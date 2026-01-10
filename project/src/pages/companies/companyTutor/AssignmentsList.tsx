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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

import { applicationsApi } from "../../../api/applications.api";
import StudentDetailsModal from "./StudentDetailsModal";

import { ApplicationDTO, ApplicationStatus } from "../../../types/ApplicationDTO";

interface VacancyGroup {
  vacancyId: string;
  vacancyTitle: string;
  students: ApplicationDTO[];
}

// ====== Helpers de estado ======
function normalizeStatus(status: ApplicationStatus | string) {
  const s = String(status ?? "").toUpperCase();

  if (s === "ASSIGNED") return { label: "PENDIENTE", scheme: "yellow" as const };
  if (s === "APPROVED_BY_COMPANY") return { label: "APROBADA", scheme: "green" as const };
  if (s === "REJECTED_BY_COMPANY") return { label: "RECHAZADA", scheme: "red" as const };
  if (s === "FINISHED") return { label: "FINALIZADA", scheme: "blue" as const };
  if (s === "GRADED") return { label: "CALIFICADA", scheme: "purple" as const };

  return { label: s || "DESCONOCIDO", scheme: "gray" as const };
}

export default function AssignmentsList() {
  const [vacancies, setVacancies] = useState<VacancyGroup[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDTO | null>(null);
  const modal = useDisclosure();

  // ===== Modal finalizar =====
  const finishModal = useDisclosure();
  const [finishTarget, setFinishTarget] = useState<ApplicationDTO | null>(null);
  const [finishFeedback, setFinishFeedback] = useState("");
  const [finishing, setFinishing] = useState(false);

  const toast = useToast();

  // ================================
  // CARGAR Y AGRUPAR
  // ================================
  const load = async () => {
    const list: ApplicationDTO[] = await applicationsApi.listForCompanyTutor();

    const map = new Map<string, VacancyGroup>();

    list.forEach((a) => {
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
  // ACCIONES
  // ================================
  const approve = async (id: string) => {
    await applicationsApi.approve(id);
    await load();
  };

  const reject = async (id: string) => {
    await applicationsApi.reject(id);
    await load();
  };

  const openFinish = (app: ApplicationDTO) => {
    setFinishTarget(app);
    setFinishFeedback("");
    finishModal.onOpen();
  };

  const finalize = async () => {
    if (!finishTarget) return;

    setFinishing(true);
    try {
      await applicationsApi.finish(finishTarget.id, finishFeedback);

      toast({ status: "success", title: "Pasantía marcada como FINALIZADA" });

      finishModal.onClose();
      setFinishTarget(null);
      setFinishFeedback("");
      await load();
    } catch (e: any) {
      toast({
        status: "error",
        title: "No se pudo finalizar",
        description: e?.response?.data?.message ?? "Revisa permisos/estado.",
      });
    } finally {
      setFinishing(false);
    }
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
            <CardHeader>
              <Heading size="md">{vac.vacancyTitle}</Heading>
              <Text color="gray.500" fontSize="sm">
                Total de postulantes: {vac.students.length}
              </Text>
            </CardHeader>

            <Divider />

            <CardBody>
              {vac.students.map((app) => {
                const st = normalizeStatus(app.status);

                const canApproveReject = app.status === "ASSIGNED";
                const canFinish = app.status === "APPROVED_BY_COMPANY";
                const isFinished = app.status === "FINISHED";
                const isGraded = app.status === "GRADED" || app.finalGrade != null;

                return (
                  <Flex
                    key={app.id}
                    justify="space-between"
                    align="center"
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "gray.50" }}
                    gap={4}
                    flexWrap="wrap"
                  >
                    {/* IZQUIERDA */}
                    <HStack spacing={4} minW={{ base: "full", md: "420px" }}>
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

                        {/* Nota (solo si está calificada) */}
                        {isGraded && (
                          <Text fontSize="sm" color="gray.700" mt={1}>
                            Nota final: <b>{Number(app.finalGrade ?? 0).toFixed(2)}</b>
                          </Text>
                        )}
                      </Box>
                    </HStack>

                    {/* ESTADO */}
                    <Badge colorScheme={st.scheme} borderRadius="full" px={3}>
                      {st.label}
                    </Badge>

                    {/* ACCIONES */}
                    <HStack spacing={2}>
                      {canApproveReject && (
                        <>
                          <Button size="sm" colorScheme="green" onClick={() => approve(app.id)}>
                            Aprobar
                          </Button>

                          <Button size="sm" colorScheme="red" onClick={() => reject(app.id)}>
                            Rechazar
                          </Button>
                        </>
                      )}

                      {canFinish && (
                        <Button size="sm" colorScheme="blue" onClick={() => openFinish(app)}>
                          Finalizar
                        </Button>
                      )}

                      {/* Si ya está finalizada o calificada, no mostramos botones (solo info) */}
                      {(isFinished || isGraded) && (
                        <Text fontSize="sm" color="gray.500">
                          —
                        </Text>
                      )}

                      <IconButton
                        aria-label="info"
                        icon={<FaInfoCircle />}
                        onClick={() => openDetails(app)}
                        variant="ghost"
                      />
                    </HStack>
                  </Flex>
                );
              })}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* MODAL DETALLE */}
      <StudentDetailsModal
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        application={selectedApplication}
      />

      {/* MODAL FINALIZAR */}
      <Modal isOpen={finishModal.isOpen} onClose={finishModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Finalizar pasantía</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Feedback de cierre (opcional)</FormLabel>
              <Textarea
                placeholder="Observación del tutor de empresa al finalizar..."
                value={finishFeedback}
                onChange={(e) => setFinishFeedback(e.target.value)}
              />
            </FormControl>

            <Text mt={3} fontSize="sm" color="gray.600">
              Esto marcará la pasantía como <b>FINALIZADA</b>. Luego el tutor escolar podrá calificar.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={finishModal.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={finalize} isLoading={finishing}>
              Finalizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
