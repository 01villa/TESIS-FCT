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
  const [loading, setLoading] = useState(false);

  // confirm dialogs
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const cancelRef = useRef<any>(null);

  const reset = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhotoFile(null);
  };

  const createConfirmed = async () => {
    try {
      setLoading(true);

      // 1️⃣ crear admin de empresa
      const user = await companyAdminApi.create(companyId, {
        fullName,
        email,
        password,
      });

      // 2️⃣ subir foto SOLO si existe
      if (photoFile) {
        await usersApi.uploadPhoto(user.id, photoFile);
      }

      onCreated();
      reset();
      onClose();
    } finally {
      setLoading(false);
      setConfirmCreateOpen(false);
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
          <ModalHeader>Nuevo Administrador</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={5}>
              {/* FOTO OPCIONAL */}
              <div style={{ width: "100%" }}>
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
                    onChange={(e) =>
                      setPhotoFile(e.target.files?.[0] ?? null)
                    }
                  />
                </Flex>

                <Text fontSize="sm" color="gray.500" mt={2}>
                  PNG, JPG o JPEG. Máx recomendado: 2MB.
                </Text>
              </div>

              {/* DATOS */}
              <div style={{ width: "100%" }}>
                <FormLabel>Nombre Completo</FormLabel>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div style={{ width: "100%" }}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={{ width: "100%" }}>
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
            <Button
              variant="ghost"
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
              onClick={() => setConfirmCreateOpen(true)}
              isLoading={loading}
            >
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ==========================
          CONFIRM CREATE
      ========================== */}
      <AlertDialog
        isOpen={confirmCreateOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmCreateOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar creación
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de crear este administrador para la empresa?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setConfirmCreateOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={createConfirmed}
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
