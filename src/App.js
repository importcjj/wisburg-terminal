import "./App.css";
import { Segmented } from "antd";
import LatestContents from "./pages/contents";
import { FloatButton, Affix } from "antd";
import { UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";

const menus = [
  {
    label: <UnorderedListOutlined />,
    value: "Timeline",
  },
  {
    label: <SettingOutlined />,
    value: "Settings",
  },
];

function App() {
  return (
    <div>
      <header></header>

      <main>
        <LatestContents />
        <FloatButton.BackTop />
      </main>
      <footer className="footer">
        <Affix offsetBottom={5}>
          <Segmented size="large" options={menus} />
        </Affix>
      </footer>
    </div>
  );
}

export default App;
