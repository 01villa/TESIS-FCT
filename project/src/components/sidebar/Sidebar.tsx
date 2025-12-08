import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  IconButton,
  Icon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import {
  FaHome,
  FaSchool,
  FaBuilding,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

type MenuItem = {
  label: string;
  to: string;
  icon: any;
};

export default function Sidebar() {
  const { role, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  // Menús por rol
  const menuByRole: Record<string, MenuItem[]> = {
    ADMIN: [
      { label: "Inicio", to: "/dashboard", icon: FaHome },
      { label: "Colegios", to: "/dashboard/schools", icon: FaSchool },
      { label: "Empresas", to: "/dashboard/companies", icon: FaBuilding },
      { label: "Usuarios", to: "/dashboard/users", icon: FaUsers },
      { label: "Reportes", to: "/dashboard/reports", icon: FaFileAlt }, // luego lo armas
    ],

    SCHOOL_ADMIN: [
      { label: "Mi escuela", to: "/dashboard/school", icon: FaSchool },
    ],

    SCHOOL_TUTOR: [
      { label: "Inicio", to: "/dashboard/tutor", icon: FaHome },
      { label: "Estudiantes", to: "/dashboard/tutor/students", icon: FaUsers },
      { label: "Vacantes", to: "/dashboard/tutor/vacancies", icon: FaBuilding },
      { label: "Asignar estudiante", to: "/dashboard/tutor/assign", icon: FaFileAlt },
      { label: "Mis asignaciones", to: "/dashboard/tutor/assignments", icon: FaFileAlt },
    ],

    // 🔹 Menú para COMPANY_ADMIN (lo mínimo funcional de momento)
    COMPANY_ADMIN: [
      { label: "Inicio", to: "/dashboard", icon: FaHome },
      { label: "Mi empresa", to: "/dashboard/companies", icon: FaBuilding },
      // luego puedes separar vista específica tipo /dashboard/company
    ],

    COMPANY_TUTOR: [
      { label: "Vacantes", to: "/dashboard/company/vacancies", icon: FaBuilding },
      { label: "Estudiantes asignados", to: "/dashboard/company/assignments", icon: FaUsers },
    ],

    STUDENT: [
      { label: "Vacantes disponibles", to: "/dashboard/vacancies", icon: FaBuilding },
      { label: "Mis aplicaciones", to: "/dashboard/applications", icon: FaFileAlt },
    ],
  };

  // Normalizar rol (por si viene como "ROLE_ADMIN")
  const normalizedRole = (role || "ADMIN").replace(/^ROLE_/, "");
  const menu = menuByRole[normalizedRole] ?? menuByRole["ADMIN"];

  const bgSidebar = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      w="260px"
      bg={bgSidebar}
      p={6}
      borderRight="1px solid"
      borderColor={borderColor}
      minH="100vh"
      position="sticky"
      top="0"
      shadow="sm"
    >
      {/* HEADER */}
      <Flex align="center" justify="space-between" mb={10}>
        <Text fontSize="2xl" fontWeight="bold">
          Panel
        </Text>

        <IconButton
          size="sm"
          aria-label="switch theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </Flex>

      {/* MENÚ */}
      <VStack align="stretch" spacing={2}>
        {menu.map((item) => (
          <Button
            key={item.to}
            as={Link}
            to={item.to}
            justifyContent="flex-start"
            leftIcon={<Icon as={item.icon} />}
            variant="ghost"
            size="lg"
          >
            {item.label}
          </Button>
        ))}

        {/* LOGOUT */}
        <Button colorScheme="red" variant="outline" mt={8} onClick={logout}>
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  );
}
