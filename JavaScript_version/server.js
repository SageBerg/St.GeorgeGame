"use strict";

var persons   = require("./persons").persons;
var places    = require("./places").places;
var actions   = require("./actions").actions;
var character = require("./character").character;

var express   = require('express');
var http      = require('http');
var port      = 3000;
var app;
var server;

app = express();
server = http.createServer(app);
server.listen(port);

//app.use(express.urlencoded());
app.use(express.static(__dirname));

app.get("/request_initial_world.json", respond_with_initial_world);
app.get("/request_outcome_of_action.json", respond_with_outcome); 

console.log("Server started on port: " + port); //because feedback is nice

function respond_with_initial_world(req, res) {
    var game_state = {
        "action": null,
        "character": character,
        "message": "You are in a tavern. The local assassins hate you",
        "options": 
            {
                "a": "Ask about assassins",
                "b": "Buy a drink",
                "c": "Leave in a huff",
                "d": "Sing a song"
            },
        "persons": persons,
        "places": places,
    };
    res.json(game_state);
}

function respond_with_outcome(req, res) {
    console.log(req.query.game_state.action);
    //res.json();
}
