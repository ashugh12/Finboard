'use client';

import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { AddWidgetModal } from "@/components/AddWidgetModal";
import { Loader } from "@/components/Loader";
import { HelpSection } from "@/components/HelpSection";
import { useWidgetStore } from "@/stores/widgetStore";
import { useLayoutStore } from "@/stores/layoutStore";
import { useThemeStore } from "@/stores/themeStore";
import { startWidgetPolling } from "@/services/scheduler";
import { exportDashboard, importDashboard } from "@/services/dashboardIO";
import { Widget } from "@/types/widget";
import { FiMoon, FiSun, FiPlus, FiDownload, FiUpload, FiInfo } from "react-icons/fi";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const widgets = useWidgetStore((s) => s.widgets);
  const addWidget = useWidgetStore((s) => s.addWidget);
  const appendWidget = useLayoutStore((s) => s.appendWidget);

  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const theme = useThemeStore((s) => s.theme);

  /* Restart polling on reload (persisted widgets) */
  useEffect(() => {
    Object.values(widgets).forEach((widget) => {
      if (!widget.apis?.length) return;

      startWidgetPolling(
        widget.id,
        widget.apis[0].urls,
        widget.apis[0].refreshInterval,
        widget.viewType
      );
    });
  }, [widgets]);

  function openCreateWidget() {
    setMode("create");
    setEditingWidget(null);
    setOpen(true);
  }

  /* Called ONLY when modal finishes widget creation */
  function handleCreateWidget(widget: Widget) {
    addWidget(widget);
    appendWidget(widget.id);

    startWidgetPolling(
      widget.id,
      widget.apis[0].urls,
      widget.apis[0].refreshInterval,
      widget.viewType
    );
  }

  function openEditWidget(widget: Widget) {
    setMode("edit");
    setEditingWidget(widget);
    setOpen(true);
  }

  function handleEditWidget(id: string, patch: Partial<Widget>) {
    useWidgetStore.getState().updateWidget(id, patch);
  }

  return (
    <main className="min-h-screen relative">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text)' }}>
            FinBoard
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                color: theme === "light" ? "#ffffff" : "#111827",
                borderColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              <span className="text-sm sm:text-base">{theme === "light" ? "Dark" : "Light"}</span>
            </button>

            <button
              onClick={exportDashboard}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                color: theme === "light" ? "#ffffff" : "#111827",
                borderColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            >
              <FiDownload size={16} />
              <span className="text-sm sm:text-base">Export</span>
            </button>

            <label
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                color: theme === "light" ? "#ffffff" : "#111827",
                borderColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            >
              <FiUpload size={16} />
              <span className="text-sm sm:text-base">Import</span>
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importDashboard(file);
                }}
              />
            </label>

            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                color: theme === "light" ? "#ffffff" : "#111827",
                borderColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            >
              <FiInfo size={18} />
              <span className="text-sm sm:text-base">Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Help/Disclaimer Section */}
      <HelpSection isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Dashboard Area with Gray Background */}
      {!showHelp &&
        <div
          className="p-4 sm:p-6 min-h-[calc(111vh-200px)] relative"
          style={{
            backgroundColor: theme === "light" ? "#e5e7eb" : "#1f2937",
          }}
        >
          <Dashboard onEditWidget={openEditWidget} />

          {/* Floating Add Widget Button - Concentric Circles */}
          <button
            onClick={openCreateWidget}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group"
            style={{
              width: '64px',
              height: '64px',
            }}
          >
            {/* Outer circle - animated pulse */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            />

            {/* Middle circle - shadow */}
            <div
              className="absolute inset-0 rounded-full shadow-lg"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
                boxShadow: `0 10px 25px -5px ${theme === "light" ? "rgba(139, 92, 246, 0.5)" : "rgba(255, 255, 255, 0.3)"}`,
              }}
            />

            {/* Inner circle - main button */}
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#ffffff",
              }}
            >
              <FiPlus
                size={28}
                style={{
                  color: theme === "light" ? "#ffffff" : "#111827",
                }}
              />
            </div>
          </button>
        </div>
      }

      {/* Add Widget Modal */}
      <AddWidgetModal
        open={open}
        mode={mode}
        initialWidget={editingWidget ?? undefined}
        onClose={() => setOpen(false)}
        onCreate={handleCreateWidget}
        onUpdate={handleEditWidget}
      />
    </main>
  );
}
