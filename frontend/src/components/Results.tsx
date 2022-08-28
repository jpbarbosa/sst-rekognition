import { useEffect, useRef } from "react";
import { Item } from "../../../types/Item";
import { useFetch } from "../hooks/useFetch";
import { usePooling } from "../hooks/usePooling";
import { useAppContext } from "../contexts/AppContext";
import { ResultsItem } from "./ResultsItem";
import { Status } from "./Status";

type Result = {
  Items: Item[];
};

const poolingInterval = 3_000;

export const Results: React.FC = () => {
  const { uploadId, setSelectedItem } = useAppContext();

  const { fetchItems, fetching, result, error } = useFetch<Result>(
    import.meta.env.VITE_API_URL
  );

  const resultRef = useRef(result);
  resultRef.current = result;

  const findUploadIdInResult = () => {
    return resultRef.current?.Items.find((item) => item.id === uploadId);
  };

  const poolingCallback = () => {
    setSelectedItem(findUploadIdInResult());
  };

  const { pooling } = usePooling({
    startTrigger: Boolean(uploadId),
    action: fetchItems,
    stopConditional: findUploadIdInResult,
    callback: poolingCallback,
    interval: poolingInterval,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div id="results">
      <Status
        status={[
          {
            condition: fetching,
            message: "Loading...",
          },
          {
            condition: pooling,
            message: `Next fetch in ${poolingInterval / 1000}s...`,
          },
        ]}
      />
      <h2>Results ({result?.Items ? result.Items.length : "..."})</h2>
      {error ? (
        <div className="box error">{error.message}</div>
      ) : (
        <div className="scrollable">
          <ul className="results">
            {result?.Items?.map((item) => (
              <ResultsItem key={item.id} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
