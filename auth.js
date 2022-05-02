/*(function(){
    const app = document.querySelector(".app");
    
    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        let username = app.querySelector(".join-screen #username").value;
        let password = app.querySelector(".join-screen #password").value;
        console.log(username)
        fetch('/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain'
            },
            body: username
            
        })
    });

    
    
    

})();
*/