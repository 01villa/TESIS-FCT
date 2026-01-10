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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { companiesApi } from "../../api/companies.api";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCompanyModal({
  isOpen,
  onClose,
  onCreated,
}: CreateCompanyModalProps) {
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

  const handleCreate = async () => {
    try {
      setSaving(true);

      // 1) Crear empresa (sin logoUrl, porque el logo es archivo)
      const created = await companiesApi.create({
        name,
        address: address || null,
        publicUrl: publicUrl || null,
      });

      // 2) Subir logo si seleccionaron archivo
      if (logoFile) {
        await companiesApi.uploadLogo(created.id, logoFile);
      }

      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={saving ? () => {} : onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nueva Empresa</ModalHeader>

        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Ej. Inducom S.A."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Input
              placeholder="Dirección exacta"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={saving}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Sitio Web / Landing</FormLabel>
            <Input
              placeholder="https://empresa.com"
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
          <Button variant="ghost" mr={3} onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleCreate}
            isLoading={saving}
            disabled={!name.trim()}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
