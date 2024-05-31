let open = document.querySelector(".arrowbtn");
let close = document.querySelector(".backbtn");


open.addEventListener("click",(e)=>{
    let onlineuserslist = document.querySelector(".fourthinnerdiv");
    onlineuserslist.classList.add("positionclass");
})


close.addEventListener("click",(e)=>{
    let onlineuserslist = document.querySelector(".fourthinnerdiv");
    onlineuserslist.classList.remove("positionclass");
})




