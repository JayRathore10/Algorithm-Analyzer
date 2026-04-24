import { useEffect, useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [array, setArray] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState([]);

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
    const res = await axios.post("http://localhost:3000/api/sort/bubble-sort", {
      array: array.split(",").map(Number),
    });
    setSteps(res.data.steps);
  }

  useEffect(() => {
    if (steps.length === 0) return;

    let i = 0;

    const interval = setInterval(() => {
      setCurrentStep(steps[i]);
      i++;

      console.log("l");

      if (i >= steps.length) clearInterval(interval);
    }, 1000); // speed (ms)

    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div>
      <h1>Sorting Analyzer</h1>

      <input
        value={array}
        onChange={(e) => setArray(e.target.value)}
        placeholder="Enter numbers"
      />

      <button onClick={handleSort}>Sort</button>

      <div>
        {currentStep.map((num, i) => (
          <span key={i}>{num} </span>
        ))}
      </div>

      <div className="bar-container">
        {currentStep.map((num, i) => (
          <div
            key={i}
            className="bar"
            style={{ height: `${num * 5}px`}}
          >
            {num}
          </div>
        ))}
      </div>

    </div>
  );

}

export default App
