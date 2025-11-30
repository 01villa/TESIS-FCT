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

export default function CreateSchoolModal({ isOpen, onClose }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await schoolsApi.create(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Colegio</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <Input placeholder="Nombre" name="name" onChange={handleChange} />
            <Input placeholder="Email" name="email" onChange={handleChange} />
            <Input placeholder="Teléfono" name="phone" onChange={handleChange} />
            <Input placeholder="Dirección" name="address" onChange={handleChange} />
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
