import {
  Box,
  Heading,
  Text,
  Badge,
  Flex,
  Spinner,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  SimpleGrid
} from "@chakra-ui/react";

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies.api";

import CompanyAdminsTab from "./tabs/CompanyAdminsTab";
import CompanyTutorsTab from "./tabs/CompanyTutorsTab";
import CompanyVacanciesTab from "./tabs/CompanyVacanciesTab";

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCompany = async () => {
    const data = await companiesApi.get(id!);
    setCompany(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompany();
  }, [id]);

  if (loading)
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box>

      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">{company.name}</Heading>

        <Button as={Link} to="/dashboard/companies" colorScheme="gray">
          ← Regresar
        </Button>
      </Flex>

      {/* INFO CARD */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={5}
        mb={6}
        shadow="sm"
      >
        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text><b>Nombre:</b> {company.name}</Text>
            <Text><b>Dirección:</b> {company.address}</Text>
          </Box>

          <Box>
            <Text><b>Creada el:</b> {new Date(company.createdAt).toLocaleDateString()}</Text>
            <Text><b>Actualizada el:</b> {new Date(company.updatedAt).toLocaleDateString()}</Text>
          </Box>
        </SimpleGrid>

        <Box mt={3}>
          <b>Estado: </b>
          {!company.deletedAt ? (
            <Badge colorScheme="green">ACTIVA</Badge>
          ) : (
            <Badge colorScheme="red">INACTIVA</Badge>
          )}
        </Box>
      </Box>

      {/* TABS */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Administradores</Tab>
          <Tab>Tutores</Tab>
          <Tab>Vacantes</Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
            <CompanyAdminsTab companyId={id!} />
          </TabPanel>

          <TabPanel>
            <CompanyTutorsTab companyId={id!} />
          </TabPanel>

          <TabPanel>
            <CompanyVacanciesTab companyId={id!} />
          </TabPanel>

        </TabPanels>
      </Tabs>
    </Box>
  );
}
