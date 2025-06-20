import type { AnalysisData } from "../../types/Analysis";
import PlotDisplay from "../PlotDisplay";

const ThreeDPlot: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Gráfico 3D</h2>
    <PlotDisplay src={data.plots["3d_plot"]} alt="Gráfico 3D" />
  </div>
);

export default ThreeDPlot;