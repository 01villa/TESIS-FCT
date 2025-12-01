import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "../sidebar/Sidebar"; // AJUSTA la ruta si es diferente
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Flex minH="100vh">
      <Sidebar />

      <Box flex="1" p={8}>
        <Outlet />
      </Box>
    </Flex>
  );
}
