import { useWidgetStore } from "@/stores/widgetStore";
import { useLayoutStore } from "@/stores/layoutStore";
import { useThemeStore } from "@/stores/themeStore";

export function exportDashboard() {
  const widgets = useWidgetStore.getState().widgets;
  const layoutOrder = useLayoutStore.getState().order;
  const theme = useThemeStore.getState().theme;

  const payload = {
    version: 1,
    widgets,
    layoutOrder,
    theme,
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "finboard-dashboard.json";
  a.click();

  URL.revokeObjectURL(url);
}


export function importDashboard(file: File) {
    const reader = new FileReader();
  
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
  
        if (data.version !== 1) {
          alert("Unsupported dashboard version");
          return;
        }
  
        // Restore stores
        useWidgetStore.setState({ widgets: data.widgets });
        useLayoutStore.setState({ order: data.layoutOrder });
        useThemeStore.setState({ theme: data.theme });
  
        alert("Dashboard imported successfully");
      } catch (e) {
        alert("Invalid dashboard file");
      }
    };
  
    reader.readAsText(file);
  }
  