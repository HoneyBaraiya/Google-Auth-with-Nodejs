require('dotenv').config();
const express = require('express');
const session=require('express-session');
const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20').Strategy; //class name starts with caps
const ejs=require('ejs');
const path=require('path');
const { REFUSED } = require('dns');


const app=express();

app.set("view engine","ejs");

// using this there is no need to do login again and again
app.use(session({
    secret:"key",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

// to intialize the passport
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:8000/google/callback"
}, function (accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}))

passport.serializeUser(function(user,cb){
    cb(null,user);
})

passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})

// work with static file
app.use(express.static(path.join(__dirname,"public")));

// APIs
app.get("/login",(req,res)=>{
    res.render(path.join(__dirname,"login.ejs"));
});

app.get("/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/google/callback",
        passport.authenticate("google",{failureRedirect:"/login"}),
        async(req,res)=>{
            res.redirect("/dashboard");
        }
)

app.get("/dashboard",(req,res)=>{
    if(req.isAuthenticated())
        res.render(path.join(__dirname,"dashboard.ejs"),{user:req.user});
    else
        res.render(path.join(__dirname,"login.ejs"));
})

app.listen("8000",()=>{

    console.log("listing");
})