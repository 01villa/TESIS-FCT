import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack spacing={5} textAlign="center" maxW="400px" px={4}>
        <Icon as={WarningIcon} boxSize={14} color="orange.400" />

        <Heading size="xl">404</Heading>

        <Text fontSize="lg" fontWeight="medium">
          Página no encontrada
        </Text>

        <Text fontSize="sm" color="gray.600">
          La página que estás buscando no existe o fue movida.
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
