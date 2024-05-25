/*-------------------------------- Dependencies --------------------------------*/
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const Comment = require('./models/comment');
const { Sighting, Favourite } = require('./models/sighting');
const User = require('./models/user');

/*-------------------------------- Controllers/Port --------------------------------*/
const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : '3000';

/*-------------------------------- DB Connect --------------------------------*/

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

/*-------------------------------- Middleware --------------------------------*/

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  app.use('/auth', authController);
  app.use(morgan('dev'));


/*-------------------------------- Routes --------------------------------*/

app.get("/", (req, res) => {
    res.send("Hello")
})

/*-------------------------------- Listener --------------------------------*/

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });