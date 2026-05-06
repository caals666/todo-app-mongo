const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const express=require("express");

const app = express();
app.use(express.json());
app.use(cookieParser());

function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, "srirame");

    if(decoded.userId){
        req.userId = decoded.userId;
        next();
    }
    else{
        res.status(403).json({
            message:"Token invalid or not found"
        })
    }
}

module.exports={
    authMiddleware: authMiddleware
}