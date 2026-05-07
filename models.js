const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://strink:e@mernapp.x6kowse.mongodb.net/todo");

const UserSchema = new mongoose.Schema({
    username:String,
    password:String
})

const TodoSchema = new mongoose.Schema({
    title:String,
    description:String,
    userId:mongoose.Types.ObjectId
})

const userModel = mongoose.model("users",UserSchema);
const todoModel = mongoose.model("todos",TodoSchema);

module.exports={
    userModel,
    todoModel
};