import { Route, Routes } from "react-router-dom";
import { SortingAnalyzer } from "./pages/SortingAnalyzer";
import {DijkstraAnalyzer } from "./pages/DijkstraAnalyze";
import { KruskalAnalyzer } from "./pages/KruskalAnalyzer";

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
        <Route
          path="/kruskal-analyzer"
          element={<KruskalAnalyzer/>}
        />
      </Routes>
    </>
  );
}

export default App

// add grid that show all the algos i have 