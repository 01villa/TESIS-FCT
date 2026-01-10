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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { schoolTutorsApi } from "../../../api/schoolTutor.api";
import { usersApi } from "../../../api/users.api";

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

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setPhotoFile(null);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1) crea tutor (crea también el USER)
      const created = await schoolTutorsApi.create(schoolId, {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || null,
      });

      // 2) sube foto al USER (si existe)
      if (photoFile) {
        const userId = created?.userId;
        if (!userId) {
          throw new Error(
            "El backend no devolvió userId en SchoolTutorDTO. Agrega userId al DTO para poder subir foto."
          );
        }
        await usersApi.uploadPhoto(userId, photoFile);
      }

      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const canSave =
    fullName.trim() && email.trim() && password.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      isCentered
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Crear Tutor Escolar</ModalHeader>

        <ModalBody>
          {/* FOTO */}
          <FormControl mb={5}>
            <FormLabel>Foto (opcional)</FormLabel>

            <Flex align="center" gap={4}>
              <Avatar
                size="lg"
                name={fullName}
                src={photoFile ? URL.createObjectURL(photoFile) : undefined}
              />

              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                disabled={loading}
              />
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={2}>
              Se guarda en el perfil del usuario.
            </Text>
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
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
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
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSave}
            isLoading={loading}
            isDisabled={!canSave}
          >
            Guardar
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
            isDisabled={loading}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
