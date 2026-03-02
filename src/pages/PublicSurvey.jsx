import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Typography
} from 'antd';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitSurvey } from '../lib/api.js';

const { Title, Text } = Typography;

const BUSINESS_TYPES = [
  { label: 'ห้างสรรพสินค้า / คอมมูนิตี้มอลล์', value: 'shopping' },
  { label: 'โรงแรม / รีสอร์ท', value: 'hotel' },
  { label: 'อาคารสำนักงาน', value: 'office' },
  { label: 'ร้านอาหาร / คาเฟ่', value: 'restaurant' },
  { label: 'ปั๊มน้ำมัน', value: 'gas_station' },
  { label: 'อื่น ๆ', value: 'others' }
];

const USER_GROUPS = [
  { label: 'ลูกค้าทั่วไป', value: 'general_customers' },
  { label: 'ลูกค้าประจำ', value: 'loyal_customers' },
  { label: 'พนักงาน/บุคลากร', value: 'staff' },
  { label: 'นักเรียน/นักศึกษา', value: 'students' },
  { label: 'Fleet รถองค์กร', value: 'fleet' }
];

const PEAK_TIMES = [
  { label: '6:00–9:00', value: '06_09' },
  { label: '9:00–12:00', value: '09_12' },
  { label: '12:00–15:00', value: '12_15' },
  { label: '15:00–18:00', value: '15_18' },
  { label: '18:00–21:00', value: '18_21' },
  { label: '21:00–00:00', value: '21_00' },
  { label: '00:00–6:00', value: '00_06' },
  { label: 'ตลอดทั้งวัน', value: 'all_day' }
];

const PARKING_DURATIONS = [
  { label: '< 30 นาที', value: 'lt_30_minutes' },
  { label: '30–60 นาที', value: '30_60_minutes' },
  { label: '1–2 ชม.', value: '1_2_hours' },
  { label: '> 2 ชม.', value: 'gt_2_hours' }
];

const EV_PRESENCE = [
  { label: 'พบเป็นประจำ', value: 'regular' },
  { label: 'พบเป็นครั้งคราว', value: 'occasional' },
  { label: 'ยังไม่พบ', value: 'not_yet_observed' },
  { label: 'ยังไม่แน่ใจ', value: 'not_sure' }
];

const SLOTS = [
  { label: '1–2 ช่อง', value: '1_2' },
  { label: '3–4 ช่อง', value: '3_4' },
  { label: 'มากกว่า 4 ช่อง', value: 'gt_4' },
  { label: 'ยังไม่ตัดสินใจ', value: 'not_decided' }
];

const PARKING_POLICY = [
  { label: 'เฉพาะ EV', value: 'ev_only' },
  { label: 'ใช้ร่วม', value: 'shared_use' }
];

const INSTALL_LOCATIONS = [
  { label: 'ใกล้ทางเข้า–ออก', value: 'near_entry' },
  { label: 'ลานจอดหลัก', value: 'main_parking' },
  { label: 'ใกล้อาคาร', value: 'near_building' },
  { label: 'ยังไม่แน่ใจ', value: 'undecided' }
];

const TRANSFORMER = [
  { label: 'มี', value: 'yes' },
  { label: 'ไม่มี', value: 'no' },
  { label: 'ไม่ทราบ', value: 'unknown' }
];

const ELEC_CONTACT_KNOWN = [
  { label: 'มีข้อมูลติดต่อ', value: 'yes' },
  { label: 'ไม่ทราบ', value: 'unknown' }
];

const normalizePhone = (phone) => String(phone || '').replace(/[^\d]/g, '');
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
const isValidTHPhone = (phone) => {
  const digits = normalizePhone(phone);
  return digits.length >= 9 && digits.length <= 10;
};

