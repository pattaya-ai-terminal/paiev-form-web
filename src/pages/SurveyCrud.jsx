import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Checkbox
} from 'antd';
import {
  createSurvey,
  deleteSurvey,
  getSurveys,
  updateSurvey
} from '../lib/api.js';

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

const emptyForm = {
  survey_id: '',
  fullName: '',
  phone: '',
  placeName: '',
  email: '',
  province: '',
  businessType: '',
  userGroups: [],
  peakTimes: [],
  parkingDuration: '',
  evPresence: '',
  availableTime: '',
  slots: '',
  parkingPolicy: '',
  installLocation: [],
  areaConstraints: '',
  transformer: '',
  elecContactKnown: '',
  elecContactName: '',
  elecContactPhone: ''
};

const labelMap = (options) =>
  options.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

const businessTypeLabel = labelMap(BUSINESS_TYPES);
const parkingPolicyLabel = labelMap(PARKING_POLICY);

export default function SurveyCrud() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', businessType: '', province: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchRows = async () => {
    try {
      setLoading(true);
      const data = await getSurveys();
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      message.error(error.message || 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const filteredRows = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return rows.filter((row) => {
      const id = row.survey_id || row._id || '';
      const matchesKeyword = keyword
        ? [id, row.fullName, row.placeName, row.email, row.phone]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(keyword))
        : true;
      const matchesBusiness = filters.businessType
        ? row.businessType === filters.businessType
        : true;
      const matchesProvince = filters.province
        ? String(row.province || '').toLowerCase().includes(filters.province.toLowerCase())
        : true;
      return matchesKeyword && matchesBusiness && matchesProvince;
    });
  }, [rows, filters]);

  const openCreate = () => {
    setEditingRow(null);
    form.setFieldsValue(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRow(record);
    form.setFieldsValue({
      ...emptyForm,
      ...record
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (record) => {
    const recordId = record.survey_id || record._id;
    if (!recordId) return;
    try {
      await deleteSurvey(recordId);
      message.success('ลบรายการเรียบร้อย');
      setRows((prev) => prev.filter((row) => (row.survey_id || row._id) !== recordId));
    } catch (error) {
      message.error(error.message || 'ลบรายการไม่สำเร็จ');
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      submittedAt: editingRow?.submittedAt || new Date().toISOString()
    };

    try {
      setLoading(true);
      if (editingRow) {
        const recordId = editingRow.survey_id || editingRow._id;
        const updated = await updateSurvey(recordId, payload);
        message.success('อัปเดตรายการเรียบร้อย');
        setRows((prev) =>
          prev.map((row) =>
            (row.survey_id || row._id) === recordId ? { ...row, ...payload, ...updated } : row
          )
        );
      } else {
        const created = await createSurvey(payload);
        message.success('สร้างรายการเรียบร้อย');
        setRows((prev) => [created || payload, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message || 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Survey ID',
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => record.id || record._id || '-'
    },
    {
      title: 'ชื่อผู้ติดต่อ',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'สถานที่',
      dataIndex: 'placeName',
      key: 'placeName'
    },
    {
      title: 'ประเภทธุรกิจ',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (value) => businessTypeLabel[value] || value || '-'
    },
    {
      title: 'นโยบายที่จอด',
      dataIndex: 'parkingPolicy',
      key: 'parkingPolicy',
      render: (value) => (
        <Tag color={value === 'ev_only' ? 'blue' : 'default'}>
          {parkingPolicyLabel[value] || value || '-'}
        </Tag>
      )
    },
    {
      title: 'วันที่ส่ง',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (value) => (value ? String(value).slice(0, 10) : '-')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="ลบรายการนี้?"
            description="การลบจะไม่สามารถกู้คืนได้"
            okText="ลบ"
            cancelText="ยกเลิก"
            onConfirm={() => handleDelete(record)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="survey-crud">
      <div className="survey-crud-header">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Survey Management
          </Title>
          <Text type="secondary">จัดการแบบฟอร์ม สำรวจ และติดตามสถานะได้ในที่เดียว</Text>
        </div>
        <Space>
          <Button onClick={fetchRows}>รีเฟรช</Button>
          <Button type="primary" size="large" onClick={openCreate}>
            สร้าง Survey ใหม่
          </Button>
        </Space>
      </div>

      <Card className="survey-crud-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input
              placeholder="ค้นหา ID, ชื่อ, อีเมล, เบอร์โทร"
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
            />
          </Col>
          <Col xs={24} md={7}>
            <Select
              placeholder="ประเภทธุรกิจ"
              allowClear
              options={BUSINESS_TYPES}
              value={filters.businessType || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, businessType: value || '' }))}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={7}>
            <Input
              placeholder="จังหวัด / ทำเล"
              value={filters.province}
              onChange={(e) => setFilters((prev) => ({ ...prev, province: e.target.value }))}
            />
          </Col>
        </Row>
      </Card>

      <Card className="survey-crud-card">
        <Table
          columns={columns}
          dataSource={filteredRows}
          rowKey={(record) => record.id || record._id}
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <Modal
        title={editingRow ? 'แก้ไข Survey' : 'สร้าง Survey ใหม่'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={editingRow ? 'บันทึก' : 'สร้าง'}
        cancelText="ยกเลิก"
        width={900}
      >
        <Form form={form} layout="vertical" initialValues={emptyForm}>
          <Title level={5}>ข้อมูลผู้ติดต่อ</Title>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="ชื่อ-นามสกุล"
                name="fullName"
                rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
              >
                <Input placeholder="เช่น John Doe" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="เบอร์โทร"
                name="phone"
                rules={[{ required: true, message: 'กรุณากรอกเบอร์โทร' }]}
              >
                <Input placeholder="0812345678" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="ชื่อสถานที่"
                name="placeName"
                rules={[{ required: true, message: 'กรุณากรอกชื่อสถานที่' }]}
              >
                <Input placeholder="ABC Shopping Center" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[{ required: true, message: 'กรุณากรอกอีเมล' }]}
              >
                <Input placeholder="john@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="จังหวัด" name="province">
                <Input placeholder="Bangkok" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="ประเภทธุรกิจ" name="businessType">
                <Select options={BUSINESS_TYPES} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5}>ลักษณะการใช้งาน</Title>
          <Form.Item label="กลุ่มผู้ใช้งานหลัก" name="userGroups">
            <Checkbox.Group options={USER_GROUPS} />
          </Form.Item>
          <Form.Item label="ช่วงเวลาการใช้งานหนาแน่น" name="peakTimes">
            <Checkbox.Group options={PEAK_TIMES} />
          </Form.Item>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Form.Item label="ระยะเวลาจอดรถ" name="parkingDuration">
                <Select options={PARKING_DURATIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="การพบเห็น EV" name="evPresence">
                <Select options={EV_PRESENCE} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="ช่วงเวลาที่ใช้พื้นที่ได้" name="availableTime">
            <Input placeholder="09:00–18:00" />
          </Form.Item>

          <Title level={5}>พื้นที่สำหรับติดตั้ง</Title>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Form.Item label="ช่องจอด" name="slots">
                <Select options={SLOTS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="นโยบายที่จอด" name="parkingPolicy">
                <Select options={PARKING_POLICY} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="ตำแหน่งติดตั้ง" name="installLocation">
            <Checkbox.Group options={INSTALL_LOCATIONS} />
          </Form.Item>
          <Form.Item label="ข้อจำกัดพื้นที่" name="areaConstraints">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Title level={5}>ข้อมูลระบบไฟฟ้า</Title>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Form.Item label="มีหม้อแปลง" name="transformer">
                <Select options={TRANSFORMER} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="ผู้ดูแลระบบไฟฟ้า" name="elecContactKnown">
                <Select options={ELEC_CONTACT_KNOWN} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Form.Item label="ชื่อผู้ติดต่อ" name="elecContactName">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="เบอร์โทรผู้ติดต่อ" name="elecContactPhone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
