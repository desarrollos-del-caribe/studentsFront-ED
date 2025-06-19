import type { AnalysisData } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";

const AgeValidation: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Validación de Edades</h2>
    <p>
      Rango de edades: {data.age_info.min_age} - {data.age_info.max_age} años
    </p>
    <p>Edades fuera del rango (16-25): {data.age_info.invalid_ages}</p>
    <PlotDisplay src={data.plots.histogram} alt="Histograma de Edades" />
  </div>
);

export default AgeValidation;