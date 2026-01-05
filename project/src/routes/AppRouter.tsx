// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../modules/auth/Login";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../router/ProtectedRoute";

// HOME POR ROL
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

// EMPRESAS – ADMIN GENERAL
import CompanyDashboard from "../pages/companies/CompanyDashboard";
import CompanyDetails from "../pages/companies/CompanyDetails";

// COMPANY ADMIN (perfil de empresa)
import CompanyProfile from "../pages/companies/CompanyProfile";
import AssignmentsList from "../pages/companies/companyTutor/AssignmentsList";
import CompanyTutorDashboard from "../pages/companies/companyTutor/CompanyTutorDashboard";
import CompanyVacancies from "../pages/companies/companyTutor/CompanyVacancies";

// ============================
//  COMPANY TUTOR (NUEVO)
// ============================

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* HOME AUTOMÁTICO SEGÚN ROL */}
          <Route index element={<DashboardHome />} />

          {/* ADMIN GENERAL */}
          <Route path="users" element={<UsersPage />} />

          {/* COLEGIOS */}
          <Route path="schools" element={<SchoolList />} />
          <Route path="schools/:id" element={<SchoolDetails />} />

          {/* SCHOOL ADMIN */}
          <Route path="school" element={<SchoolDashboard />} />

          {/* EMPRESAS – ADMIN GENERAL */}
          <Route path="companies" element={<CompanyDashboard />} />
          <Route path="companies/:id" element={<CompanyDetails />} />

          {/* COMPANY ADMIN */}
          <Route path="company" element={<CompanyProfile />} />

          {/* ========================================================
                SCHOOL TUTOR (FUNCIONALES)
             ======================================================== */}
          <Route path="tutor" element={<TutorHome />} />
          <Route path="tutor/vacancies" element={<TutorVacancies />} />
          <Route path="tutor/assign" element={<TutorAssign />} />
          <Route path="tutor/assignments" element={<TutorAssignments />} />
          <Route path="tutor/students" element={<TutorStudentsPage />} />

          {/* ========================================================
                COMPANY TUTOR (NUEVO - lo que hicimos)
             ======================================================== */}
          <Route path="company-tutor" element={<CompanyTutorDashboard />} />
          <Route path="company-tutor/vacancies" element={<CompanyVacancies />} />
          <Route path="company-tutor/assignments" element={<AssignmentsList />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
