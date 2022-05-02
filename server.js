/*


const url = "mongodb+srv://admin:admin@cluster0.reoei.mongodb.net/users?retryWrites=true&w=majority"
const connectionParams = {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
}
const mongoose = require('mongoose')
mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error('Error connecting to the database. n${err}');
    })

    
*/

    

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
        socket.on("clearDrawing", function(){
            socket.in(room).emit("clearDrawing");
        })

    });
});

app.get('/', (req, res) => {
    //res.send('Hello World!')
});

server.listen(port, () => {
    console.log(`App started!`)
    console.log(`Listening at port : ${port}`)

 /*   var Schema = mongoose.Schema;


var adminLogin = new Schema({
    login: String,
    password: String
},
{collection: 'login'});

const login = mongoose.model('login', adminLogin);

const admin = new login({ login: 'admin' });
console.log(admin.login);
var id = '627040a0284dbf19fe515253';
login.findById(id, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        console.log("Result : ", docs);
    }
});

*/

});

/*
app.post('/send',
(req, res)=> {
    console.log(req.body)
})

*/
