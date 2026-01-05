import axios from "axios";

export const dashboardApi = {
  async getStats() {
    const [
      vacanciesRes,
      studentsRes,
      companiesRes,
      schoolsRes,
      applicationsRes
    ] = await Promise.all([
      axios.get("/vacancies"),
      axios.get("/admin/students"),
      axios.get("/admin/companies"),
      axios.get("/admin/schools"),
      axios.get("/applications"),
    ]);

    const applicationsAccepted = Array.isArray(applicationsRes.data)
      ? applicationsRes.data.filter((a) => a.status === "ACCEPTED").length
      : 0;

    return {
      vacancies: Array.isArray(vacanciesRes.data)
        ? vacanciesRes.data.length
        : 0,

      students: Array.isArray(studentsRes.data)
        ? studentsRes.data.length
        : 0,

      companies: Array.isArray(companiesRes.data)
        ? companiesRes.data.length
        : 0,

      schools: Array.isArray(schoolsRes.data)
        ? schoolsRes.data.length
        : 0,

      applicationsAccepted,
    };
  }
};
