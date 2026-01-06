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
  Input,
  Select,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import { companyTutorApi } from "../../../api/companyTutors.api";
import CreateCompanyTutorModal from "./CreateCompanyTutorModal";
import EditCompanyTutorModal from "./EditCompanyTutorModal";

import UserCell from "../../../components/UserCell";

type SortField = "fullName" | "email" | "deletedAt";
type SortOrder = "asc" | "desc";

export default function CompanyTutorsTab({ companyId }: { companyId: string }) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const [sort, setSort] = useState<{ field: SortField; direction: SortOrder }>({
    field: "fullName",
    direction: "asc",
  });

  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const load = async () => {
    const data = await companyTutorApi.listByCompany(companyId);
    setTutors(data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const filtered = useMemo(() => {
    let f = [...tutors];

    const q = search.trim().toLowerCase();
    if (q) {
      f = f.filter(
        (t) =>
          (t.fullName ?? "").toLowerCase().includes(q) ||
          (t.email ?? "").toLowerCase().includes(q)
      );
    }

    if (status !== "all") {
      const active = status === "active";
      f = f.filter((t) => (active ? !t.deletedAt : !!t.deletedAt));
    }

    f.sort((a, b) => {
      let A: any = a[sort.field];
      let B: any = b[sort.field];

      if (typeof A === "string") {
        A = A.toLowerCase();
        B = (B ?? "").toString().toLowerCase();
      }

      // nulls al final
      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;

      if (A < B) return sort.direction === "asc" ? -1 : 1;
      if (A > B) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return f;
  }, [tutors, search, status, sort]);

  const toggleSort = (field: SortField) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  const sortIcon = (field: SortField) => {
    if (sort.field !== field) return null;
    return sort.direction === "asc" ? <Icon as={ChevronUpIcon} /> : <Icon as={ChevronDownIcon} />;
  };

  return (
    <Box>
      <Flex justify="space-between" mb={4} flexWrap="wrap" gap={3}>
        <Button colorScheme="blue" size="sm" onClick={createModal.onOpen}>
          + Nuevo Tutor
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={4} flexWrap="wrap">
        <Input
          placeholder="Buscar por nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="360px"
        />

        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          maxW="220px"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </Select>
      </Flex>

      {/* TABLA */}
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
          {filtered.map((t, idx) => (
            <Tr key={t.id ?? `${t.email}-${idx}`}>
              <Td>
                <UserCell fullName={t.fullName ?? "—"} photoUrl={t.photoUrl ?? null} />
              </Td>

              <Td>{t.email ?? "—"}</Td>

              <Td>
                {!t.deletedAt ? (
                  <Badge colorScheme="green">Activo</Badge>
                ) : (
                  <Badge colorScheme="red">Inactivo</Badge>
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
                        await companyTutorApi.delete(t.id);
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
                        await companyTutorApi.restore(t.id);
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

      {/* MODALES */}
      <CreateCompanyTutorModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        companyId={companyId}
        onCreated={load}
      />

      <EditCompanyTutorModal
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
