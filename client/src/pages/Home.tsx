import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Home.css";

type Algo = {
  name: string;
  route: string;
  description: string;
  image: string;
  video: string;
  category: string;
};

const algorithms: Algo[] = [
  {
    name: "Sorting",
    route: "/sorting-analyzer",
    description: "Visualize multiple sorting algorithms",
    image: "/assets/screenshots/sorting.png",
    video: "/assets/videos/sorting.mp4",
    category: "Sorting",
  },
  {
    name: "Binary Search",
    route: "/binary-search-analyzer",
    description: "Efficient search in sorted array",
    image: "/assets/screenshots/binary.png",
    video: "/assets/videos/binary.mp4",
    category: "Searching",
  },
  {
    name: "Linear Search",
    route: "/linear-search-analyzer",
    description: "Simple sequential search",
    image: "/assets/screenshots/linear.png",
    video: "/assets/videos/linear.mp4",
    category: "Searching",
  },
  {
    name: "BFS",
    route: "/bfs-analyzer",
    description: "Level order traversal of graph",
    image: "/assets/screenshots/bfs.png",
    video: "/assets/videos/bfs.mp4",
    category: "Graph",
  },
  {
    name: "DFS",
    route: "/dfs-analyzer",
    description: "Depth-first traversal",
    image: "/assets/screenshots/dfs.png",
    video: "/assets/videos/dfs.mp4",
    category: "Graph",
  },
  {
    name: "Dijkstra",
    route: "/dijkstra-analyzer",
    description: "Shortest path algorithm",
    image: "/assets/screenshots/dijkstra.png",
    video: "/assets/videos/dijkstra.mp4",
    category: "Graph",
  },
  {
    name: "Kruskal",
    route: "/kruskal-analyzer",
    description: "Minimum Spanning Tree",
    image: "/assets/screenshots/kruskal.png",
    video: "/assets/videos/kruskal.mp4",
    category: "Graph",
  },
  {
    name: "Prim",
    route: "/prism-analyzer",
    description: "Greedy MST algorithm",
    image: "/assets/screenshots/prim.png",
    video: "/assets/videos/prim.mp4",
    category: "Graph",
  },
  {
    name: "Floyd Warshall",
    route: "/floyd-Warshal-analyzer",
    description: "All-pairs shortest path",
    image: "/assets/screenshots/fw.png",
    video: "/assets/videos/fw.mp4",
    category: "Graph",
  },
];

export function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = algorithms.filter((algo) =>
    algo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home">
      <h1 className="home-title">Algorithm Analyzer</h1>

      <input
        className="search-bar"
        placeholder="Search algorithm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="home-grid">
        {filtered.map((algo) => (
          <div
            key={algo.name}
            className="card"
            onClick={() => navigate(algo.route)}
          >
            <div className="media">
              <img src={algo.image} className="media-img" />
              <video src={algo.video} muted loop className="media-video" />
            </div>

            <div className="info">
              <h3>{algo.name}</h3>
              <p>{algo.description}</p>
              <span className="badge">{algo.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}