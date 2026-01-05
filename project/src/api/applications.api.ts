import axios from "axios";

export const applicationsApi = {
  // Tutor escolar -> asignar estudiante a vacante
  assign: async (dto: { studentId: string; vacancyId: string }) => {
    const res = await axios.post("/applications/assign", dto);
    return res.data;
  },

  // Tutor escolar -> listar todas sus asignaciones
  listForSchoolTutor: async () => {
    const res = await axios.get("/applications/school-tutor");
    return res.data;
  },

  // Tutor empresa -> listar asignaciones de su empresa
  listForCompanyTutor: async () => {
    const res = await axios.get("/applications/company-tutor");
    return res.data;
  },

  // Tutor empresa -> aprobar
  approve: async (id: string) => {
    const res = await axios.post(`/applications/${id}/approve`);
    return res.data;
  },

  // Tutor empresa -> rechazar
  reject: async (id: string, notes?: string) => {
    const res = await axios.post(`/applications/${id}/reject`, { notes });
    return res.data;
  },

  // Estudiante -> sus asignaciones
  listForStudent: async (studentId: string) => {
    const res = await axios.get(`/applications/student/${studentId}`);
    return res.data;
  },

  // Soft delete
  delete: async (id: string) =>
    axios.delete(`/applications/${id}`),

  // Restore
  restore: async (id: string) =>
    axios.patch(`/applications/${id}/restore`),
};
