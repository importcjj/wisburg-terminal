import fetch from "./fetch";

export const getProfile = () => {
  return fetch({
    url: "/user/self",
    method: "get",
  });
};

export const auth = (data) => {
  return fetch({
    url: "/user/signin/password/mobile",
    method: "post",
    data,
  });
};
