// src/api/vacancies.api.ts
import axios from "axios";

export const vacanciesApi = {
  // Todas las vacantes activas
  list: async () => {
    const res = await axios.get("/vacancies");
    return res.data;
  },

  // Vacantes activas por empresa
  listByCompany: async (companyId: string) => {
    const res = await axios.get(`/vacancies/company/${companyId}`);
    return res.data;
  },

  // Obtener detalle de vacante
  get: async (id: string) => {
    const res = await axios.get(`/vacancies/${id}`);
    return res.data;
  },

  // Crear vacante (empresa)
  create: async (companyId: string, dto: any) => {
    const res = await axios.post(`/vacancies/company/${companyId}`, dto);
    return res.data;
  },

  // Actualizar vacante
  update: async (id: string, dto: any) => {
    const res = await axios.put(`/vacancies/${id}`, dto);
    return res.data;
  },

  // Cerrar vacante
  close: async (id: string) => {
    const res = await axios.patch(`/vacancies/${id}/close`);
    return res.data;
  },

  // Abrir vacante
  open: async (id: string) => {
    const res = await axios.patch(`/vacancies/${id}/open`);
    return res.data;
  },

  // Soft delete
  delete: async (id: string) => {
    await axios.delete(`/vacancies/${id}`);
  },

  // Restore
  restore: async (id: string) => {
    const res = await axios.patch(`/vacancies/${id}/restore`);
    return res.data;
  },
};
