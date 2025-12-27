import { ApiAdapter } from "../ApiAdapter";

export class AlphaVantageTimeSeriesAdapter implements ApiAdapter {
  canHandleResponse(rawApiResponse: any): boolean {
    return Boolean(rawApiResponse?.["Time Series (Daily)"]);
  }

  normalize(rawApiResponse: any, viewType: string) {

    const recentDate = transformTimeSeriesToTable(rawApiResponse["Time Series (Daily)"]);
    const metaInformation = rawApiResponse["Meta Data"];
    console.log(transformTimeSeriesToTable(rawApiResponse["Time Series (Daily)"]), "inside the alphavantage");
    return {
      normalizedFields: {
        metaInformation,
        recentDate,
      },
      meta: {
        source: "alphavantage-time-series",
        lastUpdated: Date.now(),
      },
    };
  }
}

function cleanKey(key: string): string {
  return key
    .replace(/^\d+\.\s*/, "") // remove "1. "
    .replace(/\s+/g, "_");    // "adjusted close" → "adjusted_close"
}



function transformTimeSeriesToCard(
  timeSeries: Record<string, any>
) {
  const dates = Object.keys(timeSeries).sort().reverse();
  const latestDate = dates[0];
  const latestData = timeSeries[latestDate];

  const cardData: Record<string, string | number> = {
    date: latestDate,
  };

  Object.entries(latestData).forEach(([key, value]) => {
    const cleanedKey = cleanKey(key);
    cardData[cleanedKey] = Number(value);
  });

  return cardData;
}


function transformTimeSeriesToTable(
  timeSeries: Record<string, any>
) {
  const rows: Record<string, string | number>[] = [];
  const columnSet = new Set<string>(["date"]);

  Object.keys(timeSeries)
    .sort()
    .reverse()
    .forEach((date) => {
      const rawData = timeSeries[date];
      const row: Record<string, string | number> = { date };

      Object.entries(rawData).forEach(([key, value]) => {
        const cleanedKey = cleanKey(key);
        columnSet.add(cleanedKey);
        row[cleanedKey] = Number(value);
      });

      rows.push(row);
    });

  return {
    columns: Array.from(columnSet),
    rows,
  };
}


