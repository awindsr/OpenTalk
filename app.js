import express from "express";
import user from "./models/user.js";
import passport from "passport";
import localStrategy from "passport-local";
import expressSession from "express-session";
import flash from "connect-flash";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(flash());

////////////////////////////////////////////////////////////
passport.use(new localStrategy(user.authenticate()));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hey",
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.render("start.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { existsError: req.flash("error") });
});

app.post("/register", (req, res, next) => {
  const userData = new user({
    username: req.body.username,
    password: req.body.password,
    fullname: req.body.fullname,
  });
  console.log(req.body);
  user.register(userData, req.body.password, (err) => {
    if (err) {
      // If the error is due to a duplicate username
      if (err.name === "UserExistsError") {
        req.flash("error", "Username already exists.");
        return res.redirect("/register");
      }
    }
    // Registration successful
    passport.authenticate("local")(req, res, () => {
      res.redirect("/home");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { error: req.flash("error") });
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) { }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/home", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/home/" + username);
});

app.get("/home/:username", isLoggedIn, (req, res) => {
  if (req.params.username !== req.session.passport.user) {
    res.redirect("/login");
  } else {
    res.render("home.ejs");
  }
});

app.get("/group", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/group/" + username);
});

app.get("/group/:username", isLoggedIn, (req, res) => {
  if (req.params.username !== req.session.passport.user) {
    res.redirect("/login");
  } else {
    res.render("group.ejs");
  }
});

app.get("/addUser", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/addUser/" + username);
});

app.get("/addUser/:username", isLoggedIn,async (req, res) => {
  try{
    if (req.params.username !== req.session.passport.user) {
      res.redirect("/login");
    } else {
      //All existing users except the client
      const existingUserList = await user.find(  
        {username:{$ne:req.params.username}} , 
        {_id:0,username:1,fullname:1}
      );

      //Friends of the client
      const friendsList = await user.find(  
        {username:req.params.username} , 
        {_id:0,friends:1}
      );

      res.render("addUser.ejs",{
        existingUsers :existingUserList,
        friendsList :friendsList
      });
    }
  }
  catch(err){
    console.log(err);
  }
});

app.post("/addFriend/:newFriendName", isLoggedIn,async (req, res) => {
  try{
    const myUsername = req.session.passport.user;
    const frdUsername = req.params.newFriendName;
    await user.updateOne(
      { username: myUsername },
      { $push:{friends:frdUsername}}
    );
    res.redirect("/addUser");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/removeFriend/:oldFriendName", isLoggedIn,async (req, res) => {
  try{
    const myUsername = req.session.passport.user;
    const frdUsername = req.params.oldFriendName;
    await user.updateOne(
      { username: myUsername },
      { $pull:{friends:frdUsername}}
    );
    res.redirect("/addUser");
  }
  catch(err){
    console.log(err);
  }
});

app.get("/global", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/global/" + username);
});

app.get("/global/:username", isLoggedIn, (req, res) => {
  if (req.params.username !== req.session.passport.user) {
    res.redirect("/login");
  } else {
    res.render("global.ejs");
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
//socket io code//////////////////////////////////////////

io.on("connection", (socket) => {
  console.log("a user connected :" + socket.id);
  socket.on("disconnect", () => {
    socket.leave("some room");
    console.log("user disconnected :" + socket.id);
  });
});
//             Global Chat
// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       socket.broadcast.emit('chat message', msg);
//     });
//   });

io.on("connection", (socket) => {
  socket.join("some room");

  socket.on("chat message", (msg) => {
    // Broadcast to all connected clients in the room except the sender
    socket.to("some room").emit("chat message", msg);

  });
  // Join the room named 'some room'
});

//////////////////////////////////////////////////////////

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
