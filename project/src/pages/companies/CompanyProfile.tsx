import {
  Box,
  Heading,
  Badge,
  Spinner,
  Center,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { companiesApi } from "../../api/companies.api";

import CompanyAdminsTab from "./tabs/CompanyAdminsTab";
import CompanyTutorsTab from "./tabs/CompanyTutorsTab";
import CompanyVacanciesTab from "./tabs/CompanyVacanciesTab";

export default function CompanyProfile() {
  const { user } = useAuth();
  const companyId = user?.companyId; // ← viene del JWT

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCompany = async () => {
    if (!companyId) return;
    setLoading(true);
    const data = await companiesApi.get(companyId);
    setCompany(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompany();
  }, []);

  if (!companyId) {
    return (
      <Center mt={20}>
        <Heading size="md" color="red.400">
          Tu cuenta no está asociada a ninguna empresa.
        </Heading>
      </Center>
    );
  }

  if (loading)
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box>
      {/* ========= HEADER =========== */}
      <Heading mb={4}>{company.name}</Heading>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        mb={6}
        background="white"
        shadow="sm"
      >
        <Flex justify="space-between" mb={3}>
          <Box>
            <strong>Dirección:</strong> {company.address}
            <br />
            <strong>Creada el:</strong> {company.createdAt?.slice(0, 10)}
            <br />
            <strong>Actualizada el:</strong> {company.updatedAt?.slice(0, 10)}
          </Box>

          <Badge
            colorScheme={company.deletedAt ? "red" : "green"}
            fontSize="lg"
            p={2}
          >
            {company.deletedAt ? "INACTIVA" : "ACTIVA"}
          </Badge>
        </Flex>
      </Box>

      {/* ========= TABS =========== */}
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Administradores</Tab>
          <Tab>Tutores</Tab>
          <Tab>Vacantes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CompanyAdminsTab companyId={companyId} />
          </TabPanel>

          <TabPanel>
            <CompanyTutorsTab companyId={companyId} />
          </TabPanel>

          <TabPanel>
            <CompanyVacanciesTab companyId={companyId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
