import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Text,
  Badge,
  Stack,
  Divider,
  Flex,
  Box,
  HStack,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

function formatDate(value: any) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export default function VacancyDetailDrawer({ isOpen, onClose, vacancy }: any) {
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.300");

  const isOpenStatus = Number(vacancy?.status) === 1;
  const statusText = isOpenStatus ? "ABIERTA" : "CERRADA";
  const statusColor = isOpenStatus ? "green" : "gray";

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />

      <DrawerContent borderLeftWidth="1px" borderColor={border}>
        {/* HEADER */}
        <DrawerHeader px={5} py={4}>
          <Flex justify="space-between" align="start" gap={3}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" lineHeight="1.2">
                {vacancy?.title ?? "Vacante"}
              </Text>

              <Text mt={1} fontSize="sm" color={subtleText}>
                {vacancy?.companyName ?? "—"} · {vacancy?.specialtyName ?? "—"}
              </Text>
            </Box>

            <Flex align="center" gap={2}>
              <Badge
                colorScheme={statusColor}
                variant={isOpenStatus ? "subtle" : "solid"}
                px={3}
                py={1}
                borderRadius="md"
                fontSize="xs"
                letterSpacing="0.5px"
              >
                {statusText}
              </Badge>

              <IconButton
                aria-label="Cerrar"
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={onClose}
              />
            </Flex>
          </Flex>
        </DrawerHeader>

        <Divider />

        {/* BODY */}
        <DrawerBody px={5} py={4}>
          {!vacancy ? (
            <Text color={subtleText}>Selecciona una vacante para ver el detalle.</Text>
          ) : (
            <Stack spacing={4}>
              {/* MÉTRICAS */}
              <HStack spacing={3} align="stretch" flexWrap="wrap">
                <Box
                  flex="1"
                  minW="160px"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={border}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="xs" color={subtleText} fontWeight="semibold">
                    CUPOS
                  </Text>
                  <Text mt={1} fontSize="2xl" fontWeight="bold">
                    {vacancy.capacity ?? "—"}
                  </Text>
                </Box>

                <Box
                  flex="2"
                  minW="220px"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={border}
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="xs" color={subtleText} fontWeight="semibold">
                    PERIODO
                  </Text>
                  <Text mt={1} fontSize="md" fontWeight="semibold">
                    {formatDate(vacancy.startDate)} – {formatDate(vacancy.endDate)}
                  </Text>
                </Box>
              </HStack>

              {/* INFO */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Detalle
                </Text>

                <Box
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={border}
                  borderRadius="lg"
                  p={4}
                >
                  <Stack spacing={2}>
                    <Text fontSize="sm">
                      <b>Empresa:</b> {vacancy.companyName ?? "—"}
                    </Text>
                    <Text fontSize="sm">
                      <b>Especialidad:</b> {vacancy.specialtyName ?? "—"}
                    </Text>
                  </Stack>
                </Box>
              </Box>

              {/* DESCRIPCIÓN */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Descripción
                </Text>

                <Box
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={border}
                  borderRadius="lg"
                  p={4}
                >
                  {vacancy.description ? (
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {vacancy.description}
                    </Text>
                  ) : (
                    <Text fontSize="sm" color={subtleText}>
                      Sin descripción.
                    </Text>
                  )}
                </Box>
              </Box>
            </Stack>
          )}
        </DrawerBody>

        <Divider />

        {/* FOOTER */}
        <DrawerFooter px={5} py={4}>
          <Flex w="full" justify="flex-end" gap={2}>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
