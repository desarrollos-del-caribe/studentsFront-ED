import type { AnalysisData } from "../../types/Analysis";

const Predictions: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Predicción de Conflictos</h2>
    <p>Probabilidad de conflictos altos por estado de relación:</p>
    <ul>
      {Object.entries(data.prediction_summary).map(([status, prob]) => (
        <li key={status}>
          {status}: {prob.toFixed(2)}
        </li>
      ))}
    </ul>
  </div>
);

export default Predictions;