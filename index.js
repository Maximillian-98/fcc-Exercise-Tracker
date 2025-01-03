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


//GET to api users
app.get('/api/users', (req, res) => {

  User.find()
    .then(users => { //Remove _v from object with .map
      res.json(users.map(user => ({
        username: user.username,
        _id: user._id
      })))
    })
})


//POST api user id exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  const _id = req.params._id
  const { description, duration, date } = req.body;

  //entry validation
  if(!_id || !description || !duration) {
    return res.status(400).json({ error: "Input Error, No input provided" })
  }

  //number validation
  const durationNum = Number(duration)
  if(isNaN(durationNum)) {
    return res.status(400).json({ error: "Input Error, Duration is not a number" })
  }

  //date creation
  let dateString = new Date()
  if(date) {
    dateString = new Date(date)
    //incorrect input
    if(isNaN(dateString)) {
      return res.status(400).json({ error: "Input Error, Not a date format" })
    }
  }

  //find user
  User.findById(_id)
    .then(user => {
      //Check if user exists
      if(!user) {
        return res.status(400).json({ error: "No known ID" })
      }

      //Create log
      const newLog = new Log({
        userid: user._id,
        username: user.username,
        description: description,
        duration: durationNum,
        date: dateString,
      });

      //Save and produce log
      newLog.save().then(log => {
        res.json({
          _id: log.userid,
          username: log.username,
          description: log.description,
          duration: log.duration,
          date: log.date.toDateString(),
        })
      });
    })

})

app.get('/api/users/:_id/logs', (req, res) => {
  const _id = req.params._id

  //Find user
  User.findById(_id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    
      //Find logs of user
      Log.find({ userid: _id})
        .then(logs => {
          console.log(logs)
          res.json({
            _id: user._id,
            username: user.username,
            count: logs.length,
            log: logs.map(log => ({
              description: log.description,
              duration: log.duration,
              date: log.date.toDateString()
            }))
          })
        })
    })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
