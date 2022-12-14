import { Button } from "antd";
import React from "react";
import { useAuth } from "../../hooks/useAuth";

import "./index.css";

export default () => {
  const { logout } = useAuth();

  return (
    <div className="settings-box">
      <Button type="primary" onClick={logout}>
        退出登录
      </Button>
    </div>
  );
};
