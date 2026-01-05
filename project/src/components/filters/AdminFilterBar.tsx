import { Flex, Input, Select, VStack, useMediaQuery } from "@chakra-ui/react";

interface Filters {
  search: string;
  status: string; // all | active | deleted
}

export default function AdminFilterBar({
  onFilter,
}: {
  onFilter: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const handleChange = (key: keyof Filters, value: string) => {
    onFilter((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <>
      <Input
        placeholder="Buscar por nombre o email…"
        onChange={(e) => handleChange("search", e.target.value)}
      />

      <Select onChange={(e) => handleChange("status", e.target.value)}>
        <option value="all">Todos</option>
        <option value="active">Activos</option>
        <option value="deleted">Eliminados</option>
      </Select>
    </>
  );

  return isMobile ? (
    <VStack spacing={3} w="100%" mb={5}>
      {content}
    </VStack>
  ) : (
    <Flex gap={4} mb={5}>
      {content}
    </Flex>
  );
}
