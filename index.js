const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Array to store users
users = []

app.post('/api/users', (req, res) => {
  usernameString = req.body.username
  idString = Math.random.toString(36).substring(2, 22)

  userObject = {
    _id: idString,
    username: usernameString
  }
  //userObject[id] = usernameString
  //users.append(userObject)

  res.json({
    username: usernameString,
    _id: idString
  })
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

// Object in the format user ID: an array of execrise objects
logsObj = {}

app.post('/api/users/:_id/exercises', (req, res) => {
  idString = req.body._id
  descriptionString = req.body.description

  //return single user object based on id, used for id and username
  user = users.find((user) => user._id === idString);
  userId = user._id
  userUsername = user.username

  // duration validation (number)
  durationNum = Number(req.body.duration)

  //date validation (Date() method)
  dateString = new Date(req.body.date)
  dateString = dateString.toDateString()

  //Exercise log
  exerciseLog = {
    description: descriptionString,
    duration: durationNum,
    date: dateString
  }

  //Update Object
  //if id exists, add to array of exerciselogs
  if(logsObj.hasOwnProperty(userId)) {
    logsObj[userId].push(exerciseLog)
  } else {//if id doesnt exist create new property(key) with userId
    logsObj[userId] = [exerciseLog]
  }
  


  res.json({
    _id: userId,
    username: userUsername,
    date: dateString,
    duration: durationNum,
    description: descriptionString
  })
})


app.get('/api/users/:id/logs', (req, res) => {
  idString = req.params.id

  user = users.find((user) => user._id === userId);

  logsArray = logsObj[idString]

  countNum = logsArray.length

  res.json({
    id: idString,
    username: user.username,
    count: coutnNum,
    logs: logsArray
    //array of objects that have description duration and date
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
