const express = require('express');
const app = express();
const { ROLE, users } = require('./data');
const projectRouter = require('./routes/projects');
const { authUser, authRole } = require('./basicAuth');

app.use(express.json());
app.use(setUser);
app.use('/projects', projectRouter);

//this is a regular route
//anyone can reach this route
//no user permissions needed
app.get('/', (req, res) => {
  res.send('This is the homepage.');
});

//this is an admin route
//there is an authRole permission added to it
//preventing users without the role: Admin from reaching it
app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send('This is the admin page.');
});

//a dashboard route
//only logged in users can reach this route
app.get('/dashboard', authUser, (req, res) => {
  res.send('This is the user dashboard.');
});

//simple function for setting the requested user
//the userId needs to be a number in the request
function setUser(req, res, next) {
  const userID = req.body.userId;
  if (userID) {
    req.user = users.find((user) => user.id === userID);
  }
  next();
}

app.listen(3030, () => console.log('Server up and running...'));
