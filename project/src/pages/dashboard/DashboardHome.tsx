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
  Spinner,
  Text,
} from "@chakra-ui/react";

import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardStats {
  vacancies: number;
  students: number;
  companies: number;
  schools: number;              // 👈 NUEVO
}

export default function DashboardHome() {
  const { user, role } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    vacancies: 0,
    students: 0,
    companies: 0,
    schools: 0,                 // 👈 NUEVO
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);

        const [vacanciesRes, studentsRes, companiesRes, schoolsRes] =
          await Promise.all([
            axios.get("/vacancies"),
            axios.get("/admin/students"),
            axios.get("/admin/companies"),
            axios.get("/admin/schools"),     // 👈 NUEVO
          ]);

        if (cancelled) return;

        setStats({
          vacancies: Array.isArray(vacanciesRes.data)
            ? vacanciesRes.data.length
            : 0,
          students: Array.isArray(studentsRes.data)
            ? studentsRes.data.length
            : 0,
          companies: Array.isArray(companiesRes.data)
            ? companiesRes.data.length
            : 0,
          schools: Array.isArray(schoolsRes.data)
            ? schoolsRes.data.length
            : 0, // 👈 NUEVO
        });
      } catch (err) {
        console.error("Error cargando estadísticas del dashboard", err);
        if (!cancelled) {
          setError("No se pudieron cargar las estadísticas (se muestran en 0).");
          // stats se queda en 0, pero la página sigue viva
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Box mb={10}>
        <Heading size="lg">Bienvenido, {user?.fullName}</Heading>
        <Box fontSize="md" mt={2} color="gray.500">
          Rol: {role}
        </Box>
        {error && (
          <Text mt={2} fontSize="sm" color="orange.400">
            {error}
          </Text>
        )}
      </Box>

      <Divider mb={10} />

      {/* ESTADÍSTICAS */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={10}>
        <StatCard
          label="Vacantes activas"
          value={stats.vacancies}
          change="+0%"
        />
        <StatCard
          label="Estudiantes inscritos"
          value={stats.students}
          change="+0%"
        />
        <StatCard
          label="Empresas asociadas"
          value={stats.companies}
          change="+0%"
        />
        <StatCard
          label="Escuelas registradas"      // 👈 NUEVO
          value={stats.schools}
          change="+0%"
        />
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
  value: number | string;
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
