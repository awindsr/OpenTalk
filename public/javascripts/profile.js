const uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", ()=> {
    document.getElementById("imageUploadInput").click();
});

document.querySelector("#imageUploadInput").addEventListener("change",()=>{
    document.querySelector("#inputForm").submit();
 })

