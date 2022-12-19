import { Header } from "antd/es/layout/layout"
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import UploadBeatModal from "./UploadBeatModal";



export default function Navbar() {

  const navigate = useNavigate();

  return (
      <Header style={{ width: '100%', margin: 0}}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
        >
          <Menu.Item key="upload">
            <UploadBeatModal />
          </Menu.Item>
          <Menu.Item key="beats">
            <Button type='ghost' onClick={() => { navigate('/beats') }} style={{ color: 'white' }}>Beats</Button>
          </Menu.Item>
          <Menu.Item key="settings">
            <Button type='ghost' onClick={() => { navigate('/settings') }} style={{ color: 'white' }}>Settings</Button>
          </Menu.Item>
          <Menu.Item key="about">
            <Button type='ghost' onClick={() => { navigate('/about') }} style={{ color: 'white' }}>About</Button>
          </Menu.Item>
        </Menu>
      </Header>
  )
}