//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema( {
  email: String,
  password: String,
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)

app.route("/")

.get(function(req,res){
  res.render("home")
});

app.route("/register")

.get(function(req,res){
  res.render("register")
})

.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.render("secrets")
    }
  })
});

app.route("/login")

.get(function(req,res){
  res.render("login")
})
.post(function(req,res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email: userName}, function(err,foundUser){
    if (err){
      console.log(err)
    }else{
      if(foundUser)

      {if(foundUser.password === password ){
        res.render("secrets")
      };}

    };
  })
});


app.listen(3000 , function(req,res){
  console.log("Server is running successfully on port 3000");
})
