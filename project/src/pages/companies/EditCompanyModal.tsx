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

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: any | null;
  onUpdated: () => void;
}

export default function EditCompanyModal({
  isOpen,
  onClose,
  company,
  onUpdated,
}: EditCompanyModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isOpen && company) {
      setName(company.name || "");
      setAddress(company.address || "");
    }
  }, [isOpen, company]);

  if (!company) return null;

  const handleUpdate = async () => {
    await companiesApi.update(company.id, { name, address });
    onUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Empresa</ModalHeader>

        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="yellow" onClick={handleUpdate}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
