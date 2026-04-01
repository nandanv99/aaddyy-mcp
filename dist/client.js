"use strict";
/**
 * HTTP client for AADDYY backend API.
 * All requests authenticated with API key, identified by User-Agent.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTools = fetchTools;
exports.callTool = callTool;
exports.callToolV2 = callToolV2;
const BASE_URL = process.env.AADDYY_BASE_URL || 'https://backend.aaddyy.com/api';
const API_KEY = process.env.AADDYY_API_KEY || '';
const USER_AGENT = 'aaddyy-mcp/1.0.0';
if (!API_KEY) {
    console.error('ERROR: AADDYY_API_KEY environment variable is required.');
    console.error('Get your API key at https://www.aaddyy.com/api-keys');
    process.exit(1);
}
async function fetchTools() {
    const res = await fetch(`${BASE_URL}/documentation/tools`, {
        headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok)
        throw new Error(`Failed to fetch tools: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (!data.success)
        throw new Error(`API error: ${data.message}`);
    return data.data.tools.filter(t => t.status === 'active');
}
async function callTool(endpoint, method, body) {
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
    const data = await res.json();
    if (!data.success) {
        const errMsg = data.message || 'API call failed';
        throw new Error(errMsg);
    }
    return data.data;
}
async function callToolV2(toolPath, body) {
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
    const submitData = await submitRes.json();
    if (!submitData.success)
        throw new Error(submitData.message || 'V2 submit failed');
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
        const pollData = await pollRes.json();
        if (!pollData.success)
            throw new Error(pollData.message || 'V2 poll failed');
        const job = pollData.data;
        if (job.status === 'completed')
            return job.result;
        if (job.status === 'failed')
            throw new Error(job.error || 'Job failed');
    }
    throw new Error(`Job ${jobId} timed out after ${timeout / 1000}s`);
}
//# sourceMappingURL=client.js.map