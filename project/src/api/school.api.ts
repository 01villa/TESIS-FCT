import axios from "axios";

export const schoolsApi = {

  // === SCHOOLS ===
  list: async () => {
    const res = await axios.get("/admin/schools");
    return res.data;
  },

  get: async (id: string) => {
    const res = await axios.get(`/admin/schools/${id}`);
    return res.data;
  },

  create: async (dto: any) => {
    const res = await axios.post("/admin/schools", dto);
    return res.data;
  },

  update: async (id: string, dto: any) => {
    const res = await axios.put(`/admin/schools/${id}`, dto);
    return res.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/admin/schools/${id}`);
  },

  restore: async (id: string) => {
    const res = await axios.patch(`/admin/schools/${id}/restore`);
    return res.data;
  },

  // === SCHOOL ADMIN ===
  listAdmins: async (schoolId: string) => {
    const res = await axios.get(`/admin/school-admins/school/${schoolId}`);
    return res.data;
  },

  createAdmin: async (schoolId: string, dto: any) => {
    const res = await axios.post(`/admin/schools/${schoolId}/admin`, dto);
    return res.data;
  },

  deleteAdmin: async (adminId: string) => {
    await axios.delete(`/admin/school-admins/${adminId}`);
  },

  restoreAdmin: async (adminId: string) => {
    const res = await axios.patch(`/admin/school-admins/${adminId}/restore`);
    return res.data;
  },

  updateAdmin: async (adminId: string, dto: any) => {
    const res = await axios.put(`/admin/school-admins/${adminId}`, dto);
    return res.data;
  },
  
 uploadLogo: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.patch(`/admin/schools/${id}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  removeLogo: async (id: string) => {
    await axios.patch(`/admin/schools/${id}/logo/remove`);
  }, 
  
};
