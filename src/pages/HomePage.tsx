import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type HomePageProps = {
    socket: any;
};

const HomePage: React.FC<HomePageProps> = ({ socket }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const userName = e.target.username.value.trim();
        sessionStorage.setItem("userName", userName);

        socket.emit("signin", { userName });

        navigate("/chat");
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center
            bg bg-dark"
            style={{
                minHeight: "100vh",
            }}
        >
            <Row className="w-100">
                <Col xs={12} md={6} lg={4} className="mx-auto">
                    <div
                        className="p-4 shadow-lg rounded bg bg-secondary"
                        style={{
                            borderRadius: "8px",
                        }}
                    >
                        <h2 className="text-center mb-4">Sign into Open Chat</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username" className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Sign In
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
