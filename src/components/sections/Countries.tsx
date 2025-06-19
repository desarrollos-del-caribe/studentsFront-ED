import type { AnalysisData } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";

const Countries: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Clasificación por Países</h2>
    <p>Número de países únicos: {data.country_info.valid_countries}</p>
    <h3>Estudiantes por País (Top 10)</h3>
    <ul>
      {Object.entries(data.country_info.country_counts).map(([country, count]) => (
        <li key={country}>
          {country}: {count}
        </li>
      ))}
    </ul>
    <PlotDisplay src={data.plots.country_plot} alt="Gráfico por País" />
  </div>
);

export default Countries;