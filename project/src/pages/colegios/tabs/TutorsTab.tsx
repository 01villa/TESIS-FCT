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
  Select,
  Icon,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";

import EditSchoolTutorModal from "./EditSchoolTutorModal";
import CreateSchoolTutorModal from "./CreateSchoolTutorModal";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { schoolTutorsApi } from "../../../api/schooltutor.api";
import UserCell from "../../../components/UserCell";

interface Filters {
  search: string;
  status: "all" | "active" | "deleted";
}

type SortField = "fullName" | "email" | "phone" | "deletedAt";
type SortOrder = "asc" | "desc";

export default function TutorsTab({ schoolId }: { schoolId: string }) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
  });

  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const load = async () => {
    setLoading(true);
    try {
      const data = await schoolTutorsApi.listBySchool(schoolId);
      setTutors(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const viewRows = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    let arr = [...tutors];

    // 🔎 search
    if (q) {
      arr = arr.filter((t) => {
        const fullName = (t.fullName ?? "").toLowerCase();
        const email = (t.email ?? "").toLowerCase();
        return fullName.includes(q) || email.includes(q);
      });
    }

    // ✅ status
    if (filters.status !== "all") {
      const active = filters.status === "active";
      arr = arr.filter((t) => (active ? !t.deletedAt : !!t.deletedAt));
    }

    // ↕️ sort
    arr.sort((a, b) => {
      let A: any = a[sortField];
      let B: any = b[sortField];

      // deletedAt como booleano (activos primero si asc)
      if (sortField === "deletedAt") {
        A = A ? 1 : 0;
        B = B ? 1 : 0;
      }

      if (typeof A === "string") {
        A = A.toLowerCase();
        B = (B ?? "").toString().toLowerCase();
      } else if (sortField === "phone") {
        // phone puede ser null
        A = (A ?? "").toString().toLowerCase();
        B = (B ?? "").toString().toLowerCase();
      }

      // nulls al final
      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;

      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [tutors, filters, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <Icon as={ChevronUpIcon} />
    ) : (
      <Icon as={ChevronDownIcon} />
    );
  };

  if (loading)
    return (
      <Center mt={5}>
        <Spinner size="lg" />
      </Center>
    );

  return (
    <Box>
      {/* HEADER */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={5}
        flexWrap="wrap"
        gap={3}
      >
        <Heading size="md">Tutores Escolares</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nuevo Tutor
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={5} flexWrap="wrap">
        <Input
          placeholder="Buscar por nombre o correo…"
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          maxW="360px"
        />

        <Select
          value={filters.status}
          onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value as any }))}
          maxW="220px"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="deleted">Eliminados</option>
        </Select>
      </Flex>

      {/* EMPTY */}
      {viewRows.length === 0 && (
        <Center
          p={10}
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text>No hay tutores que coincidan con el filtro.</Text>
        </Center>
      )}

      {/* TABLE */}
      {viewRows.length > 0 && (
        <Table variant="simple" bg="white" rounded="md" shadow="sm">
          <Thead bg="gray.50">
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
            {viewRows.map((t: any, idx: number) => (
              <Tr key={t.id ?? `${t.userId}-${idx}`}>
                <Td>
                  <UserCell fullName={t.fullName ?? "—"} photoUrl={t.photoUrl ?? null} />
                </Td>

                <Td>{t.email ?? "—"}</Td>
                <Td>{t.phone ?? "—"}</Td>

                <Td>
                  {!t.deletedAt ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Eliminado</Badge>
                  )}
                </Td>

                <Td>
                  <Flex gap={3} justify="center" flexWrap="wrap">
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
                        isDisabled={!t.id}
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
                        isDisabled={!t.id}
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

      {/* MODALES */}
      <CreateSchoolTutorModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        schoolId={schoolId}
        onCreated={load}
      />

      <EditSchoolTutorModal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.onClose();
          setSelectedTutor(null);
        }}
        tutor={selectedTutor}
        onUpdated={load}
      />
    </Box>
  );
}
