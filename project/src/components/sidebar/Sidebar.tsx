import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { menuItemsByRole } from "./MenuItemsByRole";

export default function Sidebar() {
  const { role, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const menu = menuItemsByRole[role || "GUEST"] || [];

  return (
    <Box
      w="260px"
      bg="white"
      _dark={{ bg: "gray.800" }}
      p={6}
      borderRight="1px solid"
      borderColor="gray.200"
      minH="100vh"
      position="sticky"
      top="0"
    >
      <Flex align="center" justify="space-between" mb={10}>
        <Text fontSize="2xl" fontWeight="bold">
          Panel
        </Text>

        <IconButton
          size="sm"
          aria-label="switch"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </Flex>

      <VStack align="stretch" spacing={2}>
        {menu.map((item) => (
          <Button
            key={item.path}
            as={Link}
            to={item.path}
            variant="ghost"
            justifyContent="flex-start"
            size="lg"
          >
            {item.label}
          </Button>
        ))}

        <Button colorScheme="red" variant="outline" mt={10} onClick={logout}>
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  );
}
