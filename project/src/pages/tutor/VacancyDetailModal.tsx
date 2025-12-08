import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Badge,
} from "@chakra-ui/react";

export default function VacancyDetailModal({ isOpen, onClose, vacancy }: any) {
  if (!vacancy) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{vacancy.title}</ModalHeader>

        <ModalBody>
          <Text><b>Empresa:</b> {vacancy.companyName}</Text>
          <Text mt={2}><b>Estado:</b> {vacancy.status}</Text>
          <Text mt={2}><b>Cupos:</b> {vacancy.capacity}</Text>

          <Text mt={4}><b>Requisitos:</b></Text>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(vacancy.requirements, null, 2)}
          </pre>

          <Text mt={4}><b>Descripción:</b></Text>
          <Text>{vacancy.description}</Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
