import { useEffect, useRef } from "react";
import { Item } from "../../../types/Item";
import { useFetch } from "../hooks/useFetch";
import { usePooling } from "../hooks/usePooling";
import { useAppContext } from "../contexts/AppContext";
import { ListItem } from "./ListItem";

type Result = {
  Items: Item[];
};

const poolingInterval = 3_000;

export const List: React.FC = () => {
  const { uploadId, setSelectedItem } = useAppContext();

  const { fetchItems, fetching, result } = useFetch<Result>(
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
    <div id="list">
      <div className="status">
        {pooling && (
          <div className="pooling">
            Pooling every {poolingInterval / 1000}s...
          </div>
        )}
        {fetching && <div className="loading">Loading...</div>}
      </div>
      <h2>List ({result ? result.Items.length : "..."})</h2>
      <ul className="list">
        {result?.Items.map((item) => (
          <ListItem item={item} />
        ))}
      </ul>
    </div>
  );
};
