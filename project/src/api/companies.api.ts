import axios from "axios";

export const companiesApi = {
  // LISTAR TODAS LAS COMPAÑÍAS (ADMIN)
  list: async () => {
    const res = await axios.get("/admin/companies");
    return res.data;
  },

  // OBTENER UNA COMPAÑÍA POR ID
  get: async (id: string) => {
    const res = await axios.get(`/admin/companies/${id}`);
    return res.data;
  },

  // CREAR COMPAÑÍA
  create: async (dto: any) => {
    const res = await axios.post("/admin/companies", dto);
    return res.data;
  },

  // ACTUALIZAR COMPAÑÍA
  update: async (id: string, dto: any) => {
    const res = await axios.put(`/admin/companies/${id}`, dto);
    return res.data;
  },

  // ELIMINAR (SOFT DELETE)
  delete: async (id: string) => {
    await axios.delete(`/admin/companies/${id}`);
  },

  // RESTAURAR
  restore: async (id: string) => {
    const res = await axios.patch(`/admin/companies/${id}/restore`);
    return res.data;
  },

    uploadLogo: async (companyId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.patch(
      `/admin/companies/${companyId}/logo`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  removeLogo: async (companyId: string) => {
    await axios.patch(`/admin/companies/${companyId}/logo/remove`);
  },
};
