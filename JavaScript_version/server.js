"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var character   = require("./character").character;
var destringify = require("./destringify_http").destringify;
var Game        = require("./game").Game;
var OptionsGen  = require("./options").OptionsGenerator;
var persons     = require("./persons").persons;
var places      = require("./places").places;
var validation  = require("./validation");

var express     = require("express");
var http        = require("http");
var port        = 80; // change to 80 before committing 
var app         = express();
var server;

app.get("/request_initial_world.json", respond_with_initial_world);
app.get("/request_outcome_of_action.json", respond_with_outcome);
app.use(express.static(__dirname));

server = http.createServer(app);
server.listen(port);

// stopgap until I set up more sophisticated logging
function log(game_state) {
    console.log(game_state.action);
    console.log(new Date());
}

function respond_with_initial_world(req, res) {
    var game_state = {
        "action":      null,
        "character":   character,
        "destination": null,
        "for_sell":    null,
        "marriage":    false,
        "message":     "You are in a tavern. The local assassins hate you.",
        "options":     {"a": "Ask about assassins.",
                        "b": "Buy a drink.",
                        "c": "Leave in a huff.",
                        "d": "Sing a song.",
                        "e": ""},
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
            var game_state = destringify(req.query);

            log(game_state);

            var game = new Game(game_state);

            game.set_outcome();   // generates and sets outcome
            game.enact_outcome(); // modifies game state based on outcome

            var options_gen = new OptionsGen();
            options_gen.set_options(game); // generates and sets options
    

            res.json(game.get_state());
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
