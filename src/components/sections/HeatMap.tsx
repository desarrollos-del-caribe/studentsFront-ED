import type { AnalysisData } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";

const HeatMap: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Mapa de Calor de Correlación</h2>
    <PlotDisplay src={data.plots.heatmap} alt="Mapa de Calor" />
  </div>
);

export default HeatMap;