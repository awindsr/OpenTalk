//logout
const logout=document.querySelector(".logout");
const okBtn=document.querySelector(".button1");
const cancelBtn=document.querySelector(".button2");

logout.addEventListener("click",(e)=>{
    document.querySelector(".logoutContainer").classList.add("show");
});

okBtn.addEventListener("click",(e)=>{
    document.querySelector(".logoutContainer").classList.remove("show");
    window.location.href="/logout";
})

cancelBtn.addEventListener("click",(e)=>{
    document.querySelector(".logoutContainer").classList.remove("show");
})