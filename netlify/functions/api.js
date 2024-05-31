/*-------------------------------- Dependencies --------------------------------*/
const dotenv = require('dotenv');
dotenv.config();
const serverless = require('serverless-http')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require("path");
const MongoStore = require("connect-mongo");
const isSignedIn = require('../../middleware/is-signed-in.js');
const passUserToView = require('../../middleware/pass-user-to-view.js');
const Comment = require('../../models/comment');
const Sighting = require('../../models/sighting');

/*-------------------------------- Controllers/Port --------------------------------*/
const authController = require('../../controllers/auth.js');
const feedController = require('../../controllers/feed.js');
const sightingController = require('../../controllers/sighting.js');
const userController = require('../../controllers/user.js');

// const port = process.env.PORT ? process.env.PORT : '3000';

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
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

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
  app.use('/community', isSignedIn, userController);


/*-------------------------------- Routes --------------------------------*/

app.get("/", async (req, res) => {
  try {
    const sightings = await Sighting.find().populate('publisher');
    const reversedSightings = sightings.slice().reverse();
    const mostRecent = reversedSightings.slice(0, 3);
    const sortedSightings = sightings.slice().sort((a, b) => { 
      return b.comments.length - a.comments.length});
    const mostDiscussed = sortedSightings.slice(0, 3);
    res.render('index.ejs', {
      sightings: mostRecent,
      mostDiscussed,
    });
  } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
  }
});


app.get("*", function (req, res) {
  res.render("error.ejs", { systemErrorMessage: "Error 404: Page not found." });
});

/*-------------------------------- Listener --------------------------------*/
// app.listen(port, () => {
//     console.log(`The express app is ready on port ${port}!`);
//   });
  module.exports.handler = serverless(app)
