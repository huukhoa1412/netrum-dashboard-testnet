const BASE_URL = 'https://node.netrumlabs.dev';
const RATE_LIMIT_MS = 30000;

const rateLimiter = {
  lastCalls: {},
  canCall(endpoint) {
    const now = Date.now();
    if (!this.lastCalls[endpoint]) return true;
    return now - this.lastCalls[endpoint] >= RATE_LIMIT_MS;
  },
  getRemainingTime(endpoint) {
    if (!this.lastCalls[endpoint]) return 0;
    const elapsed = Date.now() - this.lastCalls[endpoint];
    return Math.ceil(Math.max(0, RATE_LIMIT_MS - elapsed) / 1000);
  },
  markCalled(endpoint) {
    this.lastCalls[endpoint] = Date.now();
  }
};

const demoData = {
  '/lite/nodes/stats': {
    total_nodes: 1247,
    active_nodes: 892,
    online_nodes: 756,
    mining_nodes: 423,
    total_tokens: '125000'
  }
};

export async function fetchAPI(endpoint, options = {}) {
  const { useDemoMode = true } = options;
  
  if (!rateLimiter.canCall(endpoint)) {
    const remaining = rateLimiter.getRemainingTime(endpoint);
    return {
      error: true,
      message: `⏱️ Please wait ${remaining} seconds`,
      remaining
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    rateLimiter.markCalled(endpoint);
    
    if (response.ok) {
      const data = await response.json();
      return { error: false, data };
    } else if (useDemoMode && demoData[endpoint]) {
      return { error: false, data: demoData[endpoint], demo: true };
    }
    return { error: true, message: `API status: ${response.status}` };
  } catch (err) {
    if (useDemoMode && demoData[endpoint]) {
      return { error: false, data: demoData[endpoint], demo: true };
    }
    return { error: true, message: err.message };
  }

  
  nodeDetail: (id) => fetchSafe(`/lite/nodes/id/${id}`)


}   
