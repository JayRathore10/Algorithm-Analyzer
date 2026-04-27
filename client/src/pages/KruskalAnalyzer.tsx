import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/DijkstraAnalyze.css";

type Step = {
  edge?: [number, number, number];
  mstEdges?: [number, number, number][];
  totalWeight?: number;
  accepted?: boolean;
};

export function KruskalAnalyzer() {
  const [n, setN] = useState("");
  const [edges, setEdges] = useState("");

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [graphEdges, setGraphEdges] = useState<[number, number, number][]>([]);
  const [showMSTOnly, setShowMSTOnly] = useState(false);

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
      if (!n || !edges) {
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
          if ([u, v, w].some((x) => Number.isNaN(x))) throw new Error();
          return [u, v, w];
        });

      setGraphEdges(parsedEdges);

      const res = await axios.post(
        "http://localhost:3000/api/graph/kruskal",
        {
          n: Number(n),
          edges: parsedEdges,
        }
      );

      setSteps(res.data.steps);
    } catch {
      alert("Invalid input or server error");
    }
  };

  const isFinished =
    steps.length > 0 &&
    currentStep === steps[steps.length - 1];

  const edgesToRender =
    showMSTOnly || isFinished
      ? currentStep?.mstEdges || []
      : graphEdges;

  return (
    <div className="app-graph">
      <h1 className="title-graph">Kruskal Visualizer</h1>

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
        <button className="btn-graph" onClick={handleRun}>
          Run
        </button>
        <button
          className="btn-graph"
          onClick={() => setShowMSTOnly(!showMSTOnly)}
        >
          {showMSTOnly ? "Show Full Graph" : "Show MST Only"}
        </button>
      </div>

      <div className="graph-box-graph">
        <svg width="400" height="300" className="svg-graph">
          {edgesToRender.map(([u, v, w], i) => {
            const p1 = getPosition(u);
            const p2 = getPosition(v);

            const isMST = currentStep?.mstEdges?.some(
              ([a, b]) =>
                (a === u && b === v) || (a === v && b === u)
            );

            const isCurrent =
              currentStep?.edge &&
              ((currentStep.edge[0] === u &&
                currentStep.edge[1] === v) ||
                (currentStep.edge[0] === v &&
                  currentStep.edge[1] === u));

            const isRejected =
              isCurrent && currentStep?.accepted === false;

            return (
              <g key={i}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={
                    isRejected
                      ? "#888"
                      : isCurrent
                      ? "#e63946"
                      : isMST
                      ? "#2a9d8f"
                      : "#aaa"
                  }
                  strokeWidth={isMST ? 3 : 1.5}
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

              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="18" fill="#4361ee" />
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
        <p>Current Edge: {currentStep?.edge?.join(", ") || "-"}</p>
        <p>
          Accepted:{" "}
          {currentStep?.accepted === undefined
            ? "-"
            : currentStep.accepted
            ? "Yes"
            : "No"}
        </p>
        <p>MST Weight: {currentStep?.totalWeight ?? "-"}</p>
      </div>
    </div>
  );
} 

/* Have to add prism and some of others */