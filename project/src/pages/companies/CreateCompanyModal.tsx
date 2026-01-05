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
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { companiesApi } from "../../api/companies.api";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCompanyModal({
  isOpen,
  onClose,
  onCreated,
}: CreateCompanyModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setAddress("");
    }
  }, [isOpen]);

  const handleCreate = async () => {
    await companiesApi.create({ name, address });
    onCreated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nueva Empresa</ModalHeader>

        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Ej. Inducom S.A."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Input
              placeholder="Dirección exacta"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleCreate} disabled={!name.trim()}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
