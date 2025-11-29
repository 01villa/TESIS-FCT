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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { usersApi } from "../../api/users.api";
import CreateAdminModal from "./CreateAdminModal";
import EditAdminModal from "./EditAdminModal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ----------------------------
  // FILTROS
  // ----------------------------
  useEffect(() => {
    let result = [...users];

    if (search.trim() !== "") {
      result = result.filter((u) =>
        `${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "") {
      result = result.filter((u) => u.roles?.includes(roleFilter));
    }

    setFiltered(result);
  }, [search, roleFilter, users]);

  // Obtener todos los roles reales para el Select
  const availableRoles = Array.from(
    new Set(users.flatMap((u) => u.roles ?? []))
  );

  return (
    <Box>
      {/* --- HEADER + INSTRUCCIONES --- */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Usuarios Administradores</Heading>

        <Button variant="outline" colorScheme="blue" onClick={onOpenInstructions}>
          Instrucciones
        </Button>
      </Flex>

      {/* --- FILTROS --- */}
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
          maxW="200px"
        >
          {availableRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>

        <Button colorScheme="blue" onClick={onOpenCreate}>
          Crear Administrador
        </Button>
      </Flex>

      {/* --- TABLA --- */}
      <Table variant="simple" bg="white" rounded="md" shadow="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>NOMBRE</Th>
            <Th>EMAIL</Th>
            <Th>ROLES</Th>
            <Th textAlign="center">ACCIONES</Th>
          </Tr>
        </Thead>

        <Tbody>
          {filtered.map((u) => (
            <Tr key={u.id}>
              <Td>{u.fullName}</Td>
              <Td>{u.email}</Td>
              <Td>{u.roles?.join(", ")}</Td>

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

      {/* --- MODALES --- */}
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

      {/* --- MODAL INSTRUCCIONES --- */}
      <InstructionsModal
        isOpen={isOpenInstructions}
        onClose={onCloseInstructions}
      />
    </Box>
  );
}

// ==============================================================
// MODAL DE INSTRUCCIONES
// ==============================================================

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
          Aquí puedes <strong>crear, editar o eliminar</strong> administradores, y demas usuarios 
           podemos editar o eliminar.
          <br /><br />
          Este módulo <strong>no crea usuarios con roles específicos </strong>
          como estudiantes, tutores escolares o tutores de empresa.
          Esos perfiles se gestionan desde los módulos correspondientes
          (escuelas, empresas o asignaciones).
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
