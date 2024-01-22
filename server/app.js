import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);

//io is curcuit's instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Id", socket.id);

  socket.emit("welcome", `Welcome to the server, ${socket.id}`);
  socket.broadcast.emit("broadcastmsg", `Socket id: "${socket.id}" joined the server.`);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
