import { useEffect, useState } from "react";

type Result = {
  Items: [];
};

function App() {
  const [result, setResult] = useState<Result | undefined>();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL)
      .then((response) => response.json())
      .then((json) => setResult(json));
  }, []);

  return (
    <div>
      {result?.Items.map((item: any) => (
        <pre>{JSON.stringify(item, null, 4)}</pre>
      ))}
    </div>
  );
}

export default App;
