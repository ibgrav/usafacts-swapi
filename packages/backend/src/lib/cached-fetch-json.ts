const cache = new Map();

// For Prod: handle paginated responses
export async function cachedFetchJson<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  let cacheKey = "";

  // set default options
  if (!options) options = {};
  if (!options.method) options.method = "GET";
  if (!options.headers) {
    // assumed we are trying to fetch json - could be extended to support other content types
    options.headers = {
      "Content-Type": "application/json"
    };
  }

  // do not cache non-GET requests, especially if they contain a body
  if ((!options?.method || options.method === "GET") && !options?.body) {
    // could hash this to reduce memory, but will add CPU overhead
    cacheKey = JSON.stringify({ url, options });

    // For Production:
    //  - could use a LRU cache to limit memory usage
    //  - could use a TTL to limit cache staleness
    //  - could use a distributed cache to share cache across instances (such as Redis)
    //  - for local development, could use a file-based cache to avoid re-fetching data on restart
    //  - if the data is highly stable (not changing at all), writing local json blobs at build time could greatly improve performance
    const cacheData = cache.get(cacheKey);
    if (cacheData) return cacheData as T;
  }

  const api = await fetch(url, options);

  const contentType = api.headers.get("Content-Type") || api.headers.get("content-type");
  // For Prod: handle non-JSON responses and response with appropriate status code (422 Unprocessable Entity)
  const isJsonContent = contentType?.includes("application/json");
  if (!isJsonContent) throw new Error(`Expected JSON response ${url}`);

  // Possible error thrown during fetch or json - will be caught by handler wrapper.
  const data = (await api.json()) as T;

  // only cache successful responses
  if (api.ok && cacheKey) {
    cache.set(cacheKey, data);
  }

  // For prod: log additional data, such as response headers and timing.
  // Ensure sensitive data is not logged.
  console.log("cached-fetch-json", api.statusText, url);

  return data;
}
