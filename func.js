(function() {
    const app = document.querySelector(".app");
    const socket = io();
    var room;

    let uname;

    app
        .querySelector(".join-screen #join-user")
        .addEventListener("click", function() {
            let username = app.querySelector(".join-screen #username").value;
            let password = app.querySelector(".join-screen #password").value;
            room = app.querySelector(".join-screen #destination").value;
            console.log(room);

            app.querySelector(".join-screen #reg-section").setAttribute("hidden", "true")
            app.querySelector(".join-screen #invalid-pass").setAttribute("hidden", "true")
            app.querySelector(".join-screen #reg-gut").setAttribute("hidden", "true")
            if (username.length == 0 || password.length == 0 || room.length == 0) {
                app.querySelector(".join-screen #invalid-pass").removeAttribute("hidden")
                return;
            }
            fetch("/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: username,
                        password: password
                    }),
                })
                .then((response) => {
                    if (response.status === 200) {
                        socket.emit("create", room);
                        socket.emit("newuser", username);
                        uname = username;
                        app.querySelector("#chat-label").innerHTML = "Jesteś w : " + room;
                        app.querySelector(".join-screen").classList.remove("active");
                        app.querySelector(".chat-screen").classList.add("active");
                    } else if (response.status === 401) {
                        app.querySelector(".join-screen #reg-section").removeAttribute("hidden")
                    } else if (response.status === 400) {
                        app.querySelector(".join-screen #invalid-pass").removeAttribute("hidden")
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        });
    app
        .querySelector(".join-screen #register")
        .addEventListener("click", function() {
            let username = app.querySelector(".join-screen #username").value;
            let password = app.querySelector(".join-screen #password").value;
            if (username.length == 0 || password.length == 0) {
                return;
            }
            fetch("/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: username,
                        password: password
                    }),
                })
                .then((response) => {
                    if (response.status === 200) {
                        app.querySelector(".join-screen #reg-section").setAttribute("hidden", "true")
                        app.querySelector(".join-screen #reg-gut").removeAttribute("hidden")
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
    app
        .querySelector(".chat-screen #send-message")
        .addEventListener("click", function() {
            let message = app.querySelector(".chat-screen #message-input").value;
            if (message.length == 0) {
                return;
            }
            renderMessage("my", {
                username: uname,
                text: message,
            });
            socket.emit("chat", {
                username: uname,
                text: message,
            });
            app.querySelector(".chat-screen #message-input").value = "";
        });

    app
        .querySelector(".chat-screen #exit-chat")
        .addEventListener("click", function() {
            socket.emit("exituser", uname);
            window.location.href = window.location.href;
        });

    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("someone", message);
    });

    app.querySelector("#clear-messages").addEventListener("click",function(){
        let messageContainer = app.querySelector(".chat-screen .messages")
        messageContainer.innerHTML = "";
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">Ty</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "someone") {
            let el = document.createElement("div");
            el.setAttribute("class", "message someones-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop =
            messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();