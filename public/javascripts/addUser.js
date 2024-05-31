//When no users are found
const existingUsers = document.querySelector(".existingUserGroup");

if (existingUsers.innerText===''){
    existingUsers.innerHTML="<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
}

//When no requests are found
const reqList = document.querySelector(".requestsdiv");

if (reqList.innerText === '') {
    reqList.innerHTML = `
            <div class="norequests">
                <img src="/images/NoRequests.png" alt="">
            </div>`;
}