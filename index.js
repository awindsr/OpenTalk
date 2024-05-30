let close = document.querySelector(".menu");

let userclickbox = document.querySelector(".user1");
let userlist = document.querySelector(".secondinnerdiv");
let chatarea = document.querySelector(".seconddiv");
userclickbox.addEventListener("click",(e)=>{
    userlist.classList.remove("newshow");
    userlist.classList.add("newhide");
    chatarea.classList.add("newshow");
    chatarea.classList.remove("newhide");
})

close.addEventListener("click",(e)=>{
    userlist.classList.remove("newhide");
    userlist.classList.add("newshow");
    chatarea.classList.add("newhide");
    chatarea.classList.remove("newshow");
})

