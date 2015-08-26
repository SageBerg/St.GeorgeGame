"use strict";

//var action      = require("./actions").actions;
var character   = require("./character").character;
var destringify = require("./destringify_http").destringify;
var options     = require("./options");
//var outcomes    = require("./outcomes").outcomes;
var persons     = require("./persons").persons;
var places      = require("./places").places;

var express     = require('express');
var http        = require('http');
var port        = 3000;
var app;
var server;

app = express();

app.get("/request_initial_world.json", respond_with_initial_world);
app.get("/request_outcome_of_action.json", respond_with_outcome); 
app.use(express.static(__dirname));

server = http.createServer(app);
server.listen(port);

function respond_with_initial_world(req, res) {
    var game_state = {
        "action":    null,
        "character": character,
        "message":   "You are in a tavern. The local assassins hate you",
        "options":   options.default_options,
        "persons":   persons,
        "places":    places,
    };
    res.json(game_state);
}

function respond_with_outcome(req, res) {
    var game_state        = req.query;
    destringify(game_state); //because HTTP turns booleans into strings
    var outcome           = "assassinated"; //raffle.get(possible_outcomes);
    game_state            = apply_outcome(outcome, game_state);
    game_state.options    = options.get_options(game_state);
    res.json(game_state);
}

function apply_outcome(outcome, game_state) {
    if (outcome === "assassinated") {
        game_state.message = "You get assassinated.";
        //game_state.character.is_dead = true;
    } else {
        game_state.message = "Error: No outcome!";
    }
    game_state.action = null; //the player hasn't chosen a new action yet
    return game_state
}
