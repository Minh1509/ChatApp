import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "localhost:3002/";

function App() {
  // Before login
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUserName] = useState("");
  const [room, setRoom] = useState("");

  //After login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([
  ]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList([...messageList, data]);
    });
  });

  const connectionToRoom = () => {
    socket.emit("join_room", room);
    setIsLogin(true);
  };

  const sendMessage = async () => {
    let contentMessage = {
      room: room,
      content: {
        author: username,
        message: message,
      },
    };
    await socket.emit("send_message", contentMessage);
    setMessageList([...messageList, contentMessage.content]);
    setMessage("");
  };
  return (
    <div>
      {isLogin ? (
        <div className="container">
          <div className="message_container">
            <div className="message">
              {messageList.map((val, key) => (
                <div
                  className="message-detail"
                  id={val.author === username ? "You" : "Others"}
                >
                  <div className="messageIndividual">
                    {val.author}: {val.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="input_message">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="login_container">
            <div className="inputs">
              <input
                type="text"
                placeholder="Username..."
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Room..."
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <button onClick={connectionToRoom}>Join room</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
