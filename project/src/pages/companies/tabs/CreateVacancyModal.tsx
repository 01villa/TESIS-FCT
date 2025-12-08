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

import { useState } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";

export default function CreateVacancyModal({
  isOpen,
  onClose,
  companyId,
  onCreated
}: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    capacity: "",
    startDate: "",
    endDate: ""
  });

  const update = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    await vacanciesApi.create(companyId, {
      title: form.title,
      description: form.description,
      requirements: [],
      capacity: Number(form.capacity),
      startDate: form.startDate,
      endDate: form.endDate
    });

    onCreated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nueva Vacante</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Título</FormLabel>
            <Input name="title" onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Descripción</FormLabel>
            <Textarea name="description" onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Cupos</FormLabel>
            <Input type="number" name="capacity" onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha Inicio</FormLabel>
            <Input type="date" name="startDate" onChange={update} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Fecha Fin</FormLabel>
            <Input type="date" name="endDate" onChange={update} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={save}>Crear</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
