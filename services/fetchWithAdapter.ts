import { AdapterFactory } from "@/adapters/AdapterFactory";
import { fetchApi } from "./apiClient";
import { Widget } from "@/types/widget";
export async function fetchAndNormalizeApiData(
  apiProvider: string,
  endpointUrl: string,
  viewType:string
) {
  const httpResponse = await fetchApi(endpointUrl);

  console.log(httpResponse, "in fetchwithadapter")
  const rawApiResponse = httpResponse
//   const viewType=

  const adapter = AdapterFactory.resolveAdapter(
    apiProvider,
    rawApiResponse
  );

  return adapter.normalize(rawApiResponse, viewType);
}
