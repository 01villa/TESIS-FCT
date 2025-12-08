import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, FormControl, FormLabel, Input
} from "@chakra-ui/react";
import { useState } from "react";
import { companyTutorApi } from "../../../api/companyTutors.api";

export default function CreateCompanyTutorModal({
  isOpen,
  onClose,
  companyId,
  onCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    await companyTutorApi.create(companyId, form);
    onCreated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuevo Tutor</ModalHeader>

        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nombre completo</FormLabel>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Email</FormLabel>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="blue" onClick={submit}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
