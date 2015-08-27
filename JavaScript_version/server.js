"use strict";

var character   = require("./character").character;
var destringify = require("./destringify_http").destringify;
var options     = require("./options");
var outcomes    = require("./outcomes");
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
        "message":   "You are in a tavern. The local assassins hate you.",
        "options":   options.default_options,
        "persons":   persons,
        "places":    places
    };
    res.json(game_state);
}

function respond_with_outcome(req, res) {
    var game_state     = req.query;
    game_state         = destringify(game_state);
    var outcome        = outcomes.get_outcome(game_state);
    game_state         = outcomes.apply_outcome(outcome, game_state);
    game_state.options = options.get_options(game_state);
    res.json(game_state);
}
