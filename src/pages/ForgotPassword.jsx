import { Button, Form, Input, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';

const { Text } = Typography;

export default function ForgotPassword() {
  const onFinish = () => {};

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-badge">กู้คืนบัญชี</div>
          <h2>เริ่มต้นใหม่อย่างปลอดภัย</h2>
          <p>
            ระบบจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลที่ลงทะเบียนไว้ภายในไม่กี่นาที
          </p>
          <ul className="auth-checklist">
            <li>ยืนยันตัวตนด้วยอีเมลหลัก</li>
            <li>ตั้งรหัสผ่านใหม่อย่างปลอดภัย</li>
            <li>เข้าสู่ระบบได้ทันทีหลังยืนยัน</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <AuthCard
          title="ลืมรหัสผ่าน"
          subtitle="กรอกอีเมลที่ลงทะเบียนไว้เพื่อรับลิงก์รีเซ็ต"
          footer={
            <Space direction="vertical" size={8}>
              <Text type="secondary">มีบัญชีแล้ว? <Link to="/login">กลับไปหน้าเข้าสู่ระบบ</Link></Text>
            </Space>
          }
        >
          <Form layout="vertical" onFinish={onFinish} requiredMark="optional">
            <Form.Item
              label="อีเมล"
              name="email"
              rules={[
                { required: true, message: 'กรุณากรอกอีเมล' },
                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
              ]}
            >
              <Input placeholder="example@company.com" size="large" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block>
              ส่งลิงก์รีเซ็ต
            </Button>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
}
