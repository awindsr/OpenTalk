import express from "express";
import user from "../models/user.js";
import passport from "passport";
import localStrategy from "passport-local";
import expressSession from "express-session";
import flash from "connect-flash";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(flash());


passport.use(new localStrategy(user.authenticate()));
router.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret :"hey"
  }))

router.get("/", ( req, res)=>{
    res.render("start.ejs");
});

router.get("/register", (req,res)=>{
    res.render("register.ejs");
});

router.post("/register",(req,res,next)=>{
    const userData = new user({
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname
    });
    console.log(req.body);
    user.register(userData,req.body.password)
    .then(()=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/home");
    })
   })
})


router.get("/login",(req,res)=>{
    res.render("login.ejs",{ error:req.flash("error")});
});

router.post("/login",passport.authenticate("local",{
    successRedirect :"/home",
    failureRedirect : "/login",
    failureFlash: true,
  }),function(req,res){
  })

router.get("/logout",(req,res,next)=>{
    req.logout((err)=> {
      if (err) { return next(err); }
      res.redirect('/login');
    });
});

router.get("/home",isLoggedIn,(req,res)=>{
    res.send("<h1>WELCOME</h1>");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()) return next();
    res.redirect("/");
  }

export default router;