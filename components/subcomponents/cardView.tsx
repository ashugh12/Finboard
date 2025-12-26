import { getValue } from "@/utils/getValue";
import { Widget } from "@/types/widget";
import { useThemeStore } from "@/stores/themeStore";

export function CardView({
  widget,
  data,
  previewFields,
}: {
  widget: Widget;
  data: any;
  previewFields?: string[];
}) {
  const theme = useThemeStore((s) => s.theme);
  const fields = previewFields ?? widget.fields.map((f) => f.path);

  // Extract currency name if available
  const currency = getValue(data, "currency") || getValue(data, "data.currency");
  
  // Get rates if available
  const rates = getValue(data, "rates") || getValue(data, "data.rates");

  return (
    <div className="space-y-4">
      {/* Currency Header */}
      {currency && (
        <div className="pb-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor: theme === "light" ? "#8b5cf6" : "#a78bfa",
                color: "#ffffff",
              }}
            >
              {currency.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text)' }}>
                {currency}
              </h4>
              <p className="text-xs sm:text-sm opacity-60" style={{ color: 'var(--text)' }}>
                Currency Rates
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rates Display */}
      {rates && typeof rates === 'object' && !Array.isArray(rates) ? (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {Object.entries(rates).slice(0, 15).map(([key, value]) => {
            const numValue = typeof value === 'string' ? parseFloat(value) : typeof value === 'number' ? value : 0;
            const displayValue = !isNaN(numValue) ? numValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            }) : String(value || 'N/A');
            
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: theme === "light" ? "#8b5cf6" : "#a78bfa",
                      color: "#ffffff",
                    }}
                  >
                    {key.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text)' }}>
                    {key}
                  </span>
                </div>
                <span className="text-sm sm:text-base font-bold" style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}>
                  {displayValue}
                </span>
              </div>
            );
          })}
          {Object.keys(rates).length > 15 && (
            <div className="text-center pt-2">
              <p className="text-xs opacity-60" style={{ color: 'var(--text)' }}>
                +{Object.keys(rates).length - 15} more currencies
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Fallback to field-based display */
        <div className="space-y-2">
          {fields.map((path) => {
            const value = getValue(data, path);
            const label = path.split(".").pop() || path;
            
            return (
              <div
                key={path}
                className="flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
                  borderColor: "var(--border)",
                }}
              >
                <span className="text-sm sm:text-base font-medium opacity-80" style={{ color: 'var(--text)' }}>
                  {label}:
                </span>
                <span className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text)' }}>
                  {typeof value === 'number' 
                    ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                    : String(value || 'N/A')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
