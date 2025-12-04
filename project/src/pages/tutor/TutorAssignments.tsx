import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Center, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TutorAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/applications/school-tutor/assignments");
      setAssignments(res.data);
      setLoading(false);
    })();
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

      <Table>
        <Thead>
          <Tr>
            <Th>Estudiante</Th>
            <Th>Vacante</Th>
            <Th>Empresa</Th>
          </Tr>
        </Thead>

        <Tbody>
          {assignments.map((a: any) => (
            <Tr key={a.id}>
              <Td>{a.studentName}</Td>
              <Td>{a.vacancyTitle}</Td>
              <Td>{a.companyName}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
