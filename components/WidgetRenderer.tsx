"use client";

import { useState, useMemo } from "react";
import { useWidgetStore } from "@/stores/widgetStore";
import { useWidgetDataStore } from "@/stores/widgetDataStore";
import { useLayoutStore } from "@/stores/layoutStore";
import { useThemeStore } from "@/stores/themeStore";
import { extractPaths } from "@/utils/extractPaths";
import { CardView } from "./subcomponents/cardView";
import { TableView } from "./subcomponents/tableView";
import { ChartView } from "./subcomponents/chartView";
import { Widget } from "@/types/widget";
import { FiEdit2, FiX, FiSave, FiXCircle } from "react-icons/fi";
import { getValue } from "@/utils/getValue";

export function WidgetRenderer({ id, onEdit}: { id: string, onEdit:(widget: Widget)=>void; }) {
  const widget = useWidgetStore((s) => s.widgets[id]);
  const dataState = useWidgetDataStore((s) => s.dataMap[id]);
  const theme = useThemeStore((s) => s.theme);

  const updateWidget = useWidgetStore((s) => s.updateWidget);
  const removeWidget = useWidgetStore((s) => s.removeWidget);
  const removeFromLayout = useLayoutStore((s) => s.removeFromLayout);
  const moveWidget = useLayoutStore((s) => s.moveWidget);

  // Determine if this is a Vantage widget (longer content)
  const source = dataState?.data?.meta ? getValue(dataState.data.meta, "source") : null;
  const isVantageWidget = source === "alphavantage-time-series";

  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFields, setTempFields] = useState<string[]>(
    widget?.fields.map((f) => f.path) ?? []
  );

  if (!widget) return null;

  /* All available selectable paths from live data */
  const availablePaths = useMemo(() => {
    if (!dataState?.data) return [];
    return extractPaths(dataState.data);
  }, [dataState?.data]);
  
  function toggleField(path: string) {
    setTempFields((prev) =>
      prev.includes(path)
    ? prev.filter((p) => p !== path)
    : [...prev, path]
  );
}

function handleSave() {
    updateWidget(id, {
      fields: tempFields.map((path) => ({
        path,
        label: path.split(".").pop()!,
      })),
    });
    setIsExpanded(false);
  }

  function handleCancel() {
    setTempFields(widget.fields.map((f) => f.path));
    setIsExpanded(false);
  }

  return (
    <div
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("draggedId", id)
      }
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) =>
        moveWidget(e.dataTransfer.getData("draggedId"), id)
      }
      className={`rounded-lg p-4 sm:p-5 transition-all duration-200 ${isExpanded ? "col-span-2" : ""} ${isVantageWidget && widget.viewType === "card" ? "row-span-2" : ""}`}
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="font-semibold text-base sm:text-lg" style={{ color: 'var(--text)' }}>
          {widget.name}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(widget)}
            className="p-1.5 sm:p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text)' }}
            title="Edit widget"
          >
            <FiEdit2 size={16} />
          </button>

          <button
            onClick={() => {
              removeWidget(id);
              removeFromLayout(id);
            }}
            className="p-1.5 sm:p-2 rounded-lg hover:opacity-80 transition-opacity text-red-500"
            title="Remove widget"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* NORMAL VIEW */}
      {!isExpanded && dataState?.status === "success" && (
        <>
          {widget.viewType === "card" && (
            <CardView widget={widget} data={widget?.fields} dataState={dataState.data} />
          )}

          {widget.viewType === "table" && (
            <TableView widget={widget} data={widget.fields} previewFields={tempFields} dataState={dataState.data} />
          )}

          {widget.viewType === "chart" && (
            <ChartView widget={widget} data={dataState.data} />
          )}
        </>
      )}

      {dataState?.status === "loading" && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent" style={{ borderColor: theme === "light" ? "#8b5cf6" : "#ffffff" }} />
        </div>
      )}

      {dataState?.status === "error" && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{dataState.error}</p>
        </div>
      )}

      {/* EXPANDED EDIT VIEW */}
      {isExpanded && (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LEFT: FIELD SELECTOR */}
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Select Attributes
              </h4>

              <div className="max-h-56 overflow-auto border rounded-lg p-3 space-y-2" style={{ borderColor: "var(--border)" }}>
                {availablePaths.map((path) => (
                  <label
                    key={path}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text)' }}
                  >
                    <input
                      type="checkbox"
                      checked={tempFields.includes(path)}
                      onChange={() => toggleField(path)}
                      className="rounded"
                    />
                    <span className="break-all text-xs sm:text-sm">{path}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Live Preview
              </h4>

              {widget.viewType === "card" && (
                <CardView
                  widget={widget}
                  data={widget?.fields}
                  previewFields={tempFields}
                  dataState={dataState.data}
                />
              )}

              {widget.viewType === "table" && (
                <TableView
                  widget={widget}
                  data={widget.fields}
                  previewFields={tempFields}
                  dataState={dataState.data}
                />
              )}

              {widget.viewType === "chart" && (
                <ChartView
                  widget={widget}
                  data={dataState?.data}
                  previewFields={tempFields}
                />
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            >
              <FiXCircle size={16} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                color: theme === "light" ? "#ffffff" : "#111827",
                borderColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            >
              <FiSave size={16} />
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
