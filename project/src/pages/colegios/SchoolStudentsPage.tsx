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

export default function SchoolStudentsPage({ schoolId }: any) {
  const [students, setStudents] = useState<any[]>([]);

  const load = async () => {
    const res = await axios.get(`/schools/${schoolId}/students`);
    setStudents(res.data);
  };

  useEffect(() => {
    load();
  }, [schoolId]);

  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <Box fontSize="xl" fontWeight="600">Estudiantes</Box>
        <Button colorScheme="blue">Registrar Estudiante</Button>
      </Flex>

      <Table>
        <Thead bg="gray.100">
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>DNI</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {students.map((s) => (
            <Tr key={s.id}>
              <Td>{s.fullName}</Td>
              <Td>{s.email}</Td>
              <Td>{s.dni}</Td>

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
