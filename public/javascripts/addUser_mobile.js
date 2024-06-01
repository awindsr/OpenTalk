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


//viewing others profile
const viewProfileList = document.querySelectorAll(".userdetails");

for (let viewProfile of viewProfileList){
    viewProfile.addEventListener("click",(e)=>{
        const otherUsername = viewProfile.querySelector("p").innerHTML;
        console.log(otherUsername);
        window.location.href = "/view-profile/" + otherUsername +"?From=addUser"; 
    });
}

//viewing others profile
const viewProfileList2 = document.querySelectorAll(".userarea");

for (let viewProfile2 of viewProfileList2){
    viewProfile2.addEventListener("click",(e)=>{
        const otherUsername = viewProfile2.querySelector("p").innerHTML;
        window.location.href = "/view-profile/" + otherUsername +"?From=addUser"; 
    });
}

//Responsive :Mobile
let color = document.querySelector(".colordiv");
let bell = document.querySelector(".bellBtn");
let close = document.querySelector(".crossBtn");
let box = document.querySelector(".receivedrequests");

let btnState = bell.getAttribute("value");


bell.addEventListener("click",()=>{
    btnState = "true";
    color.style.height="120%";
    color.style.width="150%";
    color.style.borderRadius="0px";
    box.style.left = "0px";
    box.style.transition="1s"
    box.style.transitionDelay="0.2s";
    color.style.transition="0.5s";
    box.style.opacity="1";
    color.style.animationName="full";


    fetch('/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ btnState: btnState })
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

})

close.addEventListener("click",()=>{
    btnState = "false";
    color.style.height="0px";
    color.style.width="0px";
    color.style.borderRadius="50%";
    box.style.left = "100%";
    box.style.transition = "0.3s";
    color.style.transition="1s";
    color.style.transitionDelay="0.2s";
    

    fetch('/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ btnState: btnState })
    })
    .then(response => response.text())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

})


//////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {

    if(btnState === "true"){
        bell.click();
        box.style.transition="0s"
        color.style.transition="0s"

    }
       
});

