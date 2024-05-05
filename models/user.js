import mongoose from "mongoose";

const schema = new mongoose.Schema({
    toDo : {
        type: String,
        required : true
    }
});

export { schema };