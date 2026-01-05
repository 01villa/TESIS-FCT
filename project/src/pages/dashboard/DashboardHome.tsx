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
  Avatar,
} from "@chakra-ui/react";

import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

interface DashboardStats {
  vacancies: number;
  students: number;
  companies: number;
  schools: number;
}

export default function DashboardHome() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // 1️⃣ Redirección por rol SOLO aquí
  useEffect(() => {
    if (!role) return;

    const redirects: Record<string, string> = {
      SCHOOL_ADMIN: "/dashboard/school",
      SCHOOL_TUTOR: "/dashboard/tutor",
      STUDENT: "/dashboard/applications",
      COMPANY_TUTOR: "/dashboard/company-assignments",
    };

    if (redirects[role]) navigate(redirects[role]);
  }, [role, navigate]);

  // 2️⃣ Estado del dashboard
  const [stats, setStats] = useState<DashboardStats>({
    vacancies: 0,
    students: 0,
    companies: 0,
    schools: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3️⃣ Cargar datos
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
            axios.get("/admin/schools"),
          ]);

        if (cancelled) return;

        setStats({
          vacancies: vacanciesRes.data?.length ?? 0,
          students: studentsRes.data?.length ?? 0,
          companies: companiesRes.data?.length ?? 0,
          schools: schoolsRes.data?.length ?? 0,
        });
      } catch (err) {
        if (!cancelled) setError("No se pudieron cargar las estadísticas.");
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
<Flex align="center" gap={4}>
  <Avatar
    src={user?.photoUrl ? `${API_URL}${user.photoUrl}` : undefined}
    name={user?.fullName}
    size="lg"
  />

  <Box>
    <Heading size="lg">Bienvenido, {user?.fullName}</Heading>
    <Box fontSize="md" mt={1} color="gray.500">
      Rol: {role}
    </Box>
  </Box>
</Flex>

      <Divider mb={10} />

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={10}>
        <StatCard label="Vacantes activas" value={stats.vacancies} change="+0%" />
        <StatCard label="Estudiantes inscritos" value={stats.students} change="+0%" />
        <StatCard label="Empresas asociadas" value={stats.companies} change="+0%" />
        <StatCard label="Escuelas registradas" value={stats.schools} change="+0%" />
      </SimpleGrid>
    </Box>
  );
}

/*📌 Componente de tarjeta */
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
