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
import { schoolsApi } from "../../api/school.api";
import { API_URL } from "../../config/api";

export default function EditSchoolModal({
  isOpen,
  onClose,
  school,
  onUpdated,
}: any) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (school) {
      setName(school.name);
      setAddress(school.address ?? "");
      setPhotoFile(null);
    }
  }, [school]);

  if (!school) return null;

  // ✅ USAR photoUrl (no logoUrl)
  const photoSrc = school.photoUrl
    ? `${API_URL}${school.photoUrl}`
    : null;

  const handleSave = async () => {
    try {
      setLoading(true);

      // 1️⃣ actualizar datos base
      await schoolsApi.update(school.id, {
        name,
        address: address || null,
      });

      // 2️⃣ subir imagen si hay
      if (photoFile) {
        await schoolsApi.uploadLogo(school.id, photoFile);
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
      await schoolsApi.removeLogo(school.id);
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
        <ModalHeader>Editar Escuela</ModalHeader>

        <ModalBody>
          {/* ================= IMAGEN ================= */}
          <FormControl mb={6}>
            <FormLabel>Imagen de la escuela</FormLabel>

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
                    alt={school.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                ) : (
                  <Text fontSize="xl" fontWeight="bold" color="gray.400">
                    {school.name.charAt(0)}
                  </Text>
                )}
              </Box>

              <Flex direction="column" gap={2}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoFile(e.target.files?.[0] ?? null)
                  }
                />

                {school.photoUrl && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleRemovePhoto}
                    isDisabled={loading}
                  >
                    Quitar imagen
                  </Button>
                )}
              </Flex>
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={2}>
              PNG o JPG. Tamaño recomendado: horizontal.
            </Text>
          </FormControl>

          {/* ================= DATOS ================= */}
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
