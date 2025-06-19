import type { AnalysisData } from "../../types/AnalysisData";

const Trimester: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Validación de Trimestre</h2>
    <p>Datos atípicos (horas de uso diario &gt; 10): {data.trimester_info.outliers}</p>
  </div>
);

export default Trimester;