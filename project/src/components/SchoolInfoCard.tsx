import { Box, Text, Stack } from "@chakra-ui/react";

export default function SchoolInfoCard({ school }: any) {
  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <Stack spacing={2}>
        <Text><strong>Nombre:</strong> {school.name}</Text>

        <Text>
          <strong>Dirección:</strong>{" "}
          {school.address ?? "No registrada"}
        </Text>

        <Text>
          <strong>Creada el:</strong>{" "}
          {new Date(school.createdAt).toLocaleDateString()}
        </Text>

        {school.updatedAt && (
          <Text>
            <strong>Actualizada el:</strong>{" "}
            {new Date(school.updatedAt).toLocaleDateString()}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
