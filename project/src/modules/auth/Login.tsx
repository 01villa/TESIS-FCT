import { Box, Button, Input, Heading, Text, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={24} p={8} bg="white" rounded="lg" shadow="md">
      <Heading mb={4}>Iniciar Sesión</Heading>

      <Stack spacing={4}>
        <Input
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        <Input
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        {error && <Text color="red.400">{error}</Text>}

        <Button onClick={handleSubmit} colorScheme="blue">
          Entrar
        </Button>
      </Stack>
    </Box>
  );
}
