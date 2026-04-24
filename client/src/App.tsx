import { useEffect, useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [array, setArray] = useState("");
  const [result, setResult] = useState([]);

  
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
    setResult(res.data.sorted);
  }

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
        {result.map((num, i) => (
          <span key={i}>{num} </span>
        ))}
      </div>
    </div>
  );

}

export default App
