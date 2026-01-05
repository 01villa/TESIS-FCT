import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack spacing={5} textAlign="center" maxW="420px" px={4}>
        <Icon as={LockIcon} boxSize={14} color="red.400" />

        <Heading size="lg">Acceso no autorizado</Heading>

        <Text fontSize="sm" color="gray.600">
          No tienes permisos para acceder a esta página.
          <br />
          Si crees que es un error, contacta al administrador.
        </Text>

        <Button
          colorScheme="blue"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </Button>
      </VStack>
    </Box>
  );
};
