import { Button } from "antd";
import React from "react";
import { useAuth } from "../../hooks/useAuth";

export default () => {
  const { logout } = useAuth();

  return (
    <>
      <Button onClick={logout}>退出登录</Button>
    </>
  );
};
