import "./App.css";
import { Segmented } from "antd";
import LatestContents from "./pages/contents";
import { FloatButton, Affix, Layout, Menu } from "antd";
import { UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";
import { ConfigProvider, theme } from "antd";
import Flow from "./pages/Flow";
import WithData from "./helpers/with-data";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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
  getItem("时间线", "1", <UnorderedListOutlined />),
  // getItem('设置', '2', <SettingOutlined />),
  // getItem('User', 'sub1', <UserOutlined />, [
  //   getItem('Tom', '3'),
  //   getItem('Bill', '4'),
  //   getItem('Alex', '5'),
  // ]),
  // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  // getItem('Files', '9', <FileOutlined />),
];
function App() {
  const [locale, setLocal] = useState(zhCN);

  useEffect(() => {
    dayjs.locale("zh-cn");
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <WithData>
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
            <Menu defaultSelectedKeys={["1"]} items={items} />
          </Sider>
          <Layout style={{ marginLeft: 80 }}>
            {/* <Header></Header> */}
            <Content>
              <Flow />
              <FloatButton.BackTop />
            </Content>
            <Footer className="footer"></Footer>
          </Layout>
        </Layout>
      </WithData>
    </ConfigProvider>
  );
}

export default App;
