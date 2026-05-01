import { useState } from "react";
import "../styles/pages/Home.css";  

type Algo = {
  name: string;
  route: string;
  description: string;
  image: string;
  video: string;
};

const algorithms: Algo[] = [
  {
    name: "Binary Search",
    route: "/search/binary",
    description: "Efficient search in sorted array",
    image: "/assets/binary.png",
    video: "/assets/binary.mp4",
  },
  {
    name: "Linear Search",
    route: "/search/linear",
    description: "Simple sequential search",
    image: "/assets/linear.png",
    video: "/assets/linear.mp4",
  },
  {
    name: "BFS",
    route: "/graph/bfs",
    description: "Level order traversal of graph",
    image: "/assets/bfs.png",
    video: "/assets/bfs.mp4",
  },
  {
    name: "DFS",
    route: "/graph/dfs",
    description: "Depth-first traversal",
    image: "/assets/dfs.png",
    video: "/assets/dfs.mp4",
  },
  {
    name: "Dijkstra",
    route: "/graph/dijkstra",
    description: "Shortest path algorithm",
    image: "/assets/dijkstra.png",
    video: "/assets/dijkstra.mp4",
  },
  {
    name: "Kruskal",
    route: "/graph/kruskal",
    description: "Minimum Spanning Tree",
    image: "/assets/kruskal.png",
    video: "/assets/kruskal.mp4",
  },
  {
    name: "Prim",
    route: "/graph/prims",
    description: "Greedy MST algorithm",
    image: "/assets/prim.png",
    video: "/assets/prim.mp4",
  },
  {
    name: "Floyd Warshall",
    route: "/graph/floyd",
    description: "All-pairs shortest path",
    image: "/assets/fw.png",
    video: "/assets/fw.mp4",
  },
];

export function Home() {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

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

      <div className="grid">
        {filtered.map((algo) => (
          <div
            key={algo.name}
            className={`card ${
              hovered === algo.name ? "card-hover" : ""
            }`}
            onMouseEnter={() => setHovered(algo.name)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => (window.location.href = algo.route)}
          >
            <div className="media">
              {hovered === algo.name ? (
                <video
                  src={algo.video}
                  autoPlay
                  loop
                  muted
                  className="media-content"
                />
              ) : (
                <img
                  src={algo.image}
                  alt={algo.name}
                  className="media-content"
                />
              )}
            </div>

            <div className="info">
              <h3>{algo.name}</h3>
              <p>{algo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}