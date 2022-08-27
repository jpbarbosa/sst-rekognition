import { Header } from "./components/Header";
import { Upload } from "./components/Upload";
import { Results } from "./components/Results";
import { AppContextProvider } from "./contexts/AppContext";
import { Labels } from "./components/Labels";

function App() {
  return (
    <div id="app">
      <AppContextProvider>
        <Header />
        <div className="content">
          <Upload />
          <Results />
          <Labels />
        </div>
      </AppContextProvider>
    </div>
  );
}

export default App;
