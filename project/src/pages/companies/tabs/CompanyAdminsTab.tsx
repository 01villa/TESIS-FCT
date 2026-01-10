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
  TableContainer,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import CreateCompanyAdminModal from "./CreateCompanyAdminModal";
import EditCompanyAdminModal from "./EditCompanyAdminModal";
import { companyAdminApi } from "../../../api/companyAdmin.api";
import UserCell from "../../../components/UserCell";

type Row = {
  companyAdminId?: string;
  id?: string; // por si backend manda id
  userId?: string;
  fullName?: string;
  email?: string;
  photoUrl?: string | null;
  deletedAt?: string | null;
};

export default function CompanyAdminsTab({ companyId }: { companyId: string }) {
  const [admins, setAdmins] = useState<Row[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Row | null>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all");

  const [sortField, setSortField] =
    useState<"fullName" | "email" | "deletedAt">("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const load = async () => {
    const data = await companyAdminApi.listByCompany(companyId);

    const normalized: Row[] = (data ?? []).map((x: any) => ({
      ...x,
      companyAdminId: x.companyAdminId ?? x.id, // fallback
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

      // deletedAt: activo primero si asc
      if (sortField === "deletedAt") {
        A = A ? 1 : 0;
        B = B ? 1 : 0;
      }

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

      <TableContainer bg="white" rounded="md" shadow="sm">
        <Table variant="simple">
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

                  <Td textAlign="center">
                    <Flex gap={3} justify="center" flexWrap="wrap">
                      {/* ✅ EDITAR */}
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => {
                          setSelectedAdmin(a);
                          editModal.onOpen();
                        }}
                        isDisabled={!a.companyAdminId}
                      >
                        Editar
                      </Button>

                      {/* DELETE / RESTORE */}
                      {!a.deletedAt ? (
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={async () => {
                            if (!a.companyAdminId) return;
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
      </TableContainer>

      {/* MODALES */}
      <CreateCompanyAdminModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        companyId={companyId}
        onCreated={load}
      />

      <EditCompanyAdminModal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.onClose();
          setSelectedAdmin(null);
        }}
        admin={{
          // Adaptación mínima: tu modal espera id y userId
          id: selectedAdmin?.companyAdminId,
          userId: selectedAdmin?.userId,
          fullName: selectedAdmin?.fullName,
          email: selectedAdmin?.email,
          photoUrl: selectedAdmin?.photoUrl,
        }}
        onUpdated={load}
      />
    </Box>
  );
}
