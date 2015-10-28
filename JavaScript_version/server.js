"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/ 
/*global define */

var actions     = require("./actions").actions;
var character   = require("./character").character;
var destringify = require("./destringify_http").destringify;
var functions   = require("./functions");
var options     = require("./options");
var outcomes    = require("./outcomes");
var persons     = require("./persons").persons;
var places      = require("./places").places;
var validation  = require("./validation");

var express     = require("express");
var http        = require("http");
var port        = 80;
var app         = express();
var server;

app.get("/request_initial_world.json", respond_with_initial_world);
app.get("/request_outcome_of_action.json", respond_with_outcome); 
app.use(express.static(__dirname));

server = http.createServer(app);
server.listen(port);

function respond_with_initial_world(req, res) {
    var game_state = {
        "action":      null,
        "character":   character,
        "destination": null,
        "for_sell":    null,
        "marriage":    false,
        "message":     "You are in a tavern. The local assassins hate you.",
        "options":     options.starting_options,
        "outcome":     null,
        "persons":     persons,
        "places":      places,
        "score":       0,
    };
    res.json(game_state);
}

function respond_with_outcome(req, res) {
    try {
        if (validation.validate(req.query) === true) { 
            var game_state     = req.query;
            console.log(game_state.action); // stopgap until I set up more
            console.log(new Date());        // sophisticated logging
            game_state         = destringify(game_state);
            var outcome        = outcomes.get_outcome(game_state);
            game_state.outcome = outcome;
            game_state         = outcomes.apply_outcome(outcome, game_state);
            game_state.options = options.get_options(game_state);
            game_state.score   = parseInt(game_state.score) + 1;
            functions.stop_tripping(game_state);
            if (game_state.character.place === "ocean") {
                functions.animal_drown(game_state);
            }
            res.json(game_state);
        } else { // if input validation fails
            console.log("validation returned false");
            res.json({"message": "error"});
        }
    } catch(err) { // if bad input would bring down the server
        console.log("\nUser input that would break the server was entered: ");
        console.log(err.stack);
        res.json({"message": "error"});
    }
}
