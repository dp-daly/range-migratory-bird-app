/*-------------------------------- Dependencies --------------------------------*/
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const Comment = require('./models/comment');
const Sightings = require('./models/sighting');
const User = require('./models/user');

/*-------------------------------- Controllers/Port --------------------------------*/
const authController = require('./controllers/auth.js');
const feedController = require('./controllers/feed.js');
const sightingController = require('./controllers/sighting.js');
const userController = require('./controllers/user.js');

const port = process.env.PORT ? process.env.PORT : '3000';

/*-------------------------------- DB Connect --------------------------------*/
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

/*-------------------------------- Middleware --------------------------------*/
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));


app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
    })
  );

  app.use((req, res, next) => {
    if (req.session.message) {
      res.locals.message = req.session.message;
      req.session.message = null;
    }
    next();
  });
  
  app.use(passUserToView)
  app.use('/feed', feedController);
  app.use('/sighting', sightingController);
  app.use('/auth', authController);
//   app.use('/community', isSignedIn);
  app.use('/community', isSignedIn, userController);


/*-------------------------------- Routes --------------------------------*/
app.get("/", (req, res) => {
    res.render("index.ejs")
})

/*-------------------------------- Listener --------------------------------*/
app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
  });