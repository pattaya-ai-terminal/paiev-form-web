import React from 'react';
import { Button, Layout, Menu, Typography } from 'antd';
import {
  AppstoreOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clearToken, logout } from '../lib/api.js';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/dashboard',
    icon: <AppstoreOutlined />,
    label: <NavLink to="/dashboard">Dashboard</NavLink>
  },
  {
    key: '/survey-crud',
    icon: <FormOutlined />,
    label: <NavLink to="/survey-crud">Survey CRUD</NavLink>
  }
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {
      // ignore logout error
    } finally {
      clearToken();
      navigate('/login', { replace: true });
    }
  };

  return (
    <Layout className="app-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="app-sider"
      >
        <div className="app-sider-inner">
          <div className="app-brand">
            <div className="app-logo">PA</div>
            <div className="app-brand-text">
              <Text strong style={{ color: '#ffffff' }}>PAI EV</Text>
              <Text type="secondary">Smart Console</Text>
            </div>
          </div>
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
            className="app-menu"
          />
          <div className="app-sider-footer">
            <button type="button" className="app-logout" onClick={handleLogout}>
              <LogoutOutlined />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header className="app-header">
          <div className="app-header-left">
            <Button
              type="text"
              className="app-menu-toggle"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              <span className="app-menu-bars" />
            </Button>
            <Text strong>ยินดีต้อนรับ</Text>
            <Text type="secondary">แดชบอร์ดภาพรวมระบบ</Text>
          </div>
          <div className="app-header-actions">
            <Text type="secondary">ผู้ใช้งาน: Admin</Text>
          </div>
        </Header>
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  );
}
