import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useDisclosure,
  Select
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";
import CreateVacancyModal from "./CreateVacancyModal";
import EditVacancyModal from "./EditVacancyModal";

export default function CompanyVacanciesTab({ companyId }: { companyId: string }) {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    const data = await vacanciesApi.listByCompany(companyId);
    setVacancies(data);
    setFiltered(data);
  };

  useEffect(() => {
    load();
  }, []);

  // FILTRO POR ESTADO
  useEffect(() => {
    if (!statusFilter) return setFiltered(vacancies);

    setFiltered(
      vacancies.filter(v => 
        statusFilter === "open" ? v.status === 1 : v.status === 2
      )
    );
  }, [statusFilter, vacancies]);

  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <strong>Vacantes</strong>

        <Flex gap={4}>
          <Select
            size="sm"
            placeholder="Filtrar por estado"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="open">Abiertas</option>
            <option value="closed">Cerradas</option>
          </Select>

          <Button colorScheme="blue" size="sm" onClick={createModal.onOpen}>
            + Nueva Vacante
          </Button>
        </Flex>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th>Título</Th>
            <Th>Cupos</Th>
            <Th>Inicio</Th>
            <Th>Fin</Th>
            <Th>Estado</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {filtered.map((v) => (
            <Tr key={v.id}>
              <Td>{v.title}</Td>
              <Td>{v.capacity}</Td>
              <Td>{v.startDate}</Td>
              <Td>{v.endDate}</Td>
              <Td>
                {v.status === 1 ? (
                  <Badge colorScheme="green">Abierta</Badge>
                ) : (
                  <Badge colorScheme="red">Cerrada</Badge>
                )}
              </Td>

              <Td>
                <Flex gap={3} justify="center">
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    onClick={() => {
                      setSelected(v);
                      editModal.onOpen();
                    }}
                  >
                    Editar
                  </Button>

                  {v.status === 1 ? (
                    <Button
                      size="sm"
                      colorScheme="orange"
                      onClick={async () => {
                        await vacanciesApi.close(v.id);
                        load();
                      }}
                    >
                      Cerrar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={async () => {
                        await vacanciesApi.open(v.id);
                        load();
                      }}
                    >
                      Abrir
                    </Button>
                  )}

                  {!v.deletedAt ? (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={async () => {
                        await vacanciesApi.delete(v.id);
                        load();
                      }}
                    >
                      Eliminar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={async () => {
                        await vacanciesApi.restore(v.id);
                        load();
                      }}
                    >
                      Restaurar
                    </Button>
                  )}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* MODALES */}
      <CreateVacancyModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        companyId={companyId}
        onCreated={load}
      />

      <EditVacancyModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        vacancy={selected}
        onUpdated={load}
      />
    </Box>
  );
}
