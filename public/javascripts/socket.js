const socket = io({
    auth: {
      serverOffset: 0
    }
  });


/*************************************************************Global Chat***************************************************************/
const form = document.getElementById('globalForm');
const username = form.getAttribute("username");
const input = document.getElementById('globalInput');
const messages = document.getElementById('globalMessagediv');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        ////////////////////////////////////////////
        const item = document.createElement('div');
        item.classList.add("mymessage");
        item.innerHTML ="<span>"+ input.value +"(You)</span>"
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
        ////////////////////////////////////////////
        socket.emit('Global Chat', input.value,username);
        input.value = '';
    }
});

socket.on('Global Chat', (msg , username ) => {
    const item = document.createElement('div');
    item.classList.add("othermessage");
    item.innerHTML ="<span>"+msg+ "("+username+")</span>"
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

// Handle recovered messages
socket.on('Recover messages', (msg,username) => {
    const item = document.createElement('div');
    if (form.getAttribute("username")===username){
        item.classList.add("mymessage");
        item.innerHTML = "<span>" + msg + " (You)</span>";
    }
    else{
        item.classList.add("othermessage");
        item.innerHTML = "<span>" + msg + " (" + username + ")</span>";
    }
    
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  