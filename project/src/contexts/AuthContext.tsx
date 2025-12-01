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

// Base URL global
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const AuthProvider = ({ children }: { children: any }) => {
  // 🔥 Carga instantánea desde localStorage (sin flashes, sin re-render)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState<any>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const [role, setRole] = useState<string | null>(() =>
    localStorage.getItem("role")
  );

  const [loadingAuth, setLoadingAuth] = useState(true);

  // ---------------------------------------------------
  // 1) Configurar axios
  // ---------------------------------------------------
  useEffect(() => {
    axios.defaults.baseURL = API_URL;

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // terminar carga
    setLoadingAuth(false);
  }, []);

  // Cuando cambia el token dinámicamente
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ---------------------------------------------------
  // 2) LOGIN
  // ---------------------------------------------------
  const login = async (email: string, password: string) => {
  const res = await axios.post("/auth/login", { email, password });

  const data = res.data;

  // 🔥 Decodificar el token JWT
  const decoded: any = jwtDecode(data.token);

  // obtener el primer rol del backend
  const firstRole =
    Array.isArray(data.user?.roles) && data.user.roles.length > 0
      ? data.user.roles[0]
      : decoded.role ?? null;

  // 🔥 Construir el objeto user completo
  const userFinal = {
    id: data.user?.id,
    fullName: data.user?.fullName,
    role: firstRole,
    schoolId: decoded.schoolId ?? null, // 🔥 AQUI LA MAGIA
  };

  // Guardar estado
  setToken(data.token);
  setUser(userFinal);
  setRole(firstRole);

  // Persistencia
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(userFinal));
  if (firstRole) localStorage.setItem("role", firstRole);
};
  // ---------------------------------------------------
  // 3) LOGOUT
  // ---------------------------------------------------
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

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
