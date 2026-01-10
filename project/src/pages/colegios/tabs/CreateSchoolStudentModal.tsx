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
  Avatar,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { schoolStudentsApi } from "../../../api/school.students.api";
import { specialtiesApi } from "../../../api/specialties.api";
import { usersApi } from "../../../api/users.api";

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

  // ✅ FOTO
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setCi("");
    setEmail("");
    setPassword("");
    setPhone("");
    setSpecialtyId("");
    setPhotoFile(null);
    setSaving(false);
  };

  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data ?? []);

      if ((data ?? []).length > 0 && !specialtyId) {
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

    try {
      setSaving(true);

      // 1) crea estudiante (crea también USER)
      // Debe devolver userId
      const created = await schoolStudentsApi.create(schoolId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ci: ci.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || null,
        specialtyId,
      });

      // 2) sube foto al USER
      if (photoFile) {
        const userId = created?.userId;
        if (!userId) {
          throw new Error(
            "El backend no devolvió userId en StudentDTO. Agrega userId al DTO para poder subir foto."
          );
        }
        await usersApi.uploadPhoto(userId, photoFile);
      }

      onCreated();
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    firstName.trim() &&
    lastName.trim() &&
    ci.trim() &&
    email.trim() &&
    password.trim() &&
    specialtyId &&
    !loadingSpecialties;

  const fullNamePreview = `${firstName} ${lastName}`.trim();
  const previewSrc = photoFile ? URL.createObjectURL(photoFile) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      isCentered
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Registrar Estudiante</ModalHeader>

        <ModalBody>
          {/* ✅ FOTO */}
          <FormControl mb={5}>
            <FormLabel>Foto (opcional)</FormLabel>

            <Flex align="center" gap={4}>
              <Avatar size="lg" name={fullNamePreview} src={previewSrc} />

              <Input
                type="file"
                accept="image/*"
                p={1}
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                isDisabled={saving}
              />
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={2}>
              Se guarda en el perfil del usuario del estudiante.
            </Text>
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Nombres</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Apellidos</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Cédula / CI</FormLabel>
            <Input
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Teléfono</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={saving}
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
                isDisabled={!specialties.length || saving}
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
            isLoading={saving}
            isDisabled={!canSave}
          >
            Guardar
          </Button>

          <Button
            onClick={() => {
              reset();
              onClose();
            }}
            isDisabled={saving}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
