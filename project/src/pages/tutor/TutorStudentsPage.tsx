import { Box, Heading } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import StudentsTab from "../colegios/tabs/StudentsTab";

export default function TutorStudentsPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Heading mb={6} textAlign="center">Estudiantes de mi Escuela</Heading>

      <StudentsTab schoolId={user.schoolId} />
    </Box>
  );
}
