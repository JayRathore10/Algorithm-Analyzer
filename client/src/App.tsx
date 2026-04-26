import { Route, Routes } from "react-router-dom";
import { SortingAnalyzer } from "./pages/SortingAnalyzer";
import {DijkstraAnalyzer } from "./pages/DijkstraAnalyze";

function App() {
  return(
    <>
      <Routes>
        <Route
          path="/sorting-analyzer"
          element={<SortingAnalyzer/>}
        />
        <Route
          path="/dijkstra-analyzer"
          element={<DijkstraAnalyzer/>}
        />
      </Routes>
    </>
  );
}

export default App

// add grid that show all the algos i have 