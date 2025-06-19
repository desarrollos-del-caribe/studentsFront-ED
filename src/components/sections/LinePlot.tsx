import type { AnalysisData } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";

const LinePlot: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Gráfico Lineal</h2>
    <PlotDisplay src={data.plots.line_plot} alt="Gráfico Lineal" />
  </div>
);

export default LinePlot;