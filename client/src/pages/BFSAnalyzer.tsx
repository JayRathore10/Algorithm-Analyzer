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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStep(steps[0]);

    const interval = setInterval(() => {
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        return;
      }
      setCurrentStep(steps[i]);
    }, 800);

    return () => clearInterval(interval);
  }, [steps]);

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
      <h1 className="title-graph">BFS Visualizer</h1>

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