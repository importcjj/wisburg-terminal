import "./App.css";
import { FloatButton, Layout, Menu, Button, ConfigProvider, theme } from "antd";
import {
  UnorderedListOutlined,
  SettingOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import zhCN from "antd/locale/zh_CN";

import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("时间线", "flow", <UnorderedListOutlined />),
  getItem("宏观导航", "navigator", <CompassOutlined />),
];
function App() {
  const [locale, setLocal] = useState(zhCN);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleMenuClick = ({ item, key, keyPath, domEvent }) => {
    switch (key) {
      case "flow":
        navigate("/");
        break;
      case "navigator":
        navigate("/navigator");
        break;

      default:
        break;
    }
  };

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Layout hasSider>
        <Sider
          collapsed
          style={{
            backgroundColor: "#141414",
            zIndex: 2,
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Menu
            defaultSelectedKeys={["flow"]}
            items={items}
            onClick={handleMenuClick}
          />
          <div
            style={{
              position: "fixed",
              bottom: 10,
              textAlign: "center",
              width: 80,
            }}
          >
            <Button type="text" onClick={logout}>
              登出
            </Button>
          </div>
        </Sider>
        <Layout style={{ marginLeft: 80 }}>
          <Content>
            <Outlet />
            <FloatButton.BackTop />
          </Content>
          <Footer className="footer"></Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
