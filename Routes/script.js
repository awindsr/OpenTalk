import express from "express";
const router = express.Router();
import user from "../models/user.js";
import passport from "passport";
import localStrategy from "passport-local";
import expressSession from "express-session";


router.use(express.urlencoded({ extended: true }));


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
        password:req.body.password,
        fullname: req.body.fullname
    });
    console.log(req.body);
    user.register(userData,req.body.password)
    .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/home");
    })
   })
})


router.get("/login",(req,res)=>{
    res.render("login.ejs");
});

router.post("/login",passport.authenticate("local",{
    successRedirect :"/home",
    failureRedirect : "/login",
    // failureFlash: true
  }),function(req,res){
  })

router.get("/logout",function(req,res,next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
})
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()) return next();
//     res.redirect("/");
//   }

export default router;