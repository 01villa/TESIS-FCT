import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Input,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  IconButton,
  Avatar,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { usersApi } from "../../api/users.api";
import CreateAdminModal from "./CreateAdminModal";
import EditAdminModal from "./EditAdminModal";
import { API_URL } from "../../config/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [sorted, setSorted] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const {
    isOpen: isOpenInstructions,
    onOpen: onOpenInstructions,
    onClose: onCloseInstructions,
  } = useDisclosure();

  const loadUsers = async () => {
    const data = await usersApi.list();
    setUsers(data);
    setFiltered(data);
    setSorted(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // etiquetas amigables de roles
  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador General",
    COMPANY_ADMIN: "Administrador de Empresa",
    SCHOOL_ADMIN: "Administrador de Colegio",
    SCHOOL_TUTOR: "Tuto Escolar",
    COMPANY_TUTOR: "Tutor de Empresa",
    STUDENT: "Estudiante",
  };

  // ================= FILTROS =================
  useEffect(() => {
    let result = [...users];

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter((u) =>
        `${u.fullName} ${u.email}`.toLowerCase().includes(q)
      );
    }

    if (roleFilter !== "") {
      result = result.filter((u) => u.roles?.includes(roleFilter));
    }

    setFiltered(result);
  }, [search, roleFilter, users]);

  // ================= ORDEN =================
  const applySort = (data: any[], config: typeof sortConfig) => {
    if (!config) return data;

    const { key, direction } = config;

    return [...data].sort((a, b) => {
      const x = a[key]?.toString().toLowerCase() ?? "";
      const y = b[key]?.toString().toLowerCase() ?? "";

      if (x < y) return direction === "asc" ? -1 : 1;
      if (x > y) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    setSorted(applySort(filtered, sortConfig));
  }, [filtered, sortConfig]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const availableRoles = Array.from(
    new Set(users.flatMap((u) => u.roles ?? []))
  );

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Usuarios Administradores</Heading>

        <Button variant="outline" colorScheme="blue" onClick={onOpenInstructions}>
          Instrucciones
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={6} wrap="wrap">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="300px"
        />

        <Select
          placeholder="Rol"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          maxW="260px"
        >
          {availableRoles.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r] ?? r}
            </option>
          ))}
        </Select>

        <Button colorScheme="blue" onClick={onOpenCreate}>
          Crear Administrador
        </Button>
      </Flex>

      {/* TABLA */}
      <Table variant="simple" bg="white" rounded="md" shadow="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>
              <Flex align="center" gap={2}>
                NOMBRE
                <IconButton
                  aria-label="Ordenar nombre"
                  size="xs"
                  variant="ghost"
                  icon={getSortIcon("fullName")}
                  onClick={() => handleSort("fullName")}
                />
              </Flex>
            </Th>

            <Th>
              <Flex align="center" gap={2}>
                EMAIL
                <IconButton
                  aria-label="Ordenar email"
                  size="xs"
                  variant="ghost"
                  icon={getSortIcon("email")}
                  onClick={() => handleSort("email")}
                />
              </Flex>
            </Th>

            <Th>ROL</Th>
            <Th textAlign="center">ACCIONES</Th>
          </Tr>
        </Thead>

        <Tbody>
          {sorted.map((u) => (
            <Tr key={u.id}>
              {/* NOMBRE + AVATAR */}
              <Td>
                <Flex align="center" gap={3}>
                  <Avatar
                    size="sm"
                    name={u.fullName}
                    src={u.photoUrl ? `${API_URL}${u.photoUrl}` : undefined}
                  />
                  <Box fontWeight="500">{u.fullName}</Box>
                </Flex>
              </Td>

              {/* EMAIL */}
              <Td>{u.email}</Td>

              {/* ROL */}
              <Td>
                {u.roles?.map((r: string) => roleLabels[r] ?? r).join(", ")}
              </Td>

              {/* ACCIONES */}
              <Td>
                <Flex justify="center" gap={3}>
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    onClick={() => {
                      setSelected(u);
                      onOpenEdit();
                    }}
                  >
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={async () => {
                      await usersApi.delete(u.id);
                      loadUsers();
                    }}
                  >
                    Eliminar
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* MODALES */}
      <CreateAdminModal
        isOpen={isOpenCreate}
        onClose={() => {
          onCloseCreate();
          loadUsers();
        }}
      />

      {selected && (
        <EditAdminModal
          isOpen={isOpenEdit}
          admin={selected}
          onClose={() => {
            setSelected(null);
            onCloseEdit();
            loadUsers();
          }}
        />
      )}

      {/* MODAL INSTRUCCIONES */}
      <InstructionsModal
        isOpen={isOpenInstructions}
        onClose={onCloseInstructions}
      />
    </Box>
  );
}

// ================= MODAL INSTRUCCIONES =================

function InstructionsModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Instrucciones del Módulo</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="md" color="gray.600">
          En este módulo se gestionan exclusivamente los{" "}
          <strong>usuarios administradores del sistema</strong>.
          <br />
          <br />
          Puedes crear, editar y eliminar administradores, así como actualizar
          su información personal y credenciales.
          <br />
          <br />
          Los usuarios operativos (estudiantes y tutores) se gestionan desde los
          módulos de escuelas y empresas.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Entendido
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
