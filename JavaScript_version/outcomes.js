"use strict";

var raffle  = require("./raffle");
var actions = require("./actions").actions;

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes = {};
    actions[game_state.action](game_state, possible_outcomes);
    return raffle.get(possible_outcomes);
}

exports.apply_outcome = function apply_outcome(outcome, game_state) {
    outcomes[outcome](game_state);
}

function random_int(n) {
    return Math.floor(Math.random() * n);
}

var outcomes = {
    "assassinated": function(game_state) {
        game_state.message = "You get assassinated.";
        game_state.character.is_dead = true;
    },
    "left_in_a_puff": function(game_state) {
        var place_list = [];
        for (var place in game_state.places) {
            if (game_state.places[place].name !==
                game_state.character.place) {
            place_list.push(game_state.places[place].name);
            }
        }
        var roll = random_int(place_list.length);
        var destination = place_list[roll];
        game_state.message = "You find yourself in " + destination + ".";
        game_state.character.person = null;
        game_state.character.place = destination;
        game_state.character.threatened = false;
    },
    "meet_blind_bartender": function(game_state) {
        game_state.message = 
            "The blind bartender grumbles as he passes you a drink.";
        game_state.character.person = game_state.persons.blind_bartender;
    },
    "moved": function(game_state) {
        var links = game_state.places[game_state.character.place].links
        var destination = links[random_int(links.length)];
        game_state.message = "You find yourself in " + 
            game_state.places[destination].name + ".";
        game_state.character.person = null;
        game_state.character.place = destination;
        game_state.character.threatened = false;
    },
}
