import express from "express";
import user from "./models/user.js";
import { userSort, createRoomName } from './public/javascripts/functions.js';
import passport from "passport";
import localStrategy from "passport-local";
import expressSession from "express-session";
import flash from "connect-flash";
import { Server } from "socket.io";
import { createServer } from "node:http";
import globalChat from "./models/global.js";
import homeChat from "./models/home.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});
const PORT = 3000;
let onlineUsers = [];

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
    secret: "hey"
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/images/uploads');
  },
  filename: function (req, file, cb) {
    const uniquename = uuidv4();
    cb(null, uniquename+path.extname(file.originalname));
  }

});

const upload = multer({ storage });

//////////////////////////////////////////////////////////////////////

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

app.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
}));

app.get("/logout", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/logout/" + username);
});

app.get("/logout/:username", isLoggedIn, (req, res, next) => {

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    onlineUsers.splice(onlineUsers.indexOf(req.params.username), 1);
    res.redirect("/login");
  });
});

/**************************************************************************************************************************************/
app.get("/profile", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/profile/" + username);
});

app.get("/profile/:username", isLoggedIn,async (req, res) => {
  try{
    if (req.params.username !== req.session.passport.user) {
      res.redirect("/login");
    } else {
      const userDetails = await user.findOne({username: req.session.passport.user})
      res.render("profile.ejs",{
        profileImage : userDetails.profileImage,
        username :userDetails.username,
        fullname :userDetails.fullname,
        noOfFrds : userDetails.friends.length,
        description : userDetails.description
      });
    }
  }
  catch(err){
    console.log(err);
  }
  
});

app.post('/profileupload',isLoggedIn, upload.single("image") ,async (req, res, next)=> {
  const userDetails = await user.findOne({username: req.session.passport.user})
  userDetails.profileImage = req.file.filename;
  await userDetails.save();
  res.redirect("/profile");
  
});

/**************************************************************************************************************************************/

app.get("/home", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  const searchName = req.query.search;
  let redirectUrl = "/home/" + username;
  if (searchName !== undefined) {
    redirectUrl += "?search=" + searchName;
  }
  res.redirect(redirectUrl);
});

app.get("/home/:username", isLoggedIn, async (req, res) => {
  try {
    const searchQuery = req.query.search;

    if (req.params.username !== req.session.passport.user) {
      res.redirect("/login");
    }
    else {
      //Username of Friends of the client
      let friendsListList = await user.find(
        { username: req.params.username },
        { _id: 0, friends: 1 }
      );
      let friendsList = friendsListList[0].friends;

      //Details of each friend of client
      let friendDetailsList = await user.find(
        { username: { $in: friendsList } },
        { _id: 0, username: 1, fullname: 1 ,profileImage: 1}
      );

      //To filter friendlist according to search
      if (searchQuery !== undefined && searchQuery !== '') {
        friendDetailsList = friendDetailsList.filter(user => user.fullname.includes(searchQuery));
      }

      res.render("home.ejs", {
        friendDetailsList: friendDetailsList,
        username: req.session.passport.user
      });
    }
  }
  catch (err) {
    console.log(err);
  }

});

/**************************************************************************************************************************************/

app.get("/addUser", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  const searchName = req.query.search;
  let redirectUrl = "/addUser/" + username;
  if (searchName !== undefined) {
    redirectUrl += "?search=" + searchName;
  }
  res.redirect(redirectUrl);
});

app.get("/addUser/:username", isLoggedIn, async (req, res) => {
  try {
    const searchQuery = req.query.search;

    if (req.params.username !== req.session.passport.user) {
      return res.redirect("/login");
    }
    else {
      //All existing users details except the client
      let existingUserList = await user.find(
        { username: { $ne: req.params.username } },
        { _id: 0, username: 1, fullname: 1 ,profileImage: 1}
      );

      //Usernames of Friends of the client
      let friendsList = await user.find(
        { username: req.params.username },
        { _id: 0, friends: 1 }
      );

      let sortedUserList = userSort(friendsList, existingUserList);

      //To filter sorted Users according to search
      if (searchQuery !== undefined && searchQuery !== '') {
        sortedUserList = sortedUserList.filter(user => user.username.includes(searchQuery));
      }

      res.render("addUser.ejs", {
        existingUsers: sortedUserList,
        friendsList: friendsList
      });
    }
  }
  catch (err) {
    console.log(err);
  }
});

