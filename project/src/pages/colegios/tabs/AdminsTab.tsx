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

import CreateSchoolAdminModal from "./CreateSchoolAdminModal";
import EditSchoolAdminModal from "./EditSchoolAdminModal";
import { schoolsApi } from "../../../api/school.api";

import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

// =============================================
// ==== FILTROS + ORDENAMIENTO =================
// =============================================

interface Filters {
  search: string;
  status: "all" | "active" | "deleted";
}

export default function AdminsTab({ schoolId }: any) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  // filtros
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
  });

  // orden
  const [sortField, setSortField] = useState<string>("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const load = async () => {
    setLoading(true);
    const data = await schoolsApi.listAdmins(schoolId);
    setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [schoolId]);

  // ============================================
  // FILTRO
  // ============================================

  const filtered = admins.filter((admin) => {
    const matchesSearch =
      admin.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      admin.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all"
        ? true
        : filters.status === "active"
        ? admin.deletedAt === null
        : admin.deletedAt !== null;

    return matchesSearch && matchesStatus;
  });

  // ============================================
  // ORDENAMIENTO DINÁMICO
  // ============================================

  const sorted = [...filtered].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // manejar deletedAt como booleano
    if (sortField === "deletedAt") {
      fieldA = fieldA ? 1 : 0;
      fieldB = fieldB ? 1 : 0;
    }

    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
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

  const sortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  // ============================================
  // UI
  // ============================================

  if (loading)
    return (
      <Center mt={5}>
        <Spinner size="lg" />
      </Center>
    );

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="md">Administradores de la Escuela</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nuevo Administrador
        </Button>
      </Flex>

      {/* FILTROS */}
   <Flex gap={4} mb={5}>
  <Input
    placeholder="Buscar por nombre o correo…"
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      setFilters((prev) => ({ ...prev, search: e.target.value }))
    }
  />

  <select
    style={{
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    }}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
      setFilters((prev) => ({
        ...prev,
        status: e.target.value as any,
      }))
    }
  >
    <option value="all">Todos</option>
    <option value="active">Activos</option>
    <option value="deleted">Eliminados</option>
  </select>
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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => toggleSort("fullName")}>
                Nombre {sortIcon("fullName")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("email")}>
                Email {sortIcon("email")}
              </Th>

              <Th
                cursor="pointer"
                onClick={() => toggleSort("deletedAt")}
                textAlign="left"
              >
                Estado {sortIcon("deletedAt")}
              </Th>

              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>

          <Tbody>
            {sorted.map((admin) => (
              <Tr key={admin.id}>
                <Td>{admin.fullName}</Td>
                <Td>{admin.email}</Td>

                <Td>
                  {!admin.deletedAt ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Eliminado</Badge>
                  )}
                </Td>

                <Td>
                  <Flex gap={3} justify="center">
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        editModal.onOpen();
                      }}
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
        onClose={editModal.onClose}
        admin={selectedAdmin}
        onUpdated={load}
      />
    </Box>
  );
}
