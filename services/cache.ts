/**
 * Simple caching system for API responses
 * - TTL-based expiration
 * - Request deduplication (prevents duplicate simultaneous requests)
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface PendingRequest {
  promise: Promise<any>;
}

class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly DEFAULT_TTL = 30000; // 30 seconds

  get(url: string): any | null {
    const entry = this.cache.get(url);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(url);
      return null;
    }

    return entry.data;
  }

  set(url: string, data: any, ttl?: number): void {
    this.cache.set(url, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.DEFAULT_TTL,
    });
  }

  getPendingRequest(url: string): Promise<any> | null {
    return this.pendingRequests.get(url)?.promise || null;
  }

  setPendingRequest(url: string, promise: Promise<any>): void {
    this.pendingRequests.set(url, { promise });
    promise.finally(() => this.pendingRequests.delete(url));
  }

  invalidate(url: string): void {
    this.cache.delete(url);
  }

  has(url: string): boolean {
    return this.get(url) !== null;
  }
}

export const apiCache = new ApiCache();
