var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");
var router = require("express").Router();

//ROUTES
//=========================================

// Export app routes
module.exports = function (app) {

    // GET reqs to render to handlebars pages--- index pg
    router.get("/", function (req, res) {
        db.Article.find({ saved: false })
            .then(function (result) {
                var hbsObject = {
                    articles: result
                };
                console.log(hbsObject);
                res.render('index', hbsObject);
            }).catch(function (err) {
                res.json(err)
            });
    });

    //GET reqs to render to handlebars pages--- saved pg 
    router.get("/saved", function (req, res) {
        db.Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
            var hbsObject = {
                articles: articles
            };
            res.render("saved", hbsObject);
        });
    });

    // A GET route for scraping the website
    router.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios

        axios.get("https://www.cnn.com/world").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every article tag, and do the following:
            $("article").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).find("h3").text();
                result.link = "https://www.cnn.com" + $(this).find("a").attr("href");

                // Create a new Article using the `result` object built from scraping--new article using the result object
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);

                    });
            });
            // Send a message to the client

            res.setTimeout(1000, function () {
                console.log("works!")
                res.redirect("/");
            })
        });
    });


    // Route for getting all Articles from the db
    router.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                //send as a json object 
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    //GET article by id (pop w/note)
    router.get("/articles/:id", function (req, res) {
        // Use the article id to find 
        db.Article.findOne({ "_id": req.params.id })
            //pop with its specific notes
            .populate("note")
            // Execute the above query
            .exec(function (err, dbArticle) {
                //errors
                if (err) {
                    console.log(err);
                }
                else {
                    // send article
                    res.send(dbArticle);
                }
            });
    });


    // Save the article ---POST 
    router.post("/articles/save/:id", function (req, res) {
        // Use the article id to find and update its saved boolean
        db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
            // Execute the above query
            .exec(function (err, dbArticle) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                else {
                    // send article
                    res.send(dbArticle);
                }
            });
    });


    // Route for saving/updating an Article's associated Note-- create note!
    router.post("/notes/save/:id", function (req, res) {
        // var newNote = new db.Note({
        //     body: req.body
        // });
        console.log("req", req.body); //view the newNote
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log("creating note")
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. 
                //Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                //with the json object 
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    //Delete the note-- delete ROUTE
    return router;
}