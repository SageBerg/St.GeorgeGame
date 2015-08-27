"use strict";

var raffle  = require("./raffle");
var actions = require("./actions").actions;

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes = actions[game_state.action](game_state, {});
    return raffle.get(possible_outcomes);
}

exports.apply_outcome = function apply_outcome(outcome, game_state) {
    return outcomes[outcome](game_state);
}

function random_int(n) {
    return Math.floor(Math.random() * n);
}

var outcomes = {
    "assassinated": function(game_state) {
        game_state.message = "You get assassinated.";
        game_state.character.is_dead = true;
        return game_state;
    },
    "moved": function(game_state) {
        var links = game_state.places[game_state.character.place].links
        var destination = links[random_int(links.length)];
        game_state.message = "You find yourself in " + 
            game_state.places[destination].name + ".";
        game_state.character.person = null;
        game_state.character.place = destination;
        game_state.character.threatened = false;
        return game_state;
    },
}
