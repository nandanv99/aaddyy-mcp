/**
 * HTTP client for AADDYY backend API.
 * All requests authenticated with API key, identified by User-Agent.
 */
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
export declare function fetchTools(): Promise<ToolDocumentation[]>;
export declare function callTool(endpoint: string, method: string, body: Record<string, unknown>): Promise<unknown>;
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
export declare function callToolV2(toolPath: string, body: Record<string, unknown>): Promise<unknown>;
//# sourceMappingURL=client.d.ts.map