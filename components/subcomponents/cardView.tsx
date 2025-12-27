import { getValue } from "@/utils/getValue";
import { Widget } from "@/types/widget";
import { useThemeStore } from "@/stores/themeStore";

type Attribute = {
  label: string;
};

function buildCoinbaseCardRows(
  attribute: string[],
  dataState: any,
  theme: string
) {
  const normalizedFields = dataState?.normalizedFields;
  const { baseCurrency, currencyMap } = normalizedFields || {};

  return (
    <div className="space-y-4">
      {/* Header */}
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
            Base: {baseCurrency}
          </span>
        )}
      </div>

      {/* Rates Display */}
      <div className="grid grid-cols-1 gap-3 px-4 pb-4">
        {attribute.map((label) => {
          const entry = currencyMap?.[label];
          if (!entry) return null;

          const rate = Array.isArray(entry) ? entry[2] : entry;

          // Format the rate if it's a number
          const displayRate =
            typeof rate === "number"
              ? rate.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })
              : rate;

          return (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text)" }}
              >
                {label}
              </span>

              <span
                className="text-sm font-medium"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                {displayRate}
              </span>
            </div>
          );
        })}
      </div>

      {/* No data message */}
      {attribute.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm opacity-60" style={{ color: "var(--text)" }}>
            No currency data available
          </p>
        </div>
      )}
    </div>
  );
}

function buildVantageCardRows(
  attribute: string[],
  dataState: any,
  theme: string
) {
  const normalizedFields = dataState?.normalizedFields;
  const metaInformation = normalizedFields?.metaInformation || {};
  const recentDate = normalizedFields?.recentDate || {};
  const latestRow = recentDate?.rows?.[0] || {};

  return (
    <div className="space-y-4">
      {/* Meta Information Header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
          Stock Information
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {metaInformation["2. Symbol"] && (
            <div>
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Symbol
              </span>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {metaInformation["2. Symbol"]}
              </p>
            </div>
          )}
          {metaInformation["3. Last Refreshed"] && (
            <div>
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Last Refreshed
              </span>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {metaInformation["3. Last Refreshed"]}
              </p>
            </div>
          )}
          {metaInformation["5. Time Zone"] && (
            <div>
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Time Zone
              </span>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {metaInformation["5. Time Zone"]}
              </p>
            </div>
          )}
          {metaInformation["4. Output Size"] && (
            <div>
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Output Size
              </span>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {metaInformation["4. Output Size"]}
              </p>
            </div>
          )}
        </div>
        {metaInformation["1. Information"] && (
          <div className="mt-2">
            <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
              Information
            </span>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {metaInformation["1. Information"]}
            </p>
          </div>
        )}
      </div>

      {/* Latest Data Cards */}
      <div className="px-4 pb-4">
        <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
          Latest Trading Data
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {latestRow.date && (
            <div
              className="rounded-lg border px-3 py-2 col-span-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Date
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                {latestRow.date}
              </p>
            </div>
          )}

          {latestRow.open !== undefined && (
            <div
              className="rounded-lg border px-3 py-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Open
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                ${latestRow.open.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          {latestRow.high !== undefined && (
            <div
              className="rounded-lg border px-3 py-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                High
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                ${latestRow.high.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          {latestRow.low !== undefined && (
            <div
              className="rounded-lg border px-3 py-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Low
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                ${latestRow.low.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          {latestRow.close !== undefined && (
            <div
              className="rounded-lg border px-3 py-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Close
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                ${latestRow.close.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          {latestRow.volume !== undefined && (
            <div
              className="rounded-lg border px-3 py-2 col-span-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: theme === "light" ? "#ffffff" : "var(--card-bg)",
              }}
            >
              <span className="text-xs opacity-60" style={{ color: "var(--text)" }}>
                Volume
              </span>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: theme === "light" ? "#8b5cf6" : "#a78bfa" }}
              >
                {latestRow.volume.toLocaleString("en-US")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* No data message */}
      {!latestRow.date && (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm opacity-60" style={{ color: "var(--text)" }}>
            No stock data available
          </p>
        </div>
      )}
    </div>
  );
}

export function CardView({
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
  const fields = previewFields ?? widget.fields.map((f) => f.path);

  const attribute = data.map(({ label }) => label);

  const { meta, normalizedFields } = dataState;
  const { baseCurrency, currencyMap } = normalizedFields || {};

  const source = getValue(meta, "source");

  console.log(dataState, "inside cardview");

  if (source !== "alphavantage-time-series") {
    return (
      <div className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
        {buildCoinbaseCardRows(attribute, dataState, theme)}
      </div>
    );
  } else {
    return (
      <div className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
        {buildVantageCardRows(attribute, dataState, theme)}
      </div>
    );
  }
}