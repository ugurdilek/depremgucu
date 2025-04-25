import { useState, JSX } from "react";
import "./App.css";
import { FaBolt, FaBomb } from "react-icons/fa";
import { GiNuclearBomb } from "react-icons/gi";
import { WiDayLightning } from "react-icons/wi";

// Tip tanımlamaları
interface EnergyResult {
    label: string;
    value: string;
    icon: JSX.Element;
}

// Custom hook
function useEarthquakeCalculator() {
    const calculateEnergy = (magnitude: number): EnergyResult[] => {
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
    };

    const compareMagnitudes = (m1: number, m2: number): string => {
        const diff = 1.5 * (m2 - m1);
        const factor = Math.pow(10, diff);

        if (factor === 1) return "Her iki deprem eşit büyüklüktedir.";
        if (factor > 1)
            return `${m2.toFixed(1)} büyüklüğündeki deprem, ${m1.toFixed(1)} büyüklüğündekinden yaklaşık ${factor.toFixed(1)} kat daha güçlüdür.`;
        return `${m1.toFixed(1)} büyüklüğündeki deprem, ${m2.toFixed(1)} büyüklüğündekinden yaklaşık ${(1 / factor).toFixed(1)} kat daha güçlüdür.`;
    };

    return { calculateEnergy, compareMagnitudes };
}

// ModeSelector Bileşeni
function ModeSelector({ onSelectMode }: { onSelectMode: (mode: "single" | "compare") => void }) {
    return (
        <div className="content-container">
            <h1>Deprem Gücü Hesaplayıcı</h1>
            <p>Ne yapmak istiyorsunuz?</p>
            <button onClick={() => onSelectMode("single")}>🔹 Enerji Hesapla</button>
            <button onClick={() => onSelectMode("compare")}>Depremleri Karşılaştır</button>
        </div>
    );
}

// EnergyCalculator Bileşeni
function EnergyCalculator({
                              magnitude,
                              onMagnitudeChange,
                              onCalculate,
                              onReset,
                          }: {
    magnitude: number;
    onMagnitudeChange: (mag: number) => void;
    onCalculate: () => void;
    onReset: () => void;
}) {
    const [inputVal, setInputVal] = useState<string>(magnitude.toString());
    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
            setInputVal(val);
            setError("");
        }
    };

    const handleCalculate = () => {
        const normalized = inputVal.replace(",", ".");
        if (!/^[0-9]+(\.[0-9]+)?$/.test(normalized)) {
            setError("Lütfen geçerli bir sayı giriniz (örn. 6.5)");
            return;
        }
        const parsed = parseFloat(normalized);
        if (isNaN(parsed) || parsed < 1 || parsed > 10) {
            setError("Lütfen 1.0 ile 10.0 arasında bir değer giriniz.");
            return;
        }
        onMagnitudeChange(parsed);
        onCalculate();
    };

    return (
        <div className="content-container">
            <h1>Enerji Hesaplama</h1>
            <label htmlFor="magnitude">Büyüklük (Mw):</label>
            <input
                id="magnitude"
                type="text"
                inputMode="decimal"
                placeholder="6.5"
                value={inputVal}
                onChange={handleChange}
            />
            {error && <p className="error">{error}</p>}
            <button onClick={handleCalculate}>Hesapla</button>
            <button onClick={onReset} className="secondary-button">↩ Geri</button>
        </div>
    );
}

// CompareTool Bileşeni
function CompareTool({
                         m1,
                         m2,
                         onM1Change,
                         onM2Change,
                         onCalculate,
                         onReset,
                     }: {
    m1: number;
    m2: number;
    onM1Change: (mag: number) => void;
    onM2Change: (mag: number) => void;
    onCalculate: () => void;
    onReset: () => void;
}) {
    const [val1, setVal1] = useState<string>(m1.toString());
    const [val2, setVal2] = useState<string>(m2.toString());
    const [error, setError] = useState<string>("");

    const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (/^[0-9]*[.,]?[0-9]*$/.test(v)) {
            setVal1(v);
            setError("");
        }
    };
    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        if (/^[0-9]*[.,]?[0-9]*$/.test(v)) {
            setVal2(v);
            setError("");
        }
    };

    const handleCalculate = () => {
        const n1 = val1.replace(",", ".");
        const n2 = val2.replace(",", ".");
        if (!/^[0-9]+(\.[0-9]+)?$/.test(n1) || !/^[0-9]+(\.[0-9]+)?$/.test(n2)) {
            setError("Lütfen geçerli sayılar giriniz");
            return;
        }
        const p1 = parseFloat(n1);
        const p2 = parseFloat(n2);
        if ([p1, p2].some(x => isNaN(x) || x < 1 || x > 10)) {
            setError("1.0 ile 10.0 arasında değerler giriniz");
            return;
        }
        onM1Change(p1);
        onM2Change(p2);
        onCalculate();
    };

    return (
        <div className="content-container">
            <h1>Deprem Karşılaştırma</h1>
            <label htmlFor="m1">1. Deprem (Mw):</label>
            <input id="m1" type="text" inputMode="decimal" value={val1} onChange={handleChange1} />
            <label htmlFor="m2">2. Deprem (Mw):</label>
            <input id="m2" type="text" inputMode="decimal" value={val2} onChange={handleChange2} />
            {error && <p className="error">{error}</p>}
            <button onClick={handleCalculate}>Hesapla</button>
            <button onClick={onReset} className="secondary-button">↩ Geri</button>
        </div>
    );
}

// ResultDisplay Bileşeni
function ResultDisplay({ results }: { results: EnergyResult[] }) {
    return (
        <ul className="results">
            {results.map((item, index) => (
                <li key={index}>
                    <span className={`icon ${item.label.toLowerCase().replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ /g, '-')}`}>{item.icon}</span>
                    <span>{item.label}: {item.value}</span>
                </li>
            ))}
        </ul>
    );
}

// Ana App
export default function App() {
    const [mode, setMode] = useState<"single" | "compare" | null>(null);
    const [m1, setM1] = useState(6);
    const [m2, setM2] = useState(7);
    const [results, setResults] = useState<EnergyResult[] | null>(null);
    const [comparison, setComparison] = useState<string>("");
    const { calculateEnergy, compareMagnitudes } = useEarthquakeCalculator();

    const handleCalculate = () => {
        if (mode === "single") {
            setResults(calculateEnergy(m1));
            setComparison("");
        } else {
            setComparison(compareMagnitudes(m1, m2));
            setResults(null);
        }
    };

    const reset = () => { setMode(null); setResults(null); setComparison(""); setM1(6); setM2(7); };

    return (
        <div className="App">
            {!mode ? (
                <ModeSelector onSelectMode={setMode} />
            ) : mode === "single" ? (
                <EnergyCalculator magnitude={m1} onMagnitudeChange={setM1} onCalculate={handleCalculate} onReset={reset} />
            ) : (
                <CompareTool m1={m1} m2={m2} onM1Change={setM1} onM2Change={setM2} onCalculate={handleCalculate} onReset={reset} />
            )}
            {results && <ResultDisplay results={results} />}
            {comparison && <div className="content-container"><p className="comparison">{comparison}</p></div>}
        </div>
    );
}
