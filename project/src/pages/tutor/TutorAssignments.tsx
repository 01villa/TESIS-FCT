import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Badge,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TutorAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    setLoading(true);

    // 🔥 ENDPOINT REAL
    const res = await axios.get("/applications/school-tutor");

    setAssignments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="lg" />
      </Center>
    );

  return (
    <Box>
      <Heading mb={6}>Mis Asignaciones</Heading>

      {assignments.length === 0 ? (
        <Center p={10} bg="gray.50" rounded="md" borderWidth="1px">
          No tienes asignaciones registradas.
        </Center>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Estudiante</Th>
              <Th>Vacante</Th>
              <Th>Empresa</Th>
              <Th>Estado</Th>
              <Th>Fecha</Th>
            </Tr>
          </Thead>

          <Tbody>
            {assignments.map((a) => (
              <Tr key={a.id}>
                <Td>{a.studentName}</Td>
                <Td>{a.vacancyTitle}</Td>
                <Td>{a.companyName}</Td>

                <Td>
                  <Badge
                    colorScheme={
                      a.status === "APPROVED"
                        ? "green"
                        : a.status === "REJECTED"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {a.status}
                  </Badge>
                </Td>

                <Td>{a.createdAt?.slice(0, 10)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
