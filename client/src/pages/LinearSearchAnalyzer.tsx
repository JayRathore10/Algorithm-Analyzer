import { useState, useEffect } from "react";
import axios from "axios";

type LS_Steps = {
  index: number;
  value: number;
  found: boolean;
};

export function LinearSearchAnalyzer() {
  const [arrayInput, setArrayInput] = useState("");
  const [target, setTarget] = useState("");

  const [arr, setArr] = useState<number[]>([]);
  const [steps, setSteps] = useState<LS_Steps[]>([]);
  const [currentStep, setCurrentStep] = useState<LS_Steps | null>(null);

  const [speed, setSpeed] = useState(600);
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

      setArr(parsedArr);
      setSteps([]);
      setCurrentStep(null);

      const res = await axios.post(
        "http://localhost:3000/api/searching/linear-search",
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
      <h1 className="title-graph">Linear Search Visualizer</h1>

      <div className="controls-graph">
        <input
          className="input-graph"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="Array (e.g. 4,2,7,1,9)"
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
          const isCurrent = i === currentStep?.index;
          const isFound = isCurrent && currentStep?.found;

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
                backgroundColor: isFound
                  ? "#2a9d8f"
                  : isCurrent
                  ? "#e63946"
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
        <p>Current Index: {currentStep?.index ?? "-"}</p>
        <p>Value: {currentStep?.value ?? "-"}</p>
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