import axios from "axios";

export const schoolTutorsApi = {
  // listado por escuela
  listBySchool: async (schoolId: string) => {
    const res = await axios.get(`/admin/school-tutors/school/${schoolId}`);
    return res.data;
  },

  // crear
  create: async (schoolId: string, dto: any) => {
  const res = await axios.post(`/admin/school-tutors/${schoolId}`, dto);
  return res.data;
},


  // update
  update: async (id: string, dto: any) => {
    const res = await axios.put(`/admin/school-tutors/${id}`, dto);
    return res.data;
  },

  // delete
  delete: async (id: string) => {
    await axios.delete(`/admin/school-tutors/${id}`);
  },

  // restore
  restore: async (id: string) => {
    await axios.patch(`/admin/school-tutors/${id}/restore`);
  },
};
