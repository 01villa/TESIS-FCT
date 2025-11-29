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
} from "@chakra-ui/react";

import { useState } from "react";
import { usersApi } from "../../api/users.api";

export default function EditAdminModal({ isOpen, onClose, admin }: any) {
  const [fullName, setFullName] = useState(admin.fullName);
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    await usersApi.update(admin.id, { fullName, email, password });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Administrador</ModalHeader>

        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Actualizar Contraseña</FormLabel>
            <Input
              type="password"
              placeholder="(opcional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="yellow" onClick={handleSave} mr={3}>
            Guardar Cambios
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
