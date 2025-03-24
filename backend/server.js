const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend URL for security
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle incoming messages
  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // Broadcast to all users
  });

  // Handle self-destructing messages
  socket.on("sendSelfDestructMessage", (data) => {
    io.emit("receiveMessage", data);
    setTimeout(() => {
      io.emit("deleteMessage", data.id);
    }, data.timer); // Remove message after the timer expires
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
