// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../modules/auth/Login";
import ProtectedRoute from "../router/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";

// Más adelante agregaremos tus módulos
// import SchoolsList from "../modules/admin/SchoolsList";
// import CompaniesList from "../modules/admin/CompaniesList";
// import AssignmentsList from "../modules/school-tutor/AssignmentsList";
// import CreateAssignment from "../modules/school-tutor/CreateAssignment";
// import VacanciesList from "../modules/company/VacanciesList";
// import VacanciesAvailable from "../modules/student/VacanciesAvailable";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />
       
          {/* DASHBOARD PROTEGIDO */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
      </Route>

        {/* MÁS RUTAS LUEGO */}

        {/* 404 */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
