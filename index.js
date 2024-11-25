const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })); 
//added to make the post function work? suggestion 
//from chatgpt, does actually fix it
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Array to store users
users = []

app.post('/api/users', (req, res) => {
  usernameString = req.body.username
  idString = Math.random().toString(36).substring(2, 22) //not secure
  userObject = {
    username: usernameString,
    _id: idString
  }
  users.push(userObject)
  res.json(userObject)
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

// Object in the format user ID: an array of execrise objects
logsObj = {}

app.post('/api/users/:_id/exercises', (req, res) => {
  idString = req.body[':_id'] //weird naming means .:_id doesnt work
  //console.log(idString)
  descriptionString = req.body.description

  //return single user object based on id, used for id and username
  user = users.find((user) => user._id === idString); //error if user id is not present, but not in fcc requirements
  //console.log(user)
  userId = user._id
  //console.log(userId)
  userUsername = user.username

  //duration validation (number)
  durationNum = Number(req.body.duration)

  //date validation (Date() method)
  // also fails to catch incorrect inputs, not required
  dateinput = req.body.date
  dateString = ''
  if(!dateinput) {
    dateString = new Date()
  }
  else {
    dateString = new Date(req.body.date)
  }
  //change to desired format
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


app.get('/api/users/:_id/logs', (req, res) => {
  idString = req.params._id

  user = users.find((user) => user._id === idString);

  logsArray = logsObj[user._id]
  //console.log(logsArray)

  countNum = logsArray.length

  //query limiters
  limitsObj = req.query
  from = limitsObj.from
  to = limitsObj.to
  limit = limitsObj.limit

  if(from) {
    fromDate = new Date(from)
    fromDate = fromDate.toDateString()
    if(fromDate) {
      logsArray = logsArray.filter(log => log.date <= fromDate)
    } //i feel like these inequalities are the wrong way around
  } //but the tests i do say otherwise
  if(to) {
    toDate = new Date(to)
    toDate = toDate.toDateString()
    if(toDate) {
      logsArray = logsArray.filter(log => log.date >= toDate)
    }
  }
  if(limit) { //0 doesnt work as a limit?
    exLimit = Number(limit)
    console.log(exLimit)
    if(exLimit) {
      logsArray = logsArray.slice(0,exLimit)
    }
  }
  

  res.json({
    _id: idString,
    username: user.username,
    count: countNum,
    log: logsArray
    //array of objects that have description duration and date
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
