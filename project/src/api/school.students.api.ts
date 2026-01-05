import axios from "axios";

export const schoolStudentsApi = {
  // ✅ Listar por escuela
  listBySchool: async (schoolId: string) => {
    const res = await axios.get(`/admin/students/school/${schoolId}`);
    return res.data;
  },

   getById: async (id: string) => {
    const res = await axios.get(`/admin/students/${id}`);
    return res.data;
  },

  // ✅ Crear estudiante en una escuela
  create: async (schoolId: string, dto: any) => {
    const res = await axios.post(`/admin/students/school/${schoolId}`, dto);
    return res.data;
  },

  // ✅ Actualizar estudiante
  update: async (id: string, dto: any) => {
    const res = await axios.put(`/admin/students/${id}`, dto);
    return res.data;
  },

  // ✅ Eliminar (soft delete)
  delete: async (id: string) => {
    await axios.delete(`/admin/students/${id}`);
  },

  // ✅ Restaurar
  restore: async (id: string) => {
    await axios.patch(`/admin/students/${id}/restore`);
  },
};
