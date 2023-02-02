import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_QUERY } from "../data/query/old/user";
import { auth, getProfile } from "../data/restful/auth";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useLocalStorage("user", userData);
  const [token, setToken] = useLocalStorage("x-token", userData);
  const navigate = useNavigate();


  const setAuthorized = async (token, user) => {
    let data = await getProfile(token)

    const privileges = data.privileges || [];
    const i = privileges.findIndex(p => {
      if (p.name === "研报权限") { 
        const now = moment();
        const expiredAt = moment(p.expired_at)
        return expiredAt.isAfter(now)
       }
    });

    if (i === -1) {
      throw new Error("未开通机构权限")
    }
    setToken(token);
    setUser(user);

  }
  const clearAuthorized = () => {
    setUser(null);
    setToken(null);
  }

  const login = async ({ password, phone_number }) => {
    let { token, user } = await auth({
      password,
      phone_number: Number.parseInt(phone_number),
      country_code: 86,
    });

    await setAuthorized(token, user)
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
  };

  const authByToken = async (token) => {

    let user = await getProfile(token);
    await setAuthorized(token, user)

    return user
  }

  const logout = () => {
    clearAuthorized();
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      authByToken,
      token,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};


