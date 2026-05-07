const express=require("express");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {authMiddleware}=require("./middleware.js")
const {userModel, todoModel}=require("./models.js")

const app = express();
app.use(express.json());
app.use(cookieParser());

// let CURRENT_USER_ID=1;
// let CURRENT_TODO_ID=1;

// let USERS=[];
// let TODOS=[];

app.get("/",(req,res)=>{
    res.json({
        hello:"hello"
    })
})

app.post("/signup", async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    // const existingUser=USERS.find((user)=>user.username===username);
    const existingUser=await userModel.findOne({
        username:username,
        password:password
    })
    if(existingUser){
        return res.status(403).json({
            message:"Username already exists"
        })
    }
    const newUser = await userModel.create({
        username:username,
        password:password
    });
    res.json({
        id: newUser._id
    });
})

app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const existingUser=USERS.find((user)=>user.username===username);
    if(!existingUser){
        return res.status(403).json({
            message:"Username does not exist"
        })
    }

    const token = jwt.sign({userId: existingUser.id}, "srirame");

    res.cookie("authToken", token).json({
        message:"Signin successful",
        token: token
    })
})

app.post("/todo",authMiddleware,(req,res)=>{
    const userId=req.userId;
    const title=req.body.title;
    const description=req.body.description;

    TODOS.push({
        id: CURRENT_TODO_ID++,
        userId: userId,
        title: title,
        description: description

    })
    res.json({
        message:"todo made"
    })
})

app.delete("/todo/:todoId",authMiddleware,(req,res)=>{
    const userId=req.userId;
    const todoId=parseInt(req.params.todoId);

    const doesUserOwnTodo=TODOS.find(t=>t.id&&t.userId==userId)

    if(doesUserOwnTodo){
        TODOS=TODOS.filter(t=>t.id===todoId&&t.userId===userId);
        res.json({
            message:"Deleted"
        })
    }
    else{
        res.status(411).json({
            message:"Either todo doesn't exist or user doesn't own todo"
        })
    }
})

app.get("/todos",authMiddleware,(req,res)=>{
    const userId=req.userId;
    const userTodos=TODOS.filter(t=>t.userId===userId);
    res.json({
        todos:userTodos
    })
})

app.listen(3000);