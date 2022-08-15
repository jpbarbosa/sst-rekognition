import { Header } from "./components/Header";
import { Upload } from "./components/Upload";
import { List } from "./components/List";
import { AppContextProvider } from "./contexts/AppContext";
import { Labels } from "./components/Labels";

function App() {
  return (
    <div id="app">
      <AppContextProvider>
        <Header />
        <div className="content">
          <Upload />
          <List />
          <Labels />
        </div>
      </AppContextProvider>
    </div>
  );
}

export default App;