export default function PublicSurvey() {
  const { token } = useParams();
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareCode = useMemo(() => {
    if (!token) return 'PUBLIC-DEMO';
    return token.length > 10 ? `${token.slice(0, 6)}...${token.slice(-4)}` : token;
  }, [token]);

  const buildPayload = (values) => ({
    fullName: values.fullName?.trim(),
    phone: normalizePhone(values.phone),
    placeName: values.placeName?.trim(),
    email: values.email?.trim(),
    province: values.province?.trim(),
    businessType: values.businessType || '',
    userGroups: values.userGroups || [],
    peakTimes: values.peakTimes || [],
    parkingDuration: values.parkingDuration || '',
    evPresence: values.evPresence || '',
    availableTime: values.availableTime?.trim(),
    slots: values.slots || '',
    parkingPolicy: values.parkingPolicy || '',
    installLocation: values.installLocation || [],
    areaConstraints: values.areaConstraints?.trim(),
    transformer: values.transformer || '',
    elecContactKnown: values.elecContactKnown || '',
    elecContactName: values.elecContactName?.trim(),
    elecContactPhone: normalizePhone(values.elecContactPhone),
    submittedAt: new Date().toISOString()
  });

  const handleSubmit = async (values) => {
    const payload = buildPayload(values);
    try {
      setLoading(true);
      const response = await submitSurvey(payload);
      if (response?.success) {
        message.success('ส่งแบบฟอร์มเรียบร้อยแล้ว');
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        message.error('ส่งแบบฟอร์มไม่สำเร็จ');
      }
    } catch (error) {
      message.error(error.message || 'ส่งแบบฟอร์มไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="ev-survey">
        <section className="success">
          <Card className="success-card" bordered={false}>
            <div className="badge" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
              </svg>
            </div>
            <Title level={4} style={{ marginBottom: 8 }}>
              ส่งข้อมูลเรียบร้อยแล้ว
            </Title>
            <Text>
              ขอบคุณที่ให้ความสนใจโครงการสถานี EV Charger
              <br />
              ทีมงานจะติดต่อกลับเพื่อประเมินพื้นที่เบื้องต้นภายใน <b>7 วันทำการ</b>
            </Text>
            <div style={{ marginTop: 18 }}>
              <Button onClick={handleReset} size="large">
                กลับไปกรอกใหม่ / หน้าแรก
              </Button>
            </div>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="ev-survey">
      <section className="hero">
        <div className="container hero-inner">
          <p className="kicker">ลิงก์สาธารณะ: {shareCode}</p>
          <h1>ขอรับการประเมินเบื้องต้นสำหรับติดตั้งสถานี EV Charger</h1>
          <p className="sub">
            กรุณากรอกข้อมูลเกี่ยวกับพื้นที่ของท่านเพื่อให้ทีมงานประเมินความเหมาะสม
            และติดต่อกลับภายใน <b>7 วันทำการ</b>
          </p>
        </div>
      </section>

      <main className="form-wrap">
        <Card className="card" bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark="optional"
            scrollToFirstError
          >
            <section className="section" id="sec-contact">
              <Title level={4} style={{ marginBottom: 6 }}>
                ข้อมูลผู้ติดต่อ
              </Title>
              <Text type="secondary">ช่องที่มีเครื่องหมาย * จำเป็นต้องกรอก</Text>

              <Row gutter={[24, 18]} style={{ marginTop: 18 }}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="ชื่อ – นามสกุล"
                    name="fullName"
                    rules={[{ required: true, message: 'กรุณากรอกชื่อ – นามสกุล' }]}
                  >
                    <Input placeholder="เช่น นายสมชาย ใจดี" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="เบอร์โทรศัพท์"
                    name="phone"
                    rules={[
                      { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
                      {
                        validator: (_, value) =>
                          !value || isValidTHPhone(value)
                            ? Promise.resolve()
                            : Promise.reject(new Error('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'))
                      }
                    ]}
                  >
                    <Input placeholder="เช่น 0812345678" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="ชื่อบริษัท / ชื่อสถานที่"
                    name="placeName"
                    rules={[{ required: true, message: 'กรุณากรอกชื่อบริษัท / ชื่อสถานที่' }]}
                  >
                    <Input placeholder="เช่น อาคาร ABC / โรงแรม XYZ" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="อีเมล"
                    name="email"
                    rules={[
                      { required: true, message: 'กรุณากรอกอีเมล' },
                      {
                        validator: (_, value) =>
                          !value || isValidEmail(value)
                            ? Promise.resolve()
                            : Promise.reject(new Error('กรุณากรอกอีเมลให้ถูกต้อง'))
                      }
                    ]}
                  >
                    <Input placeholder="เช่น example@company.com" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="จังหวัด / ทำเล" name="province">
                    <Input placeholder="เช่น กรุงเทพฯ / เชียงใหม่" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="ประเภทธุรกิจ" name="businessType">
                    <Select
                      placeholder="— เลือก —"
                      options={BUSINESS_TYPES}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </section>

            <section className="section" id="sec-usage">
              <Title level={4} style={{ marginBottom: 12 }}>
                ลักษณะการใช้งานพื้นที่
              </Title>

              <Form.Item label="กลุ่มผู้ใช้งานหลัก (เลือกได้มากกว่า 1)" name="userGroups">
                <Checkbox.Group className="survey-check-grid">
                  <Row gutter={[12, 12]}>
                    {USER_GROUPS.map((item) => (
                      <Col xs={24} md={12} key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="ช่วงเวลาการใช้งานหนาแน่น" name="peakTimes">
                <Checkbox.Group className="survey-check-grid">
                  <Row gutter={[12, 12]}>
                    {PEAK_TIMES.map((item) => (
                      <Col xs={24} sm={12} md={6} key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Row gutter={[24, 18]}>
                <Col xs={24} md={12}>
                  <Form.Item label="ระยะเวลาจอดรถโดยเฉลี่ย" name="parkingDuration">
                    <Radio.Group className="survey-radio-list">
                      <Row gutter={[12, 12]}>
                        {PARKING_DURATIONS.map((item) => (
                          <Col xs={24} key={item.value}>
                            <Radio value={item.value}>{item.label}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="การพบเห็น EV ในพื้นที่" name="evPresence">
                    <Radio.Group className="survey-radio-list">
                      <Row gutter={[12, 12]}>
                        {EV_PRESENCE.map((item) => (
                          <Col xs={24} key={item.value}>
                            <Radio value={item.value}>{item.label}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="ช่วงเวลาที่สามารถใช้พื้นที่" name="availableTime">
                <Input placeholder="เช่น 09:00–18:00 หรือหลัง 22:00" size="large" />
              </Form.Item>
            </section>

            <section className="section" id="sec-area">
              <Title level={4} style={{ marginBottom: 12 }}>
                พื้นที่สำหรับติดตั้ง
              </Title>

              <Row gutter={[24, 18]}>
                <Col xs={24} md={12}>
                  <Form.Item label="ช่องจอดที่จัดสรรได้" name="slots">
                    <Radio.Group className="survey-radio-list">
                      <Row gutter={[12, 12]}>
                        {SLOTS.map((item) => (
                          <Col xs={24} key={item.value}>
                            <Radio value={item.value}>{item.label}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="การจัดการที่จอด" name="parkingPolicy">
                    <Radio.Group className="survey-radio-list">
                      <Row gutter={[12, 12]}>
                        {PARKING_POLICY.map((item) => (
                          <Col xs={24} key={item.value}>
                            <Radio value={item.value}>{item.label}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="ตำแหน่งติดตั้ง" name="installLocation">
                <Checkbox.Group className="survey-check-grid">
                  <Row gutter={[12, 12]}>
                    {INSTALL_LOCATIONS.map((item) => (
                      <Col xs={24} md={12} key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item label="ข้อจำกัดพื้นที่ / งานก่อสร้าง" name="areaConstraints">
                <Input.TextArea rows={4} placeholder="เช่น เพดานต่ำ, อยู่ระหว่างรีโนเวท, มีเสา ฯลฯ" />
              </Form.Item>
            </section>

            <section className="section" id="sec-electrical">
              <Title level={4} style={{ marginBottom: 6 }}>
                ข้อมูลระบบไฟฟ้า
              </Title>
              <Text type="secondary">
                กรอกเท่าที่ทราบ หากไม่แน่ใจสามารถเลือก “ไม่ทราบ” ได้
              </Text>

              <Row gutter={[24, 18]} style={{ marginTop: 18 }}>
                <Col xs={24} md={12}>
                  <Form.Item label="มีหม้อแปลงในพื้นที่" name="transformer">
                    <Radio.Group className="survey-radio-list">
                      <Row gutter={[12, 12]}>
                        {TRANSFORMER.map((item) => (
                          <Col xs={24} key={item.value}>
                            <Radio value={item.value}>{item.label}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="ผู้ดูแลระบบไฟฟ้า/อาคาร" name="elecContactKnown">
                    <Radio.Group className="survey-radio-list">
                      <Row gutter={[12, 12]}>
                        {ELEC_CONTACT_KNOWN.map((item) => (
                          <Col xs={24} md={24} key={item.value}>
                            <Radio value={item.value}>{item.label}</Radio>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item noStyle shouldUpdate>
                    {() =>
                      form.getFieldValue('elecContactKnown') === 'yes' ? (
                        <div className="electric-fields">
                          <Row gutter={[16, 12]}>
                            <Col xs={24} md={24}>
                              <Form.Item label="ชื่อผู้ติดต่อ" name="elecContactName">
                                <Input placeholder="เช่น คุณเอก" size="large" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={24}>
                              <Form.Item label="เบอร์โทร / ช่องทางติดต่อ" name="elecContactPhone">
                                <Input placeholder="เช่น 08x-xxx-xxxx" size="large" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Text type="secondary">ถ้ามีเพียงบางส่วน กรอกเท่าที่ทราบได้</Text>
                        </div>
                      ) : null
                    }
                  </Form.Item>
                </Col>
              </Row>
            </section>

            <div className="submit-area">
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                ส่งข้อมูลเพื่อขอรับการประเมิน
              </Button>
              <Text type="secondary">
                ข้อมูลของท่านจะถูกใช้เพื่อการติดต่อกลับและประเมินความเหมาะสมเบื้องต้นเท่านั้น
              </Text>
            </div>
          </Form>
        </Card>
      </main>
    </div>
  );
}
