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
  VStack,
  HStack,
  Avatar,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { companyAdminApi } from "../../../api/companyAdmin.api";
import { usersApi } from "../../../api/users.api";
import { API_URL } from "../../../config/api";

function normalizeImgUrl(raw?: string | null) {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${API_URL}${raw}`;
  return `${API_URL}/${raw}`;
}

export default function EditCompanyAdminModal({
  isOpen,
  onClose,
  admin,
  onUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin: any; // ideal: tipa con CompanyAdminDTO
  onUpdated: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName ?? "");
      setEmail(admin.email ?? "");
      setPassword("");
      setPhotoFile(null);
      setSaving(false);
    }
  }, [admin]);

  const handleSave = async () => {
    if (!admin?.id) return;

    try {
      setSaving(true);

      // 1) Update texto
      await companyAdminApi.update(admin.id, {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim() ? password : null,
      });

      // 2) Subir nueva foto (si hay)
      if (photoFile && admin?.userId) {
        await usersApi.uploadPhoto(admin.userId, photoFile);
      }

      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!admin?.userId) return;

    try {
      setSaving(true);
      await usersApi.removePhoto(admin.userId);
      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const canSave = fullName.trim() && email.trim();

  const avatarSrc = normalizeImgUrl(admin?.photoUrl ?? null) ?? undefined;

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => {} : onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Administrador (Empresa)</ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} justify="center">
              <Avatar size="xl" name={fullName} src={avatarSrc} />
            </HStack>

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
              <FormLabel>Contraseña (opcional)</FormLabel>
              <Input
                type="password"
                placeholder="Dejar vacío para no cambiar"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={saving}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Nueva foto (opcional)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                disabled={saving}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Si seleccionas una imagen, se reemplaza la foto del usuario.
              </Text>
            </FormControl>

            <HStack justify="space-between">
              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleRemovePhoto}
                disabled={saving || !admin?.photoUrl}
              >
                Quitar foto
              </Button>

              <Button
                colorScheme="blue"
                onClick={handleSave}
                isLoading={saving}
                disabled={!canSave}
              >
                Guardar cambios
              </Button>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
