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

  useEffect(() => {
    const call = async () => {
      try {
        await axios.get(`http://localhost:3000`);
      } catch (error) {
        console.log(error);
      }
    };
    call();
  }, []);

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
      const res = await axios.post(
        `http://localhost:3000/api/sort/${algo}`,
        {
          array: array.split(",").map(Number),
        }
      );

      setSteps(res.data.steps);
      setTc(res.data.timeComplexity);
      setSc(res.data.spaceComplexity);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (steps.length === 0) return;

    let i = 0;

    const interval = setInterval(() => {
      if (i >= steps.length) {
        setComparing([]);
        clearInterval(interval);
        return;
      }

      setCurrentStep(steps[i].array);
      setComparing(steps[i].comparing || []);
      i++;
    }, 100);

    return () => clearInterval(interval);
  }, [steps]);

  const maxVal = Math.max(...currentStep, 1);
  // const maxVal = currentStep.length ? Math.max(...currentStep) : 1;
  return (
    <div className="app">
      <h1 className="hd">Sorting Analyzer</h1>

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
          <option className="opt" value="">
            Select Algorithm
          </option>
          <option className="opt" value="bubble-sort">
            Bubble Sort
          </option>
          <option className="opt" value="selection-sort">
            Selection Sort
          </option>
          <option className="opt" value="insertion-sort">
            Insertion Sort
          </option>
          <option className="opt" value="merge-sort">
            Merge Sort
          </option>
          <option className="opt" value="quick-sort">
            Quick Sort
          </option>
        </select>

        <button className="btn" onClick={handleSort}>
          Sort
        </button>
      </div>

      <div className="grid">
        <div className="left">
          <div className="box">
            <h3 className="sub">Sorted Array</h3>
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