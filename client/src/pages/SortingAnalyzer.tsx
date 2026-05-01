import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/SortingAnalyzer.css";

type Step = {
  array: number[];
  comparing?: number[];
};

export function SortingAnalyzer() {
  const [array, setArray] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number[]>([]);
  const [algo, setAlgo] = useState("");
  const [tc, setTc] = useState("");
  const [sc, setSc] = useState("");
  const [comparing, setComparing] = useState<number[]>([]);

  const [speed, setSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!steps.length) return;

    let i = 0;
    let cancelled = false;

    const run = () => {
      if (cancelled || i >= steps.length) {
        setComparing([]);
        return;
      }

      if (!isPlaying) {
        setTimeout(run, 100);
        return;
      }

      setCurrentStep(steps[i].array);
      setComparing(steps[i].comparing || []);
      i++;

      setTimeout(run, speed);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [steps, speed, isPlaying]);

  const handleSort = async () => {
    if (!algo) {
      alert("Select algo");
      return;
    }

    if (!array.trim()) {
      alert("Enter array");
      return;
    }

    try {
      const parsed = array.split(",").map(Number);

      if (parsed.some(Number.isNaN)) {
        alert("Invalid input");
        return;
      }

      setSteps([]);
      setCurrentStep([]);
      setComparing([]);

      const res = await axios.post(
        `http://localhost:3000/api/sort/${algo}`,
        { array: parsed }
      );

      setSteps(res.data.steps);
      setTc(res.data.timeComplexity);
      setSc(res.data.spaceComplexity);
    } catch {
      alert("Server error");
    }
  };

  const maxVal = Math.max(...currentStep, 1);

  return (
    <div className="app">
      <h1 className="hd">
        Sorting Analyzer
        <span
          style={{
            marginLeft: "10px",
            cursor: "pointer",
            border: "1px solid #999",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
          title={`Red → Elements being compared
Blue → Normal elements
Bars show relative values`}
        >
          i
        </span>
      </h1>

      <div className="ct">
        <input
          className="inp"
          value={array}
          onChange={(e) => setArray(e.target.value)}
          placeholder="Enter numbers"
        />

        <select
          className="sel"
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
        >
          <option value="">Select Algorithm</option>
          <option value="bubble-sort">Bubble Sort</option>
          <option value="selection-sort">Selection Sort</option>
          <option value="insertion-sort">Insertion Sort</option>
          <option value="merge-sort">Merge Sort</option>
          <option value="quick-sort">Quick Sort</option>
        </select>

        <button className="btn" onClick={handleSort}>
          Sort
        </button>

        <button
          className="btn"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className="grid">
        <div className="left">
          <div className="box">
            <h3 className="sub">Current Array</h3>
            <div className="arr">
              {currentStep.map((num, i) => (
                <span key={i} className="tag">
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div className="cmp">
            <div className="cmpBox">
              <strong className="lbl">Time Complexity</strong>
              <p className="val">{tc}</p>
            </div>
            <div className="cmpBox">
              <strong className="lbl">Space Complexity</strong>
              <p className="val">{sc}</p>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <input
              type="range"
              min="1"
              max="10"
              value={Math.floor((1100 - speed) / 100)}
              onChange={(e) =>
                setSpeed(1100 - Number(e.target.value) * 100)
              }
            />
            <span> {speed} ms</span>
          </div>
        </div>

        <div className="bars">
          {currentStep.map((num, i) => (
            <div
              key={i}
              className="bar"
              style={{
                height: `${Math.max((num / maxVal) * 280, 30)}px`,
                width: `${Math.max(15, 400 / currentStep.length)}px`,
                backgroundColor: comparing.includes(i)
                  ? "#e63946"
                  : "#4361ee",
              }}
            >
              <span className="barTxt">{num}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}