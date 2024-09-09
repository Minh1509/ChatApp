const express = require("express");
const app = express();
const cors = require('cors');
const socket = require('socket.io');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(3002, () => {
    console.log("Server is running on port 3002...");
});

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("User joined room: " + data);
    });
    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data.content);
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});