import { useState } from "react";
import "./App.css";
import { FaBolt, FaBomb } from "react-icons/fa";
import { GiNuclearBomb } from "react-icons/gi";
import { WiDayLightning } from "react-icons/wi";
import { RiScales3Line } from "react-icons/ri"; // Yeni karşılaştırma ikonu

function calculateEnergy(magnitude: number) {
    const joules = Math.pow(10, 1.5 * magnitude + 4.8);
    const tnt = joules / 4.184e6;
    const hiroshima = tnt / 15000;
    const lightning = joules / 1e9;

    return [
        { label: "Enerji", value: `${joules.toExponential(2)} J`, icon: <FaBolt /> },
        { label: "TNT", value: `${tnt.toLocaleString()} kg`, icon: <FaBomb /> },
        { label: "Hiroşima Bombası", value: hiroshima.toFixed(2), icon: <GiNuclearBomb /> },
        { label: "Yıldırım", value: `${lightning.toFixed(0)} düşüm`, icon: <WiDayLightning /> },
    ];
}

function compareMagnitudes(m1: number, m2: number): string {
    const diff = 1.5 * (m2 - m1);
    const factor = Math.pow(10, diff);

    if (factor === 1) return "Her iki deprem eşit büyüklüktedir.";
    if (factor > 1)
        return `${m2.toFixed(1)} büyüklüğündeki deprem, ${m1.toFixed(1)} büyüklüğündekinden yaklaşık ${factor.toFixed(1)} kat daha güçlüdür.`;
    else
        return `${m1.toFixed(1)} büyüklüğündeki deprem, ${m2.toFixed(1)} büyüklüğündekinden yaklaşık ${(1 / factor).toFixed(1)} kat daha güçlüdür.`;
}

export default function App() {
    const [mode, setMode] = useState<"single" | "compare" | null>(null);
    const [m1, setM1] = useState(6.0);
    const [m2, setM2] = useState(7.0);
    const [result, setResult] = useState<any[] | string>("");
    const [comparison, setComparison] = useState("");

    const handleCalculate = () => {
        if (mode === "single") {
            if (isNaN(m1) || m1 < 1.0 || m1 > 10.0) {
                setResult("Lütfen 1.0 ile 10.0 arasında geçerli bir büyüklük giriniz.");
                return;
            }
            setResult(calculateEnergy(m1));
        } else if (mode === "compare") {
            if (
                isNaN(m1) || m1 < 1.0 || m1 > 10.0 ||
                isNaN(m2) || m2 < 1.0 || m2 > 10.0
            ) {
                setResult("Lütfen 1.0 ile 10.0 arasında geçerli büyüklükler giriniz.");
                setComparison("");
                return;
            }
            setComparison(compareMagnitudes(m1, m2));
            setResult(""); // Enerji verilerini göstermiyoruz
        }
    };

    const reset = () => {
        setMode(null);
        setResult("");
        setComparison("");
        setM1(6.0);
        setM2(7.0);
    };

    return (
        <div className="App">
            {!mode ? (
                <>
                    <h1>Deprem Gücü Hesaplayıcı</h1>
                    <p>Ne yapmak istiyorsunuz?</p>
                    <button onClick={() => setMode("single")}>🔹 Enerji Hesapla</button>
                    <button onClick={() => setMode("compare")}>
                        <RiScales3Line style={{ marginRight: "6px" }} />
                        Depremleri Karşılaştır
                    </button>
                </>
            ) : (
                <>
                    <h1>{mode === "single" ? "Enerji Hesaplama" : "Deprem Karşılaştırma"}</h1>

                    <div style={{ width: "100%" }}>
                        <label>1. Deprem Büyüklüğü (Mw):</label>
                        <input
                            type="number"
                            value={m1}
                            onChange={(e) => setM1(parseFloat(e.target.value))}
                            step="0.1"
                            min="1.0"
                            max="10.0"
                        />
                    </div>

                    {mode === "compare" && (
                        <div style={{ width: "100%" }}>
                            <label>2. Deprem Büyüklüğü (Mw):</label>
                            <input
                                type="number"
                                value={m2}
                                onChange={(e) => setM2(parseFloat(e.target.value))}
                                step="0.1"
                                min="1.0"
                                max="10.0"
                            />
                        </div>
                    )}

                    <button onClick={handleCalculate}>Hesapla</button>
                    <button onClick={reset} style={{ backgroundColor: "#888", marginTop: "10px" }}>↩ Geri</button>

                    {comparison && <p className="comparison">{comparison}</p>}

                    {result &&
                        typeof result !== "string" && (
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
                        )}

                    {typeof result === "string" && <p className="error">{result}</p>}
                </>
            )}
        </div>
    );
}
