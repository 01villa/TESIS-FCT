import axios from "axios";

export const usersApi = {
  // =========================
  // LIST
  // =========================
  list: async () => {
    const res = await axios.get("/admin/users");
    return res.data;
  },

  // =========================
  // CREATE
  // =========================
  create: async (dto: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const res = await axios.post("/admin/users", {
      ...dto,
      roles: ["ADMIN"],
    });
    return res.data;
  },

  // =========================
  // UPDATE DATA
  // =========================
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
      roles: ["ADMIN"],
    });
    return res.data;
  },

  // =========================
  // DELETE USER (soft delete)
  // =========================
  delete: async (id: string) => {
    await axios.delete(`/admin/users/${id}`);
  },

  // =========================
  // UPLOAD PHOTO
  // =========================
  uploadPhoto: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.patch(
      `/admin/users/${id}/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },

  // =========================
  // REMOVE PHOTO
  // =========================
  removePhoto: async (id: string) => {
    await axios.patch(`/admin/users/${id}/photo/remove`);
  },
};
