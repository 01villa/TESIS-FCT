import {
  Flex,
  Input,
  Select,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";

interface Filters {
  search: string;
  role: string;
  schoolId: string;
  companyId: string;
}

interface Props {
  onFilter: React.Dispatch<React.SetStateAction<Filters>>;
  roles?: string[];
  schools?: Array<{ id: string; name: string }>;
  companies?: Array<{ id: string; name: string }>;
}

export default function UserFilterBar({
  onFilter,
  roles = [],
  schools = [],
  companies = [],
}: Props) {
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
        placeholder="Buscar por nombre o email…"
        onChange={(e) => handleFilterChange("search", e.target.value)}
      />

      {roles.length > 0 && (
        <Select
          placeholder="Rol"
          onChange={(e) => handleFilterChange("role", e.target.value)}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      )}

      {schools.length > 0 && (
        <Select
          placeholder="Escuela"
          onChange={(e) => handleFilterChange("schoolId", e.target.value)}
        >
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      )}

      {companies.length > 0 && (
        <Select
          placeholder="Empresa"
          onChange={(e) => handleFilterChange("companyId", e.target.value)}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      )}
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