app.post("/addFriend/:newFriendName", isLoggedIn, async (req, res) => {
  try {
    const myUsername = req.session.passport.user;
    const frdUsername = req.params.newFriendName;
    await user.updateOne(
      { username: myUsername },
      { $push: { friends: frdUsername } }
    );
    res.redirect("/addUser");
  }
  catch (err) {
    console.log(err);
  }
});

app.post("/removeFriend/:oldFriendName", isLoggedIn, async (req, res) => {
  try {
    const myUsername = req.session.passport.user;
    const frdUsername = req.params.oldFriendName;
    await user.updateOne(
      { username: myUsername },
      { $pull: { friends: frdUsername } }
    );
    res.redirect("/addUser");
  }
  catch (err) {
    console.log(err);
  }
});

/****************************************************************************************************************************************/

app.get("/global", isLoggedIn, (req, res) => {
  const username = req.session.passport.user;
  res.redirect("/global/" + username);
});

app.get("/global/:username", isLoggedIn, async (req, res) => {
  try {
    if (req.params.username !== req.session.passport.user) {
      res.redirect("/login");
    }
    else {
      //All online users details
      let onlineUsersList = await user.find(
        { username: { $in: onlineUsers } },
        { _id: 0, username: 1, fullname: 1 ,profileImage: 1}
      );

      res.render("global.ejs", {
        online: onlineUsers.length,
        onlineUsersList: onlineUsersList,
        username: req.session.passport.user
      });
    }
  }
  catch (err) {
    console.log(err);
  }

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    if (!onlineUsers.includes(req.session.passport.user)) {
      onlineUsers.push(req.session.passport.user);
    }
    return next();
  }
  res.redirect("/login");
}

/*************************************************   Home Chat   **********************************************************************************/
io.on('connection', async (socket) => {

  let roomName;

  // Leave all rooms
  socket.on('leave all rooms',async () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (room !== socket.id) { // Exclude the default room (socket.id)
        socket.leave(room);
      }
    });
  });

  socket.on("Join Home Room", async (myUsername, frdUsername) => {
    roomName = createRoomName(myUsername, frdUsername);
    socket.join(roomName);
    console.log(roomName);


    try {
      const messages = await homeChat.find({ timestamp: { $gt: 0 }, room: roomName });
      messages.forEach(message => {
        socket.emit('Recover home messages', message.text, message.username);
      });
    } catch (e) {
      console.error('Error fetching messages from database:', e);
    }

  });

  socket.on("Home Chat", async (msg, username) => {
    try {

      const homechat = new homeChat({
        room: roomName,
        username: username,
        text: msg
      });
      await homechat.save();

    } catch (err) {
      console.error('Error saving message to database:', err);
    }
    socket.broadcast.to(roomName).emit('Home Chat', msg, username);
  });

});
/**************************************************  Global Chat  **********************************************************************************/
io.on('connection', async (socket) => {
  socket.on('Global Chat', async (msg, username) => {
    try {
      const globalchat = new globalChat({
        username: username,
        text: msg
      });
      await globalchat.save();

    } catch (err) {
      console.error('Error saving message to database:', err);
    }
    socket.broadcast.emit('Global Chat', msg, username);
  });

  if (!socket.recovered) {
    try {
      const messages = await globalChat.find({ timestamp: { $gt: 0 } });
      messages.forEach(message => {
        socket.emit('Recover global messages', message.text, message.username, message._id);
      });
    } catch (e) {
      console.error('Error fetching messages from database:', e);
    }
  }
});

//////////////////////////////////////////////

// io.on("connection", (socket) => {
//   // socket.join("some room");

//   socket.on("chat message", (msg) => {
//     // Broadcast to all connected clients in the room except the sender
//     socket.to("some room").emit("chat message", msg);

//   });
//   // Join the room named 'some room'
// });

//////////////////////////////////////////////////////////

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

