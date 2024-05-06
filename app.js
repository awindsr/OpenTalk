import express from "express";
import router from './Routes/script.js';
import user from "./models/user.js";
import passport from "passport";

const app=express();
const PORT=3000;

app.set("view engine", "ejs");

app.use('/', router);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json())

////////////////////////////////////////////////////////////

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

////////////////////////////////////////////////////////////

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


