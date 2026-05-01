import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/DijkstraAnalyze.css";

type Step = {
  currentNode?: number;
  visited?: number[];
  queue?: number[];
};

export function BFSAnalyzer() {
  const [n, setN] = useState("");
  const [edges, setEdges] = useState("");
  const [source, setSource] = useState("");

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [graphEdges, setGraphEdges] = useState<[number, number, number][]>([]);

  const [speed, setSpeed] = useState(800);
  const [isPlaying, setIsPlaying] = useState(true);

  const getPosition = (i: number) => {
    const total = Number(n) || 1;
    const radius = 120;
    const cx = 200;
    const cy = 150;
    const angle = (2 * Math.PI * i) / total;

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  useEffect(() => {
    if (!steps.length) return;

    let i = 0;
    let cancelled = false;

    const run = () => {
      if (cancelled || i >= steps.length) return;

      if (!isPlaying) {
        setTimeout(run, 100);
        return;
      }

      setCurrentStep(steps[i]);
      i++;

      setTimeout(run, speed);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [steps, speed, isPlaying]);

  const handleRun = async () => {
    try {
      if (!n || !edges || source === "") {
        alert("Fill all fields");
        return;
      }

      setSteps([]);
      setCurrentStep(null);

      const parsedEdges: [number, number, number][] = edges
        .split(";")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .map((e) => {
          const [u, v, w] = e.split(",").map(Number);
          if ([u, v].some((x) => Number.isNaN(x))) throw new Error();
          return [u, v, w || 1];
        });

      setGraphEdges(parsedEdges);

      const res = await axios.post(
        "http://localhost:3000/api/graph/bfs",
        {
          n: Number(n),
          edges: parsedEdges,
          source: Number(source),
        }
      );

      setSteps(res.data.steps);
    } catch {
      alert("Invalid input or server error");
    }
  };

  return (
    <div className="app-graph">
      <h1 className="title-graph">
        BFS Visualizer
        <span
          style={{
            marginLeft: "10px",
            cursor: "pointer",
            border: "1px solid #999",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
            position: "relative",
          }}
          title={`Red → Current Node
Green → Visited Node
Blue → Unvisited Node`}
        >
          i
        </span>
      </h1>

      <div className="controls-graph">
        <input
          className="input-graph"
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="Nodes"
        />
        <input
          className="input-graph"
          value={edges}
          onChange={(e) => setEdges(e.target.value)}
          placeholder="Edges (u,v,w;...)"
        />
        <input
          className="input-graph"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Start Node"
        />
        <button className="btn-graph" onClick={handleRun}>
          Run
        </button>
        <button
          className="btn-graph"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="range"
          min="1"
          max="10"
          value={Math.floor((2100 - speed) / 200)}
          onChange={(e) =>
            setSpeed(2100 - Number(e.target.value) * 200)
          }
        />
        <span> {speed} ms</span>
      </div>

      <div className="graph-box-graph">
        <svg width="400" height="300" className="svg-graph">
          {graphEdges.map(([u, v, w], i) => {
            const p1 = getPosition(u);
            const p2 = getPosition(v);

            return (
              <g key={i}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#aaa"
                  strokeWidth={1.5}
                />
                <text
                  x={(p1.x + p2.x) / 2}
                  y={(p1.y + p2.y) / 2}
                  fontSize="12"
                >
                  {w}
                </text>
              </g>
            );
          })}

          {n &&
            Array.from({ length: Number(n) }).map((_, i) => {
              const { x, y } = getPosition(i);

              const isVisited = currentStep?.visited?.includes(i);
              const isCurrent = currentStep?.currentNode === i;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill={
                      isCurrent
                        ? "#e63946"
                        : isVisited
                        ? "#2a9d8f"
                        : "#4361ee"
                    }
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="#fff"
                  >
                    {i}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      <div className="info-graph">
        <p>Current Node: {currentStep?.currentNode ?? "-"}</p>
        <p>Visited: {currentStep?.visited?.join(", ") || "-"}</p>
        <p>Queue: {currentStep?.queue?.join(" → ") || "-"}</p>
      </div>
    </div>
  );
}