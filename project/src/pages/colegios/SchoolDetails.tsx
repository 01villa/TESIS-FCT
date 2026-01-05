import {
  Box,
  Heading,
  Flex,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { schoolsApi } from "../../api/school.api";
import SchoolInfoCard from "../../components/SchoolInfoCard";
import AdminsTab from "./tabs/AdminsTab.tsx";
import TutorsTab from "./tabs/TutorsTab.tsx";
import StudentsTab from "./tabs/StudentsTab.tsx";

export default function SchoolDetails() {
  const { id } = useParams();
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await schoolsApi.get(id!);
    setSchool(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <Flex justify="center" align="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!school) return <Heading>No se encontró la escuela</Heading>;

  return (
    <Box p={6}>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">{school.name}</Heading>

        {!school.deletedAt ? (
          <Badge colorScheme="green" p={2}>
            Activa
          </Badge>
        ) : (
          <Badge colorScheme="red" p={2}>
            Eliminada
          </Badge>
        )}
      </Flex>

      {/* INFO CARD */}
      <SchoolInfoCard school={school} />

      {/* TABS */}
      <Tabs colorScheme="blue" mt={8} isFitted variant="enclosed">
        <TabList>
          <Tab>Administradores</Tab>
          <Tab>Tutores</Tab>
          <Tab>Estudiantes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AdminsTab schoolId={school.id} />
          </TabPanel>

          <TabPanel>
            <TutorsTab schoolId={school.id} />
          </TabPanel>

          <TabPanel>
            <StudentsTab schoolId={school.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
