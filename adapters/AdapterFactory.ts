//2step, 

import { ApiAdapter } from "./ApiAdapter";
import { coinbaseAdapterRegistry } from "./coinbase";
import { alphaVantageAdapterRegistry } from "./alphavantage";

export class AdapterFactory{
    static resolveAdapter(
        apiProvider: string, 
        rawApiResponse: any,
    ):ApiAdapter{
        let adapterRegistry: ApiAdapter[];

        console.log(apiProvider, "apiProvider ");

        switch (apiProvider) {
            case "coinbase":
              adapterRegistry = coinbaseAdapterRegistry;
              break;
            case "alphavantage":
              adapterRegistry = alphaVantageAdapterRegistry;
              break;
            default:
              throw new Error("Unsupported API provider");
          }
        
        const matchingAdapter = adapterRegistry.find((adapter) =>
            adapter.canHandleResponse(rawApiResponse)
          );

        if (!matchingAdapter) {
        throw new Error("Unsupported endpoint for this API provider");
        }
    
        return matchingAdapter;

    }
}