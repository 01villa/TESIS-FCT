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
import { schoolStudentsApi } from "../../../api/school.students.api";

export default function EditSchoolStudentModal({
  isOpen,
  onClose,
  student,
  onUpdated,
}: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ci, setCi] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (student) {
      setFirstName(student.firstName || "");
      setLastName(student.lastName || "");
      setCi(student.ci || "");
      setPhone(student.phone || "");
    }
  }, [student]);

  const handleSave = async () => {
    await schoolStudentsApi.update(student.id, {
      firstName,
      lastName,
      ci,
      phone,
    });

    onUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Estudiante</ModalHeader>

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

          <FormControl mb={3} isDisabled>
            <FormLabel>Email</FormLabel>
            <Input value={student?.email || ""} />
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
