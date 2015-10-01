"use strict";

var actions     = require("./actions").actions;
var character   = require("./character").character;
var destringify = require("./destringify_http").destringify;
var functions   = require("./functions");
var options     = require("./options");
var outcomes    = require("./outcomes");
var persons     = require("./persons").persons;
var places      = require("./places").places;

var express     = require("express");
var http        = require("http");
var port        = 3000;
var app;
var server;

app = express();

app.get("/request_initial_world.json", respond_with_initial_world);
app.get("/request_outcome_of_action.json", respond_with_outcome); 
app.use(express.static(__dirname));

server = http.createServer(app);
server.listen(port);

function get_destination(game_state) {
    var links = game_state.places[game_state.character.place].links;
    var destination = links[functions.random_int(links.length)];
    return destination;
}

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
        "topic":       null,
    };
    res.json(game_state);
}

function respond_with_outcome(req, res) {
    if (validate(req.query) === true) { 
        var game_state     = req.query;
        game_state         = destringify(game_state);
        game_state.topic   = null;
        var outcome        = outcomes.get_outcome(game_state);
        game_state.outcome = outcome;
        game_state         = outcomes.apply_outcome(outcome, game_state);
        game_state.options = options.get_options(game_state);
        set_destination(game_state, outcome);
        game_state.score   = parseInt(game_state.score) + 1;
        stop_tripping(game_state);
        res.json(game_state);
    } else {
        res.json({"message": "error"});
    }
}

function set_destination(game_state, outcome) {
    if (game_state.options.c === "GO_TO") {
        switch (outcome) {
            case "directions_to_manor":
                game_state.destination = "lord_bartholomew_manor";
                break;
            case "directions_to_town":
                game_state.destination = "streets";
                break;
            case "directions_to_woods":
                game_state.destination = "woods";
                break;
            default:
                game_state.destination = get_destination(game_state);
        }
    } else {
        game_state.destination = null; 
    }
}

function stop_tripping(game_state) {
    if (game_state.character.is_tripping && 
        Math.floor(Math.random() * 8) === 0) {
        game_state.character.is_tripping = false; 
    }
}

function validate(game_state, conditions) {
    var conditions = [
        typeof(game_state) === "object",
        
        typeof(game_state.destination) === "string" &&
        (game_state.destination === "" ||
         typeof(places[game_state.destination]) === "object"), 

        typeof(game_state.for_sell) === "string",

        typeof(game_state.message) === "string",

        typeof(game_state.outcome) === "string" &&
        (game_state.outcome === "" ||
         typeof(outcomes.outcomes[game_state.outcome]) === "function"),

        typeof(game_state.persons) === "object",
        typeof(game_state.places)  === "object",

        typeof(game_state.score) === "string" &&
        !isNaN(parseInt(game_state.score)),

        typeof(game_state.topic) === "string",
    ];

    if (validate_character(game_state) === false ||
        validate_options(game_state) === false) {
        return false;
    }

    //return a boolean that says if all conditions in the list are true or not
    return conditions.every(function(condition) {
        return condition;
    });
}

function validate_character(game_state) {

    var character_keys = Object.keys(character);
    var input_character_keys = Object.keys(game_state.character);
    if (character_keys.length === input_character_keys.length) {
        for (var i in character_keys) {
            if (character_keys[i] !== input_character_keys[i]) {
                return false;
            }
        }
    } else {
        return false;
    }

    var conditions = [
        typeof(game_state.character)        === "object",
        typeof(game_state.character.excuse) === "string",

        game_state.character.has_found_true_love === "false" ||
        game_state.character.has_found_true_love === "true",
        game_state.character.has_lost_leg        === "false" ||
        game_state.character.has_lost_leg        === "true",
        game_state.character.has_tail            === "false" ||
        game_state.character.has_tail            === "true",
        game_state.character.is_dead             === "false" ||
        game_state.character.is_dead             === "true",
        game_state.character.is_frog             === "false" ||
        game_state.character.is_frog             === "true",
        game_state.character.is_monstrosity      === "false" ||
        game_state.character.is_monstrosity      === "true",
        game_state.character.is_threatened       === "false" ||
        game_state.character.is_threatened       === "true",
        game_state.character.is_tripping         === "false" ||
        game_state.character.is_tripping         === "true",

        game_state.character.money === "none" ||
        game_state.character.money === "pittance" ||
        game_state.character.money === "small_fortune" ||
        game_state.character.money === "large_fortune",

        typeof(persons[game_state.character.person]) === "object" ||
        game_state.character.person === "",

        typeof(places[game_state.character.place]) === "object" ||
        game_state.character.place === "",
    
        !isNaN(parseInt(game_state.character.strength)),
    ];

    for (var item in game_state.character.items) {
        conditions.push(!isNaN(parseInt(game_state.character.items[item])));
    }

    return conditions.every(function(condition) {
        return condition;
    });

}

function validate_options(game_state) {
    return typeof(game_state.options)             === "object" &&
           typeof(actions[game_state.options.a])  === "function" &&
           typeof(actions[game_state.options.b])  === "function" &&
           (typeof(actions[game_state.options.c]) === "function" ||
            game_state.options.c === "") &&
           (typeof(actions[game_state.options.d]) === "function" || 
            game_state.options.d === "") &&
           (typeof(actions[game_state.options.e]) === "function" || 
            game_state.options.e === "");
}
