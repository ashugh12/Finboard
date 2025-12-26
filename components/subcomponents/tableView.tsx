import { Widget } from "@/types/widget";
import { getValue } from "@/utils/getValue";
import { useThemeStore } from "@/stores/themeStore";

type Attribute = {
  label: string;
};

export function TableView({
  widget,
  data,
  previewFields,
  dataState,
}: {
  widget: Widget;
  data: { path: string; label: string }[];
  previewFields?: string[];
  dataState: any;
}) {
  const theme = useThemeStore((s) => s.theme);
  
  // Get rates from dataState - handle nested structure
  const rates = dataState?.rates 
    || dataState?.data?.rates 
    || getValue(dataState, "rates") 
    || getValue(dataState, "data.rates") 
    || {};
  
  // Extract only labels
  const attribute: Attribute[] = data.map(({ label }) => ({ label }));

  // Build table rows using label -> value mapping
  const rows = attribute.map(({ label }) => {
    const value = rates[label] 
      ?? getValue(dataState, label) 
      ?? getValue(dataState, `data.${label}`)
      ?? "N/A";
    return {
      label,
      value,
    };
  });

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm opacity-60" style={{ color: 'var(--text)' }}>No table data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937" }}>
            <th
              className="px-4 py-3 text-left font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Currency
            </th>
            <th
              className="px-4 py-3 text-right font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Rate
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => {
            const numValue = typeof row.value === 'string' ? parseFloat(row.value) : typeof row.value === 'number' ? row.value : 0;
            const displayValue = !isNaN(numValue) && numValue !== 0
              ? numValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8
                })
              : String(row.value || 'N/A');
            
            return (
              <tr
                key={i}
                className="border-b transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: i % 2 === 0 
                    ? (theme === "light" ? "#ffffff" : "var(--card-bg)")
                    : (theme === "light" ? "#f9fafb" : "#1f2937"),
                }}
              >
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>
                  {row.label}
                </td>
                <td className="px-4 py-3 text-right font-medium" style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}>
                  {displayValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
