import { useEffect, useState, useRef } from "react";
import { Container, Button, Form } from "react-bootstrap";

type ChatProviderProps = {
    socket: any;
};

type Message = {
    id: string; 
    text: string;
    userId: string;
    timestamp: string;
    username: string;
};

const ChatProvider: React.FC<ChatProviderProps> = ({ socket }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [editingMessage, setEditingMessage] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");
    const userId = sessionStorage.getItem("userName") || "anonymous";
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on("message", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on("delete_message", (messageId: string) => {
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg.id !== messageId)
            );
        });

        socket.on("edit_message", (data: { id: string; text: string }) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === data.id ? { ...msg, text: data.text } : msg
                )
            );
        });

        return () => {
            socket.off("message");
            socket.off("delete_message");
            socket.off("edit_message");
        };
    }, [socket]);

    const scrollToBottom = () => {
        chatWindowRef.current?.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: "smooth" });
    };

    const handleDelete = (messageId: string) => {
        socket.emit("delete_message", messageId);
    };

    const handleEdit = (message: Message) => {
        setEditingMessage(message.id);
        setEditText(message.text);
    };

    const handleEditSubmit = () => {
        socket.emit("edit_message", { id: editingMessage, text: editText });
        setEditingMessage(null);
        setEditText("");
    };

    return (
        <Container
            style={{
                marginTop: "40px",
                background: "#f5deb3",
                padding: "20px",
                borderRadius: "10px",
                maxWidth: "600px",
                fontFamily: "'Courier New', monospace",
            }}
        >
            {/* Chat Messages Window */}
            <div
                ref={chatWindowRef}
                style={{
                    height: "300px", 
                    overflowY: "auto",
                    background: "black", 
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                }}
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        style={{
                            marginBottom: "10px",
                            textAlign: message.userId === userId ? "right" : "left",
                            color: "orange",
                            fontSize: "14px",
                            position: "relative",
                        }}
                    >
                        <div>
                            <strong>{message.username}</strong>{" "}
                            <span style={{ fontSize: "12px", color: "gray" }}>
                                {message.timestamp}
                            </span>
                        </div>
                        {editingMessage === message.id ? (
                            <Form.Control
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                style={{
                                    marginBottom: "5px",
                                    fontSize: "14px",
                                    background: "black",
                                    color: "orange",
                                    border: "1px solid gray",
                                    fontFamily: "'Courier New', monospace",
                                }}
                            />
                        ) : (
                            <div>{message.text}</div>
                        )}

                        {message.userId === userId && (
                            <div style={{ marginTop: "5px", textAlign: "right" }}>
                                {editingMessage === message.id ? (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={handleEditSubmit}
                                        style={{
                                            padding: "2px 6px",
                                            fontSize: "12px",
                                            marginLeft: "5px",
                                            background: "green",
                                            border: "1px solid black",
                                        }}
                                    >
                                        Save
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleEdit(message)}
                                            style={{
                                                padding: "2px 6px",
                                                fontSize: "12px",
                                                marginRight: "5px",
                                                color: "orange",
                                                border: "1px solid orange",
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(message.id)}
                                            style={{
                                                padding: "2px 6px",
                                                fontSize: "12px",
                                                color: "orange",
                                                border: "1px solid orange",
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Scroll to Bottom Button */}
            <Button
                variant="primary"
                size="sm"
                style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    background: "orange",
                    border: "1px solid black",
                    color: "black",
                }}
                onClick={scrollToBottom}
            >
                Scroll to Bottom
            </Button>
        </Container>
    );
};

export default ChatProvider;
