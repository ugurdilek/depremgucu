import { useState } from "react";
import "./App.css";

function App() {
  const [magnitude, setMagnitude] = useState(6.0);
  const [result, setResult] = useState("");

  const calculate = () => {
    const joules = Math.pow(10, 1.5 * magnitude + 4.8);
    const tnt = joules / 4.184e6;
    const hiroshima = tnt / 15000;
    const gas = joules / 34e6;
    const calories = joules / 8400000;
    const lightning = joules / 1e9;

    setResult(`Enerji: ${joules.toExponential(2)} J
TNT: ${tnt.toLocaleString()} kg
Hiroşima Bombası: ${hiroshima.toFixed(2)}
Benzin: ${gas.toLocaleString()} L
Kalori: ${calories.toLocaleString()} kcal
Yıldırım: ${lightning.toFixed(0)} düşüm`);
  };

  return (
      <div className="App">
        <h1>Deprem Gücü Hesaplayıcı</h1>
        <div>
          <label>Deprem Büyüklüğü (Mw): </label>
          <input
              type="range"
              min="5"
              max="10"
              value={magnitude}
              onChange={(e) => setMagnitude(Number(e.target.value))}
              step="0.1"
          />
          <span>{magnitude}</span>
        </div>
        <button onClick={calculate}>Hesapla</button>
        {result && <pre>{result}</pre>}
      </div>
  );
}

export default App;
