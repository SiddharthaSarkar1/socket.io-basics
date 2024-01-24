import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3000;
const secretKeyJWT = "secretKeyJWT";

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

// This is just for learning purpose
app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "ABCDEFGHIJKL" }, secretKeyJWT);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Login Success",
    });
});

// Middleware (finctionality is unless we go to /login route it will not get connected)
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;

    if (!token) return next(new Error("Authentication Error"));

    const decoded = jwt.verify(token, secretKeyJWT);
    next();
  });
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

  // Individual socket who will request will join that room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}.`);
  });

  //Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
