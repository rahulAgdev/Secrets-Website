// always use dotenv at the very top of the program.
require("dotenv").config();
const express = require("express");
const bodyParser=require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose")
// const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const tempPort = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// connecting with local mongoose server
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

// creating mongodb schema 
// const userSchema = { 
//     email: String,
//     password : String
// }

//creating mongodb schema with encryption 
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// creating secret --> converting into environment variable. USE process.env.SECRET to access the secret from the env file.

// adding the plugin encrypt to the schema. make sure to add this before making the model. but we dont want to encrypt the email as we have to traverse and serach for it in the db. therefore we will only encrypt the password
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

// Creating model for the schema 
const User = new mongoose.model("User", userSchema);

// when the user goes to the register page and types in the email and the password and then hits the submit button that is when we want to create a new user in the user model.


app.get("/", (req,res)=>{
    res.render("home");
})
app.get("/login", (req,res)=>{
    res.render("login");
})
app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err)=>{
        if(err){
            console.log("err");
        }
        // the reason we are rendering the secrets page here is because we want to render it only when it is registered/ logged in.
        else{
            res.render("secrets")
        }
    });
})

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = mp5(req.body.password);

    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
                else{
                    console.log("Wrong password");
                }
            }
        }
    })

})

app.listen(tempPort, ()=>{
    console.log("Being hosted at http://localhost:"+tempPort);
})

