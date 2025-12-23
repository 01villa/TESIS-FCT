import {
  Box,
  Button,
  Heading,
  Spinner,
  Center,
  Badge,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies.api";
import CreateCompanyModal from "./CreateCompanyModal";
import EditCompanyModal from "./EditCompanyModal";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";

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

  if (loading) {
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

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
      <Flex mb={6} gap={4} flexWrap="wrap">
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

      {/* CARDS */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
        {filtered.map((c) => (
          <Box
            key={c.id}
            p={6}
            rounded="lg"
            bg="white"
            shadow="md"
            borderWidth="1px"
          >
            {/* LOGO + INFO */}
            <Flex align="center" gap={4} mb={4}>
              <Box
  w="100px"
  h="60px"
  bg="gray.50"
  border="1px solid"
  borderColor="gray.200"
  rounded="md"
  display="flex"
  alignItems="center"
  justifyContent="center"
  overflow="hidden"
>
  {c.photoUrl ? (
    <Box
      as="img"
      src={`${API_URL}${c.photoUrl}`}
      alt={c.name}
      maxW="100%"
      maxH="100%"
      objectFit="contain"
    />
  ) : (
    <Text fontSize="xl" fontWeight="bold" color="gray.400">
      {c.name.charAt(0)}
    </Text>
  )}
</Box>

              <Box>
                <Heading size="md">{c.name}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {c.address || "Sin dirección registrada"}
                </Text>
              </Box>
            </Flex>

            {/* ESTADO */}
            <Flex justify="center" mb={5}>
              <Badge
                px={3}
                py={1}
                rounded="full"
                fontSize="0.8rem"
                colorScheme={c.deletedAt ? "red" : "green"}
              >
                {c.deletedAt ? "INACTIVA" : "ACTIVA"}
              </Badge>
            </Flex>

            {/* ACCIONES */}
            <Flex gap={2} justify="flex-end" flexWrap="wrap">
              <Button
                as={Link}
                to={`/dashboard/companies/${c.id}`}
                size="sm"
                colorScheme="blue"
              >
                Abrir
              </Button>

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
          </Box>
        ))}
      </SimpleGrid>

      {/* MODALES */}
      <CreateCompanyModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreated={load}
      />

      {selectedCompany && (
        <EditCompanyModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          company={selectedCompany}
          onUpdated={load}
        />
      )}
    </Box>
  );
}
