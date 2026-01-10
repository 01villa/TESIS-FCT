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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { RepeatIcon, SearchIcon } from "@chakra-ui/icons";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AssignmentDetailDrawer from "./AssignmentDetailDrawer";

// ====== Status enum (string) ======
type AppStatus =
  | "ASSIGNED"
  | "APPROVED_BY_COMPANY"
  | "REJECTED_BY_COMPANY"
  | "FINISHED"
  | "GRADED"
  | string;

function normalizeStatus(status: any) {
  const s = String(status ?? "").toUpperCase();

  if (s === "ASSIGNED") return { label: "ASIGNADA", scheme: "yellow" as const };
  if (s === "APPROVED_BY_COMPANY") return { label: "ACEPTADA", scheme: "green" as const };
  if (s === "REJECTED_BY_COMPANY") return { label: "RECHAZADA", scheme: "red" as const };
  if (s === "FINISHED") return { label: "FINALIZADA", scheme: "blue" as const };
  if (s === "GRADED") return { label: "CALIFICADA", scheme: "purple" as const };

  return { label: s ? s : "DESCONOCIDO", scheme: "gray" as const };
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
  const [filterStatus, setFilterStatus] = useState<"all" | AppStatus>("all");

  const [selected, setSelected] = useState<any>(null);
  const detail = useDisclosure();

  // ====== Modal calificación ======
  const gradeModal = useDisclosure();
  const [grading, setGrading] = useState(false);
  const [gradeTarget, setGradeTarget] = useState<any>(null);
  const [finalGrade, setFinalGrade] = useState<string>(""); // string para NumberInput
  const [finalFeedback, setFinalFeedback] = useState<string>("");

  const toast = useToast();

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
        statusRaw: String(a?.status ?? ""),
        finalGrade: a?.finalGrade ?? null,
        finalFeedback: a?.finalFeedback ?? null,
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
      assigned: items.filter((x) => String(x.raw?.status) === "ASSIGNED").length,
      approved: items.filter((x) => String(x.raw?.status) === "APPROVED_BY_COMPANY").length,
      rejected: items.filter((x) => String(x.raw?.status) === "REJECTED_BY_COMPANY").length,
      finished: items.filter((x) => String(x.raw?.status) === "FINISHED").length,
      graded: items.filter((x) => String(x.raw?.status) === "GRADED" || x.finalGrade != null).length,
    };

    return { filtered, counts };
  }, [assignments, search, filterStatus]);

  const openGrade = (app: any) => {
    setGradeTarget(app);
    setFinalGrade(app?.finalGrade != null ? String(app.finalGrade) : "");
    setFinalFeedback(app?.finalFeedback ?? "");
    gradeModal.onOpen();
  };

  const submitGrade = async () => {
    if (!gradeTarget?.id) return;

    const g = Number(finalGrade);
    if (!Number.isFinite(g)) {
      toast({ status: "error", title: "Nota inválida", description: "Ingresa un número válido." });
      return;
    }
    if (g < 0 || g > 10) {
      toast({ status: "error", title: "Rango inválido", description: "La nota debe estar entre 0 y 10." });
      return;
    }

    setGrading(true);
    try {
      await axios.patch(`/applications/${gradeTarget.id}/grade`, {
        finalGrade: g,
        finalFeedback: finalFeedback?.trim() ? finalFeedback.trim() : null,
      });

      toast({ status: "success", title: "Calificación guardada" });
      gradeModal.onClose();
      setGradeTarget(null);
      setFinalGrade("");
      setFinalFeedback("");
      await loadAssignments({ silent: true });
    } catch (e: any) {
      toast({
        status: "error",
        title: "No se pudo calificar",
        description: e?.response?.data?.message ?? "Revisa permisos/estado de la asignación.",
      });
    } finally {
      setGrading(false);
    }
  };

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
            Clic en una fila para ver el detalle. Para calificar, usa el botón “Calificar” cuando esté FINALIZADA.
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
              w={{ base: "full", md: "260px" }}
              bg={cardBg}
            >
              <option value="all">Todos los estados</option>
              <option value="ASSIGNED">Asignada</option>
              <option value="APPROVED_BY_COMPANY">Aceptada</option>
              <option value="REJECTED_BY_COMPANY">Rechazada</option>
              <option value="FINISHED">Finalizada</option>
              <option value="GRADED">Calificada</option>
            </Select>
          </HStack>

          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme="yellow" variant="subtle" px={2} py={1} borderRadius="md">
              Asignadas: {computed.counts.assigned}
            </Badge>
            <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="md">
              Aceptadas: {computed.counts.approved}
            </Badge>
            <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="md">
              Finalizadas: {computed.counts.finished}
            </Badge>
            <Badge colorScheme="purple" variant="subtle" px={2} py={1} borderRadius="md">
              Calificadas: {computed.counts.graded}
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
                  <Th textAlign="center">Nota</Th>
                  <Th textAlign="center">Acciones</Th>
                </Tr>
              </Thead>

              <Tbody>
                {computed.filtered.map((x, idx) => {
                  const statusRaw = String(x.raw?.status ?? "");
                  const hasGrade = x.raw?.finalGrade != null;
                  const canGrade = statusRaw === "FINISHED" && !hasGrade;

                  return (
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

                      <Td textAlign="center">
                        {hasGrade ? (
                          <Badge colorScheme="purple" variant="subtle" px={2} py={1} borderRadius="md">
                            {Number(x.raw.finalGrade).toFixed(2)}
                          </Badge>
                        ) : (
                          <Text fontSize="sm" color={subtleText}>
                            —
                          </Text>
                        )}
                      </Td>

                      <Td textAlign="center" onClick={(e) => e.stopPropagation()}>
                        {canGrade ? (
                          <Button
                            size="sm"
                            colorScheme="purple"
                            onClick={() => openGrade(x.raw)}
                          >
                            Calificar
                          </Button>
                        ) : (
                          <Text fontSize="sm" color={subtleText}>
                            —
                          </Text>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
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

      {/* ===== Modal de Calificación ===== */}
      <Modal isOpen={gradeModal.isOpen} onClose={gradeModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Calificar pasantía</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Nota (0 - 10)</FormLabel>
              <NumberInput value={finalGrade} onChange={(v) => setFinalGrade(v)} min={0} max={10} precision={2}>
                <NumberInputField placeholder="Ej: 9.50" />
              </NumberInput>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Feedback (opcional)</FormLabel>
              <Textarea
                placeholder="Observación final del tutor escolar..."
                value={finalFeedback}
                onChange={(e) => setFinalFeedback(e.target.value)}
              />
            </FormControl>

            <Text mt={3} fontSize="sm" color={subtleText}>
              Solo puedes calificar cuando la empresa marque la pasantía como <b>FINALIZADA</b>.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={gradeModal.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="purple" onClick={submitGrade} isLoading={grading}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
