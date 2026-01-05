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
  Select,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";
import { specialtiesApi } from "../../../api/specialties.api";
import CreateVacancyModal from "./CreateVacancyModal";
import EditVacancyModal from "./EditVacancyModal";

type Specialty = {
  id: string;
  name: string;
};

export default function CompanyVacanciesTab({ companyId }: { companyId: string }) {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const [statusFilter, setStatusFilter] = useState(""); // open | closed | ""
  const [specialtyFilter, setSpecialtyFilter] = useState("all"); // all | specialtyId

  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const load = async () => {
    const data = await vacanciesApi.listByCompany(companyId);
    setVacancies(data);
  };

  const loadSpecialties = async () => {
    const data = await specialtiesApi.list();
    setSpecialties(data);
  };

  useEffect(() => {
    load();
    loadSpecialties();
  }, [companyId]);

  // FILTROS (estado + especialidad)
  useEffect(() => {
    let result = [...vacancies];

    if (statusFilter) {
      result = result.filter((v) =>
        statusFilter === "open" ? v.status === 1 : v.status === 2
      );
    }

    if (specialtyFilter !== "all") {
      result = result.filter((v) => (v.specialtyId ?? "") === specialtyFilter);
    }

    setFiltered(result);
  }, [statusFilter, specialtyFilter, vacancies]);

  return (
    <Box>
      <Flex justify="space-between" mb={4} align="center">
        <strong>Vacantes</strong>

        <Flex gap={4} align="center">
          {/* ✅ filtro por estado */}
          <Select
            size="sm"
            placeholder="Filtrar por estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW="220px"
          >
            <option value="open">Abiertas</option>
            <option value="closed">Cerradas</option>
          </Select>

          {/* ✅ NUEVO: filtro por especialidad */}
          <Select
            size="sm"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            maxW="260px"
          >
            <option value="all">Todas las especialidades</option>
            {specialties.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.name}
              </option>
            ))}
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
            <Th>Especialidad</Th>
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
              <Td>{v.specialtyName ?? "—"}</Td>
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
