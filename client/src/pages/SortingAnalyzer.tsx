import { useEffect, useState } from 'react';
import axios from "axios";
import "../App.css";

type Step = {
  array: number[];
  comparing?: number[];
};

export function SortingAnalyzer(){
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
        const res = await axios.get(`http://localhost:3000`);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
    call();
  }, []);

  const handleSort = async () => {

    if (!algo) {
      alert("Please select a sorting algorithm first!");
      return;
    }

    if (!array.trim()) {
      alert("Please enter an array!");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/api/sort/${algo}`, {
        array: array.split(",").map(Number),
      });
      setSteps(res.data.steps);
      setTc(res.data.timeComplexity);
      setSc(res.data.spaceComplexity);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (steps.length === 0) return;

    let i = 0;
    
    const interval = setInterval(() => {
      if (i >= steps.length) {
        setComparing([]);
        clearInterval(interval);
        return ;
      }
      setCurrentStep(steps[i].array);
      setComparing(steps[i].comparing || []);
      i++;
      
    }, 100);

    return () => clearInterval(interval);
  }, [steps, setCurrentStep]);

  const maxVal = Math.max(...currentStep, 1);

  return (
    <div className="app-container">
      <h1>Sorting Analyzer</h1>

      <div className="controls">
        <input
          value={array}
          onChange={(e) => setArray(e.target.value)}
          placeholder="Enter numbers"
        />

        <select value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="">Select Algorithm</option>
          <option value="bubble-sort">Bubble Sort</option>
          <option value="selection-sort">Selection Sort</option>
          <option value="insertion-sort">Insertion Sort</option>
          <option value="merge-sort">Merge Sort</option>
          <option value="quick-sort">Quick Sort</option>
        </select>

        <button onClick={handleSort}>Sort</button>
      </div>

      <div className="main-grid">
        <div>
          <div className="sorted-array">
            <h3>Sorted Array</h3>
            <div className="array-values">
              {currentStep.map((num, i) => (
                <span key={i}>{num}</span>
              ))}
            </div>
          </div>

          <div className="complexity">
            <div>
              <strong>Time Complexity</strong>
              <p>{tc}</p>
            </div>
            <div>
              <strong>Space Complexity</strong>
              <p>{sc}</p>
            </div>
          </div>
        </div>

        <div className="bar-container">
          {currentStep.map((num, i) => (
            <div
              key={i}
              className="bar"
              style={{
                height: `${Math.max((num / maxVal) * 280, 30)}px`,
                width: `${Math.max(15, 400 / currentStep.length)}px`,
                backgroundColor: comparing.includes(i)
                  ? "#e63946"
                  : "#4361ee"
              }}
            >
              <span className="bar-text">{num}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}