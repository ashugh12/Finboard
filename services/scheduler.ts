/**
 * Simple scheduler for widget polling with caching
 */

import { fetchApi } from "./apiClient";
import { useWidgetDataStore } from "@/stores/widgetDataStore";
import { apiCache } from "./cache";

const activeIntervals = new Map<string, NodeJS.Timeout>();

export function startWidgetPolling(
  widgetId: string,
  url: string,
  intervalSeconds: number
): NodeJS.Timeout | null {
  if (!url) return null;

  // Stop existing polling
  stopWidgetPolling(widgetId);

  const setData = useWidgetDataStore.getState().setData;

  async function fetchAndUpdate() {
    try {
      setData(widgetId, { status: "loading" });
      
      // Use cache-aware fetch (will use cache if available and fresh)
      const data = await fetchApi(url);
      
      setData(widgetId, {
        status: "success",
        data,
        lastFetchedAt: Date.now(),
      });
    } catch (err: any) {
      setData(widgetId, {
        status: "error",
        error: err.message || "Failed to fetch data",
        lastFetchedAt: Date.now(),
      });
    }
  }

  // Fetch immediately
  fetchAndUpdate();

  // Set up interval
  const interval = setInterval(fetchAndUpdate, intervalSeconds * 1000);
  activeIntervals.set(widgetId, interval);

  return interval;
}

export function stopWidgetPolling(widgetId: string): void {
  const interval = activeIntervals.get(widgetId);
  if (interval) {
    clearInterval(interval);
    activeIntervals.delete(widgetId);
  }
}

export function stopAllPolling(): void {
  for (const interval of activeIntervals.values()) {
    clearInterval(interval);
  }
  activeIntervals.clear();
}
