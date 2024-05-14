//When no users are found
const friendList = document.querySelector(".friendlist");

if (friendList.innerText===''){
    friendList.innerHTML="<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
    friendList.classList.add("center");
}


//Selecting a friend
const allFriendsList = document.querySelectorAll(".user1");

for (let friend of allFriendsList){
    friend.addEventListener("click",(e)=>{
        
        friend.classList.add("clicked");
        setTimeout(()=>{
            friend.classList.remove("clicked");
        },300)

        const fullname=friend.querySelector("h3").innerText;
        const username=friend.querySelector("h6").innerText;
        console.log(fullname);

        document.querySelector(".selecteduserdetails h4").innerText = fullname;
        document.querySelector(".selecteduserdetails p").innerText = username;

        document.querySelector(".emptySecondDiv").classList.add("hide");
        document.querySelector(".seconddiv").classList.remove("hide");

    })
}