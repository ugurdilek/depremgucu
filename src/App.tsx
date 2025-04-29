import { JSX, useState } from "react";
import "./App.css";
import { FaBolt, FaBomb } from "react-icons/fa";
import { GiNuclearBomb } from "react-icons/gi";
import { WiDayLightning } from "react-icons/wi";
import { RiScales3Line } from "react-icons/ri";

interface EnergyResult {
    label: string;
    value: string;
    icon: JSX.Element;
}

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

export default function App() {
    const [mode, setMode] = useState<"single" | "compare" | null>(null);
    const [m1, setM1] = useState<number | ''>('');
    const [m2, setM2] = useState<number | ''>('');
    const [results, setResults] = useState<EnergyResult[] | null>(null);
    const [comparison, setComparison] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { calculateEnergy, compareMagnitudes } = useEarthquakeCalculator();

    const handleCalculate = () => {
        if (typeof m1 !== 'number' || (mode === "compare" && typeof m2 !== 'number')) {
            setError("Geçerli büyüklük değerleri giriniz.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            if (mode === "single") {
                setResults(calculateEnergy(m1));
                setComparison("");
            } else if (mode === "compare") {
                if (typeof m2 === 'number') {
                    setComparison(compareMagnitudes(m1, m2));
                }
                setResults(null);
            }
            setIsLoading(false);
        }, 300);
    };

    const handleMagnitudeChange = (index: number, value: string) => {
        const input = value;
        if (input === '') {
            if (index === 1) {
                setM1('');
            } else {
                setM2('');
            }
            setError(null);
        } else {
            const parsed = parseFloat(input);
            if (!isNaN(parsed)) {
                if (parsed >= 1.0 && parsed <= 10.0) {
                    if (index === 1) {
                        setM1(parsed);
                    } else {
                        setM2(parsed);
                    }
                    setError(null);
                } else {
                    setError("Lütfen 1.0 ile 10.0 arasında bir değer giriniz.");
                }
            }
        }
    };

    const reset = () => {
        setMode(null);
        setResults(null);
        setComparison("");
        setM1('');
        setM2('');
        setError(null);
    };

    const renderContent = () => {
        if (!mode) {
            return (
                <main className="content-container">
                    <h1>Deprem Gücü Hesaplayıcı</h1>
                    <p>Ne yapmak istiyorsunuz?</p>
                    <button onClick={() => setMode("single")} aria-label="Enerji hesaplama modunu seç">🔹 Enerji Hesapla</button>
                    <button onClick={() => setMode("compare")} aria-label="Deprem karşılaştırma modunu seç">
                        <RiScales3Line style={{ marginRight: "6px" }} />
                        Depremleri Karşılaştır
                    </button>
                </main>
            );
        }

        return (
            <>
                {mode === "single" ? (
                    <section className="content-container">
                        <h1>Enerji Hesaplama</h1>
                        <label htmlFor="magnitude">Depremin Büyüklüğü (Mw):</label>
                        <input
                            id="magnitude"
                            type="number"
                            step="any"
                            value={m1}
                            onChange={(e) => handleMagnitudeChange(1, e.target.value)}
                            placeholder="Örn: 6.5"
                            aria-label="Depremin büyüklüğü"
                            aria-describedby="magnitude-desc"
                        />
                        <small id="magnitude-desc">1.0 ile 10.0 arasında bir değer giriniz.</small>
                        {error && <p className="error" role="alert">{error}</p>}
                        <button onClick={handleCalculate} aria-label="Depremin enerjisini hesapla">Hesapla</button>
                        <button onClick={reset} className="secondary-button" aria-label="Geri dön">↩ Geri</button>
                    </section>
                ) : (
                    <section className="content-container">
                        <h1>Deprem Karşılaştırma</h1>
                        <label htmlFor="magnitude1">1. Depremin Büyüklüğü (Mw):</label>
                        <input
                            id="magnitude1"
                            type="number"
                            step="any"
                            value={m1}
                            onChange={(e) => handleMagnitudeChange(1, e.target.value)}
                            placeholder="Örn: 6.0"
                            aria-label="Birinci depremin büyüklüğü"
                        />
                        <label htmlFor="magnitude2">2. Depremin Büyüklüğü (Mw):</label>
                        <input
                            id="magnitude2"
                            type="number"
                            step="any"
                            value={m2}
                            onChange={(e) => handleMagnitudeChange(2, e.target.value)}
                            placeholder="Örn: 7.0"
                            aria-label="İkinci depremin büyüklüğü"
                        />
                        {error && <p className="error" role="alert">{error}</p>}
                        <button onClick={handleCalculate} aria-label="Depremleri karşılaştır">Hesapla</button>
                        <button onClick={reset} className="secondary-button" aria-label="Geri dön">↩ Geri</button>
                    </section>
                )}

                {isLoading && <div className="loading" role="status">Hesaplanıyor...</div>}

                {comparison && (
                    <section className="content-container">
                        <p className="comparison">{comparison}</p>
                    </section>
                )}

                {results && (
                    <section className="content-container">
                        <ul className="results">
                            {results.map((item, index) => (
                                <li key={index}>
                                    <span
                                        className={`icon ${item.label.toLowerCase().replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ /g, '-')}`}
                                        aria-hidden="true"
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.label}: {item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </>
        );
    };

    return <div className="App">{renderContent()}</div>;
}
