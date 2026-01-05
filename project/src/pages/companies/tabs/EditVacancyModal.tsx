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

import { useState, useEffect } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";
import { specialtiesApi } from "../../../api/specialties.api";

type Specialty = {
  id: string;
  name: string;
};

export default function EditVacancyModal({
  isOpen,
  onClose,
  vacancy,
  onUpdated,
}: any) {
  const [form, setForm] = useState<any>({});
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadSpecialties();
  }, [isOpen]);

  useEffect(() => {
    if (vacancy) {
      setForm({
        ...vacancy,
        specialtyId: vacancy.specialtyId ?? "",
      });
    }
  }, [vacancy]);

  const update = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!vacancy?.id) return;

    await vacanciesApi.update(vacancy.id, {
      title: form.title?.trim() === "" ? null : form.title,
      description: form.description?.trim() === "" ? null : form.description,
      requirements: form.requirements ?? [],
      capacity:
        form.capacity === "" || form.capacity === null || form.capacity === undefined
          ? null
          : Number(form.capacity),
      startDate: form.startDate?.trim() === "" ? null : form.startDate,
      endDate: form.endDate?.trim() === "" ? null : form.endDate,
      status: form.status ?? null,
      specialtyId: form.specialtyId || null, // 👈 NUEVO
    });

    onUpdated();
    onClose();
  };

  if (!vacancy) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Vacante</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Título</FormLabel>
            <Input name="title" value={form.title ?? ""} onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              name="description"
              value={form.description ?? ""}
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
                value={form.specialtyId ?? ""}
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

          <FormControl mb={3}>
            <FormLabel>Cupos</FormLabel>
            <Input
              type="number"
              name="capacity"
              value={form.capacity ?? ""}
              onChange={update}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha Inicio</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={form.startDate ?? ""}
              onChange={update}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha Fin</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={form.endDate ?? ""}
              onChange={update}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="yellow"
            onClick={save}
            isDisabled={loadingSpecialties}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
