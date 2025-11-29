import axios from "axios";

export const usersApi = {
  // Obtener admins del sistema
  list: async () => {
    const res = await axios.get("/admin/users");
    return res.data;
  },

  // Crear admin (forzado a rol ADMIN)
  create: async (dto: { fullName: string; email: string; password: string }) => {
    const res = await axios.post("/admin/users", {
      ...dto,
      roles: ["ADMIN"], // 🔥 obligatorio en tu backend
    });

    return res.data;
  },

  // Editar admin
  update: async (
    id: string,
    dto: {
      fullName: string;
      email: string;
      password?: string;
    }
  ) => {
    const res = await axios.put(`/admin/users/${id}`, {
      ...dto,
      roles: ["ADMIN"], // 🔥 mantenemos el rol, el backend lo exige
    });

    return res.data;
  },

  // Eliminar admin
  delete: async (id: string) => {
    await axios.delete(`/admin/users/${id}`);
  },
};
