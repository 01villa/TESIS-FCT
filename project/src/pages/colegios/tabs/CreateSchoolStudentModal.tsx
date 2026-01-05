import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { schoolStudentsApi } from "../../../api/school.students.api";
import { specialtiesApi } from "../../../api/specialties.api";

type Specialty = {
  id: string;
  name: string;
};

export default function CreateSchoolStudentModal({
  isOpen,
  onClose,
  schoolId,
  onCreated,
}: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ci, setCi] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [specialtyId, setSpecialtyId] = useState("");

  const [loadingSpecialties, setLoadingSpecialties] = useState(false);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setCi("");
    setEmail("");
    setPassword("");
    setPhone("");
    setSpecialtyId("");
  };

  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data);

      if (data.length > 0 && !specialtyId) {
        setSpecialtyId(data[0].id);
      }
    } finally {
      setLoadingSpecialties(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSpecialties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = async () => {
    if (!specialtyId) return;

    await schoolStudentsApi.create(schoolId, {
      firstName,
      lastName,
      ci,
      email,
      password,
      phone,
      specialtyId,
    });

    onCreated();
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Registrar Estudiante</ModalHeader>

        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Nombres</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Apellidos</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Cédula / CI</FormLabel>
            <Input value={ci} onChange={(e) => setCi(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Especialidad</FormLabel>

            {loadingSpecialties ? (
              <Flex align="center" gap={2}>
                <Spinner size="sm" />
                <Text fontSize="sm">Cargando especialidades…</Text>
              </Flex>
            ) : (
              <Select
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                placeholder="Selecciona una especialidad"
                isDisabled={!specialties.length}
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSave}
            isDisabled={!specialtyId || loadingSpecialties}
          >
            Guardar
          </Button>

          <Button
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
