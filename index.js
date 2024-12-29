const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json());  // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })) //chatgpt added, breaks without
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose.connect("mongodb+srv://maxa:kUgGmrWJphBAjZW8@cluster0.qnmv2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

//Main schema to store info
const Log = mongoose.model(
  "Log",
  new mongoose.Schema({
    userid: String,
    username: String,
    description: String,
    duration: Number,
    date: { type: Date, default: Date.now },
  })
);

// Initial user schema for first post method
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
  })
);

//POST to api users
app.post('/api/users', (req, res) => {

  const newUser = new User({
    username: req.body.username,
  })

  // Save the new user to the database
  newUser.save()
    .then(user => {
      // Return the object AFTER the save is finished
      res.json({
        username: user.username,
        _id: user._id,
      });
    })
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
