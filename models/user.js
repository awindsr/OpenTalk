import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/OpenTalk");
import plm from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      profileImage: String,
      password: {
        type: String,
        required:true,
        
      },
      fullname: {
        type: String,
        required: true
      }
});

userSchema.plugin(plm);

const user = mongoose.model("user",userSchema,"user"); //collection
export default user;