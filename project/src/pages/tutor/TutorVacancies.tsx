import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Badge,
  Button,
  useDisclosure,
  Text,
  Flex,
  HStack,
  Input,
  Select,
  IconButton,
  TableContainer,
  Skeleton,
  SkeletonText,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";

import { RepeatIcon, SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect, useMemo } from "react";
import { vacanciesApi } from "../../api/vacancies.api";
import VacancyDetailModal from "./VacancyDetailModal";

function formatDate(value: any) {
  if (!value) return "—";
  // soporta "YYYY-MM-DD" y fechas ISO
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function statusMeta(status: any) {
  const s = Number(status);
  if (s === 1) return { label: "Abierta", scheme: "green" as const };
  return { label: "Cerrada", scheme: "gray" as const };
}

export default function TutorVacancies() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const detailModal = useDisclosure();

  // filtros UI
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "open" | "closed">("open");
  const [specialty, setSpecialty] = useState<string>("all");

  // colors
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const headBg = useColorModeValue("gray.50", "gray.800");
  const pageText = useColorModeValue("gray.600", "gray.300");

  const load = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;

    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await vacanciesApi.list();
      setVacancies(data ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // lista especialidades (para el Select)
  const specialties = useMemo(() => {
    const s = new Set<string>();
    (vacancies ?? []).forEach((v: any) => {
      if (v?.specialtyName) s.add(v.specialtyName);
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [vacancies]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (vacancies ?? [])
      .filter((v: any) => {
        // status filter
        if (status === "open" && Number(v.status) !== 1) return false;
        if (status === "closed" && Number(v.status) === 1) return false;

        // specialty filter
        if (specialty !== "all" && v.specialtyName !== specialty) return false;

        // search
        if (!q) return true;
        const hay = `${v.title ?? ""} ${v.companyName ?? ""} ${v.specialtyName ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      // orden por fecha inicio (desc)
      .sort((a: any, b: any) => {
        const da = new Date(a?.startDate ?? 0).getTime();
        const db = new Date(b?.startDate ?? 0).getTime();
        return db - da;
      });
  }, [vacancies, search, status, specialty]);

  if (loading) {
    return (
      <Box>
        <Flex mb={6} align="center" justify="space-between">
          <Box>
            <Skeleton height="28px" width="260px" mb={2} />
            <SkeletonText noOfLines={1} spacing="2" width="220px" />
          </Box>
          <Skeleton height="36px" width="140px" />
        </Flex>

        <Box bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="xl" p={4}>
          <Skeleton height="44px" mb={3} />
          <Skeleton height="44px" mb={3} />
          <Skeleton height="44px" mb={3} />
          <Skeleton height="44px" />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Flex mb={6} align="start" justify="space-between" gap={4} flexWrap="wrap">
        <Box>
          <Heading size="lg">Vacantes</Heading>
          <Text mt={1} color={pageText} fontSize="sm">
            {filtered.length} {filtered.length === 1 ? "vacante" : "vacantes"} {status === "open" ? "abiertas" : "en total"}
          </Text>
        </Box>

        <HStack spacing={2}>
          <Tooltip label="Actualizar">
            <IconButton
              aria-label="Actualizar"
              icon={<RepeatIcon />}
              isLoading={refreshing}
              onClick={() => load({ silent: true })}
              variant="outline"
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* CARD */}
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="xl"
        overflow="hidden"
        boxShadow={useColorModeValue("sm", "none")}
      >
        {/* TOOLBAR (Filtros) */}
        <Flex
          p={4}
          gap={3}
          align="center"
          justify="space-between"
          flexWrap="wrap"
          borderBottomWidth="1px"
          borderColor={cardBorder}
          bg={headBg}
        >
          <HStack spacing={3} flexWrap="wrap" w={{ base: "full", md: "auto" }}>
            <Flex align="center" gap={2} w={{ base: "full", md: "320px" }}>
              <SearchIcon opacity={0.7} />
              <Input
                placeholder="Buscar por título, empresa o especialidad…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg={cardBg}
              />
            </Flex>

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              w={{ base: "full", md: "180px" }}
              bg={cardBg}
            >
              <option value="open">Solo abiertas</option>
              <option value="all">Todas</option>
              <option value="closed">Solo cerradas</option>
            </Select>

            <Select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              w={{ base: "full", md: "240px" }}
              bg={cardBg}
            >
              <option value="all">Todas las especialidades</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </HStack>

        </Flex>

        {filtered.length === 0 ? (
          <Center p={10}>
            <Box textAlign="center">
              <Heading size="sm" mb={2}>
                No hay resultados
              </Heading>
              <Text color={pageText}>
                Prueba cambiando los filtros o limpiando la búsqueda.
              </Text>
              <Button
                mt={4}
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("open");
                  setSpecialty("all");
                }}
              >
                Limpiar filtros
              </Button>
            </Box>
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg={headBg}>
                <Tr>
                  <Th>Título</Th>
                  <Th>Empresa</Th>
                  <Th>Especialidad</Th>
                  <Th>Periodo</Th>
                  <Th textAlign="center">Estado</Th>
                  <Th isNumeric>Cupos</Th>
                  <Th textAlign="center">Acción</Th>
                </Tr>
              </Thead>

              <Tbody>
                {filtered.map((v: any, idx: number) => {
                  const st = statusMeta(v.status);

                  return (
                    <Tr
                      key={v.id}
                      _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}
                      bg={idx % 2 === 0 ? useColorModeValue("white", "gray.900") : useColorModeValue("gray.50", "gray.900")}
                      transition="background 0.15s ease"
                    >
                      <Td fontWeight="semibold">{v.title ?? "—"}</Td>
                      <Td>{v.companyName ?? "—"}</Td>
                      <Td>{v.specialtyName ?? "—"}</Td>

                      <Td>
                        <Text fontSize="sm">
                          {formatDate(v.startDate)} – {formatDate(v.endDate)}
                        </Text>
                      </Td>

                      <Td textAlign="center">
                        <Badge
                          colorScheme={st.scheme}
                          variant={st.scheme === "green" ? "subtle" : "solid"}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {st.label.toUpperCase()}
                        </Badge>
                      </Td>

                      <Td isNumeric fontWeight="semibold">
                        {v.capacity ?? "—"}
                      </Td>

                      <Td textAlign="center">
                        <Button
                          size="sm"
                          variant="solid"
                          colorScheme="blue"
                          onClick={() => {
                            setSelectedVacancy(v);
                            detailModal.onOpen();
                          }}
                        >
                          Detalle
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* MODAL DETALLE */}
      <VacancyDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        vacancy={selectedVacancy}
      />
    </Box>
  );
}
