import { Token } from "graphql";
import fetch from "./fetch";

export const getProfile = (token) => {
  return fetch({
    url: "/institution/user/self",
    method: "get",
    headers: {
      "x-hufu-token": token,
    }
  });
};

export const auth = (data) => {
  return fetch({
    url: "/user/signin/password/mobile",
    method: "post",
    data,
  });
};
