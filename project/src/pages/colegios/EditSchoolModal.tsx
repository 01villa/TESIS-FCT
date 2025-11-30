import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { schoolsApi } from "../../api/school.api";

export default function EditSchoolModal({ isOpen, onClose, school }: any) {
  const [form, setForm] = useState({
    name: school.name,
    email: school.email || "",
    phone: school.phone || "",
    address: school.address || "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await schoolsApi.update(school.id, form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Colegio</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <Input name="name" value={form.name} onChange={handleChange} />
            <Input name="email" value={form.email} onChange={handleChange} />
            <Input name="phone" value={form.phone} onChange={handleChange} />
            <Input name="address" value={form.address} onChange={handleChange} />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
