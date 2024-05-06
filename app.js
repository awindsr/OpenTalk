import express from "express";
import router from './Routes/script.js';
import user from "./models/user.js";
import passport from "passport";
import localStrategy from "passport-local";
import expressSession from "express-session";

const app=express();
const PORT=3000;

app.set("view engine", "ejs");

////////////////////////////////////////////////////////////

//Session middleware
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret :"hey"
  }));

//Passport initialization middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


