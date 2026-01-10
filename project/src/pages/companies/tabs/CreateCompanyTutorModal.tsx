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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { companyTutorApi } from "../../../api/companyTutors.api";
import { usersApi } from "../../../api/users.api";

type CreateTutorForm = {
  fullName: string;
  email: string;
  password: string;
};

export default function CreateCompanyTutorModal({
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
  const [form, setForm] = useState<CreateTutorForm>({
    fullName: "",
    email: "",
    password: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({ fullName: "", email: "", password: "" });
      setPhotoFile(null);
      setLoading(false);
      setConfirmOpen(false);
    }
  }, [isOpen]);

  const reset = () => {
    setForm({ fullName: "", email: "", password: "" });
    setPhotoFile(null);
  };

  const submitConfirmed = async () => {
    try {
      setLoading(true);

      // 1) crear tutor (crea también el USER)
      // Debe retornar algo como { id: tutorId, userId: "...", ... }
      const created = await companyTutorApi.create(companyId, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // 2) subir foto si existe (al USER)
      if (photoFile) {
        const userId = created?.userId; // 👈 CLAVE
        if (!userId) {
          throw new Error(
            "El backend no devolvió userId. Agrega userId al DTO del tutor para poder subir la foto."
          );
        }
        await usersApi.uploadPhoto(userId, photoFile);
      }

      onCreated();
      reset();
      onClose();
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const canSubmit =
    form.fullName.trim() && form.email.trim() && form.password.trim();

  const previewSrc = photoFile ? URL.createObjectURL(photoFile) : undefined;

  return (
    <>
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
          <ModalHeader>Nuevo Tutor</ModalHeader>

          <ModalBody>
            {/* FOTO OPCIONAL */}
            <FormControl mb={5}>
              <FormLabel>Foto de perfil (opcional)</FormLabel>

              <Flex align="center" gap={4}>
                <Avatar size="lg" name={form.fullName} src={previewSrc} />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                />
              </Flex>

              <Text fontSize="sm" color="gray.500" mt={2}>
                PNG, JPG o JPEG. Recomendado &lt; 2MB.
              </Text>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Nombre completo</FormLabel>
              <Input
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                reset();
                onClose();
              }}
              isDisabled={loading}
            >
              Cancelar
            </Button>

            <Button
              colorScheme="blue"
              onClick={() => setConfirmOpen(true)}
              isLoading={loading}
              isDisabled={!canSubmit}
            >
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CONFIRM CREATE */}
      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar creación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de crear este tutor para la empresa?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>

              <Button
                colorScheme="blue"
                onClick={submitConfirmed}
                ml={3}
                isLoading={loading}
                isDisabled={!canSubmit}
              >
                Crear
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
