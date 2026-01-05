// src/pages/company/CompanyTutorDashboard.tsx

import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  Flex,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { FaInfoCircle, FaBriefcase, FaUsers } from "react-icons/fa";
import InfoModal from "./InfoModal";

export default function CompanyTutorDashboard() {
  const infoModal = useDisclosure();

  return (
    <Box p={6}>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Panel del Tutor Empresarial</Heading>

        <Button
          leftIcon={<FaInfoCircle />}
          variant="outline"
          colorScheme="blue"
          onClick={infoModal.onOpen}
        >
          Información
        </Button>
      </Flex>

      {/* CARDS */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        
        {/* VACANTES */}
        <Card
          borderRadius="2xl"
          boxShadow="md"
          p={4}
          _hover={{ boxShadow: "xl", transform: "translateY(-3px)", transition: ".2s" }}
        >
          <CardHeader>
            <Flex align="center" gap={3}>
              <Icon as={FaBriefcase} boxSize={6} color="blue.500" />
              <Heading size="md">Gestión de Vacantes</Heading>
            </Flex>
          </CardHeader>

          <CardBody>
            <Text mb={4} color="gray.600">
              Administra las vacantes de tu empresa: crear, editar,
              cerrar o eliminar vacantes activas.
            </Text>

            <Button as={Link} to="vacancies" colorScheme="blue">
              Ver Vacantes
            </Button>
          </CardBody>
        </Card>

        {/* SOLICITUDES */}
        <Card
          borderRadius="2xl"
          boxShadow="md"
          p={4}
          _hover={{ boxShadow: "xl", transform: "translateY(-3px)", transition: ".2s" }}
        >
          <CardHeader>
            <Flex align="center" gap={3}>
              <Icon as={FaUsers} boxSize={6} color="green.500" />
              <Heading size="md">Postulaciones Recibidas</Heading>
            </Flex>
          </CardHeader>

          <CardBody>
            <Text mb={4} color="gray.600">
              Recibe solicitudes de estudiantes y decide si aprobarlas
              o rechazarlas, con acceso a información detallada.
            </Text>

            <Button as={Link} to="assignments" colorScheme="green">
              Ver Solicitudes
            </Button>
          </CardBody>
        </Card>

      </SimpleGrid>

      {/* MODAL DE INFORMACIÓN */}
      <InfoModal isOpen={infoModal.isOpen} onClose={infoModal.onClose} />
    </Box>
  );
}
