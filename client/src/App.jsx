import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button, Stack } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [setsocketID, setSetsocketID] = useState("");
  const [messages, setMessages] = useState([]);

  const [roomName, setRoomName] = useState("");

  const socket = useMemo(() => io("http://localhost:3000", {
    withCredentials: true
  }), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  }
  

  useEffect(() => {
    socket.on("connect", () => {
      setSetsocketID(socket.id);
      console.log("Connected", socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("broadcastmsg", (msg) => {
      console.log(msg);
    });

    socket.on("receive-message", (msg) => {
      console.log(msg);
      setMessages((messages) => [...messages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h3" component="div" gutterBottom>
          Welcome to socket.io basics
        </Typography>

        {socket.id && (
          <Typography variant="h6" component="div" gutterBottom>
            Room Id: {socket.id}
          </Typography>
        )}

        <form onSubmit={joinRoomHandler}>
          <h5>Join Room</h5>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
          />

          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="Message"
            variant="outlined"
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            id="outlined-basic"
            label="Room"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>

        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default App;
