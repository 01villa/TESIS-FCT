import {
  Box,
  Heading,
  Spinner,
  Center,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

import axios from "axios";

import AdminsTab from "../colegios/tabs/AdminsTab";
import TutorsTab from "../colegios/tabs/TutorsTab";
import StudentsTab from "../colegios/tabs/StudentsTab";

export default function SchoolDashboard() {
  const { user } = useAuth();

  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // 1) CARGAR LA ESCUELA DEL ADMIN ESCOLAR
  // ---------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        // 1. obtener school-admins
        const res = await axios.get("/admin/school-admins");
        const admins = res.data;

        // 2. buscar el admin asociado al usuario logueado
        const me = admins.find((a: any) => a.userId === user.id);

        if (!me) {
          setError("No tienes una escuela asignada.");
          setLoading(false);
          return;
        }

        // 3. cargar la escuela REAL
        const schoolRes = await axios.get(`/admin/schools/${me.schoolId}`);

        setSchool(schoolRes.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la escuela.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------
  if (loading)
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------
  if (error)
    return (
      <Center mt={20}>
        <Text color="red.500">{error}</Text>
      </Center>
    );

  // ---------------------------------------------------------
  // VISTA PRINCIPAL
  // ---------------------------------------------------------
  return (
  <Box>

    {/* TITULO */}
    <Heading
      mb={8}
      textAlign="center"
      bgGradient="linear(to-r, blue.500, teal.400)"
      bgClip="text"
      fontSize="3xl"
      fontWeight="extrabold"
    >
      Mi Escuela
    </Heading>

    {/* CARD DE INFO */}
    <Box
      maxW="700px"
      mx="auto"
      p={8}
      borderWidth="1px"
      rounded="2xl"
      shadow="lg"
      bg="white"
      _dark={{ bg: "gray.700" }}
      transition="0.2s"
      _hover={{ shadow: "xl" }}
      mb={10}
    >
      <Heading size="md" mb={4}>
        {school.name}
      </Heading>

      <Text><strong>Dirección:</strong> {school.address}</Text>
      <Text mt={2}><strong>Creada el:</strong> {school.createdAt.slice(0, 10)}</Text>
      <Text mt={2}><strong>Actualizada el:</strong> {school.updatedAt.slice(0, 10)}</Text>
    </Box>

    {/* TABS */}
    <Tabs
      variant="soft-rounded"
      colorScheme="blue"
      isFitted
      w="90%"
      mx="auto"
      mt={10}
    >
      <TabList>
        <Tab fontWeight="bold">Administradores</Tab>
        <Tab fontWeight="bold">Tutores</Tab>
        <Tab fontWeight="bold">Estudiantes</Tab>
      </TabList>

      <TabPanels mt={6}>
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
