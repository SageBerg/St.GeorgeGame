/*
 * The St. George Game (server)
 * by Sage Berg
 * developed in JavaScript 23 June 2015 
 *                      to XX XXXX 2015
 */

"use strict";

// Server Setup

var persons = require("./persons");
var places  = require("./places");
var actions = require("./actions");

var express = require('express'),
    http = require('http'),
    port = 3000,
    app,
    server;

app = express();
server = http.createServer(app);
server.listen(port);

app.use(express.urlencoded());
app.use(express.static(__dirname + "/client"));

app.post("/action.json", action_handler);

console.log("Server started on port: " + port); //because feedback is nice

// Game Data (will be stored in db if the size of the game gets unweidly)

// Functions

function action_handler(req, res) {
    if (strip_action(req.body.action) === "Play again.") {
        res.json({"reload": true});
        return;
    }
    var client_action = strip_action(req.body.action);
    var outcome_raffle = get_possible_outcomes_of_action(req.body.game_state, 
                                                         client_action);
    var outcome_id = raffle_get(outcome_raffle);
    var outcome = get_outcome(req.body.game_state, outcome_id);
  
    if (!outcome.dead && !outcome.found_love) {
        var options = get_player_options(outcome);
        outcome.options.a = options[0];
        outcome.options.b = options[1];
        outcome.options.c = options[2];
        outcome.options.d = options[3];
    } else {
        outcome.options.a = "Play again.";
        outcome.options.b = "Don't play again.";
    }
    res.json(outcome);
}

function complete_message_based_on_context(outcome) {
    if (outcome.message === "You kill") {
        outcome.message += " " + outcome.game_state.person.name + ".";
        outcome.game_state.person.alive = false;
    }
}

function make_game_state_edits(game_state, game_state_edits) {
    for (var key in game_state_edits) {
        if (key === "person") {
            game_state.person = game_state_edits.person;
        }
    }
}

function make_character_edits(game_state, character_edits) {
    for (var key in character_edits) {
        if (key === "person") {
            game_state.character.person = character_edits.person;
        }
        if (key === "threatened") {
            game_state.character.threatened = character_edits.threatened;
        }
    }
}

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function create_outcome_template() {
    return {"character_edits": {},
            "dead": false,
            "game_state": {},
            "game_state_edits": {},
            "found_love": false,
            "message": "error: (you shouldn't be seeing this message)",
            "moved": false,
            "options": {"a": "", "b": "", "c": "", "d": "", "e": "",},
            "redload": false, //factor this out
           };
}

function get_outcome(game_state, outcome_id) {
    var outcome = create_outcome_template();
    for (var key in actions[outcome_id]) {
        outcome[key] = actions[outcome_id][key];        
    }
    outcome.game_state = game_state;
    complete_message_based_on_context(outcome);
    make_game_state_edits(outcome.game_state, outcome.game_state_edits);
    make_character_edits(outcome.game_state, outcome.character_edits);
    return outcome;
}

function fight(game_state, raffle) {
    if (game_state.character.attack_strength > game_state.person.attack) {
        raffle_add(raffle, "you_kill", 1);
    } else {
        raffle_add(raffle, "you_get_killed", 1);
    }
}

function get_possible_outcomes_of_action(game_state, action) { 
    var raffle = {};
    if (action.split(" ")[0] === "Attack" || 
        game_state.character.threatened === true &&
        action !== "Run like the Devil." &&
        action !== "Waddle like God." && 
        action !== "Leave in a puff.") {
        fight(game_state, raffle);
    }

    if (action === "Ask about assassins.") {
        //raffle_add(raffle, "assassinated_in_tavern", 5);
        raffle_add(raffle, "no_one_wants_to_talk", 5);
        //raffle_add(raffle, "find_a_pretty_lady", 5);
    }
    if (action === "Buy a drink.") {
        raffle_add(raffle, "bartender_grumbles", 5);
    }
    if (action === "Leave in a huff.") {
        raffle_add(raffle, "random_move", 1);
        game_state.place = 
            places[game_state.place].links[
                randint(places[game_state.place].links.length)];
    }
    if (action === "Sing a song.") {
        if (game_state.place === "tavern") {
            raffle_add(raffle, "assassins_notice_singing", 1);
        }
    }
    return raffle;
}

function randint(n) {
    return Math.floor(Math.random() * n);
}

function get_player_options(outcome) {
    var a = {}, b = {}, c = {}, d = {};
    get_default_player_options(outcome.game_state, a, b, c, d);
    get_npc_player_options(outcome.game_state.person, a, b, c, d);
    get_outcome_player_options(outcome.message, a, b, c, d);
    get_place_player_options(outcome.game_state, a, b, c, d);
    return [raffle_get(a), raffle_get(b), raffle_get(c), raffle_get(d)];
}

function get_default_player_options(game_state, raffle_a, raffle_b, 
                                                raffle_c, raffle_d) {
    raffle_add(raffle_a, "Think.", 1);
    raffle_add(raffle_a, "Lick the ground.", 1);
    raffle_add(raffle_b, "Pray to a higher power.", 1);
    //raffle_add(raffle_c, "Go to sleep.", 1);
    if (places.places[game_state.place].links.length > 0) {
        //raffle_add(raffle_c, 
        //           "Go to " + get_adjacent_place(game_state.place) + ".", 10);
        raffle_add(raffle_c, "Leave in a huff.", 1);
    }
    //raffle_add(raffle_c, "Leave in a puff.", 1);
    raffle_add(raffle_d, "Sing a song.", 1);
    raffle_add(raffle_d, "Dance a jig.", 1);
}

function get_adjacent_place(place) {
    var raffle = {};
    for (var i in place.links) {
        raffle_add(raffle, places[place.links[i]].name, 1);
    }
    return raffle_get(raffle);
}

function get_outcome_player_options(message, raffle_a, raffle_b, 
                                             raffle_c, raffle_d) {
}

function get_place_player_options(game_state, raffle_a, raffle_b, 
                                              raffle_c, raffle_d) {
    if (game_state.place === "the tavern") {
        raffle_add(raffle_a, "Ask about assassins.", 1);
        raffle_add(raffle_b, "Buy a drink.", 2);
        raffle_add(raffle_d, "Do some gambling.", 2);
    }
}

function get_npc_player_options(npc, raffle_a, raffle_b, 
                                     raffle_c, raffle_d) {
    if (npc !== null && npc !== "") {
        raffle_add(raffle_a, "Attack " + get_her_him_or_them(npc) + ".", 10);
    }
    if (npc.name === "pretty_lady") {
        raffle_add(raffle_b, "Flirt with the pretty lady.", 100);
    }
}

function get_her_him_or_them(npc) {
    switch (npc.type) {
        case "female":
            return "her";
        case "group":
            return "them";
        case "male":
            return "him";
    }
}

function raffle_add(raffle, outcome, votes) {
    if (raffle[outcome]) {
        raffle[outcome] += votes;
    } else {
        raffle[outcome] = votes;
    }
}

function raffle_get(raffle) {
    var raffle_size = 0;
    for (var key in raffle) {
        raffle_size += raffle[key]; 
    }
    var roll = Math.floor(Math.random() * raffle_size);
    for (var key in raffle) {
        roll -= raffle[key];
        if (roll <= 0) {
            break;
        }
    }
    return key;
}
