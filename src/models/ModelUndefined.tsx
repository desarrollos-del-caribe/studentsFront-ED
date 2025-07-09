import { Link } from "react-router-dom";
import { Button } from "../shared/components/Button";
export default function ModelUndefined() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Modelo no encontrado
        </h1>
        <Link to="/dashboard">
          <Button>Volver al Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
