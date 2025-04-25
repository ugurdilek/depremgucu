import { useState, useMemo, JSX } from "react";
import "./App.css";
import { FaBolt, FaBomb } from "react-icons/fa";
import { GiNuclearBomb } from "react-icons/gi";
import { WiDayLightning } from "react-icons/wi";
import { RiScales3Line } from "react-icons/ri";

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
        else
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
            <button onClick={() => onSelectMode("single")} aria-label="Enerji hesaplama modunu seç">
                🔹 Enerji Hesapla
            </button>
            <button onClick={() => onSelectMode("compare")} aria-label="Deprem karşılaştırma modunu seç">
                <RiScales3Line style={{ marginRight: "6px" }} /> Depremleri Karşılaştır
            </button>
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
    const [error, setError] = useState<string>("");

    const handleMagnitudeChangeLocal = (value: number) => {
        setError("");
        onMagnitudeChange(value);
    };

    const validateInput = (): boolean => {
        if (isNaN(magnitude) || magnitude < 1.0 || magnitude > 10.0) {
            setError("Lütfen 1.0 ile 10.0 arasında geçerli bir büyüklük giriniz.");
            return false;
        }
        return true;
    };

    const handleCalculateClick = () => {
        if (validateInput()) {
            onCalculate();
        }
    };

    return (
        <div className="content-container">
            <h1>Enerji Hesaplama</h1>

            <div style={{ width: "100%" }}>
                <label htmlFor="magnitude">Depremin Büyüklüğü (Mw):</label>
                <input
                    id="magnitude"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    placeholder="örn. 6.5"
                    value={magnitude}
                    onChange={(e) => {
                        const inputValue = e.target.value.replace(',', '.');
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            handleMagnitudeChangeLocal(parseFloat(inputValue));
                        }
                    }}
                    aria-describedby="magnitudeError"
                />
            </div>

            {error && <p className="error" id="magnitudeError">{error}</p>}

            <button onClick={handleCalculateClick}>Hesapla</button>
            <button onClick={onReset} className="secondary-button" aria-label="Ana menüye dön">
                ↩ Geri
            </button>
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
    const [error, setError] = useState<string>("");

    const handleMagnitudeChangeLocal = (index: number, value: number) => {
        setError("");
        if (index === 1) {
            onM1Change(value);
        } else {
            onM2Change(value);
        }
    };

    const validateInput = (): boolean => {
        if (
            isNaN(m1) || m1 < 1.0 || m1 > 10.0 ||
            isNaN(m2) || m2 < 1.0 || m2 > 10.0
        ) {
            setError("Lütfen 1.0 ile 10.0 arasında geçerli büyüklükler giriniz.");
            return false;
        }
        return true;
    };

    const handleCalculateClick = () => {
        if (validateInput()) {
            onCalculate();
        }
    };

    return (
        <div className="content-container">
            <h1>Deprem Karşılaştırma</h1>

            <div style={{ width: "100%" }}>
                <label htmlFor="magnitude1">1. Depremin Büyüklüğü (Mw):</label>
                <input
                    id="magnitude1"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    placeholder="örn. 6.5"
                    value={m1}
                    onChange={(e) => {
                        const inputValue = e.target.value.replace(',', '.');
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            handleMagnitudeChangeLocal(1, parseFloat(inputValue));
                        }
                    }}
                    aria-describedby="magnitudesError"
                />
            </div>

            <div style={{ width: "100%" }}>
                <label htmlFor="magnitude2">2. Depremin Büyüklüğü (Mw):</label>
                <input
                    id="magnitude2"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    placeholder="örn. 6.5"
                    value={m2}
                    onChange={(e) => {
                        const inputValue = e.target.value.replace(',', '.');
                        if (/^\d*\.?\d*$/.test(inputValue)) {
                            handleMagnitudeChangeLocal(2, parseFloat(inputValue));
                        }
                    }}
                    aria-describedby="magnitudesError"
                />
            </div>

            {error && <p className="error" id="magnitudesError">{error}</p>}

            <button onClick={handleCalculateClick}>Hesapla</button>
            <button onClick={onReset} className="secondary-button" aria-label="Ana menüye dön">
                ↩ Geri
            </button>
        </div>
    );
}

// ResultDisplay Bileşeni
function ResultDisplay({ results }: { results: EnergyResult[] }) {
    return (
        <ul className="results">
            {results.map((item, index) => (
                <li key={index}>
                    <span className={`icon ${item.label.toLowerCase().replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ /g, '-')}`}>
                        {item.icon}
                    </span>
                    <span>{item.label}: {item.value}</span>
                </li>
            ))}
        </ul>
    );
}

export default function App() {
    const [mode, setMode] = useState<"single" | "compare" | null>(null);
    const [m1, setM1] = useState(6.0);
    const [m2, setM2] = useState(7.0);
    const [results, setResults] = useState<EnergyResult[] | null>(null);
    const [comparison, setComparison] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { calculateEnergy, compareMagnitudes } = useEarthquakeCalculator();

    const handleCalculate = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (mode === "single") {
                setResults(calculateEnergy(m1));
                setComparison("");
            } else if (mode === "compare") {
                setComparison(compareMagnitudes(m1, m2));
                setResults(null);
            }
            setIsLoading(false);
        }, 300);
    };

    const reset = () => {
        setMode(null);
        setResults(null);
        setComparison("");
        setM1(6.0);
        setM2(7.0);
    };

    const calculationResults = useMemo(() => {
        if (results) {
            return <ResultDisplay results={results} />;
        }
        return null;
    }, [results]);

    const renderContent = () => {
        if (!mode) {
            return <ModeSelector onSelectMode={setMode} />;
        }
        return (
            <>
                {mode === "single" ? (
                    <EnergyCalculator
                        magnitude={m1}
                        onMagnitudeChange={setM1}
                        onCalculate={handleCalculate}
                        onReset={reset}
                    />
                ) : (
                    <CompareTool
                        m1={m1}
                        m2={m2}
                        onM1Change={setM1}
                        onM2Change={setM2}
                        onCalculate={handleCalculate}
                        onReset={reset}
                    />
                )}

                {isLoading && <div className="loading">Hesaplanıyor...</div>}

                {comparison && <div className="content-container"><p className="comparison">{comparison}</p></div>}

                {calculationResults && <div className="content-container">{calculationResults}</div>}
            </>
        );
    };

    return <div className="App">{renderContent()}</div>;
}
