// adapters/coinbase/index.ts
import { CoinbaseRatesAdapter } from "./CoinbaseRateAdapters";


export const coinbaseAdapterRegistry = [
  new CoinbaseRatesAdapter(),
];
