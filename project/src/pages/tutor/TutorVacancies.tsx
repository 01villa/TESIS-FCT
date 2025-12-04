import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TutorVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/applications/school-tutor/vacancies");
        setVacancies(res.data);
      } finally {
        setLoading(false);
      }
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
      <Heading mb={6}>Vacantes Disponibles</Heading>

      <Table>
        <Thead>
          <Tr>
            <Th>Título</Th>
            <Th>Empresa</Th>
            <Th>Estado</Th>
          </Tr>
        </Thead>

        <Tbody>
          {vacancies.map((v: any) => (
            <Tr key={v.id}>
              <Td>{v.title}</Td>
              <Td>{v.companyName}</Td>
              <Td>
                <Badge colorScheme="green">Abierta</Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
