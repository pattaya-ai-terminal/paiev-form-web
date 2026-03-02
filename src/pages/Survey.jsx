import { Button, Card, Form, Input, Radio, Rate, Select, Typography } from 'antd';

const { Title, Text } = Typography;

export default function Survey() {
  const onFinish = () => {};

  return (
    <div className="survey-page">
      <Card className="survey-card">
        <div className="survey-header">
          <Title level={2}>แบบฟอร์มสำรวจความพึงพอใจ</Title>
          <Text type="secondary">ลิงก์สาธารณะ ไม่ต้องเข้าสู่ระบบ</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} requiredMark="optional">
          <Form.Item
            label="ชื่อ-นามสกุล"
            name="fullName"
            rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
          >
            <Input placeholder="เช่น สมชาย ใจดี" size="large" />
          </Form.Item>

          <Form.Item
            label="อีเมล"
            name="email"
            rules={[
              { required: true, message: 'กรุณากรอกอีเมล' },
              { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
            ]}
          >
            <Input placeholder="name@company.com" size="large" />
          </Form.Item>

          <Form.Item
            label="เลือกประเภทผู้ใช้งาน"
            name="role"
            rules={[{ required: true, message: 'กรุณาเลือกประเภทผู้ใช้งาน' }]}
          >
            <Select
              size="large"
              placeholder="เลือกประเภทผู้ใช้งาน"
              options={[
                { value: 'employee', label: 'พนักงาน' },
                { value: 'manager', label: 'หัวหน้าทีม' },
                { value: 'external', label: 'ผู้ใช้ภายนอก' }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="ประสบการณ์โดยรวม"
            name="experience"
            rules={[{ required: true, message: 'กรุณาเลือกคะแนน' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="ระบบตอบโจทย์งานของคุณหรือไม่"
            name="fit"
            rules={[{ required: true, message: 'กรุณาเลือกคำตอบ' }]}
          >
            <Radio.Group>
              <Radio value="yes">ตอบโจทย์มาก</Radio>
              <Radio value="partial">พอใช้ได้</Radio>
              <Radio value="no">ยังไม่ตอบโจทย์</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="ข้อเสนอแนะเพิ่มเติม" name="comment">
            <Input.TextArea rows={4} placeholder="พิมพ์ข้อเสนอแนะของคุณ" />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block>
            ส่งแบบสำรวจ
          </Button>
        </Form>
      </Card>
    </div>
  );
}
