import {
  Box,
  Button,
  Heading,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies.api";
import CreateCompanyModal from "./CreateCompanyModal";
import EditCompanyModal from "./EditCompanyModal";
import { Link } from "react-router-dom";

export default function CompanyDashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // ──────────── FILTROS ─────────────
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const load = async () => {
    setLoading(true);
    const data = await companiesApi.list();
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );

  // ──────────── APLICAR FILTROS ─────────────
  const filtered = companies.filter((c) => {
    const s = search.toLowerCase();

    const matchesSearch =
      c.name.toLowerCase().includes(s) ||
      c.address?.toLowerCase().includes(s);

    const matchesStatus =
      status === "all"
        ? true
        : status === "active"
        ? !c.deletedAt
        : !!c.deletedAt;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Empresas</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Nueva Empresa
        </Button>
      </Flex>

      {/* FILTROS */}
      <Flex mb={4} gap={4} flexWrap="wrap">
        <Input
          placeholder="Buscar empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="250px"
        />

        <Select
          width="160px"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </Select>
      </Flex>

      {/* TABLE */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Dirección</Th>
            <Th>Estado</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {filtered.map((c) => (
            <Tr key={c.id}>
              <Td>{c.name}</Td>
              <Td>{c.address}</Td>

              <Td>
                {c.deletedAt ? (
                  <Badge colorScheme="red">Inactiva</Badge>
                ) : (
                  <Badge colorScheme="green">Activa</Badge>
                )}
              </Td>

              <Td>
                <Flex gap={3} justify="center">
                  {/* DETALLE */}
                  <Button
                    as={Link}
                    to={`/dashboard/companies/${c.id}`}
                    size="sm"
                    colorScheme="blue"
                  >
                    Abrir
                  </Button>

                  {/* EDITAR */}
                  <Button
                    size="sm"
                    colorScheme="yellow"
                    onClick={() => {
                      setSelectedCompany(c);
                      editModal.onOpen();
                    }}
                  >
                    Editar
                  </Button>

                  {/* DELETE / RESTORE */}
                  {!c.deletedAt ? (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={async () => {
                        await companiesApi.delete(c.id);
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
                        await companiesApi.restore(c.id);
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
      <CreateCompanyModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreated={load}
      />

      <EditCompanyModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        company={selectedCompany}
        onUpdated={load}
      />
    </Box>
  );
}
