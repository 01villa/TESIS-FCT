import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

import { useState } from "react";
import { schoolsApi } from "../../api/school.api";

export default function CreateSchoolModal({ isOpen, onClose, onCreated }: any) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = async () => {
    await schoolsApi.create({
      name,
      address: address || null,
    });

    onCreated(); // Recargar la tabla
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Registrar Escuela</ModalHeader>

        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Nombre de la escuela"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Textarea
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave} mr={3}>
            Guardar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
