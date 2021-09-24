const socket = io('http://localhost:8000');

const tikSound = new Howl({
    src : ['../music/tik.mp3']
});

const form  = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

let username = prompt("Enter your name to join");
while(username == null){
    username = prompt("Enter your name to join");
}
socket.emit('new-user-joined' , username);

const append = (message , position) => {
    if(position == 'left'){
        tikSound.play();
    }
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit' , (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if(message == ""){
        return;
    }
    append(`You: ${message}` , 'right');
    socket.emit('send' , message);
    messageInput.value = '';
});

function clearBox(elementID) {
    var div = document.getElementById(elementID);
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
    div.innerHTML = `<button class="btnClr" type="button" onclick="clearBox('box')">Clear</button>
    `;
    append("- Message Cleard -" , 'mid');
}

form.addEventListener('button' , (e) => {
    e.preventDefault();
    let div = document.getElementsByClassName("container");
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
});

socket.on('user-joined' , name => {
    append(`${name} joined the chat` , 'mid');
});

socket.on('receive' , data => {
    append(`${data.name} : ${data.message}` , 'left');
});

socket.on('left' , data =>{
    append(`${data.name} left the chat !` , 'mid');
})
