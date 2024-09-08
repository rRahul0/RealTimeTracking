const express = require("express");
const {config} = require("dotenv");
const socket = require("socket.io");
const http = require("http");
const path = require("path");

config();

const app = express();
const httpServer = http.createServer(app);
const io = socket(httpServer);

io.on("connection", (socket) => {
    console.log("User connected with id: ", socket.id);
    socket.on("send-location", coords => io.emit("receive-location", {id:socket.id, ...coords}));
    socket.on("disconnect", () => console.log("User disconnected"));
});

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.render("index");
});

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});