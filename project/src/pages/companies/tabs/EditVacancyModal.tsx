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
  Textarea
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";

export default function EditVacancyModal({
  isOpen,
  onClose,
  vacancy,
  onUpdated
}: any) {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (vacancy) setForm(vacancy);
  }, [vacancy]);

  const update = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    await vacanciesApi.update(vacancy.id, {
      title: form.title,
      description: form.description,
      requirements: form.requirements,
      capacity: Number(form.capacity),
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status
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
            <Input name="title" value={form.title} onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Descripción</FormLabel>
            <Textarea name="description" value={form.description} onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Cupos</FormLabel>
            <Input type="number" name="capacity" value={form.capacity} onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha Inicio</FormLabel>
            <Input type="date" name="startDate" value={form.startDate} onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha Fin</FormLabel>
            <Input type="date" name="endDate" value={form.endDate} onChange={update} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="yellow" onClick={save}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
