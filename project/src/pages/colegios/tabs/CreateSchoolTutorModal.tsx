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
import { schoolTutorsApi } from "../../../api/schooltutor.api";

export default function CreateSchoolTutorModal({
  isOpen,
  onClose,
  schoolId,
  onCreated,
}: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = async () => {
    await schoolTutorsApi.create(schoolId, {
      fullName,
      email,
      password,
      phone,
    });

    onCreated();
    onClose();
  };

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Crear Tutor Escolar</ModalHeader>

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

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Guardar
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
