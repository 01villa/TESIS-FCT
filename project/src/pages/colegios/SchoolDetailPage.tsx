import {
  Box,
  Heading,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { schoolsApi } from "../../api/school.api";
import SchoolAdminPage from "./SchoolAdminPage";
import SchoolStudentsPage from "./SchoolStudentsPage";
import SchoolTutorsPage from "./SchoolTutorsPage";

export default function SchoolDetailPage() {
  const { id } = useParams();
  const [school, setSchool] = useState<any>(null);

  const load = async () => {
    const list = await schoolsApi.list();
    const found = list.find((s: any) => s.id === id);
    setSchool(found);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!school) return <Box>Cargando...</Box>;

  return (
    <Box>
      <Heading size="lg" mb={4}>
        {school.name}
      </Heading>

      <Divider mb={6} />

      <Tabs colorScheme="blue">
        <TabList>
          <Tab>Administradores</Tab>
          <Tab>Tutores Escolares</Tab>
          <Tab>Estudiantes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SchoolAdminPage schoolId={id!} />
          </TabPanel>

          <TabPanel>
            <SchoolTutorsPage schoolId={id!} />
          </TabPanel>

          <TabPanel>
            <SchoolStudentsPage schoolId={id!} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
