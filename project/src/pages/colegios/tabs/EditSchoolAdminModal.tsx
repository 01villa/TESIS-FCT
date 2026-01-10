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
  Avatar,
  Flex,
  Text,
  HStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { schoolsApi } from "../../../api/school.api";
import { usersApi } from "../../../api/users.api";

export default function EditSchoolAdminModal({
  isOpen,
  onClose,
  admin,
  onUpdated,
}: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName ?? "");
      setEmail(admin.email ?? "");
      setPassword("");
      setPhotoFile(null);
      setLoading(false);
    }
  }, [admin]);

  const handleSave = async () => {
    if (!admin?.id) return;

    try {
      setLoading(true);

      // 1) update texto
      await schoolsApi.updateAdmin(admin.id, {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() ? password : null,
      });

      // 2) update foto (si eligió archivo)
      if (photoFile) {
        const userId = admin?.userId;
        if (!userId) {
          throw new Error(
            "El admin no trae userId. Agrega userId al DTO del SchoolAdmin para poder subir foto."
          );
        }
        await usersApi.uploadPhoto(userId, photoFile);
      }

      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = async () => {
    const userId = admin?.userId;
    if (!userId) return;

    try {
      setLoading(true);
      await usersApi.removePhoto(userId);
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  const previewSrc = photoFile
    ? URL.createObjectURL(photoFile)
    : admin.photoUrl ?? undefined;

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Administrador Escolar</ModalHeader>

        <ModalBody>
          {/* FOTO */}
          <FormControl mb={5}>
            <FormLabel>Foto (opcional)</FormLabel>

            <Flex align="center" gap={4}>
              <Avatar size="lg" name={fullName} src={previewSrc} />

              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                disabled={loading}
              />
            </Flex>

            <HStack mt={2} justify="space-between">
              <Text fontSize="sm" color="gray.500">
                Si seleccionas una imagen, se reemplaza la foto.
              </Text>

              <Button
                size="xs"
                variant="outline"
                colorScheme="red"
                onClick={removePhoto}
                isDisabled={loading || !admin?.photoUrl || !admin?.userId}
              >
                Quitar foto
              </Button>
            </HStack>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Nombre Completo</FormLabel>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Contraseña (opcional)</FormLabel>
            <Input
              type="password"
              placeholder="Dejar vacío para no cambiar"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} isDisabled={loading}>
            Cancelar
          </Button>

          <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
