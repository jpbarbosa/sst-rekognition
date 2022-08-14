import { useState } from "react";

export const useFetch = <T>(url: string) => {
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<T | undefined>();

  const fetchItems = async () => {
    setFetching(true);
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setResult(json);
        setFetching(false);
      });
  };

  return {
    fetchItems,
    fetching,
    result,
  };
};
