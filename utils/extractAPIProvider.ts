/**
 * Extract API provider name from a given URL.
 * This is a lightweight helper to infer provider without
 * coupling logic to fetch or adapter layers.
 */

export function extractApiProvider(url: string): string  {
    if (!url) return "";
  
    try {
      const hostname = new URL(url).hostname.toLowerCase();
  
      if (hostname.includes("coinbase")) return "coinbase";
      if (hostname.includes("alphavantage")) return "alphavantage";
  
      return "";
    } catch {
      // Invalid URL
      return "";
    }
  }
  