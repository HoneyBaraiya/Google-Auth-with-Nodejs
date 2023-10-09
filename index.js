const express=require('express');
const session=require('express-session');
const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20').Strategy; //class name starts with caps
const ejs=require('ejs');
const path=require('path');


const app=express();


// 839183282321-hptgtm00mg7pg63k23c11f4087a1l5ir.apps.googleusercontent.com

// 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

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

// connect application to google oauth
passport.use(new GoogleStrategy({
    clientID:"839183282321-hptgtm00mg7pg63k23c11f4087a1l5ir.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/google/callback"
},function(accessToken,refereshToken,profile,cb){
    cb(null,profile)
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
        res.render(path.join(__dirname,"login.ejs"));s
})

app.listen("8000",()=>{
    console.log("listing");
})