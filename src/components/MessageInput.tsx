import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

type MessageInputProps = {
    socket: any;
};

const MessageInput: React.FC<MessageInputProps> = ({ socket }) => {
    const [messageText, setMessageText] = useState("");

    const sendMessage = () => {
        const userId = sessionStorage.getItem("userName") || "Guest";
        const message = {
            userId,
            username: userId,
            text: messageText,
        };
        socket.emit("message", message); 
        setMessageText("");
    };

    const handleEnterKey = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <Container className="mt-3 bg bg-dark">
            <Form>
                <Form.Label style={{ font: "Arial", color: "gray" }}>
                    Type your message
                </Form.Label>
                <Form.Control
                    type="text"
                    id="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleEnterKey}
                    placeholder="Enter your message..."
                    autoComplete="off"
                />
            </Form>
        </Container>
    );
};

export default MessageInput;
