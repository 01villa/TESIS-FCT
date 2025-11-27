import { Routes, Route } from "react-router-dom";
import DashboardHome from "../pages/dashboard/DashboardHome";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="home" element={<DashboardHome />} />

      {/* Más rutas según rol */}
      <Route path="schools" element={<div>Colegios</div>} />
      <Route path="companies" element={<div>Empresas</div>} />
      <Route path="students" element={<div>Estudiantes</div>} />
      <Route path="vacancies" element={<div>Vacantes</div>} />

      <Route path="*" element={<DashboardHome />} />
    </Routes>
  );
}
