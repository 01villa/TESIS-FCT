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
  Text,
  Center,
  useDisclosure,
  Input,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import EditSchoolTutorModal from "./EditSchoolTutorModal";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { schoolTutorsApi } from "../../../api/schooltutor.api";
import CreateSchoolTutorModal from "./CreateSchoolTutorModal";

interface Filters {
  search: string;
  status: "all" | "active" | "deleted";
}

export default function TutorsTab({ schoolId }: any) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
  });

  const [sortField, setSortField] = useState("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const load = async () => {
    setLoading(true);
    const data = await schoolTutorsApi.listBySchool(schoolId);
    setTutors(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [schoolId]);

  // FILTRO
  const filtered = tutors.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all"
        ? true
        : filters.status === "active"
        ? t.deletedAt === null
        : t.deletedAt !== null;

    return matchesSearch && matchesStatus;
  });

  // SORT
  const sorted = [...filtered].sort((a, b) => {
    let A = a[sortField];
    let B = b[sortField];

    if (typeof A === "string") {
      A = A.toLowerCase();
      B = B.toLowerCase();
    }

    if (A < B) return sortOrder === "asc" ? -1 : 1;
    if (A > B) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortIcon = (field: string) =>
    sortField !== field ? null : sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;

  if (loading)
    return (
      <Center mt={5}>
        <Spinner size="lg" />
      </Center>
    );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="md">Tutores Escolares</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nuevo Tutor
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={5}>
        <Input
          placeholder="Buscar por nombre o correo…"
          onChange={(e) =>
            setFilters((p) => ({ ...p, search: e.target.value }))
          }
        />

        <select
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value as any }))
          }
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="deleted">Eliminados</option>
        </select>
      </Flex>

      {sorted.length === 0 && (
        <Center
          p={10}
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text>No hay tutores registrados.</Text>
        </Center>
      )}

      {sorted.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => toggleSort("fullName")}>
                Nombre {sortIcon("fullName")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("email")}>
                Email {sortIcon("email")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("phone")}>
                Teléfono {sortIcon("phone")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("deletedAt")}>
                Estado {sortIcon("deletedAt")}
              </Th>

              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>

          <Tbody>
            {sorted.map((t) => (
              <Tr key={t.id}>
                <Td>{t.fullName}</Td>
                <Td>{t.email}</Td>
                <Td>{t.phone}</Td>

                <Td>
                  {!t.deletedAt ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Eliminado</Badge>
                  )}
                </Td>

                <Td>
                  <Flex gap={3} justify="center">
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() => {
                        setSelectedTutor(t);
                        editModal.onOpen();
                      }}
                    >
                      Editar
                    </Button>

                    {!t.deletedAt ? (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={async () => {
                          await schoolTutorsApi.delete(t.id);
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
                          await schoolTutorsApi.restore(t.id);
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
      )}

      <CreateSchoolTutorModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        schoolId={schoolId}
        onCreated={load}
      />

      <EditSchoolTutorModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        tutor={selectedTutor}
        onUpdated={load}
      />
    </Box>
  );
}
