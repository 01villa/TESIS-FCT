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
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import { schoolStudentsApi } from "../../../api/school.students.api";
import { specialtiesApi } from "../../../api/specialties.api";

import CreateSchoolStudentModal from "./CreateSchoolStudentModal";
import EditSchoolStudentModal from "./EditSchoolStudentModal";
import StudentDetailModal from "./StudentDetailModal";

import UserCell from "../../../components/UserCell";

interface Filters {
  search: string;
  status: "all" | "active" | "deleted";
  specialtyId: string;
}

type Specialty = {
  id: string;
  name: string;
};

type SortField = "fullName" | "email" | "specialtyName" | "deletedAt";
type SortOrder = "asc" | "desc";

export default function StudentsTab({ schoolId }: { schoolId: string }) {
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
    specialtyId: "all",
  });

  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // =========================
  // LOAD SPECIALTIES
  // =========================
  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data ?? []);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  // =========================
  // LOAD STUDENTS
  // =========================
  const load = async () => {
    setLoading(true);
    try {
      const data = await schoolStudentsApi.listBySchool(schoolId);
      setStudents(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  // =========================
  // FILTER + SORT
  // =========================
  const viewRows = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    let arr = [...students];

    // 🔎 search
    if (q) {
      arr = arr.filter((s) => {
        const fullName = (s.fullName ?? "").toLowerCase();
        const email = (s.email ?? "").toLowerCase();
        return fullName.includes(q) || email.includes(q);
      });
    }

    // ✅ status
    if (filters.status !== "all") {
      const active = filters.status === "active";
      arr = arr.filter((s) => (active ? !s.deletedAt : !!s.deletedAt));
    }

    // 🎓 specialty
    if (filters.specialtyId !== "all") {
      arr = arr.filter((s) => (s.specialtyId ?? "") === filters.specialtyId);
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
  }, [students, filters, sortField, sortOrder]);

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
        <Heading size="md">Estudiantes de la Escuela</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nuevo Estudiante
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

        <Select
          value={filters.specialtyId}
          onChange={(e) => setFilters((p) => ({ ...p, specialtyId: e.target.value }))}
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

      {/* EMPTY */}
      {viewRows.length === 0 && (
        <Center
          p={10}
          bg="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Text>No hay estudiantes que coincidan con el filtro.</Text>
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
            {viewRows.map((s: any, idx: number) => (
              <Tr key={s.id ?? `${s.userId}-${idx}`}>
                <Td>
                  <UserCell fullName={s.fullName ?? "—"} photoUrl={s.photoUrl ?? null} />
                </Td>

                <Td>{s.email ?? "—"}</Td>

                <Td>{s.specialtyName ?? "—"}</Td>

                <Td>
                  {!s.deletedAt ? (
                    <Badge colorScheme="green">Activo</Badge>
                  ) : (
                    <Badge colorScheme="red">Eliminado</Badge>
                  )}
                </Td>

                <Td>
                  <Flex gap={3} justify="center" flexWrap="wrap">
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
                        isDisabled={!s.id}
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
                        isDisabled={!s.id}
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
        onClose={() => {
          editModal.onClose();
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onUpdated={load}
      />

      <StudentDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => {
          detailModal.onClose();
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </Box>
  );
}
