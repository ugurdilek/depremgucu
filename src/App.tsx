import { useState } from "react";
import "./App.css";
import { FaBolt, FaBomb, FaGasPump } from "react-icons/fa";
import { GiMeal, GiNuclearBomb } from "react-icons/gi";
import { WiDayLightning } from "react-icons/wi";

function calculateEnergy(magnitude: number) {
    const joules = Math.pow(10, 1.5 * magnitude + 4.8);
    const tnt = joules / 4.184e6;
    const hiroshima = tnt / 15000;
    const gas = joules / 34e6;
    const calories = joules / 8400000;
    const lightning = joules / 1e9;

    return [
        { label: "Enerji", value: `${joules.toExponential(2)} J`, icon: <FaBolt /> },
        { label: "TNT", value: `${tnt.toLocaleString()} kg`, icon: <FaBomb /> },
        { label: "Hiroşima Bombası", value: hiroshima.toFixed(2), icon: <GiNuclearBomb /> },
        { label: "Benzin", value: `${gas.toLocaleString()} L`, icon: <FaGasPump /> },
        { label: "Kalori", value: `${calories.toLocaleString()} kcal`, icon: <GiMeal /> },
        { label: "Yıldırım", value: `${lightning.toFixed(0)} düşüm`, icon: <WiDayLightning /> },
    ];
}

function compareMagnitudes(m1: number, m2: number): string {
    const diff = 1.5 * (m2 - m1);
    const factor = Math.pow(10, diff);

    if (factor === 1) return "Her iki deprem de eşit büyüklükte.";
    if (factor > 1)
        return `${m2.toFixed(1)} büyüklüğündeki deprem, ${m1.toFixed(1)} büyüklüğündekinden yaklaşık ${factor.toFixed(1)} kat daha fazla enerji salar.`;
    else
        return `${m1.toFixed(1)} büyüklüğündeki deprem, ${m2.toFixed(1)} büyüklüğündekinden yaklaşık ${(1 / factor).toFixed(1)} kat daha fazla enerji salar.`;
}

function App() {
    const [magnitude1, setMagnitude1] = useState(6.0);
    const [magnitude2, setMagnitude2] = useState(7.0);
    const [result, setResult] = useState<any[] | string>("");
    const [comparison, setComparison] = useState("");

    const calculate = () => {
        if (
            isNaN(magnitude1) || magnitude1 < 1.0 || magnitude1 > 10.0 ||
            isNaN(magnitude2) || magnitude2 < 1.0 || magnitude2 > 10.0
        ) {
            setResult("Lütfen 1.0 ile 10.0 arasında geçerli büyüklükler giriniz.");
            setComparison("");
            return;
        }

        setResult(calculateEnergy(magnitude2)); // büyük olanı detaylı gösteriyoruz
        setComparison(compareMagnitudes(magnitude1, magnitude2));
    };

    return (
        <div className="App">
            <h1>Deprem Gücü Hesaplayıcı</h1>
            <p className="description">
                İki deprem büyüklüğü girin, enerji karşılıklarını ve aralarındaki farkı görün.
            </p>

            <div style={{ width: "100%" }}>
                <label>1. Deprem Büyüklüğü (Mw): </label>
                <input
                    type="number"
                    value={magnitude1}
                    onChange={(e) => setMagnitude1(parseFloat(e.target.value))}
                    step="0.1"
                    min="1.0"
                    max="10.0"
                />
            </div>

            <div style={{ width: "100%" }}>
                <label>2. Deprem Büyüklüğü (Mw): </label>
                <input
                    type="number"
                    value={magnitude2}
                    onChange={(e) => setMagnitude2(parseFloat(e.target.value))}
                    step="0.1"
                    min="1.0"
                    max="10.0"
                />
            </div>

            <button onClick={calculate}>Hesapla</button>

            {comparison && <p className="comparison">{comparison}</p>}

            {result &&
                (typeof result === "string" ? (
                    <p className="error">{result}</p>
                ) : (
                    <ul className="results">
                        {result.map((item, index) => (
                            <li key={index}>
                                <span className={`icon ${item.label.toLowerCase().replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ /g, '-')}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}: {item.value}</span>
                            </li>
                        ))}
                    </ul>
                ))}
        </div>
    );
}

export default App;
