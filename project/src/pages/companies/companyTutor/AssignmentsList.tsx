// src/pages/companies/companyTutor/AssignmentsList.tsx

import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  Badge,
  Flex,
  HStack,
  Avatar,
  SimpleGrid,
  IconButton,
  Divider,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

import { applicationsApi } from "../../../api/applications.api";
import StudentDetailsModal from "./StudentDetailsModal";

import { ApplicationDTO } from "../../../types/ApplicationDTO";

interface VacancyGroup {
  vacancyId: string;
  vacancyTitle: string;
  students: ApplicationDTO[];
}

export default function AssignmentsList() {
  const [vacancies, setVacancies] = useState<VacancyGroup[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationDTO | null>(null);

  const modal = useDisclosure();

  // ================================
  // CARGAR Y AGRUPAR
  // ================================
  const load = async () => {
    const list: ApplicationDTO[] = await applicationsApi.listForCompanyTutor();

    const map = new Map<string, VacancyGroup>();

    list.forEach((a: ApplicationDTO) => {
      if (!map.has(a.vacancyId)) {
        map.set(a.vacancyId, {
          vacancyId: a.vacancyId,
          vacancyTitle: a.vacancyTitle,
          students: [],
        });
      }
      map.get(a.vacancyId)!.students.push(a);
    });

    setVacancies(Array.from(map.values()));
  };

  useEffect(() => {
    load();
  }, []);

  const openDetails = (application: ApplicationDTO) => {
    setSelectedApplication(application);
    modal.onOpen();
  };

  // ================================
  // ACCIONES (USANDO ENDPOINTS REALES)
  // ================================
  const approve = async (id: string) => {
    await applicationsApi.approve(id);
    load();
  };

  const reject = async (id: string) => {
    await applicationsApi.reject(id);
    load();
  };

  // SOLO FUNCIONA SI CREAS EL ENDPOINT EN EL BACKEND
  const finalize = async (id: string) => {
    // await applicationsApi.finalize(id);
    load();
  };

  // ================================
  // RENDER
  // ================================
  return (
    <Box p={6}>
      <Heading mb={6}>Solicitudes Recibidas</Heading>

      <SimpleGrid columns={{ base: 1 }} spacing={6}>
        {vacancies.map((vac) => (
          <Card
            key={vac.vacancyId}
            borderRadius="2xl"
            boxShadow="md"
            p={4}
            _hover={{ boxShadow: "xl", transition: ".2s" }}
          >
            {/* HEADER */}
            <CardHeader>
              <Heading size="md">{vac.vacancyTitle}</Heading>
              <Text color="gray.500" fontSize="sm">
                Total de postulantes: {vac.students.length}
              </Text>
            </CardHeader>

            <Divider />

            {/* LISTA DE ESTUDIANTES */}
            <CardBody>
              {vac.students.map((app) => (
                <Flex
                  key={app.id}
                  justify="space-between"
                  align="center"
                  p={3}
                  borderRadius="md"
                  _hover={{ bg: "gray.50" }}
                >
                  {/* IZQUIERDA */}
                  <HStack spacing={4}>
                    <Avatar name={app.studentFullName} />

                    <Box>
                      <Text fontWeight="medium">{app.studentFullName}</Text>

                      <Text fontSize="sm" color="gray.600">
                        Tutor escolar: {app.schoolTutorName}
                      </Text>

                      <Text fontSize="sm" color="gray.600">
                      Inicio: {app.vacancyStartDate ?? "—"}
                      </Text>

                  <Text fontSize="sm" color="gray.600">
                   Fin: {app.vacancyEndDate ?? "—"}
                  </Text>

                    </Box>
                  </HStack>

                  {/* ESTADO */}
                  <Badge
                    colorScheme={
                      app.status === 1
                        ? "yellow"
                        : app.status === 2
                        ? "green"
                        : "red"
                    }
                    borderRadius="full"
                    px={3}
                  >
                    {app.status === 1
                      ? "PENDIENTE"
                      : app.status === 2
                      ? "APROBADA"
                      : "RECHAZADA"}
                  </Badge>

                  {/* ACCIONES */}
                  <HStack spacing={2}>
                    {app.status === 1 && (
                      <>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => approve(app.id)}
                        >
                          Aprobar
                        </Button>

                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => reject(app.id)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}

                 

                    <IconButton
                      aria-label="info"
                      icon={<FaInfoCircle />}
                      onClick={() => openDetails(app)}
                      variant="ghost"
                    />
                  </HStack>
                </Flex>
              ))}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* MODAL */}
      <StudentDetailsModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        application={selectedApplication}
      />
    </Box>
  );
}
