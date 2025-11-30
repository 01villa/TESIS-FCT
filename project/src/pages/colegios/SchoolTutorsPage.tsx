import {
  Box,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SchoolTutorsPage({ schoolId }: any) {
  const [tutors, setTutors] = useState<any[]>([]);

  const load = async () => {
    const res = await axios.get(`/schools/${schoolId}/tutors`);
    setTutors(res.data);
  };

  useEffect(() => {
    load();
  }, [schoolId]);

  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <Box fontSize="xl" fontWeight="600">Tutores Escolares</Box>
        <Button colorScheme="blue">Crear Tutor</Button>
      </Flex>

      <Table>
        <Thead bg="gray.100">
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {tutors.map((t) => (
            <Tr key={t.id}>
              <Td>{t.fullName}</Td>
              <Td>{t.email}</Td>

              <Td>
                <Flex gap={3}>
                  <Button size="sm" colorScheme="yellow">Editar</Button>
                  <Button size="sm" colorScheme="red">Eliminar</Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
