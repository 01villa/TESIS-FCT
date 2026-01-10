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
  HStack,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { schoolTutorsApi } from "../../../api/schoolTutor.api";
import { usersApi } from "../../../api/users.api";

export default function EditSchoolTutorModal({
  isOpen,
  onClose,
  tutor,
  onUpdated,
}: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tutor) {
      setFullName(tutor.fullName ?? "");
      setEmail(tutor.email ?? "");
      setPassword("");
      setPhone(tutor.phone ?? "");
      setPhotoFile(null);
      setLoading(false);
    }
  }, [tutor]);

  const handleSave = async () => {
    if (!tutor?.id) return;

    try {
      setLoading(true);

      // 1) update de tutor + user (backend debe soportarlo)
      await schoolTutorsApi.update(tutor.id, {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() ? password : null,
        phone: phone.trim() || null,
      });

      // 2) update foto (USER)
      if (photoFile) {
        const userId = tutor?.userId;
        if (!userId) {
          throw new Error(
            "El tutor no trae userId. Agrega userId al DTO para poder subir foto."
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
    const userId = tutor?.userId;
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

  if (!tutor) return null;

  const previewSrc = photoFile
    ? URL.createObjectURL(photoFile)
    : tutor.photoUrl ?? undefined;

  const canSave = fullName.trim() && email.trim();

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Tutor Escolar</ModalHeader>

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
                Selecciona una imagen para reemplazar la foto.
              </Text>

              <Button
                size="xs"
                variant="outline"
                colorScheme="red"
                onClick={removePhoto}
                isDisabled={loading || !tutor?.photoUrl || !tutor?.userId}
              >
                Quitar foto
              </Button>
            </HStack>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Nombre</FormLabel>
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

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} isDisabled={loading}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSave}
            isLoading={loading}
            isDisabled={!canSave}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
