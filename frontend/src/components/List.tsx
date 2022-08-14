import { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { usePooling } from "../hooks/usePooling";

type Item = {
  id: string;
  createdAt: string;
  labels: any;
};

type Result = {
  Items: Item[];
};

type ListProps = {
  uploadId?: string;
  setUploadId: Function;
};

const poolingInterval = 3_000;

export const List: React.FC<ListProps> = ({ uploadId, setUploadId }) => {
  const [selectedItem, setSelectedItem] = useState<Item>();

  const { fetchItems, fetching, result } = useFetch<Result>(
    import.meta.env.VITE_API_URL
  );

  const resultRef = useRef(result);
  resultRef.current = result;

  const findUploadIdInResult = () => {
    return resultRef.current?.Items.find((item) => item.id === uploadId);
  };

  const { startPooling, pooling } = usePooling({
    action: fetchItems,
    stopConditional: findUploadIdInResult,
    callback: () => setUploadId(undefined),
    interval: poolingInterval,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (uploadId) {
      startPooling();
    }
  }, [uploadId]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h2>List ({result?.Items.length})</h2>
        {pooling && (
          <div>Pooling is active every {poolingInterval / 1000} seconds...</div>
        )}
        {fetching && <div>Loading...</div>}
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created At</th>
              <th>Labels</th>
            </tr>
          </thead>
          <tbody>
            {result?.Items.map((item: any) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.createdAt}</td>
                <td>
                  <button onClick={() => setSelectedItem(item)}>Labels</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Labels</h2>
        {selectedItem && (
          <pre>{JSON.stringify(selectedItem.labels, null, 4)}</pre>
        )}
      </div>
    </div>
  );
};
