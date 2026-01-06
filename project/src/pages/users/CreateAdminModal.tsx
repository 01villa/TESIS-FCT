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
  Avatar,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useState } from "react";
import { usersApi } from "../../api/users.api";

export default function CreateAdminModal({ isOpen, onClose }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhotoFile(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1️⃣ crear usuario
      const user = await usersApi.create({
        fullName,
        email,
        password,
      });

      // 2️⃣ subir foto SOLO si existe
      if (photoFile) {
        await usersApi.uploadPhoto(user.id, photoFile);
      }

      reset();
      onClose();
    } finally {
      setLoading(false);
    }
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
        <ModalHeader>Crear Administrador</ModalHeader>

        <ModalBody>
          {/* FOTO (opcional) */}
          <FormControl mb={6}>
            <FormLabel>Foto de perfil (opcional)</FormLabel>

            <Flex align="center" gap={4}>
              <Avatar
                size="lg"
                name={fullName}
                src={photoFile ? URL.createObjectURL(photoFile) : undefined}
              />

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={2}>
              PNG, JPG o JPEG. Máx recomendado: 2MB.
            </Text>
          </FormControl>

          {/* DATOS */}
          <FormControl mb={4} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={loading}
            mr={3}
          >
            Guardar
          </Button>
          <Button onClick={onClose} isDisabled={loading}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
