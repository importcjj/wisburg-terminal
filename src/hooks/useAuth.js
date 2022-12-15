import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../data/restful/auth";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useLocalStorage("user", userData);
  const [token, setToken] = useLocalStorage("x-token", userData);
  const navigate = useNavigate();

  const login = async ({ password, phone_number }) => {
    let { token, user } = await auth({
      password,
      phone_number: Number.parseInt(phone_number),
      country_code: 86,
    });
    setToken(token);
    setUser(user);
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      token,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
