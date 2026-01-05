import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }: any) {
  const { user, loadingAuth } = useAuth();
  const location = useLocation();

  // ⛔ Evita pantalla en blanco
  if (loadingAuth) return <div>Cargando...</div>;

  // ⛔ Usuario no logueado
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role;

  const redirectByRole: any = {
    ADMIN: "/dashboard",
    SCHOOL_ADMIN: "/dashboard/school",
    SCHOOL_TUTOR: "/dashboard/tutor",
    COMPANY_ADMIN: "/dashboard/company",
    COMPANY_TUTOR: "/dashboard/company-tutor",
  };

  const target = redirectByRole[role] ?? "/dashboard";

  // ⛔ Evita redirect infinito → solo redirige si REALMENTE estás en la raíz
  if (location.pathname === "/dashboard" && target !== "/dashboard") {
    return <Navigate to={target} replace />;
  }

  return children ? children : <Outlet />;
}
