import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthState {
  token: string | null;
  role: string | null;
  user: any | null;
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );
  const [user, setUser] = useState<any | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post("http://localhost:8080/auth/login", {
      email,
      password,
    });

    const data = res.data;
    const userRole = data.user.roles?.[0] ?? null;

    setToken(data.token);
    setRole(userRole);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("user", JSON.stringify(data.user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
