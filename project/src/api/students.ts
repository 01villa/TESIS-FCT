import axios from "axios";

export const studentsApi = {
  list: async () => {
    const res = await axios.get("/students");
    return res.data;
  },
};
