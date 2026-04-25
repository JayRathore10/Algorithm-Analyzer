import { Route, Routes } from "react-router-dom";
import { SortingAnalyzer } from "./pages/SortingAnalyzer";
import { GraphAnalyzer } from "./pages/GraphAnalyzer";

function App() {
  return(
    <>
      <Routes>
        <Route
          path="/sorting-analyzer"
          element={<SortingAnalyzer/>}
        />
        <Route
          path="/graph-analyzer"
          element={<GraphAnalyzer/>}
        />
      </Routes>
    </>
  );
}

export default App
