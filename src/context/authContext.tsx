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
import { api } from "../api/api";

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

  const login = (token: CredentialResponse) => {
    if (!token.credential) {
      throw new Error();
    }
    const decoded = jwtDecode<Payload>(token.credential);
    sessionStorage.setItem("gsi_credential", token.credential);

    let existing = api.getUser(decoded.sub);
    if (existing) {
      setUser(existing);
    } else {
      const user = {
        id: decoded.sub,
        name: decoded.given_name,
        surname: decoded.family_name,
        role: decoded.email == "dgoyman13@gmail.com" ? "admin" : "guest",
        banned: false,
      } as User;
      api.addUser(user);
      setUser(user);
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("gsi_credential");

      if (!token) return;

      const decoded = jwtDecode<Payload>(token);
      if (decoded.exp * 1000 > Date.now()) {
        let existing = api.getUser(decoded.sub);
        if (existing) {
          setUser(existing);
        } else {
          const user = {
            id: decoded.sub,
            name: decoded.given_name,
            surname: decoded.family_name,
            role: decoded.email == "dgoyman13@gmail.com" ? "admin" : "guest",
            banned: false,
          } as User;
          api.addUser(user);
          setUser(user);
        }
      } else {
        sessionStorage.removeItem("gsi_credential");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
