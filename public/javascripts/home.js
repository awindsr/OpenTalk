//When no users are found
const friendList = document.querySelector(".friendlist");

if (friendList.innerText===''){
    friendList.innerHTML="<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
    friendList.classList.add("center");
}