import { Button, Flex, Text } from "@chakra-ui/react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  return (
    <Flex justify="space-between" align="center" mt={6}>
      <Button
        isDisabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>

      <Text fontWeight="bold">
        Página {page} de {totalPages}
      </Text>

      <Button
        isDisabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </Flex>
  );
}
