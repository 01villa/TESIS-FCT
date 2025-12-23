// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  user: any | null;
  role: string | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  role: null,
  loadingAuth: true,
  login: async () => {},
  logout: () => {},
});

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const AuthProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState<any>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));
  const [loadingAuth, setLoadingAuth] = useState(true);

  // ============= CONFIG AXIOS =============
  useEffect(() => {
    axios.defaults.baseURL = API_URL;

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoadingAuth(false);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // ============= LOGIN =============
  const login = async (email: string, password: string) => {
    const res = await axios.post("/auth/login", { email, password });
    const data = res.data;

    const decoded: any = jwtDecode(data.token);

    const firstRole =
      Array.isArray(data.user?.roles) && data.user.roles.length > 0
        ? data.user.roles[0]
        : decoded.roles?.[0] ?? null;

const userFinal = {
  ...data.user,        // 👈 NO pierdes nada (photoUrl incluida)
  role: firstRole,     // 👈 mantienes compatibilidad con tu app
};

if (decoded.schoolId) userFinal.schoolId = decoded.schoolId;
if (decoded.companyId) userFinal.companyId = decoded.companyId;


    setToken(data.token);
    setUser(userFinal);
    setRole(firstRole);

    localStorage.setItem("user", JSON.stringify(userFinal));
    if (firstRole) localStorage.setItem("role", firstRole);
  };

  // ============= LOGOUT =============
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        loadingAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
