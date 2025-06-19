import type { AnalysisData } from "../../types/AnalysisData";

const Statistics: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Estadísticas Descriptivas</h2>
    {Object.entries(data.statistics).map(([col, stats]) => (
      <div key={col}>
        <h3>{col}</h3>
        <ul>
          {Object.entries(stats).map(([key, value]) => (
            <li key={key}>
              {key}: {value.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default Statistics;