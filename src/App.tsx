import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

// Chart.js yapılandırma
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [magnitude, setMagnitude] = useState(6.0);
  const [result, setResult] = useState("");
  const [chartData, setChartData] = useState({
    labels: ["Enerji (J)", "TNT (kg)", "Hiroşima", "Benzin (L)", "Kalori", "Yıldırım"],
    datasets: [
      {
        label: "Deprem Enerjisi",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

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

    setChartData({
      labels: ["Enerji (J)", "TNT (kg)", "Hiroşima", "Benzin (L)", "Kalori", "Yıldırım"],
      datasets: [
        {
          label: `Deprem Enerjisi (Mw: ${magnitude})`,
          data: [joules, tnt, hiroshima, gas, calories, lightning],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  };

  const calculateByType = (type: string) => {
    let factor = 1;
    if (type === "surface") factor = 1.5;  // Yüzey dalgaları için katsayı
    if (type === "body") factor = 2;      // İç dalgalar için katsayı

    const joules = Math.pow(10, 1.5 * magnitude + 4.8) * factor;
    const tnt = joules / 4.184e6;
    setResult(`Enerji: ${joules.toExponential(2)} J
TNT: ${tnt.toLocaleString()} kg`);
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

      <div style={{ marginTop: "30px" }}>
        <Bar data={chartData} />
      </div>

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => calculateByType("surface")}>Yüzey Dalgası Hesapla</button>
        <button onClick={() => calculateByType("body")}>İç Dalgası Hesapla</button>
      </div>
    </div>
  );
}

export default App;
