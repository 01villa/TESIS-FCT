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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { usersApi } from "../../api/users.api";
import { API_URL } from "../../config/api";

export default function EditAdminModal({
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

  // dialogs
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  // ✅ Chakra v2 compatible
  const cancelRef = useRef<any>(null);

  useEffect(() => {
    if (!admin) return;

    setFullName(admin.fullName ?? "");
    setEmail(admin.email ?? "");
    setPassword("");
    setPhotoFile(null);
  }, [admin]);

  if (!admin) return null;

  const avatarSrc = admin.photoUrl
    ? `${API_URL}${admin.photoUrl}`
    : undefined;

  // ==========================
  // CONFIRM ACTIONS
  // ==========================
  const confirmSave = async () => {
    try {
      setLoading(true);

      await usersApi.update(admin.id, {
        fullName,
        email,
        password: password?.trim() ? password : undefined,
      });

      if (photoFile) {
        await usersApi.uploadPhoto(admin.id, photoFile);
      }

      onUpdated?.();
      onClose();
    } finally {
      setLoading(false);
      setConfirmSaveOpen(false);
    }
  };

  const confirmRemovePhoto = async () => {
    try {
      setLoading(true);
      await usersApi.removePhoto(admin.id);
      onUpdated?.();
      onClose();
    } finally {
      setLoading(false);
      setConfirmRemoveOpen(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Editar Administrador</ModalHeader>

          <ModalBody>
            {/* FOTO */}
            <FormControl mb={6}>
              <FormLabel>Foto de perfil</FormLabel>

              <Flex align="center" gap={4}>
                <Avatar size="lg" src={avatarSrc} name={fullName} />

                <Flex direction="column" gap={2}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setPhotoFile(e.target.files?.[0] ?? null)
                    }
                  />

                  {admin.photoUrl && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => setConfirmRemoveOpen(true)}
                      isLoading={loading}
                    >
                      Quitar imagen
                    </Button>
                  )}
                </Flex>
              </Flex>

              <Text fontSize="sm" color="gray.500" mt={2}>
                PNG, JPG o JPEG. Máx recomendado: 2MB.
              </Text>
            </FormControl>

            {/* DATOS */}
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Actualizar contraseña</FormLabel>
              <Input
                type="password"
                placeholder="(opcional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="yellow"
              onClick={() => setConfirmSaveOpen(true)}
              isLoading={loading}
              mr={3}
            >
              Guardar cambios
            </Button>

            <Button onClick={onClose} isDisabled={loading}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CONFIRM SAVE */}
      <AlertDialog
        isOpen={confirmSaveOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmSaveOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar cambios
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de guardar los cambios del administrador?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmSaveOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="yellow"
                onClick={confirmSave}
                ml={3}
                isLoading={loading}
              >
                Guardar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* CONFIRM REMOVE PHOTO */}
      <AlertDialog
        isOpen={confirmRemoveOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmRemoveOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Quitar imagen
            </AlertDialogHeader>

            <AlertDialogBody>
              Esta acción eliminará la foto de perfil del administrador.
              ¿Deseas continuar?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmRemoveOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmRemovePhoto}
                ml={3}
                isLoading={loading}
              >
                Quitar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
