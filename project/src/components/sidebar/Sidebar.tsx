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

export default function Sidebar() {
  const { role, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  // MENÚ POR ROL
  const menuByRole: any = {
    ADMIN: [
      { label: "Inicio", to: "/dashboard", icon: FaHome },
      { label: "Colegios", to: "/dashboard/schools", icon: FaSchool },
      { label: "Empresas", to: "/dashboard/companies", icon: FaBuilding },
      { label: "Usuarios", to: "/dashboard/users", icon: FaUsers },
      { label: "Reportes", to: "/dashboard/reports", icon: FaFileAlt },
    ],

    SCHOOL_ADMIN: [
    { label: "Mi escuela", to: "/dashboard/school", icon: FaSchool },
    
  ],

    SCHOOL_TUTOR: [
      { label: "Asignaciones", to: "/dashboard/assignments", icon: FaSchool },
    ],

    COMPANY_TUTOR: [
      { label: "Vacantes", to: "/dashboard/vacancies", icon: FaBuilding },
      { label: "Estudiantes", to: "/dashboard/company-assignments", icon: FaUsers },
    ],

    STUDENT: [
      { label: "Mis Aplicaciones", to: "/dashboard/applications", icon: FaFileAlt },
    ],
  };

    const menu = menuByRole[role ?? "ADMIN"];

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
        {menu.map((item: any) => (
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
        <Button
          colorScheme="red"
          variant="outline"
          mt={8}
          onClick={logout}
        >
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  );
}
