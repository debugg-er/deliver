import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

import { IUser, IToken } from "@interfaces/User";
import userApi from "@api/userApi";
import accountApi from "@api/accountApi";

type Auth = (IUser & IToken & { token: string }) | null;

const AuthContext = React.createContext<{
  // undefined means the app is loading user credential
  // null is unauthorize
  user: Auth;
  logout: () => void;
  login: (username: string, password: string) => void;
}>({
  user: null,
  logout: () => {},
  login: () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider(props: { children?: React.ReactNode }) {
  const [user, setUser] = useState<Auth | undefined>(undefined);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    try {
      if (!token) throw new Error();
      const parsedToken = jwtDecode(token) as IToken;
      if (parsedToken.exp && parsedToken.exp * 1000 - Date.now() < 0) throw new Error();

      userApi
        .getMeInfo()
        .then((_user) => setUser({ ...parsedToken, ..._user, token }))
        .catch(() => {
          window.localStorage.removeItem("token");
          setUser(null);
        });
    } catch {
      setUser(null);
    }
  }, []);

  async function login(username: string, password: string) {
    const data = await accountApi.login(username, password);
    window.localStorage.setItem("token", data.token);
    window.location.reload();
  }

  async function logout() {
    try {
      await accountApi.logout();
    } catch {
    } finally {
      window.localStorage.removeItem("token");
      window.location.reload();
    }
  }

  return (
    <AuthContext.Provider value={{ user: user || null, logout, login }}>
      {user !== undefined && props.children}
    </AuthContext.Provider>
  );
}
