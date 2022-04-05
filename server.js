const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000

const app = express();
const server = require("http").createServer(app);

const io =require("socket.io")(server);



app.use(express.static(path.join(__dirname)))

io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + "Dolaczyl do rozmowy");
    });
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + "Wyszedł z rozmowy");
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
})

//
//Debug , to change later
//
app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
 })