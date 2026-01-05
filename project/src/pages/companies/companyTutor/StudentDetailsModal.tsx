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

export default function StudentDetailsModal({
  isOpen,
  onClose,
  application,
}: any) {
  if (!application) return null;

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

              <Badge
                px={3}
                py={1}
                borderRadius="full"
                colorScheme={
                  application.status === 1
                    ? "yellow"
                    : application.status === 2
                    ? "green"
                    : "red"
                }
              >
                {application.status === 1
                  ? "PENDIENTE"
                  : application.status === 2
                  ? "APROBADA"
                  : "RECHAZADA"}
              </Badge>
            </Box>
          </HStack>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold">Vacante:</Text>
              <Text>{application.vacancyTitle}</Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Tutor Escolar:</Text>
              <Text>{application.schoolTutorName}</Text>
            </Box>

            {/* DATOS QUE EXISTEN EN EL BACKEND */}
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
              <Text>{application.appliedAt?.split("T")[0]}</Text>
            </Box>

            {application.notes && (
              <Box>
                <Text fontWeight="bold">Notas de la escuela:</Text>
                <Text>{application.notes}</Text>
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
