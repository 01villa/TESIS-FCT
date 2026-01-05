import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Stack,
  Badge,
  Divider,
} from "@chakra-ui/react";

export default function StudentDetailModal({ isOpen, onClose, student }: any) {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Información del Estudiante</ModalHeader>

        <ModalBody>
          <Stack spacing={3}>
            <Text>
              <strong>Nombre: </strong> {student.fullName}
            </Text>

            <Text>
              <strong>Especialidad: </strong> {student.specialtyName ?? "—"}
            </Text>

            <Divider />

            <Text>
              <strong>Cédula: </strong> {student.ci}
            </Text>

            <Text>
              <strong>Teléfono: </strong> {student.phone || "—"}
            </Text>

            <Text>
              <strong>Email: </strong> {student.email ?? "—"}
            </Text>

            <Text>
              <strong>Estado: </strong>{" "}
              {!student.deletedAt ? (
                <Badge colorScheme="green">Activo</Badge>
              ) : (
                <Badge colorScheme="red">Eliminado</Badge>
              )}
            </Text>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
