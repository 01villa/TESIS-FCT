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

import { useRef, useState } from "react";
import { companyTutorApi } from "../../../api/companyTutors.api";
import { usersApi } from "../../../api/users.api";

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
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelRef = useRef<any>(null);

  const reset = () => {
    setForm({ fullName: "", email: "", password: "" });
    setPhotoFile(null);
  };

  const submitConfirmed = async () => {
    try {
      setLoading(true);

      // 1️⃣ crear tutor (crea también el USER)
      const createdUser = await companyTutorApi.create(companyId, form);

      // 2️⃣ subir foto si existe (usando USERS API)
      if (photoFile && createdUser?.id) {
        await usersApi.uploadPhoto(createdUser.id, photoFile);
      }

      onCreated();
      reset();
      onClose();
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

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
                <Avatar
                  size="lg"
                  name={form.fullName}
                  src={photoFile ? URL.createObjectURL(photoFile) : undefined}
                />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoFile(e.target.files?.[0] ?? null)
                  }
                />
              </Flex>

              <Text fontSize="sm" color="gray.500" mt={2}>
                PNG, JPG o JPEG. Máx recomendado: 2MB.
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
