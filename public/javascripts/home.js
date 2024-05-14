//When no users are found
const friendList = document.querySelector(".friendlist");

if (friendList.innerText===''){
    friendList.innerHTML="<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
    friendList.classList.add("center");
}


//Selecting a friend
const allFriendsList = document.querySelectorAll(".user1");
console.log(allFriendsList);

for (let friend of allFriendsList){
    friend.addEventListener("click",(e)=>{
        console.log("clicked");
        friend.classList.add("clicked");
        setTimeout(()=>{
            friend.classList.remove("clicked");
        },300)
    })
}