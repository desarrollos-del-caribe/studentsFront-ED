import type { AnalysisData } from "../../types/AnalysisData";
import PlotDisplay from "../PlotDisplay";

const DecisionTree: React.FC<{ data: AnalysisData }> = ({ data }) => (
  <div className="p-4 bg-white shadow rounded">
    <h2 className="text-xl font-semibold">Árbol de Decisión</h2>
    <p>{data.tree_explanation}</p>
    <PlotDisplay src={data.plots.decision_tree} alt="Árbol de Decisión" />
  </div>
);

export default DecisionTree;