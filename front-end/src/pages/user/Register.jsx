import { Button, Form, Input, Card, Typography, Select, Row, Col } from "antd";
import { createUserApi } from "../../unti/api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, phone, address, password, role } = values;
    const register = await createUserApi(name, email, phone, address, password, role);

    if (register) {
      notification.success({
        message: "Create User",
        description: "Success",
      });
      navigate("/login");
    } else {
      notification.error({
        message: "Cannot create User",
        description: "Error",
      });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 700,
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 25 }}>
          Register
        </Title>

        <Form
          layout="horizontal"
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your Name!" }]}
              >
                <Input size="large" placeholder="Enter your name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your Email!" }]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please input your phone!" }]}
              >
                <Input size="large" placeholder="Enter your phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please input your address!" }]}
              >
                <Input size="large" placeholder="Enter your address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password size="large" placeholder="Enter your password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Role" name="role">
                <Select size="large" placeholder="Select role">
                  <Option value="user">User</Option>
                  <Option value="seller">Seller</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} justify="center">
                <Col span={12}>
                    <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: "100%", borderRadius: 6 }}
                    >
                    Register
                    </Button>
                </Col>
                <Col span={12}>
                    <Button
                    type="default"
                    size="large"
                    style={{ width: "100%", borderRadius: 6 }}
                    onClick={() => navigate("/login")}
                    >
                    Login
                    </Button>
                </Col>
            </Row>


        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
