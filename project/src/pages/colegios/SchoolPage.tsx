import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import CreateSchoolModal from "./CreateSchoolModal";
import EditSchoolModal from "./EditSchoolModal";
import { schoolsApi } from "../../api/school.api";

export default function SchoolsPage() {

  const [schools, setSchools] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const navigate = useNavigate();

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const loadSchools = async () => {
    const data = await schoolsApi.list();
    setSchools(data);
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = filtered.sort((a, b) =>
    sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Colegios
      </Heading>

      <Flex gap={4} mb={6}>
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="300px"
        />

        <Button colorScheme="blue" onClick={onOpenCreate}>
          Crear Colegio
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              Nombre{" "}
              <IconButton
                ml={2}
                size="xs"
                aria-label="ordenar"
                icon={sortAsc ? <FaSortUp /> : <FaSortDown />}
                onClick={() => setSortAsc(!sortAsc)}
              />
            </Th>
            <Th>Email</Th>
            <Th>Teléfono</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>

        <Tbody>
          {sorted.map((school) => (
            <Tr
              key={school.id}
              _hover={{ bg: "gray.50", cursor: "pointer" }}
            >
              <Td onClick={() => navigate(`/dashboard/schools/${school.id}`)}>
                {school.name}
              </Td>

              <Td>{school.email}</Td>
              <Td>{school.phone}</Td>

              <Td>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  mr={3}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(school);
                    onOpenEdit();
                  }}
                >
                  Editar
                </Button>

                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await schoolsApi.delete(school.id);
                    loadSchools();
                  }}
                >
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <CreateSchoolModal
        isOpen={isOpenCreate}
        onClose={() => {
          onCloseCreate();
          loadSchools();
        }}
      />

      {selected && (
        <EditSchoolModal
          school={selected}
          isOpen={isOpenEdit}
          onClose={() => {
            setSelected(null);
            onCloseEdit();
            loadSchools();
          }}
        />
      )}
    </Box>
  );
}
