import { useState } from "react";
import { Upload } from "./components/Upload";
import { List } from "./components/List";

function App() {
  const [uploadId, setUploadId] = useState();

  return (
    <div id="app">
      <Upload setUploadId={setUploadId} />
      <List uploadId={uploadId} setUploadId={setUploadId} />
    </div>
  );
}

export default App;
