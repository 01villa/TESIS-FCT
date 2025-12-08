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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { companyTutorApi } from "../../../api/companyTutors.api";
import CreateCompanyTutorModal from "./CreateCompanyTutorModal";
import EditCompanyTutorModal from "./EditCompanyTutorModal";

export default function CompanyTutorsTab({ companyId }: { companyId: string }) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "fullName",
    direction: "asc",
  });

  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const load = async () => {
    const data = await companyTutorApi.listByCompany(companyId);
    setTutors(data);
    setFiltered(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let f = [...tutors];

    // FILTRO
    if (search.trim() !== "") {
      f = f.filter(
        (t) =>
          t.fullName.toLowerCase().includes(search.toLowerCase()) ||
          t.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ESTADO
    if (status !== "all") {
      const active = status === "active";
      f = f.filter((t) => (active ? !t.deletedAt : t.deletedAt));
    }

    // ORDENAMIENTO
    f.sort((a, b) => {
      const fa = a[sort.field]?.toString().toLowerCase();
      const fb = b[sort.field]?.toString().toLowerCase();

      if (fa < fb) return sort.direction === "asc" ? -1 : 1;
      if (fa > fb) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFiltered(f);
  }, [search, status, sort, tutors]);

  const toggleSort = (field: string) => {
    setSort((prev) => ({
      field,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <strong>Tutores</strong>

        <Button colorScheme="blue" size="sm" onClick={createModal.onOpen}>
          + Nuevo Tutor
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex gap={4} mb={4}>
        <Input
          placeholder="Buscar tutor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </Select>
      </Flex>

      {/* TABLA */}
      <Table>
        <Thead>
          <Tr>
            <Th onClick={() => toggleSort("fullName")} cursor="pointer">
              Nombre
            </Th>
            <Th onClick={() => toggleSort("email")} cursor="pointer">
              Email
            </Th>
            <Th>Estado</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {filtered.map((t) => (
            <Tr key={t.id}>
              <Td>{t.fullName}</Td>
              <Td>{t.email}</Td>
              <Td>
                {!t.deletedAt ? (
                  <Badge colorScheme="green">Activo</Badge>
                ) : (
                  <Badge colorScheme="red">Inactivo</Badge>
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
                        await companyTutorApi.delete(t.id);
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
                        await companyTutorApi.restore(t.id);
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
      <CreateCompanyTutorModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        companyId={companyId}
        onCreated={load}
      />

      <EditCompanyTutorModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        tutor={selectedTutor}
        onUpdated={load}
      />
    </Box>
  );
}
