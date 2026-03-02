import React from 'react';
import { Alert, Button, Checkbox, Form, Input, Typography, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import { login, persistToken } from '../lib/api.js';

const { Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [status, setStatus] = React.useState({ loading: false, error: '' });

  const onFinish = async (values) => {
    setStatus({ loading: true, error: '' });
    try {
      const data = await login(values);
      persistToken(data?.token, values.remember);
      navigate('/dashboard');
    } catch (error) {
      setStatus({ loading: false, error: error.message || 'เข้าสู่ระบบไม่สำเร็จ' });
      return;
    }
    setStatus({ loading: false, error: '' });
    form.resetFields(['password']);
  };

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-badge">ระบบเข้าสู่ระบบ</div>
          <h2>ศูนย์กลางการยืนยันตัวตน</h2>
          <p>
            เข้าสู่ระบบด้วยชื่อผู้ใช้หรืออีเมลเพื่อจัดการแบบฟอร์มและข้อมูลสำคัญได้ทันที
            พร้อมความปลอดภัยในระดับองค์กร
          </p>
          <div className="auth-stats">
            <div>
              <h3>99.9%</h3>
              <span>Uptime</span>
            </div>
            <div>
              <h3>2 นาที</h3>
              <span>Average approval</span>
            </div>
            <div>
              <h3>24/7</h3>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <AuthCard
          title="ยินดีต้อนรับกลับมา"
          subtitle="กรอกข้อมูลให้ครบเพื่อเข้าสู่ระบบ"
          footer={
            <Space direction="vertical" size={8}>
              <Text type="secondary">ยังไม่มีบัญชี? ติดต่อผู้ดูแลระบบ</Text>
              <Text type="secondary">ต้องการรีเซ็ตรหัสผ่าน? <Link to="/forgot-password">กดที่นี่</Link></Text>
            </Space>
          }
        >
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
            {status.error ? (
              <Alert
                type="error"
                message="ไม่สามารถเข้าสู่ระบบได้"
                description={status.error}
                showIcon
                style={{ marginBottom: 16 }}
              />
            ) : null}
            <Form.Item
              label="ชื่อผู้ใช้หรืออีเมล"
              name="identify"
              rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้หรืออีเมล' }]}
            >
              <Input placeholder="username หรือ email" size="large" />
            </Form.Item>

            <Form.Item
              label="รหัสผ่าน"
              name="password"
              rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
            >
              <Input.Password placeholder="รหัสผ่าน" size="large" />
            </Form.Item>

            <div className="auth-row">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>จดจำฉันไว้</Checkbox>
              </Form.Item>
              <Link to="/forgot-password">ลืมรหัสผ่าน?</Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={status.loading}
            >
              {status.loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
}
