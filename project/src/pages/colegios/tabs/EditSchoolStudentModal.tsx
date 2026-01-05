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

type Specialty = { id: string; name: string };

export default function EditSchoolStudentModal({
  isOpen,
  onClose,
  student,
  onUpdated,
}: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ci, setCi] = useState("");
  const [phone, setPhone] = useState("");

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [specialtyId, setSpecialtyId] = useState<string>("");

  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setCi("");
    setPhone("");
    setSpecialtyId("");
  };

  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data);
    } finally {
      setLoadingSpecialties(false);
    }
  };

  const loadStudentDetail = async (id: string) => {
    setLoadingStudent(true);
    try {
      const full = await schoolStudentsApi.getById(id);

      setFirstName(full.firstName || "");
      setLastName(full.lastName || "");
      setCi(full.ci || "");
      setPhone(full.phone || "");
      setSpecialtyId(full.specialtyId || "");
    } finally {
      setLoadingStudent(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadSpecialties();

    // si viene student del listado, solo trae id/fullName/email/etc.
    // por eso pedimos detalle real:
    if (student?.id) {
      loadStudentDetail(student.id);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, student?.id]);

  const handleSave = async () => {
    if (!student?.id) return;

    // clave: si está vacío, manda null para que el backend NO lo sobreescriba a ""
    const payload = {
      firstName: firstName.trim() === "" ? null : firstName.trim(),
      lastName: lastName.trim() === "" ? null : lastName.trim(),
      ci: ci.trim() === "" ? null : ci.trim(),
      phone: phone.trim() === "" ? null : phone.trim(),
      specialtyId: specialtyId ? specialtyId : null,
    };

    await schoolStudentsApi.update(student.id, payload);

    onUpdated();
    onClose();
  };

  const busy = loadingSpecialties || loadingStudent;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Editar Estudiante</ModalHeader>

        <ModalBody>
          {loadingStudent ? (
            <Flex align="center" gap={2} mb={4}>
              <Spinner size="sm" />
              <Text fontSize="sm">Cargando datos del estudiante…</Text>
            </Flex>
          ) : null}

          <FormControl mb={3}>
            <FormLabel>Nombres</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Apellidos</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Cédula / CI</FormLabel>
            <Input value={ci} onChange={(e) => setCi(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormControl>

          <FormControl mb={3} isDisabled>
            <FormLabel>Email</FormLabel>
            <Input value={student?.email || ""} />
          </FormControl>

          <FormControl mb={3}>
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
            isDisabled={busy}
          >
            Guardar
          </Button>
          <Button onClick={onClose} isDisabled={busy}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
