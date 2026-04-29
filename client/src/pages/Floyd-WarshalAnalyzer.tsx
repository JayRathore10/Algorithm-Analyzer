import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/Floyd-WarshallAnalyzer.css";
type Step = {
  k: number;
  matrix: number[][];
};

export function FloydWarshallAnalyzer() {
  const [n, setN] = useState("");
  const [edges, setEdges] = useState("");

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);

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

      const parsedEdges: [number, number, number][] = edges
        .split(";")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .map((e) => {
          const [u, v, w] = e.split(",").map(Number);
          if ([u, v, w].some((x) => Number.isNaN(x))) throw new Error();
          return [u, v, w];
        });

      const res = await axios.post(
        "http://localhost:3000/api/graph/floyd-warshall",
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

  return (
   <div className="app-fw">
  <h1 className="title-fw">Floyd-Warshall Visualizer</h1>

  <div className="controls-fw">
    <input
      className="input-fw"
      value={n}
      onChange={(e) => setN(e.target.value)}
      placeholder="Nodes"
    />
    <input
      className="input-fw"
      value={edges}
      onChange={(e) => setEdges(e.target.value)}
      placeholder="Edges (u,v,w;...)"
    />
    <button className="btn-fw" onClick={handleRun}>
      Run
    </button>
  </div>

  <div className="matrix-box-fw">
    <p className="info-fw">
      Intermediate Node (k): {currentStep?.k ?? "-"}
    </p>

    <table className="matrix-fw">
      <tbody>
        {currentStep?.matrix.map((row, i) => (
          <tr key={i}>
            {row.map((val, j) => (
              <td key={j}>
                {val >= 1e9 ? "∞" : val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}