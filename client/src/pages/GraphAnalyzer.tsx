import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/GraphAnalyzer.css";

type Step = {
  currentNode?: number;
  visited?: number[];
  distances?: Record<number, number>;
};

export function GraphAnalyzer() {
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
    }, 600);

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
        .filter(Boolean)
        .map((e) => {
          const p = e.split(",").map(Number);
          if (p.length !== 3 || p.some(Number.isNaN)) {
            throw new Error();
          }
          return [p[0], p[1], p[2]];
        });

      setGraphEdges(parsedEdges);

      const res = await axios.post(
        "http://localhost:3000/api/graph/dijkstra",
        {
          n: Number(n),
          edges: parsedEdges,
          source: Number(source),
        }
      );

      setSteps(res.data.steps);
    } catch {
      alert("Invalid input format");
    }
  };

  return (
    <div className="app-graph">
      <h1 className="title-graph">Dijkstra Visualizer</h1>

      <div className="controls-graph">
        <input className="input-graph" value={n} onChange={(e) => setN(e.target.value)} placeholder="Nodes" />
        <input className="input-graph" value={edges} onChange={(e) => setEdges(e.target.value)} placeholder="Edges" />
        <input className="input-graph" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <button className="btn-graph" onClick={handleRun}>Run</button>
      </div>

      <div className="graph-box-graph">
        <svg width="400" height="300" className="svg-graph">
          {graphEdges.map(([u, v, w], i) => {
            const p1 = getPosition(u);
            const p2 = getPosition(v);

            return (
              <g key={i} className="edge-graph">
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
                <text x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2}>
                  {w}
                </text>
              </g>
            );
          })}

          {n &&
            Array.from({ length: Number(n) }).map((_, i) => {
              const { x, y } = getPosition(i);

              let color = "#4361ee";

              if (currentStep?.currentNode === i) color = "#e63946";
              else if (currentStep?.visited?.includes(i)) color = "#2a9d8f";

              return (
                <g key={i} className="node-graph">
                  <circle cx={x} cy={y} r="18" fill={color} />
                  <text x={x} y={y + 5} textAnchor="middle" fill="#fffff">
                    {i}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      <div className="info-graph">
        <p>Current Node: {currentStep?.currentNode ?? "-"}</p>
        <p>Visited Node: {currentStep?.visited?.join(", ") || "-"}</p>
      </div>
    </div>
  );
}