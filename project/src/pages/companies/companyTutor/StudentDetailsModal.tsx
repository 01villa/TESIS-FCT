import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Avatar,
  VStack,
  HStack,
  Badge,
  Box,
} from "@chakra-ui/react";

function normalizeStatus(status: any) {
  const s = String(status ?? "").toUpperCase();

  if (s === "ASSIGNED") return { label: "PENDIENTE", scheme: "yellow" as const };
  if (s === "APPROVED_BY_COMPANY") return { label: "APROBADA", scheme: "green" as const };
  if (s === "REJECTED_BY_COMPANY") return { label: "RECHAZADA", scheme: "red" as const };
  if (s === "FINISHED") return { label: "FINALIZADA", scheme: "blue" as const };
  if (s === "GRADED") return { label: "CALIFICADA", scheme: "purple" as const };

  return { label: s ? s : "DESCONOCIDO", scheme: "gray" as const };
}

function formatIsoDate(value?: string | null) {
  if (!value) return "—";
  // si viene "2026-01-09T10:20:30"
  return String(value).split("T")[0] ?? "—";
}

export default function StudentDetailsModal({ isOpen, onClose, application }: any) {
  if (!application) return null;

  const st = normalizeStatus(application.status);

  const finalGrade = application.finalGrade ?? null;
  const finalFeedback = application.finalFeedback ?? null;
  const finishedAt = application.finishedAt ?? null;
  const gradedAt = application.gradedAt ?? null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />

      <ModalContent borderRadius="2xl" p={3}>
        <ModalHeader>
          <HStack spacing={3}>
            <Avatar name={application.studentFullName} size="lg" />
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                {application.studentFullName}
              </Text>

              <Badge px={3} py={1} borderRadius="full" colorScheme={st.scheme}>
                {st.label}
              </Badge>

              {/* Nota rápida si ya está calificada */}
              {finalGrade != null && (
                <Text mt={1} fontSize="sm" color="gray.600">
                  Nota final: <b>{Number(finalGrade).toFixed(2)}</b>
                </Text>
              )}
            </Box>
          </HStack>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold">Vacante:</Text>
              <Text>{application.vacancyTitle ?? "—"}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Tutor Escolar:</Text>
              <Text>{application.schoolTutorName ?? "—"}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Cédula:</Text>
              <Text>{application.studentCi ?? "No disponible"}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Teléfono:</Text>
              <Text>{application.studentPhone ?? "No disponible"}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Correo:</Text>
              <Text>{application.studentEmail ?? "No disponible"}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Fecha de aplicación:</Text>
              <Text>{formatIsoDate(application.appliedAt)}</Text>
            </Box>

            {/* Fechas nuevas */}
            {(finishedAt || gradedAt) && (
              <Box>
                <Text fontWeight="bold">Cierre / Calificación:</Text>
                <Text>Finalizada: {formatIsoDate(finishedAt)}</Text>
                <Text>Calificada: {formatIsoDate(gradedAt)}</Text>
              </Box>
            )}

            {/* Notas generales */}
            {application.notes && (
              <Box>
                <Text fontWeight="bold">Notas:</Text>
                <Text whiteSpace="pre-wrap">{application.notes}</Text>
              </Box>
            )}

            {/* Feedback final */}
            {finalFeedback && (
              <Box>
                <Text fontWeight="bold">Feedback final:</Text>
                <Text whiteSpace="pre-wrap">{finalFeedback}</Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
