import express from "express";

const app=express();
const PORT=3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", ( req, res)=>{
    res.render("start.ejs");
});

app.get("/registerPage", (req,res)=>{
    res.render("register.ejs");
});

app.get("/loginPage",(req,res)=>{
    res.render("login.ejs");
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});