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

  const [speed, setSpeed] = useState(800);
  const [isPlaying, setIsPlaying] = useState(true);

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
      <h1 className="title-fw">
        Floyd-Warshall Visualizer
        <span
          style={{
            marginLeft: "10px",
            cursor: "pointer",
            border: "1px solid #999",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
          title={`Each step uses node k as intermediate
Matrix[i][j] = shortest distance from i → j
∞ means no path exists`}
        >
          i
        </span>
      </h1>

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
        <button
          className="btn-fw"
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

      <div className="matrix-box-fw">
        <p className="info-fw">
          Intermediate Node (k): {currentStep?.k ?? "-"}
        </p>

        <table className="matrix-fw">
          <tbody>
            {currentStep?.matrix.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j}>{val >= 1e9 ? "∞" : val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}