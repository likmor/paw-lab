import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { Payload, User } from "../types";
import type { CredentialResponse } from "@react-oauth/google";
import { api, config } from "../config";

type AuthContextType = {
  user: User | null;
  login: (token: CredentialResponse) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (token: CredentialResponse) => {
    if (!token.credential) {
      throw new Error();
    }
    const decoded = jwtDecode<Payload>(token.credential);
    sessionStorage.setItem("gsi_credential", token.credential);

    let existing = await api.getUser(decoded.sub);
    if (existing) {
      setUser(existing);
    } else {
      const user = {
        id: decoded.sub,
        name: decoded.given_name,
        surname: decoded.family_name,
        role: decoded.email === config.adminEmail ? "admin" : "guest",
        banned: false,
      } as User;
      await api.addUser(user);
      setUser(user);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const login = async () => {
      try {
        const token = sessionStorage.getItem("gsi_credential");

        if (!token) return;

        const decoded = jwtDecode<Payload>(token);
        if (decoded.exp * 1000 > Date.now()) {
          let existing = await api.getUser(decoded.sub);
          if (existing) {
            setUser(existing);
          } else {
            const user = {
              id: decoded.sub,
              name: decoded.given_name,
              surname: decoded.family_name,
              role: decoded.email === config.adminEmail ? "admin" : "guest",
              banned: false,
            } as User;
            await api.addUser(user);
            setUser(user);
          }
        } else {
          sessionStorage.removeItem("gsi_credential");
        }
      } finally {
        setLoading(false);
      }
    };
    login();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
