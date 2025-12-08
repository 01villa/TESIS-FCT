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
  useDisclosure,
  Input,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import CreateCompanyAdminModal from "./CreateCompanyAdminModal";
import { companyAdminApi } from "../../../api/companyadmin.api";

export default function CompanyAdminsTab({ companyId }: { companyId: string }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const createModal = useDisclosure();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [sortField, setSortField] = useState<"fullName" | "email" | "deletedAt">("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const load = async () => {
    const data = await companyAdminApi.listByCompany(companyId);
    setAdmins(data);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔍 FILTRO
  const filtered = admins.filter((a) => {
    const term = search.toLowerCase();

    const matchesSearch =
      a.fullName.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !a.deletedAt
        : !!a.deletedAt;

    return matchesSearch && matchesStatus;
  });

  // ↕️ ORDENAMIENTO
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

  const toggleSort = (field: "fullName" | "email" | "deletedAt") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const icon = (field: string) =>
    sortField !== field ? null : sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;

  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <strong>Administradores</strong>

        <Button colorScheme="blue" size="sm" onClick={createModal.onOpen}>
          + Nuevo Administrador
        </Button>
      </Flex>

      {/* 🔍 FILTROS */}
      <Flex gap={4} mb={4}>
        <Input
          placeholder="Buscar por nombre o correo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => toggleSort("fullName")}>
              Nombre {icon("fullName")}
            </Th>

            <Th cursor="pointer" onClick={() => toggleSort("email")}>
              Email {icon("email")}
            </Th>

            <Th cursor="pointer" onClick={() => toggleSort("deletedAt")}>
              Estado {icon("deletedAt")}
            </Th>

            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {sorted.map((a) => (
            <Tr key={a.id}>
              <Td>{a.fullName}</Td>
              <Td>{a.email}</Td>

              <Td>
                {a.deletedAt ? (
                  <Badge colorScheme="red">Inactivo</Badge>
                ) : (
                  <Badge colorScheme="green">Activo</Badge>
                )}
              </Td>

              <Td>
                <Flex gap={3} justify="center">
                  {!a.deletedAt ? (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={async () => {
                        await companyAdminApi.delete(a.id);
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
                        await companyAdminApi.restore(a.id);
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

      <CreateCompanyAdminModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        companyId={companyId}
        onCreated={load}
      />
    </Box>
  );
}
