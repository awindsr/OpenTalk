const uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", ()=> {
    document.getElementById("imageUploadInput").click();
});

// Add change event listener to the file input
document.getElementById("imageUploadInput").addEventListener("change",(event)=> {
    // Get the uploaded file
    const file = event.target.files[0];

    
});
