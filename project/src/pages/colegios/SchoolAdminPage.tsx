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

export default function SchoolAdminPage({ schoolId }: any) {
  const [admins, setAdmins] = useState<any[]>([]);

  const load = async () => {
    const res = await axios.get(`/admin/schools/${schoolId}/admins`);
    setAdmins(res.data);
  };

  useEffect(() => {
    load();
  }, [schoolId]);

  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <Box fontSize="xl" fontWeight="600">Administradores del Colegio</Box>
        <Button colorScheme="blue">Crear Administrador</Button>
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
          {admins.map((a) => (
            <Tr key={a.id}>
              <Td>{a.fullName}</Td>
              <Td>{a.email}</Td>
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
