import {
  Box,
  Heading,
  SimpleGrid,
  Card,
 
  Text,
  Button,
  Badge,
  Flex,
  
  useDisclosure,
  Input,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaBriefcase, FaSearch } from "react-icons/fa";
import { vacanciesApi } from "../../../api/vacancies.api";
import { useAuth } from "../../../contexts/AuthContext";
import CreateVacancyModal from "../tabs/CreateVacancyModal";
import EditVacancyModal from "../tabs/EditVacancyModal";

export default function CompanyVacancies() {
  const { user } = useAuth();
  const companyId = user?.companyId;

  const [vacancies, setVacancies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);

  // Modales
  const createModal = useDisclosure();
  const editModal = useDisclosure();

  // ===========================
  // CARGAR VACANTES
  // ===========================
  const loadVacancies = async () => {
    if (!companyId) return;
    const data = await vacanciesApi.listByCompany(companyId);
    setVacancies(data);
    setFiltered(data);
  };

  useEffect(() => {
    loadVacancies();
  }, [companyId]);

  // ===========================
  // FILTROS
  // ===========================
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const applyFilters = () => {
    let temp = [...vacancies];

    // Buscar por título
    if (search.trim() !== "") {
      temp = temp.filter((v) =>
        v.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Estado
    if (statusFilter !== "ALL") {
      temp = temp.filter((v) =>
        statusFilter === "OPEN" ? v.status === 1 : v.status === 2
      );
    }

    setFiltered(temp);
  };

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, vacancies]);

  // ===========================
  // ACCIONES
  // ===========================
  const openEdit = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    editModal.onOpen();
  };

  const handleClose = async (id: string) => {
    await vacanciesApi.close(id);
    loadVacancies();
  };

  const handleOpen = async (id: string) => {
    await vacanciesApi.open(id);
    loadVacancies();
  };

  const handleDelete = async (id: string) => {
    await vacanciesApi.delete(id);
    loadVacancies();
  };

  return (
    <Box p={6}>
      {/* ========================= HEADER ========================= */}
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>Mis Vacantes</Heading>

        <Flex gap={3}>
            

          <Button colorScheme="green" onClick={createModal.onOpen}>
            + Nueva Vacante
          </Button>
        </Flex>
      </Flex>

      {/* ========================= FILTROS ========================= */}
      <Flex gap={4} mb={6} align="center">
        <Flex flex="1" align="center" gap={2}>
          <FaSearch color="gray" />
          <Input
            placeholder="Buscar vacantes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Flex>

        <Select
          width="220px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Todas</option>
          <option value="OPEN">Solo Abiertas</option>
          <option value="CLOSED">Solo Cerradas</option>
        </Select>
      </Flex>

      {/* ========================= CARDS ========================= */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filtered.map((v) => (
          <Card
            key={v.id}
            borderRadius="2xl"
            boxShadow="md"
            p={5}
            h="300px"
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            _hover={{ boxShadow: "xl", transform: "translateY(-3px)", transition: ".2s" }}
          >
            {/* Header */}
            <Flex justify="space-between" align="start">
              <Flex align="center" gap={3}>
                <Box
                  bg="blue.100"
                  p={3}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaBriefcase size={20} color="#1A365D" />
                </Box>

                <Heading size="md" fontWeight="semibold">
                  {v.title}
                </Heading>
              </Flex>

              <Badge
                px={3}
                py={1}
                borderRadius="full"
                colorScheme={v.status === 1 ? "green" : "red"}
                fontSize="0.75rem"
              >
                {v.status === 1 ? "ABIERTA" : "CERRADA"}
              </Badge>
            </Flex>

            {/* Description */}
            <Text color="gray.600" fontSize="sm" noOfLines={2}>
              {v.description}
            </Text>

            {/* Dates */}
            <Box mt={2} fontSize="sm" color="gray.700">
              <Text><strong>Inicio:</strong> {v.startDate ?? "N/A"}</Text>
              <Text><strong>Fin:</strong> {v.endDate ?? "N/A"}</Text>
              <Text><strong>Creado:</strong> {v.createdAt?.split("T")[0] ?? "N/A"}</Text>
            </Box>

            {/* Cupos */}
            <Text mt={2} fontWeight="medium" color="blue.900">
              Cupos: {v.capacity}
            </Text>

            {/* Buttons */}
            <Flex gap={2} mt={3}>
              <Button size="sm" colorScheme="blue" flex={1} onClick={() => openEdit(v)}>
                Editar
              </Button>

              {v.status === 1 ? (
                <Button size="sm" colorScheme="yellow" flex={1} onClick={() => handleClose(v.id)}>
                  Cerrar
                </Button>
              ) : (
                <Button size="sm" colorScheme="green" flex={1} onClick={() => handleOpen(v.id)}>
                  Abrir
                </Button>
              )}

              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                flex={1}
                onClick={() => handleDelete(v.id)}
              >
                Eliminar
              </Button>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>

      {/* ========================= MODALES ========================= */}
      <CreateVacancyModal
        isOpen={createModal.isOpen}
        onClose={() => {
          createModal.onClose();
          loadVacancies();
        }}
        companyId={companyId}
      />

      <EditVacancyModal
        isOpen={editModal.isOpen}
        onClose={() => {
          editModal.onClose();
          loadVacancies();
        }}
        vacancy={selectedVacancy}
      />


    </Box>
  );
}
