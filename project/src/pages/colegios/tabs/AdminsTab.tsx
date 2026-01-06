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

import CreateSchoolAdminModal from "./CreateSchoolAdminModal";
import EditSchoolAdminModal from "./EditSchoolAdminModal";
import { schoolsApi } from "../../../api/school.api";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import UserCell from "../../../components/UserCell";

interface Filters {
  search: string;
  status: "all" | "active" | "deleted";
}

type SortField = "fullName" | "email" | "deletedAt";
type SortOrder = "asc" | "desc";

export default function AdminsTab({ schoolId }: { schoolId: string }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

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
      const data = await schoolsApi.listAdmins(schoolId);
      setAdmins(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return admins.filter((admin) => {
      const fullName = (admin.fullName ?? "").toLowerCase();
      const email = (admin.email ?? "").toLowerCase();

      const matchesSearch = q ? fullName.includes(q) || email.includes(q) : true;

      const matchesStatus =
        filters.status === "all"
          ? true
          : filters.status === "active"
          ? !admin.deletedAt
          : !!admin.deletedAt;

      return matchesSearch && matchesStatus;
    });
  }, [admins, filters.search, filters.status]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      let A: any = a[sortField];
      let B: any = b[sortField];

      // deletedAt como booleano (activo primero si asc)
      if (sortField === "deletedAt") {
        A = A ? 1 : 0;
        B = B ? 1 : 0;
      }

      if (typeof A === "string") {
        A = A.toLowerCase();
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
  }, [filtered, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
        <Heading size="md">Administradores de la Escuela</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nuevo Administrador
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={5} flexWrap="wrap">
        <Input
          placeholder="Buscar por nombre o correo…"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          maxW="360px"
        />

        <Select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value as any }))
          }
          maxW="220px"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="deleted">Eliminados</option>
        </Select>
      </Flex>

      {/* LISTA VACÍA */}
      {sorted.length === 0 && (
        <Center
          p={10}
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text fontSize="lg" color="gray.600">
            No hay administradores que coincidan con el filtro.
          </Text>
        </Center>
      )}

      {/* TABLA */}
      {sorted.length > 0 && (
        <Table variant="simple" bg="white" rounded="md" shadow="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th cursor="pointer" onClick={() => toggleSort("fullName")}>
                Nombre {sortIcon("fullName")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("email")}>
                Email {sortIcon("email")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("deletedAt")}>
                Estado {sortIcon("deletedAt")}
              </Th>

              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>

          <Tbody>
            {sorted.map((admin: any, idx: number) => (
              <Tr key={admin.id ?? `${admin.email}-${idx}`}>
                {/* Avatar + Nombre */}
                <Td>
                  <UserCell
                    fullName={admin.fullName ?? "—"}
                    photoUrl={admin.photoUrl ?? null}
                  />
                </Td>

                <Td>{admin.email ?? "—"}</Td>

                <Td>
                  {!admin.deletedAt ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Eliminado</Badge>
                  )}
                </Td>

                <Td>
                  <Flex gap={3} justify="center" flexWrap="wrap">
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        editModal.onOpen();
                      }}
                      isDisabled={!admin}
                    >
                      Editar
                    </Button>

                    {!admin.deletedAt ? (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={async () => {
                          await schoolsApi.deleteAdmin(admin.id);
                          load();
                        }}
                        isDisabled={!admin.id}
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={async () => {
                          await schoolsApi.restoreAdmin(admin.id);
                          load();
                        }}
                        isDisabled={!admin.id}
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
      <CreateSchoolAdminModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreated={load}
        schoolId={schoolId}
      />

      <EditSchoolAdminModal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.onClose();
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onUpdated={load}
      />
    </Box>
  );
}
