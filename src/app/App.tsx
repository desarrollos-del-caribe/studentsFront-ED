import { Routes, Route } from "react-router-dom";
import { Landing } from "../features/landing";
import { Dashboard } from "../features/dashboard";
import { FormPage } from "../features/form";
import { ModelDetail } from "../features/models";
import { Navbar } from "../shared/components";

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/models/:modelId" element={<ModelDetail />} />
      </Routes>
    </div>
  );
}
