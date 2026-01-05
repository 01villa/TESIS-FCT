import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FaBriefcase,
  FaUserCheck,
  FaUserClock,
  FaInfoCircle,
} from "react-icons/fa";

export default function InfoModal({ isOpen, onClose }: any) {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent bg={bg} borderRadius="2xl" p={2}>
        <ModalHeader>
          <HStack>
            <Icon as={FaInfoCircle} color="blue.500" boxSize={6} />
            <Heading size="md">Información del Rol: Tutor Empresarial</Heading>
          </HStack>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Como tutor empresarial puedes realizar las siguientes acciones dentro de la plataforma:
          </Text>

          <VStack align="start" spacing={5}>

            {/* Crear Vacantes */}
            <HStack align="start" spacing={3}>
              <Icon as={FaBriefcase} color="blue.400" boxSize={6} />
              <Box>
                <Heading size="sm">Gestión de Vacantes</Heading>
                <Text fontSize="sm" color="gray.600">
                  Puedes crear, editar, archivar (cerrar) y eliminar vacantes de tu empresa.
                </Text>
              </Box>
            </HStack>

            {/* Estudiantes / Solicitudes */}
            <HStack align="start" spacing={3}>
              <Icon as={FaUserCheck} color="green.400" boxSize={6} />
              <Box>
                <Heading size="sm">Revisión de Solicitudes</Heading>
                <Text fontSize="sm" color="gray.600">
                  Revisa las solicitudes enviadas por estudiantes y decide si aprobarlas o rechazarlas.
                </Text>
              </Box>
            </HStack>

            {/* Seguimiento */}
            <HStack align="start" spacing={3}>
              <Icon as={FaUserClock} color="yellow.500" boxSize={6} />
              <Box>
                <Heading size="sm">Seguimiento de Practicantes</Heading>
                <Text fontSize="sm" color="gray.600">
                  Lleva un seguimiento de los estudiantes asignados a tu empresa.
                </Text>
              </Box>
            </HStack>

    

          </VStack>

          <Divider my={6} />

          <Text fontSize="sm" color="gray.500">
            Si necesitas más información o soporte, comunícate con el administrador del sistema.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} colorScheme="blue" borderRadius="xl">
            Entendido
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
