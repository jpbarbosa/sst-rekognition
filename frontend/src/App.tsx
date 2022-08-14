import { Upload } from "./components/Upload";
import { List } from "./components/List";
import { AppContextProvider } from "./contexts/AppContext";

function App() {
  return (
    <div id="app">
      <AppContextProvider>
        <Upload />
        <List />
      </AppContextProvider>
    </div>
  );
}

export default App;
