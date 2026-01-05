import {
  Flex,
  Input,
  Select,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";

interface Filters {
  search: string;
  status: string; // all | active | deleted
}

interface Props {
  onFilter: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function SchoolFilterBar({ onFilter }: Props) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const layout = (
    <>
      <Input
        placeholder="Buscar por nombre o dirección…"
        onChange={(e) => handleFilterChange("search", e.target.value)}
      />

      <Select
        placeholder="Estado"
        onChange={(e) => handleFilterChange("status", e.target.value)}
      >
        <option value="active">Activos</option>
        <option value="deleted">Eliminados</option>
      </Select>
    </>
  );

  return isMobile ? (
    <VStack spacing={3} w="100%" mb={6}>
      {layout}
    </VStack>
  ) : (
    <Flex gap={4} mb={6}>
      {layout}
    </Flex>
  );
}
