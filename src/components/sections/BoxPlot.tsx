import type { AnalysisData } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";

const BoxPlot: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Boxplot</h2>
    <PlotDisplay src={data.plots.boxplot} alt="Boxplot" />
  </div>
);

export default BoxPlot;