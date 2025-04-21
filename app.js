const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 10000;
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const session = require('express-session');

const webrouter = require("./Routes/router");
const adminrouter = require("./Routes/adminrouter");
const stdrouter = require('./Routes/stdrouter');

app.set("view engine", "ejs");
app.set("views", "Views");

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
app.locals.cache = false;

// Use MongoDB store for sessions
app.use(session({
  secret: '123456789',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { secure: false } // set to true if using https
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parser middleware
app.use(cookieparser());

// Static files
app.use(express.static("views"));

// Route handling
app.use("/", webrouter);
app.use('/admin', adminrouter);
app.use('/std', stdrouter);

// Catch-all for 404
app.get("*", (req, res) => {
  res.render("notfound");
});

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Our application server started at port number: ${PORT}`);
  }
});
