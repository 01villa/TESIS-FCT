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

        // 1) Estudiantes de su escuela
        const studentsRes = await axios.get(`/admin/students/school/${schoolId}`);

        // 2) Vacantes disponibles
        const vacanciesRes = await axios.get("/vacancies");

        // 3) Asignaciones del tutor escolar
        const assignRes = await axios.get("/applications/school-tutor");
        const assignments = Array.isArray(assignRes.data) ? assignRes.data : [];

        const count = (key: string) =>
          assignments.filter((a: any) => String(a?.status ?? "").toUpperCase() === key).length;

        const assigned = count("ASSIGNED");
        const approved = count("APPROVED_BY_COMPANY");
        const rejected = count("REJECTED_BY_COMPANY");
        const finished = count("FINISHED");
        const graded = assignments.filter(
          (a: any) => String(a?.status ?? "").toUpperCase() === "GRADED" || a?.finalGrade != null
        ).length;

        setStats({
          students: Array.isArray(studentsRes.data) ? studentsRes.data.length : 0,
          vacancies: Array.isArray(vacanciesRes.data) ? vacanciesRes.data.length : 0,
          assignments: assignments.length,

          assigned,
          approved,
          rejected,
          finished,
          graded,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.schoolId]);

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

        <StatBox label="Asignadas (pendientes de empresa)" value={stats.assigned} />
        <StatBox label="Aprobadas por empresa" value={stats.approved} />
        <StatBox label="Rechazadas por empresa" value={stats.rejected} />

        <StatBox label="Finalizadas (empresa)" value={stats.finished} />
        <StatBox label="Calificadas (escuela)" value={stats.graded} />
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
