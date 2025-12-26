/**
 * Simple API client with caching and retry logic
 */

import { apiCache } from './cache';

export async function fetchApi(url: string): Promise<any> {
  if (!url) throw new Error('URL is required');

  // Check cache first
  const cached = apiCache.get(url);
  if (cached !== null) {
    return cached;
  }

  // Check for pending request (deduplication)
  const pending = apiCache.getPendingRequest(url);
  if (pending) {
    return pending;
  }

  // Fetch with retry
  const fetchPromise = fetchWithRetry(url);
  apiCache.setPendingRequest(url, fetchPromise);

  const data = await fetchPromise;
  apiCache.set(url, data);
  return data;
}

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      if (attempt === retries) throw error;
      
      // Wait before retry (simple delay: 500ms, 1s)
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

export async function fetchApiFresh(url: string): Promise<any> {
  apiCache.invalidate(url);
  return fetchWithRetry(url);
}
