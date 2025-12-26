"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useApiTestStore } from "@/stores/apiTestScore";
import { extractPaths } from "@/utils/extractPaths";
import { Widget } from "@/types/widget";
import { useWidgetStore } from "@/stores/widgetStore";
import { useThemeStore } from "@/stores/themeStore";
import { FiX, FiFileText, FiTable, FiBarChart2 } from "react-icons/fi";

const Loader = lazy(() => import("@/components/Loader").then(module => ({ default: module.Loader })));

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialWidget?: Widget;
  onCreate?: (widget: Widget) => void;
  onUpdate?: (id: string, patch: Partial<Widget>) => void;
};

export function AddWidgetModal({
  open,
  onClose,
  mode,
  initialWidget,
  onCreate,
  onUpdate,
}: Props) {
  const [apiUrl, setApiUrl] = useState("");
  const [widgetName, setWidgetName] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [viewType, setViewType] = useState<"card" | "table" | "chart">("card");

  const { testApi, response, loading, error, reset } = useApiTestStore();
  const theme = useThemeStore((s) => s.theme);

  const isEdit = mode === "edit";

  /* PREFILL + AUTO API TEST FOR EDIT MODE */
  useEffect(() => {
    if (isEdit && initialWidget) {
      setApiUrl(initialWidget.apis[0].urls);
      setWidgetName(initialWidget.name);
      setRefreshInterval(initialWidget.apis[0].refreshInterval);
      setSelectedFields(initialWidget.fields.map((f) => f.path));
      testApi(initialWidget.apis[0].urls);
    }
  }, [isEdit, initialWidget, testApi]);

  function resetForm() {
    setApiUrl("");
    setWidgetName("");
    setRefreshInterval(30);
    setSelectedFields([]);
    reset();
  }

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      resetForm();
    }

    if (mode === "edit" && initialWidget) {
      setApiUrl(initialWidget.apis[0].urls);
      setWidgetName(initialWidget.name);
      setRefreshInterval(initialWidget.apis[0].refreshInterval);
      setSelectedFields(initialWidget.fields.map((f) => f.path));
    }
  }, [open, mode, initialWidget]);

  function toggleField(path: string) {
    setSelectedFields((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  }

  function handleSave() {
    const fields = selectedFields.map((path) => ({
      path,
      label: path.split(".").pop()!,
    }));

    if (mode === "create" && onCreate) {
      const widget: Widget = {
        id: crypto.randomUUID(),
        name: widgetName,
        apis: [{ urls: apiUrl, refreshInterval }],
        fields,
        viewType: viewType,
      };

      onCreate(widget);
    }

    if (mode === "edit") {
      if (!initialWidget || !onUpdate) {
        console.error("Edit mode missing initialWidget");
        return;
      }

      onUpdate(initialWidget.id, {
        name: widgetName,
        fields,
        apis: [
          {
            urls: initialWidget.apis[0].urls,
            refreshInterval,
          },
        ],
      });
    }
    resetForm();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Determine button state and color
  const urlValid = apiUrl && isValidUrl(apiUrl);
  const apiTested = response && !error;
  const buttonState = urlValid && apiTested ? 'success' : (error ? 'error' : 'default');

  if (!open) return null;

  return (
    <>
      {loading && (
        <Suspense fallback={null}>
          <Loader />
        </Suspense>
      )}
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
        <div
          className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg p-4 sm:p-6 shadow-xl"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text)' }}>
              {mode === "create" ? "Add New Widget" : "Edit Widget"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ color: 'var(--text)' }}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* API URL */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                API URL
              </label>
              <div className="relative">
                <input
                  value={apiUrl}
                  disabled={isEdit}
                  onChange={(e) => {
                    setApiUrl(e.target.value);
                    reset(); // Reset validation state when URL changes
                  }}
                  placeholder="https://api.example.com/data"
                  className="w-full px-3 sm:px-4 py-2 pr-10 rounded-lg border text-sm sm:text-base transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text)",
                    borderColor: 
                      apiUrl && urlValid && apiTested
                        ? '#10b981' // green
                        : apiUrl && (!urlValid || error)
                        ? '#ef4444' // red
                        : "var(--border)",
                  }}
                />
                {apiUrl && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {urlValid && apiTested ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : error || (apiUrl && !urlValid) ? (
                      <span className="text-red-500 text-lg">✗</span>
                    ) : null}
                  </div>
                )}
              </div>
              {apiUrl && !isValidUrl(apiUrl) && (
                <p className="mt-1 text-xs text-red-500">Please enter a valid URL</p>
              )}
              {apiUrl && urlValid && apiTested && (
                <p className="mt-1 text-xs text-green-500">✓ URL validated successfully</p>
              )}
            </div>

            {/* Test API (only for create) */}
            {mode === "create" && (
              <button
                onClick={() => testApi(apiUrl)}
                disabled={loading || !apiUrl || !isValidUrl(apiUrl) || (urlValid && apiTested)}
                className="w-full sm:w-auto px-4 sm:px-5 py-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  backgroundColor: 
                    buttonState === 'success' 
                      ? '#10b981' // green
                      : buttonState === 'error'
                      ? '#ef4444' // red
                      : theme === "light" 
                        ? "#8b5cf6" 
                        : "#ffffff",
                  color: 
                    buttonState === 'success' || buttonState === 'error'
                      ? "#ffffff"
                      : theme === "light" 
                        ? "#ffffff" 
                        : "#111827",
                  borderColor: 
                    buttonState === 'success' 
                      ? '#10b981'
                      : buttonState === 'error'
                      ? '#ef4444'
                      : theme === "light" 
                        ? "#8b5cf6" 
                        : "#ffffff",
                }}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Testing...
                  </>
                ) : buttonState === 'success' ? (
                  <>
                    <span>✓</span>
                    API Valid
                  </>
                ) : buttonState === 'error' ? (
                  <>
                    <span>✗</span>
                    Test Failed
                  </>
                ) : (
                  "Test API"
                )}
              </button>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* API RESPONSE + FIELD SELECTION */}
            {response && (
              <>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    API Response Preview
                  </h4>
                  <pre className="text-xs sm:text-sm max-h-40 overflow-auto p-3 rounded-lg border" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-sm sm:text-base" style={{ color: 'var(--text)' }}>
                    Select Attributes
                  </h4>
                  <div className="max-h-48 sm:max-h-56 overflow-auto border rounded-lg p-3 space-y-2" style={{ borderColor: "var(--border)" }}>
                    {extractPaths(response).map((path) => (
                      <label
                        key={path}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text)' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(path)}
                          onChange={() => toggleField(path)}
                          className="rounded"
                        />
                        <span className="break-all">{path}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* WIDGET CONFIG */}
            {response && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Widget Name
                  </label>
                  <input
                    value={widgetName}
                    onChange={(e) => setWidgetName(e.target.value)}
                    placeholder="My Widget"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base transition-colors focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base transition-colors focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Widget Type
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setViewType("card")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                        viewType === "card" ? "opacity-100" : "opacity-60"
                      }`}
                      style={{
                        backgroundColor: viewType === "card" 
                          ? (theme === "light" ? "#8b5cf6" : "#ffffff")
                          : "var(--card-bg)",
                        color: viewType === "card"
                          ? (theme === "light" ? "#ffffff" : "#111827")
                          : "var(--text)",
                        borderColor: viewType === "card"
                          ? (theme === "light" ? "#8b5cf6" : "#ffffff")
                          : "var(--border)",
                      }}
                    >
                      <FiFileText size={16} />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType("table")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                        viewType === "table" ? "opacity-100" : "opacity-60"
                      }`}
                      style={{
                        backgroundColor: viewType === "table" 
                          ? (theme === "light" ? "#8b5cf6" : "#ffffff")
                          : "var(--card-bg)",
                        color: viewType === "table"
                          ? (theme === "light" ? "#ffffff" : "#111827")
                          : "var(--text)",
                        borderColor: viewType === "table"
                          ? (theme === "light" ? "#8b5cf6" : "#ffffff")
                          : "var(--border)",
                      }}
                    >
                      <FiTable size={16} />
                      Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewType("chart")}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                        viewType === "chart" ? "opacity-100" : "opacity-60"
                      }`}
                      style={{
                        backgroundColor: viewType === "chart" 
                          ? (theme === "light" ? "#8b5cf6" : "#ffffff")
                          : "var(--card-bg)",
                        color: viewType === "chart"
                          ? (theme === "light" ? "#ffffff" : "#111827")
                          : "var(--text)",
                        borderColor: viewType === "chart"
                          ? (theme === "light" ? "#8b5cf6" : "#ffffff")
                          : "var(--border)",
                      }}
                    >
                      <FiBarChart2 size={16} />
                      Chart
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={handleClose}
                className="px-4 sm:px-5 py-2 rounded-lg border transition-all duration-200 hover:opacity-80 text-sm sm:text-base"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text)",
                  borderColor: "var(--border)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={!widgetName || selectedFields.length === 0}
                className="px-4 sm:px-5 py-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{
                  backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                  color: theme === "light" ? "#ffffff" : "#111827",
                  borderColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                }}
              >
                {mode === "create" ? "Create Widget" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
