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
  FormControl,
  Text,
  HStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { companyAdminApi } from "../../../api/companyAdmin.api";
import { usersApi } from "../../../api/users.api";

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setEmail("");
      setPassword("");
      setPhotoFile(null);
      setSaving(false);
    }
  }, [isOpen]);

  const create = async () => {
    try {
      setSaving(true);

      // 1) Crear admin
      const created = await companyAdminApi.create(companyId, {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      // 2) Subir foto (si viene)
      // created.userId DEBE venir del backend
      if (photoFile && created?.userId) {
        await usersApi.uploadPhoto(created.userId, photoFile);
      }

      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const canSave = fullName.trim() && email.trim() && password.trim();

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => {} : onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuevo Administrador (Empresa)</ModalHeader>
        <ModalCloseButton disabled={saving} />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Nombre Completo</FormLabel>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={saving}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={saving}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Foto (opcional)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                disabled={saving}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Se guarda en el perfil del usuario (User.photoUrl).
              </Text>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={create}
            isLoading={saving}
            disabled={!canSave}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
