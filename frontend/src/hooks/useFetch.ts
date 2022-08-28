import { useState } from "react";
import axios, { AxiosError } from "axios";

export const useFetch = <T>(url: string) => {
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<T | undefined>();
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  const fetchItems = async () => {
    try {
      setError(undefined);
      setFetching(true);
      const response = await axios.get(url);
      setResult(response.data);
      setFetching(false);
    } catch (e) {
      setError(e as AxiosError);
    } finally {
      setFetching(false);
    }
  };

  return {
    fetchItems,
    fetching,
    result,
    error,
  };
};
