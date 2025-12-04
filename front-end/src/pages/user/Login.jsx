import { Button, Form, Input, Card, Typography, Checkbox } from "antd";
import { LoginApi } from "../../unti/api";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";


const { Title ,Text} = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
                localStorage.clear();
                sessionStorage.clear();

            const { email, password, remember } = values;
            const res = await LoginApi(email, password);

            if (res?.token) {
                if (remember) {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("user", JSON.stringify(res.user));
                } else {
                    sessionStorage.setItem("token", res.token);
                    sessionStorage.setItem("user", JSON.stringify(res.user));
                }
                window.dispatchEvent(new Event("storageUpdate"));
            }

            notification.success({
                message: "Login Success",
                description: `Welcome ${res.user.name}`,
                duration: 2,
            });

            setTimeout(() => {
                if (res.user.role === "seller") navigate("/Seller");
                else if (res.user.role === "admin") navigate("/Admin");
                else navigate("/");
            }, 300);

        } catch (error) {
            notification.error({
                message: "Login Failed",
                description: "Invalid name or password",
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
                    width: 400,
                    padding: 20,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <Title level={3} style={{ textAlign: "center", marginBottom: 25 }}>
                    Login
                </Title>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input size="large" placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password size="large" placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{
                            width: "100%",
                            marginTop: 10,
                            borderRadius: 6,
                        }}
                    >
                        Login
                    </Button>


                    <Text style={{ display: "block", textAlign: "center", marginTop: 15 }}>
                        Don't have an account?{" "}
                        <Button
                            type="link"
                            onClick={() => navigate("/register")}
                            style={{ padding: 0 }}
                        >
                            Register
                    </Button>
                </Text>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
