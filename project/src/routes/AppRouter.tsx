// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../modules/auth/Login";
import ProtectedRoute from "../router/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";

// 🔥 Importar UsersPage
import UsersPage from "../pages/users/UsersPage";
import SchoolDetailPage from "../pages/colegios/SchoolDetailPage";
import SchoolsPage from "../pages/colegios/SchoolPage";

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
          {/* Home del dashboard */}
          <Route index element={<DashboardHome />} />
          <Route path="schools" element={<SchoolsPage />} />
<Route path="schools/:id" element={<SchoolDetailPage />} />

          {/* 🔥 Aquí se expone tu CRUD de admins */}
          <Route path="users" element={<UsersPage />} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
