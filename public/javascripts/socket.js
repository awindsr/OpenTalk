const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messagediv');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        ////////////////////////////////////////////
        const item = document.createElement('div');
        item.classList.add("mymessage");
        item.innerHTML ="<span>"+ input.value +"</span>"
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        ////////////////////////////////////////////
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('div');
    item.classList.add("othermessage");
    item.innerHTML ="<span>"+msg+"</span>"
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });


  