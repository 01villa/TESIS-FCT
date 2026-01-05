import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";
import { specialtiesApi } from "../../../api/specialties.api";

type Specialty = {
  id: string;
  name: string;
};

export default function CreateVacancyModal({
  isOpen,
  onClose,
  companyId,
  onCreated,
}: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    capacity: "",
    startDate: "",
    endDate: "",
    specialtyId: "", // 👈 nuevo
  });

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  const reset = () => {
    setForm({
      title: "",
      description: "",
      capacity: "",
      startDate: "",
      endDate: "",
      specialtyId: "",
    });
  };

  const update = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data);

      // preselecciona para evitar crear sin especialidad
      if (data.length > 0 && !form.specialtyId) {
        setForm((p) => ({ ...p, specialtyId: data[0].id }));
      }
    } finally {
      setLoadingSpecialties(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSpecialties();
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const save = async () => {
    if (!form.specialtyId) return;

    await vacanciesApi.create(companyId, {
      title: form.title,
      description: form.description,
      requirements: [],
      capacity: Number(form.capacity),
      startDate: form.startDate,
      endDate: form.endDate,
      specialtyId: form.specialtyId, // 👈 NUEVO
    });

    onCreated();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nueva Vacante</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Título</FormLabel>
            <Input name="title" value={form.title} onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={update}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Especialidad</FormLabel>

            {loadingSpecialties ? (
              <Flex align="center" gap={2}>
                <Spinner size="sm" />
                <Text fontSize="sm">Cargando especialidades…</Text>
              </Flex>
            ) : (
              <Select
                name="specialtyId"
                value={form.specialtyId}
                onChange={update}
                placeholder="Selecciona una especialidad"
                isDisabled={!specialties.length}
              >
                {specialties.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Cupos</FormLabel>
            <Input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={update}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Fecha Inicio</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={update}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Fecha Fin</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={update}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={save}
            isDisabled={loadingSpecialties || !form.specialtyId}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
