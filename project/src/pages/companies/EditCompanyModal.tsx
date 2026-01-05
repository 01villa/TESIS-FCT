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
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies.api";
import { API_URL } from "../../config/api";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: any | null;
  onUpdated: () => void;
}

export default function EditCompanyModal({
  isOpen,
  onClose,
  company,
  onUpdated,
}: EditCompanyModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name ?? "");
      setAddress(company.address ?? "");
      setPhotoFile(null);
    }
  }, [company]);

  if (!company) return null;

  // ✅ Igual que School: usar photoUrl
  const photoSrc = company.photoUrl ? `${API_URL}${company.photoUrl}` : null;

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1️⃣ actualizar datos base
      await companiesApi.update(company.id, {
        name,
        address: address || null,
      });

      // 2️⃣ subir imagen si hay
      if (photoFile) {
        await companiesApi.uploadLogo(company.id, photoFile);
      }

      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setLoading(true);
      await companiesApi.removeLogo(company.id);
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Empresa</ModalHeader>

        <ModalBody>
          {/* ================= IMAGEN ================= */}
          <FormControl mb={6}>
            <FormLabel>Logo de la empresa</FormLabel>

            <Flex align="center" gap={4}>
              <Box
                w="120px"
                h="70px"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                rounded="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                {photoSrc ? (
                  <Box
                    as="img"
                    src={photoSrc}
                    alt={company.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                ) : (
                  <Text fontSize="xl" fontWeight="bold" color="gray.400">
                    {(company.name ?? "?").charAt(0)}
                  </Text>
                )}
              </Box>

              <Flex direction="column" gap={2}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                />

                {company.photoUrl && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleRemovePhoto}
                    isDisabled={loading}
                  >
                    Quitar logo
                  </Button>
                )}
              </Flex>
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={2}>
              PNG o JPG. Recomendado: horizontal y fondo transparente.
            </Text>
          </FormControl>

          {/* ================= DATOS ================= */}
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="yellow"
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
