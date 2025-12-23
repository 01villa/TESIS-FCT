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
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && company) {
      setName(company.name || "");
      setAddress(company.address || "");
      setLogoFile(null);
    }
  }, [isOpen, company]);

  if (!company) return null;

  const logoSrc = company.photoUrl
    ? `${API_URL}${company.photoUrl}`
    : null;

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await companiesApi.update(company.id, { name, address });

      if (logoFile) {
        await companiesApi.uploadLogo(company.id, logoFile);
      }

      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLogo = async () => {
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
          {/* LOGO */}
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
                {logoSrc ? (
                  <Box
                    as="img"
                    src={logoSrc}
                    alt={company.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                ) : (
                  <Text fontWeight="bold" color="gray.400">
                    {company.name.charAt(0)}
                  </Text>
                )}
              </Box>

              <Flex direction="column" gap={2}>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setLogoFile(e.target.files?.[0] ?? null)
                  }
                />

                {company.photoUrl && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleRemoveLogo}
                    isDisabled={loading}
                  >
                    Quitar logo
                  </Button>
                )}
              </Flex>
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={2}>
              PNG, JPG o JPEG. Recomendado: fondo transparente.
            </Text>
          </FormControl>

          {/* DATOS */}
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
            Cancelar
          </Button>
          <Button
            colorScheme="yellow"
            onClick={handleUpdate}
            isLoading={loading}
          >
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
