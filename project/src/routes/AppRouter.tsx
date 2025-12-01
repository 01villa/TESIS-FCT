import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../modules/auth/Login";

import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardHome from "../pages/dashboard/DashboardHome";
import UsersPage from "../pages/users/UsersPage";
import SchoolList from "../pages/colegios/SchoolList";
import SchoolDetails from "../pages/colegios/SchoolDetails";
import SchoolDashboard from "../pages/colegios/SchoolDashboard";
import ProtectedRoute from "../router/ProtectedRoute";


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
          <Route path="schools" element={<SchoolList />} />
          <Route path="schools/:id" element={<SchoolDetails />} />

          {/* SCHOOL ADMIN — 👉 ESTA ES LA IMPORTANTE */}
          <Route path="school" element={<SchoolDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
