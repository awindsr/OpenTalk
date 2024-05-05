import express from "express";

const router = express.Router();

router.get("/", ( req, res)=>{
    res.render("start.ejs");
});

router.get("/registerPage", (req,res)=>{
    res.render("register.ejs");
});

router.get("/loginPage",(req,res)=>{
    res.render("login.ejs");
});

export default router;