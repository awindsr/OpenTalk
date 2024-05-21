const uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", () => {
    document.getElementById("imageUploadInput").click();
});

document.querySelector("#imageUploadInput").addEventListener("change", () => {
    document.querySelector("#inputForm").submit();
})

const desc = document.querySelector("textarea");
const text = desc.getAttribute("text");
const editBtn = document.querySelector(".editImgBtn");
const edit = document.querySelector(".edit");
const done = document.querySelector(".done");

desc.value = text;
editBtn.addEventListener("click", (e) => {
    if (desc.disabled === true) {
        desc.disabled = false;
        desc.classList.add("border");
        edit.classList.remove("show");
        edit.classList.add("hide");
        done.classList.remove("hide");
        done.classList.add("show")
    }
    else{
        desc.disabled = true;
        desc.classList.remove("border");
        edit.classList.add("show");
        edit.classList.remove("hide");
        done.classList.add("hide");
        done.classList.remove("show")
    }

})