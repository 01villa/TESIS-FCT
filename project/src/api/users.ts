import axios from "axios";

export const usersApi = {
  listBasic: async () => {
    const res = await axios.get("/users/basic");
    return res.data;
  },
};
