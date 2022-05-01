const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname)));

io.on("connection", function (socket) {

    socket.on('create', function (room) {
        socket.join(room);
    
        socket.on("newuser", function (username) {
            socket.in(room).emit("update", username + " Dolaczyl do rozmowy");
        });
        socket.on("exituser", function (username) {
            socket.on("disconnect", () => { });
            socket.in(room).emit("update", username + " Wyszedł z rozmowy");
        });
        socket.on("chat", function (message) {
            socket.in(room).emit("chat", message);
        });
        socket.on("drawDot", function (data) {
            socket.in(room).emit("drawDot", data);
        });
        socket.on("drawLine", function (data) {
            socket.in(room).emit("drawLine", data);
        });

    });
});

app.get('/', (req, res) => {
    //res.send('Hello World!')
});

server.listen(port, () => {
    console.log(`App started!`)
    console.log(`Listening at port : ${port}`)
});
