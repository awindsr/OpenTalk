import express from "express";

const app=express();
const PORT=3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", ( req, res)=>{
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});