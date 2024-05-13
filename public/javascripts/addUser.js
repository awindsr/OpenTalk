//When no users are found
const existingUsers = document.querySelector(".existingUserGroup");

if (existingUsers.innerText===''){
    existingUsers.innerHTML="<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
}