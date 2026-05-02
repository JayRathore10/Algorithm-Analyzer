import { Route, Routes } from "react-router-dom";
import { SortingAnalyzer } from "./pages/SortingAnalyzer";
import {DijkstraAnalyzer } from "./pages/DijkstraAnalyze";
import { KruskalAnalyzer } from "./pages/KruskalAnalyzer";
import { PrimsAnalyzer } from "./pages/PrismAnalyzer";
import { BFSAnalyzer } from "./pages/BFSAnalyzer";
import { DFSAnalyzer } from "./pages/DFSAnalyzer";
import { FloydWarshallAnalyzer } from "./pages/Floyd-WarshalAnalyzer";
import { BinarySearchAnalyzer } from "./pages/BinarySearchAnalyzer";
import { LinearSearchAnalyzer } from "./pages/LinearSearchAnalyzer";
import { Home } from "./pages/Home";

function App() {
  return(
    <>
      <Routes>
        <Route 
          path="/"
          element={<Home/>}
        />
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
        <Route
          path="/prism-analyzer"
          element={<PrimsAnalyzer/>}
        />
        <Route
          path="/bfs-analyzer" 
          element={<BFSAnalyzer/>}
        />
        <Route 
          path="/dfs-analyzer"
          element={<DFSAnalyzer />}
        />
        <Route 
          path="/floyd-Warshal-analyzer"
          element={<FloydWarshallAnalyzer/>}
        />
        <Route
          path="/binary-search-analyzer"
          element={<BinarySearchAnalyzer/>} 
        />
        <Route
          path="/linear-search-analyzer"
          element={<LinearSearchAnalyzer/>}
        />
      </Routes>
    </>
  );
}

export default App
