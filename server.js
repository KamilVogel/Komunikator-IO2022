const url =
    process.env.PATH_TO_DB || "mongodb+srv://admin:admin@cluster0.reoei.mongodb.net/users?retryWrites=true&w=majority";
const connectionParams = {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
};
const mongoose = require("mongoose");
mongoose
    .connect(url, connectionParams)
    .then(() => {
        console.log("Connected to the database ");
    })
    .catch((err) => {
        console.error(err);
    });

var Schema = mongoose.Schema;

var adminLogin = new Schema({
    login: String,
    password: String,
    email: String,
}, { collection: "login" });

const login = mongoose.model("login", adminLogin);

const express = require("express");
const path = require("path");

const port = process.env.PORT || 3000;

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname)));

io.on("connection", function(socket) {
    socket.on("create", function(room) {
        socket.join(room);

        socket.on("newuser", function(username) {
            socket.in(room).emit("update", username + " Dolaczyl do rozmowy");
        });
        socket.on("exituser", function(username) {
            socket.on("disconnect", () => {});
            socket.in(room).emit("update", username + " Wyszedł z rozmowy");
        });
        socket.on("chat", function(message) {
            socket.in(room).emit("chat", message);
        });
        socket.on("drawDot", function(data) {
            socket.in(room).emit("drawDot", data);
        });
        socket.on("drawLine", function(data) {
            socket.in(room).emit("drawLine", data);
        });
        socket.on("clearDrawing", function() {
            socket.in(room).emit("clearDrawing");
        });
    });
});

app.get("/", (req, res) => {
    //res.send('Hello World!')
});

server.listen(port, () => {
    console.log(`App started!`);
    console.log(`Listening at port : ${port}`);
});

app.use(express.json());
app.post("/send", function(req, res) {
    console.log(req.body);

    var passwordValidator = require('password-validator');
    var schema = new passwordValidator();
    schema
        .is().min(4) // Minimum length 8
        .is().max(32) // Maximum length 100
        //.has().uppercase() // Must have uppercase letters
        //.has().lowercase() // Must have lowercase letters
        //.has().digits(2) // Must have at least 2 digits
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Password', 'Password123']); // Blacklist these values

    if (!schema.validate(req.body.password)) {
        return res.status(400).send("Invalid password");
    }

    const emailvalidator = require("email-validator");
    if (!emailvalidator.validate(req.body.email)) {
        return res.status(400).send("Invalid Email");
    }

    login.findOne({ email: req.body.email }, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            if (docs == null) {
                return res.status(401).send("User not exist")
            }
            if (docs.password === req.body.password) {
                return res.status(200).send("Good email");
            } else
                return res.status(400).send("Invalid password")
        }
    });

});

app.post("/register", (req, res) => {
    var passwordValidator = require('password-validator');
    var schema = new passwordValidator();
    schema
        .is().min(4) // Minimum length 4
        .is().max(32) // Maximum length 32
        //.has().uppercase() // Must have uppercase letters
        //.has().lowercase() // Must have lowercase letters
        //.has().digits(2) // Must have at least 2 digits
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Password', 'Password123']); // Blacklist these values

    if (!schema.validate(req.body.password)) {
        return res.status(400).send("Invalid password");
    }

    const emailvalidator = require("email-validator");
    if (!emailvalidator.validate(req.body.email)) {
        return res.status(400).send("Invalid Email");
    }

    login.findOne({ email: req.body.email }, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            if (docs == null) {
                login.create({ email: req.body.email, password: req.body.password })
                return res.status(200).send("Account created");
            } else
                return res.status(400).send("Invalid password")
        }
    });
});