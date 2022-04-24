import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

import { IUser, IToken } from "@interfaces/User";
import userApi from "@api/userApi";
import accountApi from "@api/accountApi";

type Auth =
  | (IUser &
     IToken & { token: string; friends: Array<IUser>; friendCount: number; friendRequestCount: number })
  | null;

const AuthContext = React.createContext<{
  // undefined means the app is loading user credential
  // null is unauthorize
  user: Auth;
  setUser: React.Dispatch<React.SetStateAction<Auth>>;
  logout: () => void;
  login: (username: string, password: string) => void;
}>({
  user: null,
  setUser: () => {},
  logout: () => {},
  login: () => {},
});

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider(props: { children?: React.ReactNode }) {
  const [user, setUser] = useState<Auth>(undefined as any);

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
          if (!window.location.pathname.startsWith("/auth/login"))
            window.location.href = "/auth/login";
          setUser(null);
        });
    } catch {
      if (!window.location.pathname.startsWith("/auth")) window.location.href = "/auth/login";
      setUser(null);
    }
  }, []);

  async function login(username: string, password: string) {
    const data = await accountApi.login(username, password);
    window.localStorage.setItem("token", data.token);
    window.location.href = "/messages";
  }

  async function logout() {
    try {
      await accountApi.logout();
    } catch {
    } finally {
      window.localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login }}>
      {user !== undefined && props.children}
    </AuthContext.Provider>
  );
}
