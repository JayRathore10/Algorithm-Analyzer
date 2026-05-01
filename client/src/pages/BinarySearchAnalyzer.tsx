import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/DijkstraAnalyze.css";

type Step = {
  left: number;
  right: number;
  mid: number;
  value: number;
  found: boolean;
};

export function BinarySearchAnalyzer() {
  const [arrayInput, setArrayInput] = useState("");
  const [target, setTarget] = useState("");

  const [arr, setArr] = useState<number[]>([]);
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
      const parsedArr = arrayInput
        .split(",")
        .map((x) => Number(x.trim()));

      if (parsedArr.some(isNaN) || target === "") {
        alert("Invalid input");
        return;
      }

      parsedArr.sort((a, b) => a - b);

      setArr(parsedArr);
      setSteps([]);
      setCurrentStep(null);

      const res = await axios.post(
        "http://localhost:3000/api/searching/binary-search",
        {
          arr: parsedArr,
          target: Number(target),
        }
      );

      setSteps(res.data.steps);
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="app-graph">
      <h1 className="title-graph">
        Binary Search Visualizer
        <span
          style={{
            marginLeft: "10px",
            cursor: "pointer",
            border: "1px solid #999",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
          title={`Red → Mid Element
Green → Current Search Range
Grey → Discarded Elements`}
        >
          i
        </span>
      </h1>

      <div className="controls-graph">
        <input
          className="input-graph"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="Array (e.g. 1,3,5,7,9)"
        />
        <input
          className="input-graph"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target"
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        {arr.map((num, i) => {
          const isMid = i === currentStep?.mid;
          const inRange =
            currentStep &&
            i >= currentStep.left &&
            i <= currentStep.right;

          return (
            <div
              key={i}
              style={{
                width: 50,
                height: 50,
                margin: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                backgroundColor: isMid
                  ? "#e63946"
                  : inRange
                  ? "#2a9d8f"
                  : "#ccc",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {num}
            </div>
          );
        })}
      </div>

      <div className="info-graph">
        <p>Left: {currentStep?.left ?? "-"}</p>
        <p>Right: {currentStep?.right ?? "-"}</p>
        <p>Mid Index: {currentStep?.mid ?? "-"}</p>
        <p>Mid Value: {currentStep?.value ?? "-"}</p>
        <p>
          Found:{" "}
          {currentStep?.found === undefined
            ? "-"
            : currentStep.found
            ? "Yes"
            : "No"}
        </p>
      </div>
    </div>
  );
}