import {
  Box,
  Heading,
  Button,
  Select,
  Spinner,
  Center,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import { schoolStudentsApi } from "../../api/school.students.api";
import { vacanciesApi } from "../../api/vacancies.api";
import { applicationsApi } from "../../api/applications.api";

export default function TutorAssign() {
  const toast = useToast();
  const { user } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);

  const [studentId, setStudentId] = useState("");
  const [vacancyId, setVacancyId] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // LOAD DATA (students de la escuela + vacantes globales)
  // ---------------------------------------------------------
  const loadData = async () => {
    setLoading(true);

    // 1️⃣ Estudiantes de MI ESCUELA
    const studs = await schoolStudentsApi.listBySchool(user.schoolId);

    // 2️⃣ Vacantes globales
    const vacs = await vacanciesApi.list();

    setStudents(studs);
    setVacancies(vacs);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.schoolId) loadData();
  }, [user]);

  // ---------------------------------------------------------
  // ASSIGN
  // ---------------------------------------------------------
  const assign = async () => {
    await applicationsApi.assign({
      studentId,
      vacancyId,
    });

    toast({
      title: "Asignación creada",
      description: "El estudiante fue asignado correctamente.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // limpiar selección
    setStudentId("");
    setVacancyId("");
  };

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box maxW="600px" mt={5}>
      <Heading mb={6}>Asignar Estudiante a Vacante</Heading>

      {/* Estudiante */}
      <FormControl mb={4}>
        <FormLabel>Estudiante</FormLabel>
        <Select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Seleccione…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName} — {s.email ?? ""}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Vacante */}
      <FormControl mb={4}>
        <FormLabel>Vacante</FormLabel>
        <Select
          value={vacancyId}
          onChange={(e) => setVacancyId(e.target.value)}
        >
          <option value="">Seleccione…</option>
          {vacancies.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button
        colorScheme="blue"
        onClick={assign}
        disabled={!studentId || !vacancyId}
      >
        Asignar
      </Button>
    </Box>
  );
}
