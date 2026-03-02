import { Button, Card, Col, Row, Statistic, Typography } from 'antd';

const { Title, Text } = Typography;

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-hero">
        <div>
          <p className="dashboard-kicker">PAIEV Dashboard</p>
          <Title level={2}>ภาพรวมการยืนยันตัวตน</Title>
          <Text>จัดการผู้ใช้งานและดูสถานะการส่งแบบฟอร์มแบบเรียลไทม์</Text>
        </div>
        <div className="dashboard-actions">
          <Button type="primary" size="large">สร้างคำขอใหม่</Button>
        </div>
      </header>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Statistic title="คำขอใหม่วันนี้" value={38} />
            <p className="stat-sub">เพิ่มขึ้น 12% จากเมื่อวาน</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Statistic title="กำลังตรวจสอบ" value={9} />
            <p className="stat-sub">ต้องการการอนุมัติจากฝ่าย HR</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Statistic title="ผ่านการยืนยัน" value={124} />
            <p className="stat-sub">อัปเดตล่าสุด 5 นาทีที่แล้ว</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-grid">
        <Col xs={24} md={12}>
          <Card className="info-card" title="รายการที่ต้องติดตาม">
            <ul>
              <li>อัปเดตข้อมูลโปรไฟล์ผู้ใช้งานใหม่ 4 ราย</li>
              <li>ตรวจสอบคำขอเอกสารด่วน 2 รายการ</li>
              <li>ยืนยันข้อมูลติดต่อประจำเดือน</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="info-card" title="ขั้นตอนถัดไป">
            <ul>
              <li>ส่งแจ้งเตือนให้หัวหน้าฝ่ายที่เกี่ยวข้อง</li>
              <li>สำรองข้อมูลรายสัปดาห์</li>
              <li>จัดทำรายงานสรุปผู้ใช้งานรายเดือน</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
