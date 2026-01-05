import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { companyTutorApi } from "../../../api/companyTutors.api";

export default function EditCompanyTutorModal({
  isOpen,
  onClose,
  tutor,
  onUpdated
}: {
  isOpen: boolean;
  onClose: () => void;
  tutor: any;
  onUpdated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    if (tutor) {
      setForm({
        fullName: tutor.fullName,
        email: tutor.email,
      });
    }
  }, [tutor]);

  const submit = async () => {
    await companyTutorApi.update(tutor.id, form);
    onUpdated();
    onClose();
  };

  if (!tutor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Tutor</ModalHeader>

        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nombre Completo</FormLabel>
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
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={submit}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
