import { useState } from 'react';
import AnalysisCard from '../components/AnalysisCard';
import AgeValidation from '../components/sections/AgeValidation';
import Countries from '../components/sections/Countries';
import Cleaning from '../components/sections/Cleaning';
import Statistics from '../components/sections/Statistics';
import Outliers from '../components/sections/Outliers';
import Plots from '../components/sections/Plots';
import LinearRegression from '../components/sections/LinearRegression';
import LogisticRegression from '../components/sections/LogisticRegression';
import Correlation from '../components/sections/Correlation';
import DecisionTree from '../components/sections/DecisionTree';

const Dashboard: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>('');

  return (
    <>
      <div className="bg-blue-500 p-10" />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Análisis de Adicción a Redes Sociales
        </h1>
        <AnalysisCard setSelectedAction={setSelectedAction} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedAction === 'cleaning' && <Cleaning />}
          {selectedAction === 'statistics' && <Statistics />}
          {selectedAction === 'age' && <AgeValidation />}
          {selectedAction === 'countries' && <Countries />}
          {selectedAction === 'outliers' && <Outliers />}
          {selectedAction === 'plots' && <Plots />}
          {selectedAction === 'linear_regression' && <LinearRegression />}
          {selectedAction === 'logistic_regression' && <LogisticRegression />}
          {selectedAction === 'correlation' && <Correlation />}
          {selectedAction === 'decision_tree' && <DecisionTree />}
        </div>
      </div>
    </>
  );
};

export default Dashboard;