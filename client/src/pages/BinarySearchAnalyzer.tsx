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
    }, 700);

    return () => clearInterval(interval);
  }, [steps]);

  const handleRun = async () => {
    try {
      const parsedArr = arrayInput
        .split(",")
        .map((x) => Number(x.trim()));

      if (parsedArr.some(isNaN) || target === "") {
        alert("Invalid input");
        return;
      }

      parsedArr.sort((a, b) => a - b); // important

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
      <h1 className="title-graph">Binary Search Visualizer</h1>

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
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
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