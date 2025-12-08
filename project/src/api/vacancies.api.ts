// src/api/vacancies.api.ts
import axios from "axios";

export const vacanciesApi = {
  list: async () => {
    const res = await axios.get("/vacancies");
    return res.data;
  },

  listByCompany: async (companyId: string) => {
    const res = await axios.get(`/vacancies/company/${companyId}`);
    return res.data;
  },

  get: async (id: string) => {
    const res = await axios.get(`/vacancies/${id}`);
    return res.data;
  },

  create: async (companyId: string, dto: any) => {
    const res = await axios.post(`/vacancies/company/${companyId}`, dto);
    return res.data;
  },

  update: async (id: string, dto: any) => {
    const res = await axios.put(`/vacancies/${id}`, dto);
    return res.data;
  },

  close: async (id: string) => {
    const res = await axios.patch(`/vacancies/${id}/close`);
    return res.data;
  },

  open: async (id: string) => {
    const res = await axios.patch(`/vacancies/${id}/open`);
    return res.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/vacancies/${id}`);
  },

  restore: async (id: string) => {
    const res = await axios.patch(`/vacancies/${id}/restore`);
    return res.data;
  },
};
