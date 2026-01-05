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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import { schoolStudentsApi } from "../../../api/school.students.api";
import { usersApi } from "../../../api/users.api";
import { specialtiesApi } from "../../../api/specialties.api";

import CreateSchoolStudentModal from "./CreateSchoolStudentModal";
import EditSchoolStudentModal from "./EditSchoolStudentModal";
import StudentDetailModal from "./StudentDetailModal";

interface Filters {
  search: string;
  status: "all" | "active" | "deleted";
  specialtyId: string; // 👈 nuevo
}

type Specialty = {
  id: string;
  name: string;
};

export default function StudentsTab({ schoolId }: any) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    specialtyId: "all", // 👈 nuevo
  });

  const [sortField, setSortField] = useState("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ======================================================
  // LOAD SPECIALTIES
  // ======================================================
  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  // ======================================================
  // LOAD DATA
  // ======================================================
  const load = async () => {
    setLoading(true);

    // 1️⃣ Estudiantes de la escuela
    const data = await schoolStudentsApi.listBySchool(schoolId);

    // 2️⃣ Usuarios (para email)
    const users = await usersApi.list();

    // 3️⃣ Merge email
    const merged = data.map((s: any) => {
      const user = users.find((u: any) => u.id === s.userId);
      return {
        ...s,
        email: user ? user.email : "—",
      };
    });

    setStudents(merged);
    setLoading(false);
  };

  useEffect(() => {
    load();
    loadSpecialties();
  }, [schoolId]);

  // ======================================================
  // FILTER
  // ======================================================
  const filtered = students.filter((s) => {
    const matchesSearch =
      (s.fullName ?? "")
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      (s.email ?? "")
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all"
        ? true
        : filters.status === "active"
        ? s.deletedAt === null
        : s.deletedAt !== null;

    const matchesSpecialty =
      filters.specialtyId === "all"
        ? true
        : (s.specialtyId ?? "") === filters.specialtyId;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  // ======================================================
  // SORT
  // ======================================================
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
    sortField !== field ? null : sortOrder === "asc" ? (
      <ChevronUpIcon />
    ) : (
      <ChevronDownIcon />
    );

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
        <Heading size="md">Estudiantes de la Escuela</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nuevo Estudiante
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={5} wrap="wrap">
        <Input
          placeholder="Buscar por nombre o correo…"
          value={filters.search}
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
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value as any }))
          }
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="deleted">Eliminados</option>
        </select>

        {/* 👇 NUEVO: FILTRO POR ESPECIALIDAD */}
        <Select
          value={filters.specialtyId}
          onChange={(e) =>
            setFilters((p) => ({ ...p, specialtyId: e.target.value }))
          }
          isDisabled={loadingSpecialties}
          maxW="320px"
        >
          <option value="all">Todas las especialidades</option>
          {specialties.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </Select>
      </Flex>

      {sorted.length === 0 && (
        <Center
          p={10}
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text>No hay estudiantes registrados.</Text>
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

              <Th cursor="pointer" onClick={() => toggleSort("specialtyName")}>
                Especialidad {sortIcon("specialtyName")}
              </Th>

              <Th cursor="pointer" onClick={() => toggleSort("deletedAt")}>
                Estado {sortIcon("deletedAt")}
              </Th>

              <Th textAlign="center">Acciones</Th>
            </Tr>
          </Thead>

          <Tbody>
            {sorted.map((s) => (
              <Tr key={s.id}>
                <Td>{s.fullName}</Td>
                <Td>{s.email}</Td>
                <Td>{s.specialtyName ?? "—"}</Td>

                <Td>
                  {!s.deletedAt ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Eliminado</Badge>
                  )}
                </Td>

                <Td>
                  <Flex gap={3} justify="center">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedStudent(s);
                        detailModal.onOpen();
                      }}
                    >
                      Ver más
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() => {
                        setSelectedStudent(s);
                        editModal.onOpen();
                      }}
                    >
                      Editar
                    </Button>

                    {!s.deletedAt ? (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={async () => {
                          await schoolStudentsApi.delete(s.id);
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
                          await schoolStudentsApi.restore(s.id);
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
      <CreateSchoolStudentModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        schoolId={schoolId}
        onCreated={load}
      />

      <EditSchoolStudentModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        student={selectedStudent}
        onUpdated={load}
      />

      <StudentDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        student={selectedStudent}
      />
    </Box>
  );
}
