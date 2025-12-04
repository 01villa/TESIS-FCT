import { Box, Heading, Text, Stat, StatLabel, StatNumber, SimpleGrid, Spinner, Center } from "@chakra-ui/react";
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
        const res = await axios.get("/applications/school-tutor/stats");
        setStats(res.data);
      } catch (e) {
        setStats({ assignments: 0, pending: 0, completed: 0 });
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
      <Text mb={8} color="gray.500">Panel del Tutor Escolar</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatBox label="Asignaciones totales" value={stats.assignments} />
        <StatBox label="Pendientes" value={stats.pending} />
        <StatBox label="Completadas" value={stats.completed} />
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
