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
  console.log("User Connected", socket.id);

  // socket.emit("welcome", `Welcome to the server, ${socket.id}`);
  // socket.broadcast.emit(
  //   "broadcastmsg",
  //   `Socket id: "${socket.id}" joined the server.`
  // );

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });

    // socket.broadcast.emit("receive-message", data);

    //to send message to a specific room io.to() and socket.to() will work same
    socket.to(room).emit("receive-message", message);
  });

  //Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
