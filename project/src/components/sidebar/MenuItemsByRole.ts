export const menuItemsByRole: Record<string, { path: string; label: string }[]> = {
  SUPER_ADMIN: [
    { path: "/dashboard/home", label: "Inicio" },
    { path: "/dashboard/schools", label: "Colegios" },
    { path: "/dashboard/companies", label: "Empresas" },
    { path: "/dashboard/users", label: "Usuarios" },
    { path: "/dashboard/settings", label: "Configuración" },
  ],

  ADMIN_SCHOOL: [
    { path: "/dashboard/home", label: "Inicio" },
    { path: "/dashboard/students", label: "Estudiantes" },
    { path: "/dashboard/tutors", label: "Tutores Escolares" },
    { path: "/dashboard/reports", label: "Reportes" },
  ],

  SCHOOL_TUTOR: [
    { path: "/dashboard/home", label: "Inicio" },
    { path: "/dashboard/my-students", label: "Mis Estudiantes" },
    { path: "/dashboard/my-evaluations", label: "Evaluaciones" },
  ],

  ADMIN_COMPANY: [
    { path: "/dashboard/home", label: "Inicio" },
    { path: "/dashboard/vacancies", label: "Vacantes" },
    { path: "/dashboard/tutors", label: "Tutores Empresariales" },
    { path: "/dashboard/reports", label: "Reportes" },
  ],

  COMPANY_TUTOR: [
    { path: "/dashboard/home", label: "Inicio" },
    { path: "/dashboard/my-trainees", label: "Mis Pasantes" },
    { path: "/dashboard/evaluations", label: "Evaluaciones" },
  ],

  STUDENT: [
    { path: "/dashboard/home", label: "Inicio" },
    { path: "/dashboard/my-applications", label: "Mis Aplicaciones" },
    { path: "/dashboard/profile", label: "Perfil" },
  ],

  GUEST: [],
};
