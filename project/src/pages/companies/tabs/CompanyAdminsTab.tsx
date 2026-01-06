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
  Select,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import CreateCompanyAdminModal from "./CreateCompanyAdminModal";
import { companyAdminApi } from "../../../api/companyAdmin.api";
import UserCell from "../../../components/UserCell";

type Row = {
  companyAdminId?: string; // 👈 puede venir undefined si algo falló
  id?: string;             // 👈 por si backend manda id
  userId?: string;
  fullName?: string;
  email?: string;
  photoUrl?: string | null;
  deletedAt?: string | null;
};

export default function CompanyAdminsTab({ companyId }: { companyId: string }) {
  const [admins, setAdmins] = useState<Row[]>([]);
  const createModal = useDisclosure();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all");

  const [sortField, setSortField] =
    useState<"fullName" | "email" | "deletedAt">("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const load = async () => {
    const data = await companyAdminApi.listByCompany(companyId);

    // Normaliza a nivel UI por si algo viene diferente (id vs companyAdminId)
    const normalized: Row[] = (data ?? []).map((x: any) => ({
      ...x,
      companyAdminId: x.companyAdminId ?? x.id, // 👈 fallback
    }));

    setAdmins(normalized);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return admins.filter((a) => {
      const matchesSearch =
        term === ""
          ? true
          : `${a.fullName ?? ""} ${a.email ?? ""}`.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? !a.deletedAt
          : !!a.deletedAt;

      return matchesSearch && matchesStatus;
    });
  }, [admins, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      let A: any = a[sortField];
      let B: any = b[sortField];

      if (typeof A === "string") {
        A = A.toLowerCase();
        B = (B ?? "").toString().toLowerCase();
      }

      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;

      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [filtered, sortField, sortOrder]);

  const toggleSort = (field: "fullName" | "email" | "deletedAt") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const icon = (field: string) =>
    sortField !== field ? null : sortOrder === "asc" ? (
      <ChevronUpIcon />
    ) : (
      <ChevronDownIcon />
    );

  return (
    <Box>
      <Flex justify="space-between" mb={4} flexWrap="wrap" gap={3}>
        <Button colorScheme="blue" size="sm" onClick={createModal.onOpen}>
          + Nuevo Administrador
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          maxW="220px"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </Select>
      </Flex>

      <Table variant="simple" bg="white" rounded="md" shadow="sm">
        <Thead bg="gray.50">
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
          {sorted.map((a, idx) => {
            // ✅ Key siempre único (no warning)
            const rowKey =
              a.companyAdminId ?? a.userId ?? a.email ?? `row-${idx}`;

            return (
              <Tr key={rowKey}>
                <Td>
                  <UserCell
                    fullName={a.fullName ?? "—"}
                    photoUrl={a.photoUrl ?? null}
                  />
                </Td>

                <Td>{a.email ?? "—"}</Td>

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
                          if (!a.companyAdminId) return; // evita llamada mala
                          await companyAdminApi.delete(a.companyAdminId);
                          load();
                        }}
                        isDisabled={!a.companyAdminId}
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={async () => {
                          if (!a.companyAdminId) return;
                          await companyAdminApi.restore(a.companyAdminId);
                          load();
                        }}
                        isDisabled={!a.companyAdminId}
                      >
                        Restaurar
                      </Button>
                    )}
                  </Flex>
                </Td>
              </Tr>
            );
          })}
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
