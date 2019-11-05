var express = require("express");
var mongoose = require("mongoose");
var handlebars = require('express-handlebars');

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3001;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(__dirname + "/public"));


// Setup engine for Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



// Require routes from controller
var routes = require('./controllers.js/routes')(app);
app.use(routes); 

// Import routes and give the server access to them.
var router = express.Router();

// Have every request go through router middlewar
app.use(router);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });


  
