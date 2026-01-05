import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../src/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>
);
