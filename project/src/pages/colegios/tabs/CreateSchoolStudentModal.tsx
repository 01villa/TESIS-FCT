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
import { schoolStudentsApi } from "../../../api/school.students.api";

export default function CreateSchoolStudentModal({
  isOpen,
  onClose,
  schoolId,
  onCreated,
}: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ci, setCi] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const reset = () => {
    setFirstName("");
    setLastName("");
    setCi("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  const handleSave = async () => {
    await schoolStudentsApi.create(schoolId, {
      firstName,
      lastName,
      ci,
      email,
      password,
      phone,
    });

    onCreated();
    reset();
    onClose();
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
        <ModalHeader>Registrar Estudiante</ModalHeader>

        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Nombres</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Apellidos</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Cédula / CI</FormLabel>
            <Input value={ci} onChange={(e) => setCi(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
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
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Guardar
          </Button>
          <Button
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
