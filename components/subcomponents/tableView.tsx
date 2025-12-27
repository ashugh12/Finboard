import { Widget } from "@/types/widget";
import { getValue } from "@/utils/getValue";
import { useThemeStore } from "@/stores/themeStore";

type Attribute = {
  label: string;
};

function buildCoinbaseTableRows(
  attribute: Attribute[],
  dataState: any,
  theme: string
) {
  console.log(attribute, dataState);
  const normalizedFields = dataState?.normalizedFields;
  const { baseCurrency, columns, currencyMap } = normalizedFields;

  const rows = attribute.map(({ label }) => {
    const entry = currencyMap?.[label];
    const value = Array.isArray(entry) ? entry[2] : "N/A"; // [base, currency, rate]

    return {
      label,
      value,
    };
  });

  return (
    <>
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {baseCurrency && (
          <span
            className="rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: theme === "light" ? "#eef2ff" : "#312e81",
              color: theme === "light" ? "#4f46e5" : "#c7d2fe",
            }}
          >
          {baseCurrency}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
              }}
            >
              <th className="px-4 py-3 text-left font-semibold">Currency</th>
              <th className="px-4 py-3 text-right font-semibold">Rate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => {
              const numValue =
                typeof row.value === "string"
                  ? parseFloat(row.value)
                  : typeof row.value === "number"
                    ? row.value
                    : 0;

              const displayValue =
                !isNaN(numValue) && numValue !== 0
                  ? numValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })
                  : String(row.value || "N/A");

              return (
                <tr
                  key={i}
                  className="border-b transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor:
                      i % 2 === 0
                        ? theme === "light"
                          ? "#ffffff"
                          : "var(--card-bg)"
                        : theme === "light"
                          ? "#f9fafb"
                          : "#1f2937",
                  }}
                >
                  <td className="px-4 py-3 font-semibold">{row.label}</td>
                  <td
                    className="px-4 py-3 text-right font-medium"
                    style={{
                      color: theme === "light" ? "#8b5cf6" : "#a78bfa",
                    }}
                  >
                    {displayValue}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}


function buildVantageTableRows(
  attribute: Attribute[],
  dataState: any,
  theme: string
) {
  const normalizedFields = dataState?.normalizedFields;
  console.log(normalizedFields, "inside vantage table view");

  const metaInformation = normalizedFields?.metaInformation || {};
  const recentDate = normalizedFields?.recentDate || {};
  const columns = recentDate?.columns || [];
  const allRows = recentDate?.rows || [];
  
  // Get only top 10 rows
  const rows = allRows.slice(0, 10);

  return (
    <>
      {/* Meta Information Section */}
      <div
        className="px-3 py-2 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="text-xs font-semibold mb-1.5">Stock Information</h3>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {metaInformation["2. Symbol"] && (
            <div>
              <span className="opacity-60">Symbol: </span>
              <span className="font-semibold">{metaInformation["2. Symbol"]}</span>
            </div>
          )}
          {metaInformation["3. Last Refreshed"] && (
            <div>
              <span className="opacity-60">Last Refreshed: </span>
              <span className="font-semibold">{metaInformation["3. Last Refreshed"]}</span>
            </div>
          )}
          {metaInformation["1. Information"] && (
            <div className="col-span-2">
              <span className="opacity-60">Info: </span>
              <span className="font-semibold text-xs">{metaInformation["1. Information"]}</span>
            </div>
          )}
          {metaInformation["5. Time Zone"] && (
            <div>
              <span className="opacity-60">Time Zone: </span>
              <span className="font-semibold">{metaInformation["5. Time Zone"]}</span>
            </div>
          )}
          {metaInformation["4. Output Size"] && (
            <div>
              <span className="opacity-60">Output Size: </span>
              <span className="font-semibold">{metaInformation["4. Output Size"]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr
              style={{
                backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
              }}
            >
              {columns.map((col: string, idx: number) => (
                <th
                  key={idx}
                  className="px-2 py-1.5 text-left font-semibold capitalize"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row: any, i: number) => (
              <tr
                key={i}
                className="border-b transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor:
                    i % 2 === 0
                      ? theme === "light"
                        ? "#ffffff"
                        : "var(--card-bg)"
                      : theme === "light"
                        ? "#f9fafb"
                        : "#1f2937",
                }}
              >
                {columns.map((col: string, idx: number) => {
                  const value = row[col];
                  
                  // Format date column
                  if (col === "date") {
                    return (
                      <td key={idx} className="px-2 py-1.5 font-semibold">
                        {value}
                      </td>
                    );
                  }
                  
                  // Format numeric columns
                  const numValue = typeof value === "number" ? value : parseFloat(value);
                  const displayValue = !isNaN(numValue)
                    ? numValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : value;

                  return (
                    <td
                      key={idx}
                      className="px-2 py-1.5 text-right font-medium"
                      style={{
                        color: theme === "light" ? "#8b5cf6" : "#a78bfa",
                      }}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No data message */}
      {rows.length === 0 && (
        <div className="flex items-center justify-center py-4">
          <p className="text-xs opacity-60" style={{ color: "var(--text)" }}>
            No time series data available
          </p>
        </div>
      )}
    </>
  );
}


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
  const attribute: Attribute[] = data.map(({ label }) => ({ label }));
  const normalizedFields = dataState?.normalizedFields;
  



  const { baseCurrency, columns, currencyMap } = normalizedFields;

  // console.log(baseCurrency, "inside table view");
  // console.log(columns, "inside table view");

  const source=getValue(dataState.meta,"source");

  if(source !== "alphavantage-time-series"){
    return(
      <div
      className="rounded-lg border"
      style={{ borderColor: "var(--border)" }}
      >
        {buildCoinbaseTableRows(attribute, dataState, theme)}
      </div>
    )
  }
  else{
    return (
      <div
      className="rounded-lg border"
      style={{ borderColor: "var(--border)" }}
      >
        {buildVantageTableRows(attribute, dataState, theme)}
      </div>
    )
  }

}
