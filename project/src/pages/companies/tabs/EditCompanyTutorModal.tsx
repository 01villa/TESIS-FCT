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
import { companyTutorApi } from "../../../api/companyTutors.api";
import { usersApi } from "../../../api/users.api";

export default function EditCompanyTutorModal({
  isOpen,
  onClose,
  tutor,
  onUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  tutor: any; // debe traer tutor.id y tutor.userId
  onUpdated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tutor) {
      setForm({
        fullName: tutor.fullName ?? "",
        email: tutor.email ?? "",
        password: "",
      });
      setPhotoFile(null);
    }
  }, [tutor]);

  const submit = async () => {
    if (!tutor?.id) return;

    try {
      setLoading(true);

      // 1️⃣ actualizar datos básicos
      await companyTutorApi.update(tutor.id, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password.trim() ? form.password : null,
      });

      // 2️⃣ actualizar foto (si hay)
      if (photoFile && tutor.userId) {
        await usersApi.uploadPhoto(tutor.userId, photoFile);
      }

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

  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Tutor</ModalHeader>

        <ModalBody>
          {/* FOTO */}
          <FormControl mb={5}>
            <FormLabel>Foto de perfil (opcional)</FormLabel>

            <Flex align="center" gap={4}>
              <Avatar size="lg" name={form.fullName} src={previewSrc} />

              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) =>
                  setPhotoFile(e.target.files?.[0] ?? null)
                }
                disabled={loading}
              />
            </Flex>

            <HStack mt={2} justify="space-between">
              <Text fontSize="sm" color="gray.500">
                PNG, JPG o JPEG.
              </Text>

              <Button
                size="xs"
                variant="outline"
                colorScheme="red"
                onClick={async () => {
                  if (!tutor.userId) return;
                  setLoading(true);
                  try {
                    await usersApi.removePhoto(tutor.userId);
                    onUpdated();
                    onClose();
                  } finally {
                    setLoading(false);
                  }
                }}
                isDisabled={!tutor.photoUrl || loading}
              >
                Quitar foto
              </Button>
            </HStack>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Nombre Completo</FormLabel>
            <Input
              value={form.fullName}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullName: e.target.value }))
              }
              disabled={loading}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Email</FormLabel>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              disabled={loading}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Contraseña (opcional)</FormLabel>
            <Input
              type="password"
              placeholder="Dejar vacío para no cambiar"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              disabled={loading}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={submit}
            isLoading={loading}
            disabled={!form.fullName || !form.email}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
