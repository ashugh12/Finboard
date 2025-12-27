import { ApiAdapter } from "../ApiAdapter";

export class CoinbaseRatesAdapter implements ApiAdapter {
  canHandleResponse(rawApiResponse: any): boolean {
    return Boolean(rawApiResponse?.data?.rates);
  }


  normalize(rawApiResponse: any, viewType:string) {

    const baseCurrency = rawApiResponse.data.currency;
    const rates = rawApiResponse.data.rates;

    const normalizedFields=viewType==="card" ? transformCoinbaseRatesToCard(baseCurrency, rates):transformCoinbaseRatesToTable(baseCurrency, rates);
    console.log(normalizedFields, viewType, "in coinbaserateadapter");
    return {
      normalizedFields,
      meta: {
        source: "coinbase-rates",
        lastUpdated: Date.now(),
      },
    };
  }
}



export function transformCoinbaseRatesToTable(
    baseCurrency: string,
    rates: Record<string, string>
  ) {
    const currencyMap: Record<string, [string, string, number]> = {};
  
    for (const [currency, rate] of Object.entries(rates)) {
      currencyMap[currency] = [
        baseCurrency,
        currency,
        Number(rate),
      ];
    }
  
    return {
      baseCurrency,
      columns: ["base", "currency", "rate"],
      currencyMap, //  main data source (O(1) access)
    };
  }
  
function transformCoinbaseRatesToCard(
    baseCurrency: string,
    rates: Record<string, string>,
    limit = 3 // show top N currencies
  ) {
    const currencyMap: Record<string, number> = {};
  
    for (const [currency, rate] of Object.entries(rates)) {
      currencyMap[currency] = Number(rate);
    }
  
    return {
      baseCurrency,
      currencyMap, //  main data source (O(1) access)
    };
  }
  