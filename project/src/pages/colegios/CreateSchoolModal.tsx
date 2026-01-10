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
  Textarea,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { schoolsApi } from "../../api/school.api";

interface CreateSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateSchoolModal({
  isOpen,
  onClose,
  onCreated,
}: CreateSchoolModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setAddress("");
      setPublicUrl("");
      setLogoFile(null);
      setSaving(false);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // 1️⃣ Crear escuela (SIN logo, solo datos)
      const created = await schoolsApi.create({
        name,
        address: address || null,
        publicUrl: publicUrl || null,
      });

      // 2️⃣ Subir logo si existe
      if (logoFile) {
        await schoolsApi.uploadLogo(created.id, logoFile);
      }

      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => {} : onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Registrar Escuela</ModalHeader>

        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Nombre de la escuela"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Textarea
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={saving}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Sitio Web / Landing</FormLabel>
            <Input
              placeholder="https://escuela.edu.ec"
              value={publicUrl}
              onChange={(e) => setPublicUrl(e.target.value)}
              disabled={saving}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Logo (archivo)</FormLabel>
            <Input
              type="file"
              accept="image/*"
              p={1}
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              disabled={saving}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            mr={3}
            isLoading={saving}
            disabled={!name.trim()}
          >
            Guardar
          </Button>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
