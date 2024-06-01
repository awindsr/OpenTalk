//When no users are found
const existingUsers = document.querySelector(".existingUserGroup");

if (existingUsers.innerText===''){
    existingUsers.innerHTML="<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
}

//When no requests are found
const reqList = document.querySelector(".requestsdiv");
let bellBtn = document.querySelector(".bellBtn i");

if (reqList.innerText === '') {
    reqList.innerHTML = `
            <div class="norequests">
                <img src="/images/NoRequests.png" alt="">
            </div>`;
    bellBtn.classList.remove("bellAnimation");
}
else{
    bellBtn.classList.add("bellAnimation");
}


//Responsive :Mobile
let color = document.querySelector(".colordiv");
let bell = document.querySelector(".bellBtn");
let close = document.querySelector(".crossBtn");
let box = document.querySelector(".receivedrequests");


bell.addEventListener("click",()=>{
    color.style.height="120%";
    color.style.width="150%";
    color.style.borderRadius="0px";
    box.style.left = "0px";
    box.style.transition="1s"
    box.style.transitionDelay="0.2s";
    color.style.transition="0.5s";
    box.style.opacity="1";
    color.style.animationName="full";
    

})

close.addEventListener("click",()=>{
    color.style.height="0px";
    color.style.width="0px";
    color.style.borderRadius="50%";
    box.style.left = "100%";
    box.style.transition = "0.3s";
    color.style.transition="1s";
    color.style.transitionDelay="0.2s";
    

})


