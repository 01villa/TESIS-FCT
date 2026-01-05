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
import { schoolsApi } from "../../../api/school.api";

export default function EditSchoolAdminModal({
  isOpen,
  onClose,
  admin,
  onUpdated,
}: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName);
      setEmail(admin.email);
      setPassword(""); // contraseña vacía al iniciar
    }
  }, [admin]);

  const handleSave = async () => {
    await schoolsApi.updateAdmin(admin.id, {
      fullName,
      email,
      password: password || null, // si está vacío → no cambia
    });

    onUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Administrador Escolar</ModalHeader>

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
            <FormLabel>Contraseña (opcional)</FormLabel>
            <Input
              type="password"
              placeholder="Dejar vacío para no cambiar"
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
