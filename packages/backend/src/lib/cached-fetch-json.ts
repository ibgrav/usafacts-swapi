const cache = new Map();

export async function cachedFetchJson<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  // could hash this to reduce memory, but will add CPU overhead
  const cacheKey = JSON.stringify({ url, options });

  // For Production:
  //  - could use a LRU cache to limit memory usage
  //  - could use a TTL to limit cache staleness
  //  - could use a distributed cache to share cache across instances (such as Redis)
  const cacheData = cache.get(cacheKey);
  if (cacheData) return cacheData as T;

  const api = await fetch(url, options);
  // possible error thrown during fetch or json - will be caught by handler wrapper
  const data = (await api.json()) as T;

  // only cache successful responses
  if (api.ok) cache.set(cacheKey, data);

  return data;
}
