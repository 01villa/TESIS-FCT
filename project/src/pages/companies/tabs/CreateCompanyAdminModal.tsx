import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

import { useState } from "react";
import { companyAdminApi } from "../../../api/companyadmin.api";

export default function CreateCompanyAdminModal({
  isOpen,
  onClose,
  companyId,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onCreated: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const create = async () => {
    await companyAdminApi.create(companyId, {
      fullName,
      email,
      password,
    });

    onCreated();
    onClose();

    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Nuevo Administrador</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <div>
              <FormLabel>Nombre Completo</FormLabel>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>

          <Button colorScheme="blue" onClick={create}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
