import type { AnalysisData } from "../../types/AnalysisData";

const Cleaning: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Limpieza de Datos</h2>
    <p>Total de datos nulos: {data.null_info.total_nulls}</p>
    <h3 className="mt-4">Datos nulos por columna:</h3>
    <ul>
      {Object.entries(data.null_info.null_counts).map(([col, count]) => (
        <li key={col}>
          {col}: {count}
        </li>
      ))}
    </ul>
  </div>
);

export default Cleaning;
