import {
  Box,
  Heading,
  Button,
  Select,
  Spinner,
  Center,
  FormControl,
  FormLabel,
  useToast,
  Text,
  Flex,
  HStack,
  IconButton,
  Divider,
  Stack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import { schoolStudentsApi } from "../../api/school.students.api";
import { vacanciesApi } from "../../api/vacancies.api";
import { applicationsApi } from "../../api/applications.api";

function formatDate(value: any) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export default function TutorAssign() {
  const toast = useToast();
  const { user } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);

  const [studentId, setStudentId] = useState("");
  const [vacancyId, setVacancyId] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // estilos
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const headBg = useColorModeValue("gray.50", "gray.800");
  const subtleText = useColorModeValue("gray.600", "gray.300");
  const softBg = useColorModeValue("gray.50", "gray.800");

  // ---------------------------------------------------------
  // LOAD DATA (students de la escuela + vacantes globales)
  // ---------------------------------------------------------
  const loadData = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;

    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      // 1️⃣ Estudiantes de MI ESCUELA
      const studs = await schoolStudentsApi.listBySchool(user.schoolId);

      // 2️⃣ Vacantes globales
      const vacs = await vacanciesApi.list();

      // ✅ SOLO VACANTES ASIGNABLES (según tu DTO)
      // active === true && status === 1 && capacity > 0
      const available = (vacs ?? []).filter(
        (v: any) =>
          v?.active === true &&
          Number(v?.status) === 1 &&
          Number(v?.capacity) > 0
      );

      // (Opcional) orden por empresa y título
      available.sort((a: any, b: any) => {
        const ac = (a.companyName ?? "").toString().toLowerCase();
        const bc = (b.companyName ?? "").toString().toLowerCase();
        if (ac !== bc) return ac.localeCompare(bc);
        const at = (a.title ?? "").toString().toLowerCase();
        const bt = (b.title ?? "").toString().toLowerCase();
        return at.localeCompare(bt);
      });

      setStudents(studs ?? []);
      setVacancies(available);

      // si la vacante seleccionada ya no existe / cambió, limpia
      if (vacancyId && !available.some((v: any) => String(v.id) === String(vacancyId))) {
        setVacancyId("");
      }
    } catch (e: any) {
      toast({
        title: "Error cargando datos",
        description: e?.message ?? "Intenta nuevamente.",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.schoolId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.schoolId]);

  // ---------------------------------------------------------
  // Selected previews
  // ---------------------------------------------------------
  const selectedStudent = useMemo(
    () => students.find((s) => String(s.id) === String(studentId)),
    [students, studentId]
  );

  const selectedVacancy = useMemo(
    () => vacancies.find((v) => String(v.id) === String(vacancyId)),
    [vacancies, vacancyId]
  );

  const canAssign = Boolean(studentId && vacancyId) && !submitting;

  // ---------------------------------------------------------
  // ASSIGN
  // ---------------------------------------------------------
  const assign = async () => {
    if (!studentId || !vacancyId) return;

    setSubmitting(true);
    try {
      // UX guard (backend igual debe validar)
      if (!selectedVacancy) {
        toast({
          title: "Selecciona una vacante válida",
          status: "warning",
          duration: 2500,
          isClosable: true,
        });
        return;
      }

      if (selectedVacancy.active !== true || Number(selectedVacancy.status) !== 1) {
        toast({
          title: "Vacante no disponible",
          description: "Esta vacante ya no está abierta/activa.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (Number(selectedVacancy.capacity) <= 0) {
        toast({
          title: "Sin cupos",
          description: "Esta vacante ya no tiene cupos disponibles.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await applicationsApi.assign({ studentId, vacancyId });

      toast({
        title: "Asignación creada",
        description: "El estudiante fue asignado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // limpiar selección
      setStudentId("");
      setVacancyId("");

      // refresca por si cupos cambian
      loadData({ silent: true });
    } catch (e: any) {
      toast({
        title: "No se pudo asignar",
        description: e?.message ?? "Verifica los datos e intenta nuevamente.",
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box>
      {/* HEADER */}
      <Flex mb={6} align="start" justify="space-between" gap={4} flexWrap="wrap">
        <Box>
          <Heading size="lg">Asignar estudiante a vacante</Heading>
          <Text mt={1} color={subtleText} fontSize="sm">
            Solo se muestran vacantes <b>activas</b>, <b>abiertas</b> y con <b>cupos</b>.
          </Text>
        </Box>

        <HStack spacing={2}>
          <IconButton
            aria-label="Actualizar"
            icon={<RepeatIcon />}
            isLoading={refreshing}
            onClick={() => loadData({ silent: true })}
            variant="outline"
          />
        </HStack>
      </Flex>

      {/* CARD */}
      <Box
        maxW="820px"
        bg={cardBg}
        borderWidth="1px"
        borderColor={cardBorder}
        borderRadius="xl"
        overflow="hidden"
        boxShadow={useColorModeValue("sm", "none")}
      >
        <Box px={5} py={4} bg={headBg} borderBottomWidth="1px" borderColor={cardBorder}>
          <Text fontSize="sm" color={subtleText}>
            {students.length} estudiantes · {vacancies.length} vacantes asignables
          </Text>
        </Box>

        <Box p={5}>
          <Stack spacing={5}>
            {/* Estudiante */}
            <FormControl>
              <FormLabel>Estudiante</FormLabel>
              <Select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Seleccione…"
                bg={cardBg}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} {s.email ? `— ${s.email}` : ""}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Vacante */}
            <FormControl>
              <FormLabel>Vacante</FormLabel>
              <Select
                value={vacancyId}
                onChange={(e) => setVacancyId(e.target.value)}
                placeholder="Seleccione…"
                bg={cardBg}
              >
                {vacancies.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} — {v.companyName} ({v.specialtyName})
                  </option>
                ))}
              </Select>

              <Text mt={2} fontSize="sm" color={subtleText}>
                Si no aparece una vacante, es porque está cerrada, inactiva o sin cupos.
              </Text>
            </FormControl>

            {/* PREVIEW VACANTE */}
            {selectedVacancy && (
              <Box
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={cardBorder}
                bg={softBg}
              >
                <Flex justify="space-between" align="center" mb={2} gap={3} flexWrap="wrap">
                  <Text fontWeight="bold" fontSize="md">
                    {selectedVacancy.title ?? "—"}
                  </Text>

                  <HStack spacing={2}>
                    <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="md">
                      ABIERTA
                    </Badge>
                    <Badge colorScheme="purple" variant="subtle" px={2} py={1} borderRadius="md">
                      {selectedVacancy.specialtyName ?? "—"}
                    </Badge>
                  </HStack>
                </Flex>

                <Stack spacing={1} fontSize="sm">
                  <Text>
                    <b>Empresa:</b> {selectedVacancy.companyName ?? "—"}
                  </Text>
                  <Text>
                    <b>Cupos disponibles:</b> {selectedVacancy.capacity ?? "—"}
                  </Text>
                  <Text>
                    <b>Periodo:</b> {formatDate(selectedVacancy.startDate)} →{" "}
                    {formatDate(selectedVacancy.endDate)}
                  </Text>
                </Stack>

                {(selectedVacancy.description || selectedVacancy.requirements) && (
                  <>
                    <Divider my={3} />
                    {selectedVacancy.description && (
                      <Box mb={3}>
                        <Text fontWeight="bold" fontSize="sm" mb={1}>
                          Descripción
                        </Text>
                        <Text fontSize="sm" color={subtleText} whiteSpace="pre-wrap">
                          {selectedVacancy.description}
                        </Text>
                      </Box>
                    )}

                    {selectedVacancy.requirements && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={1}>
                          Requisitos
                        </Text>
                        <Text fontSize="sm" color={subtleText} whiteSpace="pre-wrap">
                          {selectedVacancy.requirements}
                        </Text>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            )}

            <Divider />

            {/* RESUMEN FINAL */}
            <Box
              bg={softBg}
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="lg"
              p={4}
            >
              <Text fontWeight="bold" mb={3}>
                Resumen
              </Text>

              <Stack spacing={2} fontSize="sm">
                <Flex justify="space-between" gap={3} flexWrap="wrap">
                  <Text color={subtleText}>Estudiante</Text>
                  <Text fontWeight="semibold">{selectedStudent?.fullName ?? "—"}</Text>
                </Flex>

                <Flex justify="space-between" gap={3} flexWrap="wrap">
                  <Text color={subtleText}>Vacante</Text>
                  <Text fontWeight="semibold">{selectedVacancy?.title ?? "—"}</Text>
                </Flex>

                <Flex justify="space-between" gap={3} flexWrap="wrap">
                  <Text color={subtleText}>Empresa</Text>
                  <Text fontWeight="semibold">{selectedVacancy?.companyName ?? "—"}</Text>
                </Flex>
              </Stack>
            </Box>

            {/* ACTIONS */}
            <Flex justify="flex-end" gap={2} flexWrap="wrap">
              <Button
                variant="outline"
                onClick={() => {
                  setStudentId("");
                  setVacancyId("");
                }}
              >
                Limpiar
              </Button>

              <Button
                colorScheme="blue"
                onClick={assign}
                isDisabled={!canAssign}
                isLoading={submitting}
                loadingText="Asignando…"
              >
                Asignar
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
