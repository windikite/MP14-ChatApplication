import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ChatProvider from "../components/ChatProvider";
import MessageInput from "../components/MessageInput";
import SignOut from "../components/SignOut";
import MessageStats from "../components/MessageStats";

type ChatRoomProps = {
  socket: any;
};

const ChatRoom: React.FC<ChatRoomProps> = ({ socket }) => {
  return (
    <Container className="bg bg-dark w-100" style={{minWidth: '100%', minHeight: "100vh"}}>
      <Row>
        <Col>
          <SignOut socket={socket} />
        </Col>
      </Row>
      <Row>
        {/* Chat Provider for messages */}
        <Col md={8}>
          <Container>
            <ChatProvider socket={socket} />
          </Container>
          <MessageInput socket={socket} />
        </Col>

        {/* Message Stats for visualization */}
        <Col md={4}>
          <MessageStats socket={socket} />
        </Col>
      </Row>
    </Container>
  );
};

export default ChatRoom;
