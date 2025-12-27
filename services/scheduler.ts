/**
 * Simple scheduler for widget polling with caching
 */

import { fetchApi } from "./apiClient";
import { useWidgetDataStore } from "@/stores/widgetDataStore";
import { apiCache } from "./cache";
import { fetchAndNormalizeApiData } from "@/services/fetchWithAdapter";
import { extractApiProvider } from "@/utils/extractAPIProvider";


const activeIntervals = new Map<string, NodeJS.Timeout>();

export function startWidgetPolling(
  widgetId: string,
  url: string,
  intervalSeconds: number,
  viewType: string
): NodeJS.Timeout | null {
  if (!url) return null;

  // Stop existing polling
  stopWidgetPolling(widgetId);

  const setData = useWidgetDataStore.getState().setData;

  async function fetchAndUpdate() {
    try {
      setData(widgetId, { status: "loading" });
      
      // Use cache-aware fetch (will use cache if available and fresh)
      const normalizedData = await fetchAndNormalizeApiData(
        extractApiProvider(url),
        url,
        viewType
      );

      console.log(normalizedData);
      
      setData(widgetId, {
        status: "success",
        data:normalizedData,  //change here
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
  const interval = setInterval(fetchAndUpdate, intervalSeconds * 10);
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
