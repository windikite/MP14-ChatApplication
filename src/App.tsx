import React from "react";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage";
import ChatRoom from "./pages/ChatRoom";
import { Route, Routes } from "react-router-dom";

const socket = io('http://127.0.0.1:5000')

const App: React.FC = () => {

  return (
    <React.StrictMode>
      <Routes>
        <Route path='/' element={<HomePage socket={socket} />} />
        <Route path='/chat' element={<ChatRoom socket={socket} />} />
      </Routes>
    </React.StrictMode>
  );
};

export default App;
