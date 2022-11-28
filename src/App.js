import './App.css';
import { Segmented } from 'antd';
import LatestContents from './pages/contents';
import { FloatButton } from 'antd';
import { UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";

const menus = [
  {
    icon: <UnorderedListOutlined />,
    value: "Timeline"
  },
  {
    icon: <SettingOutlined />,
    value: "Settings"
  }
]


function App() {
  return (
    <div>
      <header className='header'>
        <Segmented
          size='large'
          options={menus} />
      </header>
      <main>
        <LatestContents />
        <FloatButton.BackTop />
      </main>
      <footer></footer>


    </div>
  );
}

export default App;
