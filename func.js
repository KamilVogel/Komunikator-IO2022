(function(){
    const app = document.querySelector(".app");
    const socket = io();
    var room;

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        let username = app.querySelector(".join-screen #username").value;
        let password = app.querySelector(".join-screen #password").value;
        room = app.querySelector(".join-screen #destination").value;
        console.log(room)
        if(username.length == 0 || password.length == 0 || room.length == 0){
            return;
        }
        socket.emit('create', room);
        socket.emit("newuser",username);
        uname = username;
        let titleChat = app.querySelector("#chat-label").innerHTML = "Jesteś w pokoju : " + room;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
        fetch('/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "user": {
                    "email": username,
                    "password": password
                }
            }),

        });
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my",{
            username:uname,
            text:message
        });
        socket.emit("chat",{
            username:uname,
            text:message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
        socket.emit("exituser",uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update){
        renderMessage("update",update);
    });

    socket.on("chat", function(message){
        renderMessage("someone",message);
    });

    app.querySelector("#clear-messages").addEventListener("click",function(){
        let messageContainer = app.querySelector(".chat-screen .messages")
        messageContainer.innerHTML = "";
    });

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages")
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class="name">Ty</div>
                <div class="text">${message.text}</div>
            </div>
            `; 
            //console.log(el);
            messageContainer.appendChild(el);
        }
        else if(type == "someone"){
            let el = document.createElement("div");
            el.setAttribute("class","message someones-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            `; 
            //console.log(el);
            messageContainer.appendChild(el);
        }
        else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

})();
