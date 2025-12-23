import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Center,
  Badge,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import CreateSchoolModal from "./CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal";

import { School } from "../../types/school";
import { schoolsApi } from "../../api/school.api";
import SchoolFilterBar from "../../components/filters/SchoolFilterBar";
import { API_URL } from "../../config/api";

export default function SchoolList() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const navigate = useNavigate();

  const createModal = useDisclosure();
  const editModal = useDisclosure();

  // ================= LOAD =================
  const load = async () => {
    setLoading(true);
    const data = await schoolsApi.list();
    setSchools(data);
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

  // ================= FILTROS =================
  const filtered = schools.filter((s) => {
    const q = filters.search.toLowerCase();

    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      (s.address?.toLowerCase() ?? "").includes(q);

    const matchesStatus =
      filters.status === ""
        ? true
        : filters.status === "active"
        ? !s.deletedAt
        : !!s.deletedAt;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box p={6}>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Escuelas</Heading>

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Registrar Escuela
        </Button>
      </Flex>

      {/* FILTROS */}
      <SchoolFilterBar onFilter={setFilters} />

      {/* CARDS */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} mt={6}>
        {filtered.map((school) => (
          <Box
            key={school.id}
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
                {school.photoUrl ? (
                  <Box
                    as="img"
                    src={`${API_URL}${school.photoUrl}`}
                    alt={school.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                ) : (
                  <Text fontSize="xl" fontWeight="bold" color="gray.400">
                    {school.name.charAt(0)}
                  </Text>
                )}
              </Box>

              <Box>
                <Heading size="md">{school.name}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {school.address || "Sin dirección registrada"}
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
                colorScheme={school.deletedAt ? "red" : "green"}
              >
                {school.deletedAt ? "INACTIVA" : "ACTIVA"}
              </Badge>
            </Flex>

            {/* ACCIONES */}
            <Flex gap={2} justify="flex-end" flexWrap="wrap">
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() =>
                  navigate(`/dashboard/schools/${school.id}`)
                }
              >
                Abrir
              </Button>

              <Button
                size="sm"
                colorScheme="yellow"
                onClick={() => {
                  setSelectedSchool(school);
                  editModal.onOpen();
                }}
              >
                Editar
              </Button>

              {!school.deletedAt ? (
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={async () => {
                    await schoolsApi.delete(school.id);
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
                    await schoolsApi.restore(school.id);
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
      <CreateSchoolModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreated={load}
      />

      {selectedSchool && (
        <EditSchoolModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          school={selectedSchool}  
          onUpdated={load}  
        />
      )}
    </Box>
  );
}
