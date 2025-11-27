import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

import { useAuth } from "../../contexts/AuthContext";

export default function DashboardHome() {
  const { user, role } = useAuth();

  return (
    <Box>
      {/* HEADER */}
      <Box mb={10}>
        <Heading size="lg">Bienvenido, {user?.fullName}</Heading>
        <Box fontSize="md" mt={2} color="gray.500">
          Rol: {role}
        </Box>
      </Box>

      <Divider mb={10} />

      {/* ESTADÍSTICAS */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
        <StatCard label="Vacantes activas" value="32" change="+12%" />
        <StatCard label="Estudiantes inscritos" value="128" change="+5%" />
        <StatCard label="Empresas asociadas" value="14" change="+2%" />
      </SimpleGrid>

      {/* GRÁFICOS / MÓDULOS */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          p={6}
          rounded="lg"
          shadow="md"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Heading size="md" mb={4}>
            Actividad reciente
          </Heading>

          <Box color="gray.500">Próximamente gráfico...</Box>
        </Box>

        <Box
          p={6}
          rounded="lg"
          shadow="md"
          bg={useColorModeValue("white", "gray.800")}
        >
          <Heading size="md" mb={4}>
            Resumen general
          </Heading>

          <Box color="gray.500">Módulo pendiente...</Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

/* COMPONENTE DE TARJETAS */
function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <Flex
      p={6}
      rounded="lg"
      shadow="md"
      direction="column"
      bg={useColorModeValue("white", "gray.800")}
    >
      <Stat>
        <StatLabel fontSize="md" color="gray.500">
          {label}
        </StatLabel>
        <StatNumber fontSize="3xl">{value}</StatNumber>
        <StatHelpText color={change.startsWith("+") ? "green.400" : "red.400"}>
          {change}
        </StatHelpText>
      </Stat>
    </Flex>
  );
}
