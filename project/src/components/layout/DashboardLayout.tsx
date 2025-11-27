import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link, Outlet } from "react-router-dom";
import { FaHome, FaSchool, FaBuilding, FaUsers, FaFileAlt } from "react-icons/fa";

import { useAuth } from "../../contexts/AuthContext";
import { MenuItem } from "../../types/menu";

export default function DashboardLayout() {
  const { user, role } = useAuth();

  // ---------------------------- MENU POR ROL ----------------------------
  const menuItems: Record<string, MenuItem[]> = {
    USER: [
      { label: "Inicio", icon: FaHome, to: "/dashboard" },
      { label: "Colegios", icon: FaSchool, to: "/dashboard/schools" },
      { label: "Empresas", icon: FaBuilding, to: "/dashboard/companies" },
      { label: "Usuarios", icon: FaUsers, to: "/dashboard/users" },
      { label: "Reportes", icon: FaFileAlt, to: "/dashboard/reports" },
    ],

    SCHOOL_TUTOR: [
      { label: "Inicio", icon: FaHome, to: "/dashboard" },
      { label: "Estudiantes", icon: FaUsers, to: "/dashboard/students" },
      { label: "Asignaciones", icon: FaSchool, to: "/dashboard/assignments" },
    ],

    COMPANY_TUTOR: [
      { label: "Inicio", icon: FaHome, to: "/dashboard" },
      { label: "Vacantes", icon: FaBuilding, to: "/dashboard/vacancies" },
      { label: "Asignaciones", icon: FaUsers, to: "/dashboard/company-assignments" },
    ],

    
  };

  // SI EL ROL VIENE NULL AL PRINCIPIO, CAE EN USER
  const safeRole = role ?? "USER";
  const items = menuItems[safeRole] || menuItems["USER"];

  const bgSidebar = useColorModeValue("gray.50", "gray.800");

  // ---------------------------- LAYOUT ----------------------------
  return (
    <Flex minH="100vh">
      {/* SIDEBAR */}
      <Box
        w="260px"
        bg={bgSidebar}
        p={6}
        borderRight="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        shadow="sm"
      >
        <Text
          fontSize="2xl"
          fontWeight="700"
          mb={8}
          bgGradient="linear(to-r, blue.500, teal.400)"
          bgClip="text"
        >
          Pasantías
        </Text>

        <VStack align="stretch" spacing={4}>
          {items.map((item: MenuItem) => (
            <Button
              key={item.to}
              as={Link}
              to={item.to}
              justifyContent="flex-start"
              leftIcon={<Icon as={item.icon} />}
              variant="ghost"
              colorScheme="blue"
            >
              {item.label}
            </Button>
          ))}
        </VStack>
      </Box>

      {/* CONTENIDO */}
      <Box flex="1" p={10}>
        <Outlet />
      </Box>
    </Flex>
  );
}
