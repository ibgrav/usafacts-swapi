import { useCallback, useEffect, useState } from "react";
import type { ErrorResponse } from "../../types/backend";
import type { FilmHandlerBody } from "../../backend/handlers/films";

export const apiVersion = "v1";
export const apiUrlPath = `/api/${apiVersion}`;

// if the number of apis grows, this could be organize in a more appropriate manner
export const useApiFilms = () => useApiFetch<FilmHandlerBody>("films");

// not exported, since this is a private implementation - the hooks above should be used
function useApiFetch<T>(path: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ErrorResponse>();
  // if loading is set to undefined, a fetch has not been attempted
  const [loading, setLoading] = useState<boolean>();

  const fetchApi = useCallback(async () => {
    // only fetch if we don't have data, error or we are not already loading
    if (loading !== true && !data && !error) {
      setLoading(true);

      try {
        const res = await fetch(`${apiUrlPath}/${path}`);
        const data = await res.json();

        if (data.error) {
          console.error(data.error);
          setError(data);
        } else {
          setData(data);
        }
      } catch (e) {
        console.error(e);
        setError({ error: "unknown error" });
      }

      setLoading(false);
    }
  }, [loading, path, data, error]);

  useEffect(() => {
    // this will be called twice in React Strictmode
    // could be fixed by either using an AbortController, cache and dedupe the response,
    // or in production I would probably use a library like react-query or swr
    // since backend is local and cached, not a huge deal for development
    fetchApi();
  }, [fetchApi]);

  return { data, error, loading };
}
