import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Skeleton,
  HStack,
  Link,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaSchool,
  FaBuilding,
  FaUserGraduate,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import { partnersApi } from "../api/partners.api";
import { API_URL } from "../config/api";
import MainSponsorSection from "../components/MainSponsorSection";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

/* ============================
   TYPES
============================ */

type PartnerType = "SCHOOL" | "COMPANY";

type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  logoUrl?: string | null;
  photoUrl?: string | null;
  publicUrl?: string | null;
};

/* ============================
   HELPERS
============================ */

function normalizeImgUrl(raw?: string | null) {
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${API_URL}${raw}`;
  return `${API_URL}/${raw}`;
}

function normalizePublicUrl(raw?: string | null) {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/* ============================
   PAGE
============================ */

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" pb={20}>
        {/* HERO */}
        <Container maxW="6xl" pt={32} pb={20}>
          <MotionFlex
            direction="column"
            align="center"
            textAlign="center"
            gap={6}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="800"
              bgGradient="linear(to-r, blue.500, teal.400)"
              bgClip="text"
            >
              Plataforma de Pasantías
            </Heading>

            <Text color="gray.600" maxW="2xl" fontSize="lg">
              Gestión profesional para conectar estudiantes, colegios y empresas
              en un solo lugar.
            </Text>
          </MotionFlex>
        </Container>

        <BenefitsSection />
        <RolesSection />
        <MainSponsorSection />
        <PartnersTabsSection />
        <CTASection />

        <Text textAlign="center" mt={20} color="gray.500">
          © {new Date().getFullYear()} FCT Pasantías • Morvaden
        </Text>
      </Box>
    </>
  );
}

/* ============================
   BENEFITS
============================ */

function BenefitsSection() {
  const items = [
    {
      icon: FaCheckCircle,
      title: "Automatización Completa",
      desc: "Procesos rápidos y eficientes para la gestión de pasantías.",
    },
    {
      icon: FaSchool,
      title: "Colegios",
      desc: "Administración académica y seguimiento de estudiantes.",
    },
    {
      icon: FaBuilding,
      title: "Empresas",
      desc: "Gestión de vacantes y tutores empresariales.",
    },
  ];

  return (
    <Container maxW="6xl" py={20}>
      <Heading textAlign="center" mb={10}>
        ¿Por qué elegir esta plataforma?
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {items.map((item, i) => (
          <MotionBox
            key={i}
            p={8}
            bg="white"
            rounded="xl"
            shadow="md"
            whileHover={{ y: -5 }}
          >
            <Icon as={item.icon} boxSize={12} color="blue.500" mb={4} />
            <Heading fontSize="xl" mb={2}>
              {item.title}
            </Heading>
            <Text color="gray.600">{item.desc}</Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Container>
  );
}

/* ============================
   ROLES
============================ */

function RolesSection() {
  const roles = [
    {
      icon: FaUserGraduate,
      title: "Estudiantes",
      desc: "Acceden y gestionan su proceso de pasantías.",
    },
    {
      icon: FaSchool,
      title: "Colegios",
      desc: "Control académico y asignación de estudiantes.",
    },
    {
      icon: FaBuilding,
      title: "Empresas",
      desc: "Supervisión y evaluación de prácticas.",
    },
  ];

  return (
    <Box bg="white" py={20}>
      <Container maxW="6xl">
        <Heading textAlign="center" mb={10}>
          ¿Quiénes utilizan la plataforma?
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {roles.map((role, i) => (
            <MotionBox
              key={i}
              p={8}
              bg="gray.50"
              rounded="xl"
              shadow="sm"
              whileHover={{ scale: 1.03 }}
            >
              <Icon as={role.icon} boxSize={10} color="blue.500" mb={4} />
              <Heading fontSize="xl" mb={2}>
                {role.title}
              </Heading>
              <Text color="gray.600">{role.desc}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

/* ============================
   PARTNERS TABS
============================ */

function PartnersTabsSection() {
  // ✅ Hooks SOLO aquí arriba, nunca dentro de map/if
  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.300");

  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const logoBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const logoBorder = useColorModeValue("gray.200", "whiteAlpha.200");

  const tabsBg = useColorModeValue("white", "gray.700");

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await partnersApi.getAll();
        setPartners(Array.isArray(data) ? data : []);
      } catch {
        setError("No se pudieron cargar las instituciones.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const schools = useMemo(
    () => partners.filter((p) => p.type === "SCHOOL"),
    [partners]
  );

  const companies = useMemo(
    () => partners.filter((p) => p.type === "COMPANY"),
    [partners]
  );

  const renderGrid = (list: Partner[]) => {
    if (loading) {
      return (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Box
              key={i}
              bg={cardBg}
              p={6}
              rounded="2xl"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Skeleton height="96px" mb={5} rounded="xl" />
              <Skeleton height="16px" mb={3} />
              <HStack justify="center" mt={4} spacing={3}>
                <Skeleton height="22px" width="70px" rounded="md" />
                <Skeleton height="32px" width="90px" rounded="md" />
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      );
    }

    if (error) return <Text color="red.400">{error}</Text>;

    return (
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
        {list.map((p) => {
          const imgSrc =
            normalizeImgUrl(p.logoUrl ?? p.photoUrl) ?? "/logos/default.png";

          const link = normalizePublicUrl(p.publicUrl);

          return (
            <MotionBox
              key={`${p.type}-${p.id}`}
              bg={cardBg}
              p={6}
              rounded="2xl"
              borderWidth="1px"
              borderColor={borderColor}
              whileHover={{ y: -6 }}
              transition="all .2s ease"
              _hover={{ shadow: "xl" }}
            >
              <VStack spacing={4} align="stretch">
                {/* LOGO */}
                <Flex
                  h="96px"
                  align="center"
                  justify="center"
                  bg={logoBg}
                  borderWidth="1px"
                  borderColor={logoBorder}
                  rounded="xl"
                  overflow="hidden"
                >
                  <Box
                    as="img"
                    src={imgSrc}
                    alt={p.name}
                    maxH="70px"
                    maxW="90%"
                    objectFit="contain"
                    onError={(e: any) =>
                      (e.currentTarget.src = "/logos/default.png")
                    }
                  />
                </Flex>

                {/* NOMBRE */}
                <Text fontWeight="800" textAlign="center" noOfLines={2}>
                  {p.name}
                </Text>

                {/* BADGE + BOTON */}
                <HStack justify="center" spacing={3} pt={1}>
                  <Badge
                    px={2}
                    py={1}
                    rounded="md"
                    fontSize="xs"
                    colorScheme={p.type === "SCHOOL" ? "blue" : "teal"}
                  >
                    {p.type === "SCHOOL" ? "COLEGIO" : "EMPRESA"}
                  </Badge>

                  {link ? (
                    <Button
                      as={Link}
                      href={link}
                      isExternal
                      size="sm"
                      rounded="md"
                      variant="outline"
                      rightIcon={<ExternalLinkIcon />}
                    >
                      Visitar
                    </Button>
                  ) : (
                    <Button size="sm" rounded="md" variant="ghost" isDisabled>
                      Sin sitio
                    </Button>
                  )}
                </HStack>
              </VStack>
            </MotionBox>
          );
        })}
      </SimpleGrid>
    );
  };

  return (
    <Box bg={bg} py={20}>
      <Container maxW="6xl">
        <Heading textAlign="center" mb={4}>
          Instituciones que trabajan con nosotros
        </Heading>

        <Text textAlign="center" color={muted} mb={10}>
          Colegios y empresas activas en la plataforma.
        </Text>

        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList
            mb={8}
            bg={tabsBg}
            p={2}
            rounded="2xl"
            shadow="sm"
          >
            <Tab rounded="xl">Todos</Tab>
            <Tab rounded="xl">Colegios</Tab>
            <Tab rounded="xl">Empresas</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>{renderGrid(partners)}</TabPanel>
            <TabPanel px={0}>{renderGrid(schools)}</TabPanel>
            <TabPanel px={0}>{renderGrid(companies)}</TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

/* ============================
   CTA
============================ */

function CTASection() {
  return (
    <Container maxW="4xl" textAlign="center" py={20}>
      <Heading mb={4}>Listo para comenzar</Heading>

      <Text mb={8} color="gray.600">
        Conecta con instituciones y empresas de forma profesional.
      </Text>

      <Stack direction={{ base: "column", md: "row" }} justify="center">
        <Input placeholder="Ingresa tu correo" maxW="300px" />
        <Button colorScheme="blue">Empezar</Button>
      </Stack>
    </Container>
  );
}
