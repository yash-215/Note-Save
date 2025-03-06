import mongoose from "mongoose";

const Note = mongoose.Schema({
   email:{type:String},
   note:{type:String}
})

export default Note;