import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/OpenTalk");
import plm from "passport-local-mongoose";

const homeMessagesSchema = new mongoose.Schema({
    room: {
        type: String,
        required : true
    },
    username: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });

  homeMessagesSchema.plugin(plm);

  const homeChat = mongoose.model("Home Chat",homeMessagesSchema,"Home Chat"); //collection
  export default homeChat;