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
} from "@chakra-ui/react";

import { motion } from "framer-motion";
import { FaCheckCircle, FaSchool, FaBuilding, FaUserGraduate } from "react-icons/fa";
import Navbar from "../components/Navbar";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

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

          <Text
            color="gray.600"
            maxW="2xl"
            fontSize="lg"
          >
            Gestión profesional para conectar estudiantes, colegios y empresas 
            en un solo lugar. Automatiza vacantes, asignaciones y seguimiento.
          </Text>

         
        </MotionFlex>
      </Container>

      {/* BENEFICIOS */}
      <BenefitsSection />

      {/* ROLES */}
      <RolesSection />

      {/* CTA FINAL */}
      <CTASection />

      {/* FOOTER */}
      <Text textAlign="center" mt={20} color="gray.500">
        © {new Date().getFullYear()} FCT Pasantias • Morvaden
      </Text>
    </Box>
        </>

  );
}

/* -------------------------------------------------------------------------- */
/*                           BENEFICIOS (ICON CARDS)                          */
/* -------------------------------------------------------------------------- */

function BenefitsSection() {
  const items = [
    {
      icon: FaCheckCircle,
      title: "Automatización Completa",
      desc: "Procesos rápidos y eficientes para gestionar vacantes, asignaciones y evaluaciones.",
    },
    {
      icon: FaSchool,
      title: "Integración con Instituciones",
      desc: "Los colegios gestionan estudiantes, tutores y reportes desde una sola plataforma.",
    },
    {
      icon: FaBuilding,
      title: "Gestión Empresarial",
      desc: "Las empresas publican vacantes, asignan tutores y realizan seguimiento.",
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
            transition="0.3s"
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

/* -------------------------------------------------------------------------- */
/*                                 ROLES                                      */
/* -------------------------------------------------------------------------- */

function RolesSection() {
  const roles = [
    {
      icon: FaUserGraduate,
      title: "Estudiantes",
      desc: "Acceden a vacantes y realizan seguimiento.",
    },
    {
      icon: FaSchool,
      title: "Colegios",
      desc: "Administran estudiantes, tutores, asignaciones y reportes.",
    },
    {
      icon: FaBuilding,
      title: "Empresas",
      desc: "Gestionan vacantes, asignan tutores empresariales y supervisan prácticas.",
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
              transition="0.3s"
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

/* -------------------------------------------------------------------------- */
/*                                   CTA                                      */
/* -------------------------------------------------------------------------- */

function CTASection() {
  return (
    <Container maxW="4xl" textAlign="center" py={20}>
      <Heading mb={4}>Listo para comenzar</Heading>
      <Text mb={8} fontSize="lg" color="gray.600">
        Conecta con instituciones y empresas de forma profesional y eficiente.
      </Text>
      <Stack
  direction={{ base: "column", md: "row" }}
  spacing={4}
  justify="center"
  maxW="lg"
  mx="auto"
>
  <Box
    as="form"
    width="100%"
    display="flex"
    flexDirection={{ base: "column", md: "row" }}
    gap={4}
  >
    <Input
      type="email"
      placeholder="Ingresa tu correo"
      size="lg"
      bg="white"
      _dark={{ bg: "gray.700" }}
      _placeholder={{ color: "gray.500" }}
      required
    />

    <Button type="submit" colorScheme="blue" size="lg" px={10}>
      Empezar
    </Button>
  </Box>
</Stack>

      
    </Container>
  );
}
