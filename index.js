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

app.post('/api/users/:_id/exercises', (req, res) => {
  idString = req.body._id
  descriptionString = req.body.description

  //return single user object based on id
  user = users.find((user) => user._id === userId);

  // duration validation (number)
  durationNum = Number(req.body.duration)

  //date validation (Date() method)
  dateString = new Date(req.body.date)
  dateString = dateString.toDateString()

  res.json({
    _id: user._id,
    username: user.username,
    date: dateString,
    duration: durationNum,
    description: descriptionString
  })
})

app.get('/api/users/:id/logs', (req, res) => {
  idString = req.params.id
  
  res.json({
    id:,
    username:,
    count:,
    logs:
    //array of objects that have description duration and date
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
