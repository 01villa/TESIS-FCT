import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { vacanciesApi } from "../../../api/vacancies.api";
import { specialtiesApi } from "../../../api/specialties.api";

type Specialty = {
  id: string;
  name: string;
};

type FormState = {
  title: string;
  description: string;
  capacity: string; // lo mantengo string por el input
  startDate: string;
  endDate: string;
  specialtyId: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onCreated?: () => void; // 👈 opcional
};

export default function CreateVacancyModal({
  isOpen,
  onClose,
  companyId,
  onCreated,
}: Props) {
  const toast = useToast();

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    capacity: "",
    startDate: "",
    endDate: "",
    specialtyId: "",
  });

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm({
      title: "",
      description: "",
      capacity: "",
      startDate: "",
      endDate: "",
      specialtyId: "",
    });
  };

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const loadSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
      const data = await specialtiesApi.list();
      setSpecialties(data);

      // Preselecciona si no hay nada elegido
      if (data.length > 0) {
        setForm((p) => ({ ...p, specialtyId: p.specialtyId || data[0].id }));
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "No se pudieron cargar especialidades",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setLoadingSpecialties(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSpecialties();
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const save = async () => {
    // Validaciones mínimas (evitan requests basura)
    if (!form.title.trim()) {
      toast({ title: "El título es obligatorio", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    if (!form.specialtyId) return;

    const capacity = Number(form.capacity);
    if (!Number.isFinite(capacity) || capacity <= 0) {
      toast({ title: "Cupos inválidos", status: "warning", duration: 2000, isClosable: true });
      return;
    }

    setSaving(true);
    try {
      await vacanciesApi.create(companyId, {
        title: form.title.trim(),
        description: form.description.trim(),
        requirements: [],
        capacity,
        startDate: form.startDate,
        endDate: form.endDate,
        specialtyId: form.specialtyId,
      });

      // ✅ Primero notifica y cierra (UX)
      toast({
        title: "Vacante creada",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // ✅ Cierra sin romper nada
      reset();
      onClose();

      // ✅ Refresca si te pasaron callback (sin crash)
      if (typeof onCreated === "function") onCreated();
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error al crear vacante",
        description: e?.response?.data?.message || e?.message || "Intenta nuevamente",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
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
        <ModalHeader>Nueva Vacante</ModalHeader>
        <ModalCloseButton isDisabled={saving} />

        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Título</FormLabel>
            <Input name="title" value={form.title} onChange={update} isDisabled={saving} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Descripción</FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={update}
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
                name="specialtyId"
                value={form.specialtyId}
                onChange={update}
                placeholder="Selecciona una especialidad"
                isDisabled={!specialties.length || saving}
              >
                {specialties.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Cupos</FormLabel>
            <Input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={update}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Fecha Inicio</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={update}
              isDisabled={saving}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Fecha Fin</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={update}
              isDisabled={saving}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={save}
            isLoading={saving}
            isDisabled={loadingSpecialties || !form.specialtyId}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
