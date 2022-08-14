import { useEffect, useState } from "react";

type Result = {
  Items: [];
};

export const List: React.FC = () => {
  const [result, setResult] = useState<Result | undefined>();
  const [selectedItem, setSelectedItem] = useState<any>();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL)
      .then((response) => response.json())
      .then((json) => setResult(json));
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h2>List ({result?.Items.length})</h2>
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
