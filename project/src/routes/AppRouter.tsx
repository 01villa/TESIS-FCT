import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../modules/auth/Login";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../router/ProtectedRoute";

// DASHBOARD HOME
import DashboardHome from "../pages/dashboard/DashboardHome";

// USERS
import UsersPage from "../pages/users/UsersPage";

// SCHOOLS
import SchoolList from "../pages/colegios/SchoolList";
import SchoolDetails from "../pages/colegios/SchoolDetails";
import SchoolDashboard from "../pages/colegios/SchoolDashboard";

// TUTOR ESCOLAR
import TutorHome from "../pages/tutor/TutorHome";
import TutorVacancies from "../pages/tutor/TutorVacancies";
import TutorAssign from "../pages/tutor/TutorAssign";
import TutorAssignments from "../pages/tutor/TutorAssignments";
import TutorStudentsPage from "../pages/tutor/TutorStudentsPage";

// COMPANIES (CRUD + panel interno)
import CompanyDashboard from "../pages/companies/CompanyDashboard";
import CompanyDetails from "../pages/companies/CompanyDetails";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* PROTEGIDAS */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* HOME DEFAULT PARA ADMIN */}
          <Route index element={<DashboardHome />} />

          {/* ADMIN */}
          <Route path="users" element={<UsersPage />} />

          {/* COLEGIOS */}
          <Route path="schools" element={<SchoolList />} />
          <Route path="schools/:id" element={<SchoolDetails />} />

          {/* PANEL ESCUELA (ADMIN ESCOLAR) */}
          <Route path="school" element={<SchoolDashboard />} />

          {/* COMPANIES */}
          <Route path="companies" element={<CompanyDashboard />} />
          <Route path="companies/:id" element={<CompanyDetails />} />

          {/* TUTOR ESCOLAR */}
          <Route path="tutor" element={<TutorHome />} />
          <Route path="tutor/vacancies" element={<TutorVacancies />} />
          <Route path="tutor/assign" element={<TutorAssign />} />
          <Route path="tutor/assignments" element={<TutorAssignments />} />
          <Route path="tutor/students" element={<TutorStudentsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
