import axios from "axios";
import { API_URL } from "../config/api";

export const partnersApi = {
  getAll: async () => {
    const { data } = await axios.get(`${API_URL}/api/public/partners`)

    return data;
  },
};
