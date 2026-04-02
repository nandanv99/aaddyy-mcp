/**
 * HTTP client for AADDYY backend API.
 * All requests authenticated with API key, identified by User-Agent.
 */

const BASE_URL = process.env.AADDYY_BASE_URL || 'https://backend.aaddyy.com/api';
const API_KEY = process.env.AADDYY_API_KEY || '';
const USER_AGENT = 'aaddyy-mcp/1.0.0';

if (!API_KEY) {
  console.error('ERROR: AADDYY_API_KEY environment variable is required.');
  console.error('Get your API key at https://www.aaddyy.com/api-keys');
  process.exit(1);
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  requestId?: string;
}

export interface ToolDocumentation {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  endpoint: string;
  methods: string[];
  version: string;
  status: string;
  pricing: {
    basePrice: number;
    currency: string;
    unit: string;
  };
  parameters: {
    required: string[];
    optional: string[];
    validation?: Record<string, {
      type?: string;
      format?: string;
      description?: string;
      example?: unknown;
      default?: unknown;
      enum?: string[];
      minimum?: number;
      maximum?: number;
    }>;
  };
  rateLimits?: {
    requests: number;
    window: string;
    burst: number;
  };
  examples?: {
    curl: string;
    request: Record<string, unknown>;
    response: Record<string, unknown>;
  };
}

export interface ToolsListResponse {
  totalTools: number;
  tools: ToolDocumentation[];
  lastUpdated: string;
}

export async function fetchTools(retries = 3, delayMs = 2000): Promise<ToolDocumentation[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}/documentation/tools`, {
        headers: { 'User-Agent': USER_AGENT },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data: ApiResponse<ToolsListResponse> = await res.json();
      if (!data.success) throw new Error(`API error: ${data.message}`);
      return data.data.tools.filter(t => t.status === 'active');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt < retries) {
        console.error(`[aaddyy-mcp] Failed to fetch tools (attempt ${attempt}/${retries}): ${msg}. Retrying in ${delayMs / 1000}s...`);
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw new Error(`Failed to fetch tools after ${retries} attempts: ${msg}`);
      }
    }
  }
  throw new Error('Unreachable');
}

export async function callTool(endpoint: string, method: string, body: Record<string, unknown>): Promise<unknown> {
  const url = `${BASE_URL.replace(/\/api\/?$/, '')}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json() as Record<string, unknown>;
  if (!data.success) {
    const error = data.error as Record<string, unknown> | undefined;
    const code = error?.code || data.code || '';
    const message = error?.message || data.message || 'API call failed';
    const details = error?.details as Record<string, unknown> | undefined;

    let errMsg = `${message}`;
    if (code === 'INSUFFICIENT_CREDITS' && details) {
      errMsg += ` (need ${details.required} credits, have ${details.available}). Top up at https://www.aaddyy.com/dashboard`;
    } else if (code === 'RATE_LIMITED') {
      errMsg += `. Try again shortly.`;
    } else if (code === 'EMAIL_NOT_VERIFIED') {
      errMsg += `. Verify your email at https://www.aaddyy.com to create API keys.`;
    }
    throw new Error(errMsg);
  }
  return (data as unknown as ApiResponse).data;
}

export interface V2SubmitResponse {
  jobId: string;
  status: string;
  pollUrl: string;
}

export interface V2PollResponse {
  jobId: string;
  status: string;
  result: unknown;
  error: string | null;
}

export async function callToolV2(toolPath: string, body: Record<string, unknown>): Promise<unknown> {
  // Submit
  const submitUrl = `${BASE_URL}/v2/ai${toolPath}`;
  const submitRes = await fetch(submitUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify(body),
  });
  const submitData: ApiResponse<V2SubmitResponse> = await submitRes.json();
  if (!submitData.success) throw new Error(submitData.message || 'V2 submit failed');

  const { jobId } = submitData.data;

  // Poll until completed or failed (max 600s / 10 minutes)
  const start = Date.now();
  const timeout = 600_000;
  const interval = 2_000;

  while (Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, interval));

    const pollUrl = `${BASE_URL}/v2/ai/jobs/${jobId}`;
    const pollRes = await fetch(pollUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': USER_AGENT,
      },
    });
    const pollData: ApiResponse<V2PollResponse> = await pollRes.json();
    if (!pollData.success) throw new Error(pollData.message || 'V2 poll failed');

    const job = pollData.data;
    if (job.status === 'completed') return job.result;
    if (job.status === 'failed') throw new Error(job.error || 'Job failed');
  }

  throw new Error(`Job ${jobId} timed out after ${timeout / 1000}s`);
}
