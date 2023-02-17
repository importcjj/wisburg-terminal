import React from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default () => {
  let [searchParams, setSearchParams] = useSearchParams();
  let { authByToken } = useAuth();

  React.useEffect(() => {
    const t = searchParams.get("cookie");
    authByToken(t);
  }, []);

  return <div>微信登录成功</div>;
};
