import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function MainSponsorSection() {
  const cardBg = useColorModeValue("white", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.300");
  const border = useColorModeValue("gray.200", "whiteAlpha.200");
  const imgBg = useColorModeValue("gray.50", "gray.600");

  // ============================
  // MAIN SPONSOR (MANUAL)
  // ============================
  const sponsor = {
    name: "Instituto Tecnológico Sudamericano",
    url: "https://sudamericano.edu.ec/",
    logo: "/logos/sudamericano.png", // 👉 colócalo en /public/logos
    label: "Patrocinador principal",
  };

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} py={20}>
      <Container maxW="6xl">
        {/* HEADER */}
        <Box textAlign="center" mb={10}>
          <Badge
            colorScheme="purple"
            px={4}
            py={1}
            rounded="full"
            fontSize="sm"
          >
            {sponsor.label}
          </Badge>

   

          <Text mt={2} color={muted}>
            Institución que respalda y potencia la plataforma
          </Text>
        </Box>

        {/* CARD */}
        <MotionBox
          mx="auto"
          maxW="4xl"
          bg={cardBg}
          border="1px solid"
          borderColor={border}
          rounded="2xl"
          shadow="lg"
          p={{ base: 6, md: 10 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -6 }}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={6}
          >
            {/* LOGO + NAME */}
            <Flex align="center" gap={5}>
              <Flex
                h="80px"
                w="160px"
                bg={imgBg}
                align="center"
                justify="center"
                rounded="lg"
              >
                <Box
                  as="img"
                  src={sponsor.logo}
                  alt={sponsor.name}
                  maxH="60px"
                  maxW="140px"
                  objectFit="contain"
                  onError={(e: any) =>
                    (e.currentTarget.style.display = "none")
                  }
                />
              </Flex>

              <Box>
                <Text fontWeight="800" fontSize="xl">
                  {sponsor.name}
                </Text>
                <Text fontSize="sm" color={muted}>
                  sudamericano.edu.ec
                </Text>
              </Box>
            </Flex>

            {/* CTA */}
            <Button
              as="a"
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="purple"
              size="lg"
            >
              Visitar sitio
            </Button>
          </Flex>
        </MotionBox>
      </Container>
    </Box>
  );
}
