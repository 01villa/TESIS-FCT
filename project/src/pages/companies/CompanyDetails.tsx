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

  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { companiesApi } from "../../api/companies.api";

import { FaBuilding } from "react-icons/fa";

import CompanyAdminsTab from "./tabs/CompanyAdminsTab";
import CompanyTutorsTab from "./tabs/CompanyTutorsTab";
import CompanyVacanciesTab from "./tabs/CompanyVacanciesTab";

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCompany = async () => {
    setLoading(true);
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

  const isInactive = !!company?.deletedAt;


  return (
    <Box>
      {/* HEADER */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <HStack spacing={4} align="center">
          {/* Avatar/Logo placeholder */}
          <Flex
            w="46px"
            h="46px"
            borderRadius="14px"
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            align="center"
            justify="center"
          >
            <Icon as={FaBuilding} />
          </Flex>

          <VStack align="start" spacing={1}>
            <HStack spacing={3} align="center" flexWrap="wrap">
              <Heading size="lg" lineHeight="1.1">
                {company.name}
              </Heading>

              <Badge
                px={3}
                py={1}
                borderRadius="full"
                fontSize="0.75rem"
                colorScheme={isInactive ? "red" : "green"}
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                {isInactive ? "Inactiva" : "Activa"}
              </Badge>
            </HStack>

            <Text fontSize="sm" color="gray.500">
              Detalle y gestión de administradores, tutores y vacantes
            </Text>
          </VStack>
        </HStack>

        <Button as={Link} to="/dashboard/companies" variant="outline">
          ← Regresar
        </Button>
      </Flex>

      
      {/* TABS */}
      <Tabs
        variant="enclosed"
        colorScheme="blue"
        isLazy
        borderRadius="2xl"
        overflow="hidden"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <TabList bg="gray.50" borderColor="gray.200">
          <Tab _selected={{ bg: "white", fontWeight: "700" }}>Administradores</Tab>
          <Tab _selected={{ bg: "white", fontWeight: "700" }}>Tutores</Tab>
          <Tab _selected={{ bg: "white", fontWeight: "700" }}>Vacantes</Tab>
        </TabList>

        <TabPanels p={2}>
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
