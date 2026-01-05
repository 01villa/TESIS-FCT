import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  useColorModeValue,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/react";

const MotionBox = motion(Box);

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      px={6}
      py={3}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
    >

<Flex
  h={16}
  alignItems="center"
  justifyContent="space-between"
  maxW="7xl"
  mx="auto"
>
  <Text
    fontSize="xl"
    fontWeight="700"
    bgGradient="linear(to-r, blue.500, teal.400)"
    bgClip="text"
  >
    Pasantías
  </Text>

  {/* MENU DESKTOP */}
  <HStack spacing={6} display={{ base: "none", md: "flex" }}>
    <Button as={Link} to="/" variant="link" color="gray.600">
      Inicio
    </Button>
    <Button as={Link} to="/info" variant="link" color="gray.600">
      Información
    </Button>
    <Button as={Link} to="/login" colorScheme="blue">
      Iniciar Sesión
    </Button>

    
  </HStack>

  {/* MOBILE TOGGLE */}
  <IconButton
    size="md"
    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
    aria-label="Abrir menú"
    display={{ md: "none" }}
    onClick={onToggle}
  />
</Flex>


      {/* MOBILE MENU SIN COLLAPSE */}
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            overflow="hidden"
            bg={useColorModeValue("white", "gray.900")}
            py={4}
            display={{ md: "none" }}
          >
            <VStack spacing={4}>
              <Button as={Link} to="/" variant="ghost" w="full">
                Inicio
              </Button>

              <Button as={Link} to="/info" variant="ghost" w="full">
                Información
              </Button>

              <Button as={Link} to="/login" colorScheme="blue" w="full">
                Iniciar Sesión
              </Button>
              <Button
  onClick={toggleColorMode}
  variant="ghost"
  w="full"
  leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
>
  {colorMode === "light" ? "Modo Oscuro" : "Modo Claro"}
</Button>

            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}
