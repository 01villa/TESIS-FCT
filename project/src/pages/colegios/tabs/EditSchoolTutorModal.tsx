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

import { useEffect, useState } from "react";
import { schoolTutorsApi } from "../../../api/schooltutor.api";

export default function EditSchoolTutorModal({
  isOpen,
  onClose,
  tutor,
  onUpdated,
}: any) {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (tutor) {
      setPhone(tutor.phone || "");
    }
  }, [tutor]);

  const handleSave = async () => {
    await schoolTutorsApi.update(tutor.id, { phone });
    onUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Tutor Escolar</ModalHeader>

        <ModalBody>
          <FormControl mb={3} isDisabled>
            <FormLabel>Nombre</FormLabel>
            <Input value={tutor?.fullName || ""} />
          </FormControl>

          <FormControl mb={3} isDisabled>
            <FormLabel>Email</FormLabel>
            <Input value={tutor?.email || ""} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Guardar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
