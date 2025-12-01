import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";

import CreateSchoolModal from "./CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal";

import { School } from "../../types/school";
import { schoolsApi } from "../../api/school.api";
import SchoolFilterBar from "../../components/filters/SchoolFilterBar";

export default function SchoolList() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const navigate = useNavigate();

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const load = async () => {
    try {
      const data = await schoolsApi.list();
      setSchools(data);
      setFilteredSchools(data);
    } finally {
      setLoading(false);
    }
  };

  // 👉 FILTRADO AUTOMÁTICO
  useEffect(() => {
    let result = [...schools];

    // Filtro texto
    if (filters.search.length > 0) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (x) =>
          x.name.toLowerCase().includes(s) ||
          (x.address?.toLowerCase() ?? "").includes(s)
      );
    }

    // Filtro estado activo
    if (filters.status === "active") {
      result = result.filter((x) => !x.deletedAt);
    }

    // Filtro estado eliminado
    if (filters.status === "deleted") {
      result = result.filter((x) => x.deletedAt);
    }

    setFilteredSchools(result);
  }, [filters, schools]);

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Escuelas</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Registrar Escuela
        </Button>
      </Flex>

      {/* FILTRO */}
      <SchoolFilterBar onFilter={setFilters} />

      {/* TABLA */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Dirección</Th>
            <Th>Estado</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {filteredSchools.map((school) => (
            <Tr key={school.id}>
              <Td>{school.name}</Td>
              <Td>{school.address ?? "—"}</Td>

              <Td>
                {!school.deletedAt ? (
                  <Badge colorScheme="green">Activo</Badge>
                ) : (
                  <Badge colorScheme="red">Eliminado</Badge>
                )}
              </Td>

              <Td>
                <Flex justify="center" gap={3}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate(`/dashboard/schools/${school.id}`)}
                  >
                    Abrir
                  </Button>

                  <Button
                    colorScheme="yellow"
                    size="sm"
                    onClick={() => {
                      setSelectedSchool(school);
                      editModal.onOpen();
                    }}
                  >
                    Editar
                  </Button>

                  {!school.deletedAt ? (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={async () => {
                        await schoolsApi.delete(school.id);
                        load();
                      }}
                    >
                      Eliminar
                    </Button>
                  ) : (
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={async () => {
                        await schoolsApi.restore(school.id);
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
      <CreateSchoolModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreated={load}
      />

      <EditSchoolModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        school={selectedSchool}
        onUpdated={load}
      />
    </Box>
  );
}
