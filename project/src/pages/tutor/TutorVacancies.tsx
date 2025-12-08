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
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { vacanciesApi } from "../../api/vacancies.api";
import VacancyDetailModal from "./VacancyDetailModal";


export default function TutorVacancies() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  const detailModal = useDisclosure();

  const load = async () => {
    setLoading(true);
    const data = await vacanciesApi.list();
    setVacancies(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box>
      <Heading mb={6}>Vacantes Disponibles</Heading>

      {vacancies.length === 0 ? (
        <Center p={10} bg="gray.50" borderRadius="md" borderWidth="1px">
          No hay vacantes abiertas.
        </Center>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Título</Th>
              <Th>Empresa</Th>
              <Th>Estado</Th>
              <Th>Cupos</Th>
              <Th></Th>
            </Tr>
          </Thead>

          <Tbody>
            {vacancies.map((v) => (
              <Tr key={v.id}>
                <Td>{v.title}</Td>
                <Td>{v.companyName}</Td>
                <Td>
                  <Badge colorScheme={v.status === "OPEN" ? "green" : "red"}>
                    {v.status}
                  </Badge>
                </Td>
                <Td>{v.capacity}</Td>

                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => {
                      setSelectedVacancy(v);
                      detailModal.onOpen();
                    }}
                  >
                    Ver más
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* MODAL DETALLE */}
      <VacancyDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        vacancy={selectedVacancy}
      />
    </Box>
  );
}
