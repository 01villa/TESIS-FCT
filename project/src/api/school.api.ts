import axios from "axios";

export const schoolsApi = {
  list: async () => {
    const res = await axios.get("/schools");
    return res.data;
  },

  create: async (dto: any) => {
    const res = await axios.post("/schools", dto);
    return res.data;
  },

  update: async (id: string, dto: any) => {
    const res = await axios.put(`/schools/${id}`, dto);
    return res.data;
  },

  delete: async (id: string) => {
    await axios.delete(`/schools/${id}`);
  },
};
