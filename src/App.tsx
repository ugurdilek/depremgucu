import { JSX, useState, lazy, Suspense } from "react";
import "./App.css";
import { FaBolt, FaBomb } from "react-icons/fa";
import { GiNuclearBomb } from "react-icons/gi";
import { WiDayLightning } from "react-icons/wi";
import { RiScales3Line } from "react-icons/ri";
import { Helmet } from "react-helmet";

export interface EnergyResult {
    label: string;
    value: string;
    icon: JSX.Element;
}

const ResultsList = lazy(() => import("./components/ResultsList"));

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
    const [m1, setM1] = useState<number | "">("");
    const [m2, setM2] = useState<number | "">("");
    const [results, setResults] = useState<EnergyResult[] | null>(null);
    const [comparison, setComparison] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { calculateEnergy, compareMagnitudes } = useEarthquakeCalculator();

    const handleCalculate = () => {
        if (typeof m1 !== "number" || (mode === "compare" && typeof m2 !== "number")) {
            setError("Geçerli büyüklük değerleri giriniz.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            if (mode === "single") {
                setResults(calculateEnergy(m1));
                setComparison("");
            } else if (mode === "compare" && typeof m2 === "number") {
                setComparison(compareMagnitudes(m1, m2));
                setResults(null);
            }
            setIsLoading(false);
        }, 300);
    };

    const handleMagnitudeChange = (index: number, value: string) => {
        if (value === "") {
            if (index === 1) {
                setM1("");
            } else {
                setM2("");
            }
            setError(null);
        } else {
            const parsed = parseFloat(value);
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
        setM1("");
        setM2("");
        setError(null);

        // Garantili render için çok küçük zamanlı yeniden tetikleyici
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
    };


    const renderContent = () => {
        if (!mode) {
            return (
                <div className="content-container">
                    <h1>Deprem Gücü Hesaplayıcı</h1>
                    <p>Ne yapmak istiyorsunuz?</p>
                    <button onClick={() => setMode("single")}>🔹 Enerji Hesapla</button>
                    <button onClick={() => setMode("compare")}>
                        <RiScales3Line style={{ marginRight: "6px" }} />
                        Depremleri Karşılaştır
                    </button>
                </div>
            );
        }

        return (
            <>
                {mode === "single" ? (
                    <div className="content-container">
                        <h1>Enerji Hesaplama</h1>
                        <label htmlFor="magnitude">Depremin Büyüklüğü (Mw):</label>
                        <input
                            id="magnitude"
                            type="number"
                            step="any"
                            value={m1 === "" ? "" : String(m1)}
                            onChange={(e) => handleMagnitudeChange(1, e.target.value)}
                            placeholder="Örn: 6.5"
                        />
                        {error && <p className="error">{error}</p>}
                        <button onClick={handleCalculate}>Hesapla</button>
                        <button onClick={reset} className="secondary-button">↩ Geri</button>
                    </div>
                ) : (
                    <div className="content-container">
                        <h1>Deprem Karşılaştırma</h1>
                        <label htmlFor="magnitude1">1. Depremin Büyüklüğü (Mw):</label>
                        <input
                            id="magnitude1"
                            type="number"
                            step="any"
                            value={m1 === "" ? "" : String(m1)}
                            onChange={(e) => handleMagnitudeChange(1, e.target.value)}
                            placeholder="Örn: 6.0"
                        />
                        <label htmlFor="magnitude2">2. Depremin Büyüklüğü (Mw):</label>
                        <input
                            id="magnitude2"
                            type="number"
                            step="any"
                            value={m2 === "" ? "" : String(m2)}
                            onChange={(e) => handleMagnitudeChange(2, e.target.value)}
                            placeholder="Örn: 7.0"
                        />
                        {error && <p className="error">{error}</p>}
                        <button onClick={handleCalculate}>Hesapla</button>
                        <button onClick={reset} className="secondary-button">↩ Geri</button>
                    </div>
                )}

                {isLoading && <div className="loading">Hesaplanıyor...</div>}

                {mode === "compare" && comparison.trim() !== "" && (
                    <div className="content-container">
                        <p className="comparison">{comparison}</p>
                    </div>
                )}

                {results && (
                    <div className="content-container">
                        <Suspense fallback={<div>Sonuçlar yükleniyor...</div>}>
                            <ResultsList results={results} />
                        </Suspense>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="App" key={mode ?? "default"}>
            <Helmet>
                <title>Deprem Gücü Hesaplayıcı</title>
                <meta name="description" content="Depremlerin enerji karşılığını hesaplayın, büyüklükleri karşılaştırın." />
                <meta property="og:title" content="Deprem Gücü Hesaplayıcı" />
                <meta property="og:description" content="Depremlerin enerji karşılığını hesaplayın, büyüklükleri karşılaştırın." />
                <meta property="og:image" content="https://depremgucu.vercel.app/preview.png" />
                <meta property="og:url" content="https://depremgucu.vercel.app" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {renderContent()}
        </div>
    );
}
