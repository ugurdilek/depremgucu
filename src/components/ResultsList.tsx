import { EnergyResult } from "../App";

export default function ResultsList({ results }: { results: EnergyResult[] }) {
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
