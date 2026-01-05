import {
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Spinner,
  Center,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export default function TutorHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const schoolId = user.schoolId;

        // 1️⃣ Estudiantes de su escuela
        const studentsRes = await axios.get(`/admin/students/school/${schoolId}`);

        // 2️⃣ Vacantes disponibles (globales)
        const vacanciesRes = await axios.get("/vacancies");

        // 3️⃣ Asignaciones del tutor
        const assignRes = await axios.get("/applications/school-tutor");

        const assignments = assignRes.data;

        // Filtrar por estado
        const pending = assignments.filter((a: any) => a.status === "PENDING").length;
        const approved = assignments.filter((a: any) => a.status === "APPROVED").length;
        const rejected = assignments.filter((a: any) => a.status === "REJECTED").length;

        setStats({
          students: studentsRes.data.length,
          vacancies: vacanciesRes.data.length,
          assignments: assignments.length,
          pending,
          approved,
          rejected,
        });

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box>
      <Heading mb={4}>Bienvenido, {user.fullName}</Heading>
      <Text mb={8} color="gray.500">
        Panel del Tutor Escolar
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatBox label="Estudiantes de mi escuela" value={stats.students} />
        <StatBox label="Vacantes disponibles" value={stats.vacancies} />
        <StatBox label="Asignaciones totales" value={stats.assignments} />
        <StatBox label="Pendientes" value={stats.pending} />
        <StatBox label="Aprobadas" value={stats.approved} />
        <StatBox label="Rechazadas" value={stats.rejected} />
      </SimpleGrid>
    </Box>
  );
}

function StatBox({ label, value }: any) {
  return (
    <Stat p={6} shadow="md" rounded="lg" bg="white">
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
    </Stat>
  );
}
