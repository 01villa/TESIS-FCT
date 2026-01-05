import axios from "axios";

export const specialtiesApi = {
  // listado (activos) -> GET /api/specialties
  list: async () => {
    const res = await axios.get(`/api/specialties`);
    return res.data;
  },

  // crear -> POST /api/specialties
  create: async (dto: any) => {
    const res = await axios.post(`/api/specialties`, dto);
    return res.data;
  },

  // eliminar/desactivar -> DELETE /api/specialties/{id}
  deactivate: async (id: string) => {
    await axios.delete(`/api/specialties/${id}`);
  },
};
