import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Avatar,
  HStack,
  VStack,
  Badge,
} from "@chakra-ui/react";

export default function AssignmentDetailsModal({ isOpen, onClose, data }: any) {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" p={3}>
        <ModalHeader>
          <HStack spacing={4}>
            <Avatar name={data.studentName} size="lg" />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {data.studentName}
              </Text>
              <Badge
                mt={1}
                px={2}
                py={1}
                borderRadius="full"
                colorScheme={
                  data.status === "APPROVED"
                    ? "green"
                    : data.status === "REJECTED"
                    ? "red"
                    : "yellow"
                }
              >
                {data.status}
              </Badge>
            </Box>
          </HStack>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack align="start" spacing={3}>
            <Text>
              <strong>Vacante:</strong> {data.vacancyTitle}
            </Text>

            <Text>
              <strong>Tutor Escolar:</strong> {data.schoolTutorName}
            </Text>

            <Text>
              <strong>Fecha de Aplicación:</strong>{" "}
              {data.createdAt?.split("T")[0] ?? "N/A"}
            </Text>

            {data.notes && (
              <Box>
                <Text fontWeight="bold">Notas:</Text>
                <Text color="gray.700">{data.notes}</Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} colorScheme="blue">
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
