const cache = new Map();

// For Prod: handle paginated responses
export async function cachedFetchJson<T = unknown>(url: string, options?: RequestInit, retries?: number): Promise<T> {
  try {
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
      console.log("cached-fetch-json CACHED OK", url);
      if (cacheData) return cacheData as T;
    }

    const timestamp = performance.now();
    // For prod: log additional data, such as response headers and timing.
    // Ensure sensitive data is not logged.
    console.log("cached-fetch-json REQUEST", url);

    const api = await fetch(url, options);
    // Possible error thrown during fetch or json - will be caught by try/catch and bubbled up
    const data = (await api.json()) as T;

    // only cache successful responses
    if (api.ok && cacheKey) {
      cache.set(cacheKey, data);
    }

    const timing = ((performance.now() - timestamp) / 1000).toPrecision(2);
    console.log("cached-fetch-json RESPONSE", api.statusText, `${timing}s`, url);

    return data;
  } catch (e) {
    console.error(e);

    // retry fetch once if it fails
    if (!retries || retries < 1) {
      return cachedFetchJson(url, options, retries ? retries + 1 : 1);
    }

    if (e instanceof Error) {
      // could create a custom error class to avoid mutating the original error
      e.message = `cached-fetch-json ${url} ${e.message}`;
    }
    // pass up to be caught in the handler
    throw e;
  }
}
