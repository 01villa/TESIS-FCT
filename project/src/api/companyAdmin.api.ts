// src/api/companyAdmin.api.ts
import axios from "axios";

export const companyAdminApi = {
  listByCompany: async (companyId: string) => {
    const res = await axios.get(`/admin/company-admins/company/${companyId}`);
    return res.data;
  },

 async create(companyId: string, data: any) {
  const res = await axios.post(`/admin/companies/${companyId}/admin`, data);
  return res.data;
},

  delete: async (id: string) => {
    await axios.delete(`/admin/company-admins/${id}`);
  },

  restore: async (id: string) => {
    const res = await axios.patch(`/admin/company-admins/${id}/restore`);
    return res.data;
  },
};
