import { useEffect, useRef } from "react";
import moment from "moment";
import { Item } from "../../../types/Item";
import { useFetch } from "../hooks/useFetch";
import { usePooling } from "../hooks/usePooling";
import { Labels } from "./Labels";
import { useAppContext } from "../contexts/AppContext";

type Result = {
  Items: Item[];
};

const poolingInterval = 3_000;

export const List: React.FC = () => {
  const { uploadId, setUploadId, selectedItem, setSelectedItem } =
    useAppContext();

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
    setUploadId(undefined);
  };

  const { startPooling, pooling } = usePooling({
    action: fetchItems,
    stopConditional: findUploadIdInResult,
    callback: poolingCallback,
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

  const getItemClassName = (item: Item) => {
    const classes = [
      selectedItem?.id === item.id ? "selected" : "",
      item.error ? "error" : "success",
    ];
    return classes.join(" ");
  };

  return (
    <div id="list">
      <div>
        <h2>List ({result?.Items.length})</h2>
        {pooling && (
          <div>Pooling is active every {poolingInterval / 1000} seconds...</div>
        )}
        {fetching && <div>Loading...</div>}
        <table className="list" border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created At</th>
              <th>Labels</th>
            </tr>
          </thead>
          <tbody>
            {result?.Items.map((item) => (
              <tr key={item.id} className={getItemClassName(item)}>
                <td>{item.id}</td>
                <td>{moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>
                  <button onClick={() => setSelectedItem(item)}>
                    {item.error ? "Error" : "Labels"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Labels />
    </div>
  );
};
