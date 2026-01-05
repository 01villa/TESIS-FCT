import axios from "axios";

export const companyTutorApi = {
  list: async () => {
    const res = await axios.get("/admin/company-tutors");
    return res.data;
  },

  listByCompany: async (companyId: string) => {
    const res = await axios.get(`/admin/company-tutors/company/${companyId}`);
    return res.data;
  },

  get: async (id: string) => {
    const res = await axios.get(`/admin/company-tutors/${id}`);
    return res.data;
  },

  create: async (companyId: string, data: any) => {
    const res = await axios.post(`/admin/company-tutors/${companyId}`, data);
    return res.data;
  },

  update: async (id: string, data: any) => {
    const res = await axios.put(`/admin/company-tutors/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/admin/company-tutors/${id}`);
  },

  restore: async (id: string) => {
    const res = await axios.patch(`/admin/company-tutors/${id}/restore`);
    return res.data;
  },
};
