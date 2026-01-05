import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Text,
  Badge,
  Stack,
  Divider,
  Flex,
  Box,
  HStack,
  useColorModeValue,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { vacanciesApi } from "../../api/vacancies.api"; // ajusta ruta si tu estructura cambia

function formatDate(value: any) {
  if (!value) return "—";

  // LocalDate desde backend suele venir "YYYY-MM-DD"
  // New Date("2026-01-05") funciona, pero puede variar por timezone.
  // Por eso: formateo manual si viene string
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
    return new Intl.DateTimeFormat("es-EC", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(dt);
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function normalizeStatus(status: any) {
  const n = Number(status);
  if (n === 1) return { label: "PENDIENTE", scheme: "yellow" as const };
  if (n === 2) return { label: "ACEPTADA", scheme: "green" as const };
  if (n === 3) return { label: "RECHAZADA", scheme: "red" as const };
  return { label: "DESCONOCIDO", scheme: "gray" as const };
}

export default function AssignmentDetailDrawer({
  isOpen,
  onClose,
  assignment,
}: {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
}) {
  // Chakra hooks arriba (sin condicionales)
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.300");

  const [vacancy, setVacancy] = useState<any>(null);
  const [loadingVacancy, setLoadingVacancy] = useState(false);

  const status = useMemo(() => normalizeStatus(assignment?.status), [assignment?.status]);
  const vacancyId = useMemo(() => assignment?.vacancyId ?? null, [assignment?.vacancyId]);

  // 🔥 Cargar detalles de vacante al abrir
  useEffect(() => {
    const run = async () => {
      if (!isOpen) return;

      // Reset para que no muestre datos viejos cuando cambias de fila
      setVacancy(null);

      if (!vacancyId) return;

      setLoadingVacancy(true);
      try {
        const v = await vacanciesApi.get(String(vacancyId));
        setVacancy(v);
      } catch {
        setVacancy(null);
      } finally {
        setLoadingVacancy(false);
      }
    };

    run();
  }, [isOpen, vacancyId]);

  // ✅ Datos base: siempre existen en ApplicationDTO
  const title = assignment?.vacancyTitle ?? "—";
  const companyName = assignment?.companyName ?? "—";
  const studentName = assignment?.studentFullName ?? "—";

  // ✅ Periodo de pasantía: viene en ApplicationDTO (NO appliedAt)
  const startDate = assignment?.vacancyStartDate ?? null;
  const endDate = assignment?.vacancyEndDate ?? null;

  // ✅ Detalles: se completan desde GET /vacancies/{id}
  const specialtyName = vacancy?.specialtyName ?? "—";
  const capacity = vacancy?.capacity ?? "—";
  const description = vacancy?.description ?? "—";

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent borderLeftWidth="1px" borderColor={border}>
        <DrawerHeader px={5} py={4}>
          <Flex justify="space-between" align="start" gap={3}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" lineHeight="1.2">
                {title}
              </Text>
              <Text mt={1} fontSize="sm" color={subtleText}>
                {companyName} · {specialtyName}
              </Text>
            </Box>

            <Flex align="center" gap={2}>
              <Badge
                colorScheme={status.scheme}
                variant="subtle"
                px={3}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                {status.label}
              </Badge>

              <IconButton
                aria-label="Cerrar"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={onClose}
              />
            </Flex>
          </Flex>
        </DrawerHeader>

        <Divider />

        <DrawerBody px={5} py={4}>
          {!assignment ? (
            <Text color={subtleText}>Selecciona una asignación para ver el detalle.</Text>
          ) : loadingVacancy ? (
            <Center py={10}>
              <Spinner />
            </Center>
          ) : (
            <Stack spacing={4}>
              {/* Cards resumen */}
              <HStack spacing={3} align="stretch" flexWrap="wrap">
                <Box
                  flex="1"
                  minW="160px"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={border}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="xs" color={subtleText} fontWeight="semibold">
                    ESTUDIANTE
                  </Text>
                  <Text mt={1} fontSize="md" fontWeight="bold">
                    {studentName}
                  </Text>
                  <Text mt={1} fontSize="sm" color={subtleText}>
                    {assignment?.studentEmail ?? "—"}
                  </Text>
                </Box>

                <Box
                  flex="1"
                  minW="160px"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={border}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="xs" color={subtleText} fontWeight="semibold">
                    CUPOS (VACANTE)
                  </Text>
                  <Text mt={1} fontSize="2xl" fontWeight="bold">
                    {capacity}
                  </Text>
                  <Text mt={1} fontSize="sm" color={subtleText}>
                    Especialidad: {specialtyName}
                  </Text>
                </Box>
              </HStack>

              {/* Periodo de pasantía */}
              <Box
                bg={cardBg}
                borderWidth="1px"
                borderColor={border}
                borderRadius="lg"
                p={4}
              >
                <Text fontSize="xs" color={subtleText} fontWeight="semibold">
                  PERIODO DE PASANTÍA
                </Text>
                <Text mt={1} fontSize="md" fontWeight="semibold">
                  {formatDate(startDate)} – {formatDate(endDate)}
                </Text>
              </Box>

              {/* Descripción */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Descripción
                </Text>
                <Box bg={cardBg} borderWidth="1px" borderColor={border} borderRadius="lg" p={4}>
                  <Text fontSize="sm" color={subtleText} whiteSpace="pre-wrap">
                    {description}
                  </Text>
                </Box>
              </Box>

             

              {/* Notas (si existen) */}
              {assignment?.notes && (
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Notas
                  </Text>
                  <Box bg={cardBg} borderWidth="1px" borderColor={border} borderRadius="lg" p={4}>
                    <Text fontSize="sm" color={subtleText} whiteSpace="pre-wrap">
                      {assignment.notes}
                    </Text>
                  </Box>
                </Box>
              )}
            </Stack>
          )}
        </DrawerBody>

        <Divider />

        <DrawerFooter px={5} py={4}>
          <Flex w="full" justify="flex-end" gap={2}>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
