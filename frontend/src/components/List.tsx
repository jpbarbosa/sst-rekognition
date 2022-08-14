import { useEffect, useRef, useState } from "react";

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
  const [fetching, setFetching] = useState(false);
  const [pooling, setPooling] = useState(false);
  const [result, setResult] = useState<Result | undefined>();
  const [selectedItem, setSelectedItem] = useState<Item>();

  const resultRef = useRef(result);
  resultRef.current = result;

  const fetchItems = async () => {
    setFetching(true);
    fetch(import.meta.env.VITE_API_URL)
      .then((response) => response.json())
      .then((json) => {
        setResult(json);
        setFetching(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  let poolingTimeout: NodeJS.Timeout;

  const controlPooling = async () => {
    const findResult = resultRef.current?.Items.find(
      (item) => item.id === uploadId
    );

    if (findResult) {
      setPooling(false);
      setUploadId(undefined);
      clearTimeout(poolingTimeout);
      return;
    }

    setPooling(true);
    await fetchItems();
    poolingTimeout = setTimeout(() => {
      controlPooling();
    }, poolingInterval);
  };

  useEffect(() => {
    if (uploadId) {
      controlPooling();
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
