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

import { useState } from "react";
import { schoolsApi } from "../../../api/school.api";

export default function CreateSchoolAdminModal({
  isOpen,
  onClose,
  onCreated,
  schoolId,
}: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    await schoolsApi.createAdmin(schoolId, {
      fullName,
      email,
      password,
    });
    onCreated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Nuevo Administrador Escolar</ModalHeader>

        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nombre Completo</FormLabel>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
