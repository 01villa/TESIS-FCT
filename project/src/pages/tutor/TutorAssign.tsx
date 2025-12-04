import { Box, Heading, Button, Select, Spinner, Center, FormControl, FormLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TutorAssign() {
  const [students, setStudents] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [vacancyId, setVacancyId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await axios.get("/applications/school-tutor/students");
      const v = await axios.get("/applications/school-tutor/vacancies");

      setStudents(s.data);
      setVacancies(v.data);
      setLoading(false);
    })();
  }, []);

  const assign = async () => {
    await axios.post("/applications/school-tutor/assign", {
      studentId,
      vacancyId,
    });

    alert("Estudiante asignado correctamente");
  };

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box maxW="500px">
      <Heading mb={6}>Asignar Estudiante</Heading>

      <FormControl mb={4}>
        <FormLabel>Estudiante</FormLabel>
        <Select onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Seleccione...</option>
          {students.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.fullName}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Vacante</FormLabel>
        <Select onChange={(e) => setVacancyId(e.target.value)}>
          <option value="">Seleccione...</option>
          {vacancies.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button colorScheme="blue" onClick={assign} disabled={!studentId || !vacancyId}>
        Asignar
      </Button>
    </Box>
  );
}
