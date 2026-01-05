import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Badge,
  Text,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  TableContainer,
  useColorModeValue,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { RepeatIcon, SearchIcon } from "@chakra-ui/icons";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AssignmentDetailDrawer from "./AssignmentDetailDrawer";

function normalizeStatus(status: any) {
  const n = Number(status);
  if (n === 1) return { label: "PENDIENTE", scheme: "yellow" as const };
  if (n === 2) return { label: "ACEPTADA", scheme: "green" as const };
  if (n === 3) return { label: "RECHAZADA", scheme: "red" as const };
  return { label: "DESCONOCIDO", scheme: "gray" as const };
}

function getStudentName(a: any) {
  return (
    a?.studentName ||
    a?.studentFullName ||
    a?.student?.fullName ||
    a?.student?.user?.fullName ||
    a?.student?.user?.name ||
    a?.student?.email ||
    "—"
  );
}

function getVacancyTitle(a: any) {
  return a?.vacancyTitle || a?.vacancy?.title || a?.vacancyName || "—";
}

function getCompanyName(a: any) {
  return a?.companyName || a?.vacancy?.companyName || a?.vacancy?.company?.name || "—";
}

// Para poder pedir la vacante completa en el drawer
function getVacancyId(a: any) {
  return a?.vacancyId || a?.vacancy?.id || null;
}

export default function TutorAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "1" | "2" | "3">("all");

  const [selected, setSelected] = useState<any>(null);
  const detail = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const headBg = useColorModeValue("gray.50", "gray.800");
  const subtleText = useColorModeValue("gray.600", "gray.300");

  const rowHoverBg = useColorModeValue("gray.50", "gray.800");
  const rowBgEven = useColorModeValue("white", "gray.900");
  const rowBgOdd = useColorModeValue("gray.50", "gray.900");
  const cardShadow = useColorModeValue("sm", "none");

  const loadAssignments = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;

    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await axios.get("/applications/school-tutor");
      setAssignments(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const computed = useMemo(() => {
    const items = (assignments ?? []).map((a: any) => {
      const st = normalizeStatus(a?.status);
      return {
        raw: a,
        id: a?.id,
        vacancyId: getVacancyId(a),
        student: getStudentName(a),
        vacancy: getVacancyTitle(a),
        company: getCompanyName(a),
        status: st,
      };
    });

    const q = search.trim().toLowerCase();

    const filtered = items.filter((x) => {
      if (filterStatus !== "all" && String(x.raw?.status) !== filterStatus) return false;
      if (!q) return true;
      return `${x.student} ${x.vacancy} ${x.company}`.toLowerCase().includes(q);
    });

    const counts = {
      total: items.length,
      pending: items.filter((x) => Number(x.raw?.status) === 1).length,
      approved: items.filter((x) => Number(x.raw?.status) === 2).length,
      rejected: items.filter((x) => Number(x.raw?.status) === 3).length,
    };

    return { filtered, counts };
  }, [assignments, search, filterStatus]);

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box>
      <Flex mb={6} align="start" justify="space-between" gap={4} flexWrap="wrap">
        <Box>
          <Heading size="lg">Mis asignaciones</Heading>
          <Text mt={1} color={subtleText} fontSize="sm">
            Clic en una fila para ver el detalle en un panel lateral.
          </Text>
        </Box>

        <HStack spacing={2}>
          <IconButton
            aria-label="Actualizar"
            icon={<RepeatIcon />}
            isLoading={refreshing}
            onClick={() => loadAssignments({ silent: true })}
            variant="outline"
          />
        </HStack>
      </Flex>

      <Box
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="xl"
        overflow="hidden"
        boxShadow={cardShadow}
      >
        <Flex
          p={4}
          bg={headBg}
          borderBottomWidth="1px"
          borderColor={cardBorder}
          align="center"
          justify="space-between"
          gap={3}
          flexWrap="wrap"
        >
          <HStack spacing={3} flexWrap="wrap">
            <Flex align="center" gap={2} w={{ base: "full", md: "340px" }}>
              <SearchIcon opacity={0.7} />
              <Input
                placeholder="Buscar estudiante, vacante o empresa…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg={cardBg}
              />
            </Flex>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              w={{ base: "full", md: "230px" }}
              bg={cardBg}
            >
              <option value="all">Todos los estados</option>
              <option value="1">Pendiente</option>
              <option value="2">Aceptada</option>
              <option value="3">Rechazada</option>
            </Select>
          </HStack>

          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme="yellow" variant="subtle" px={2} py={1} borderRadius="md">
              Pendientes: {computed.counts.pending}
            </Badge>
            <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="md">
              Aceptadas: {computed.counts.approved}
            </Badge>
            <Badge colorScheme="red" variant="subtle" px={2} py={1} borderRadius="md">
              Rechazadas: {computed.counts.rejected}
            </Badge>
          </HStack>
        </Flex>

        {computed.filtered.length === 0 ? (
          <Center p={10}>
            <Box textAlign="center">
              <Heading size="sm" mb={2}>
                No hay asignaciones
              </Heading>
              <Text color={subtleText}>No se encontraron resultados con los filtros actuales.</Text>
              <Divider my={4} />
              <Text fontSize="sm" color={subtleText}>
                Total registradas: {computed.counts.total}
              </Text>
            </Box>
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg={headBg}>
                <Tr>
                  <Th>Estudiante</Th>
                  <Th>Vacante</Th>
                  <Th>Empresa</Th>
                  <Th textAlign="center">Estado</Th>
                </Tr>
              </Thead>

              <Tbody>
                {computed.filtered.map((x, idx) => (
                  <Tr
                    key={x.id ?? idx}
                    cursor="pointer"
                    _hover={{ bg: rowHoverBg }}
                    bg={idx % 2 === 0 ? rowBgEven : rowBgOdd}
                    transition="background 0.15s ease"
                    onClick={() => {
                      setSelected(x.raw);
                      detail.onOpen();
                    }}
                  >
                    <Td fontWeight="semibold">{x.student}</Td>
                    <Td>{x.vacancy}</Td>
                    <Td>{x.company}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={x.status.scheme} px={2} py={1} borderRadius="md">
                        {x.status.label}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        <Box px={4} py={3} borderTopWidth="1px" borderColor={cardBorder}>
          <Text fontSize="sm" color={subtleText}>
            Mostrando {computed.filtered.length} de {computed.counts.total}.
          </Text>
        </Box>
      </Box>

      <AssignmentDetailDrawer
        isOpen={detail.isOpen}
        onClose={detail.onClose}
        assignment={selected}
      />
    </Box>
  );
}
