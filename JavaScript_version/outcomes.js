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

function move_character(game_state, destination) {
    game_state.character.place = destination;
    game_state.character.is_threatened = false;
    game_state.character.person = null;
    game_state.message += "You find yourself in " + destination + ".";
}

var outcomes = {
    "assassinated": function(game_state) {
        game_state.message = "You get assassinated.";
        game_state.character.is_dead = true;
        return game_state;
    },
    "assassins_approach": function(game_state) {
        game_state.message = 
            "Some men in dark cloaks notice you singing " + 
            "and start edging toward you.";
        game_state.character.person = "assassins";
        game_state.character.is_threatened = true;
        return game_state;
    },
    "left_in_a_puff": function(game_state) {
        game_state.message = "";
        var place_list = [];
        for (var place in game_state.places) {
            if (game_state.places[place] !== 
                game_state.places[game_state.character.place]) {
            place_list.push(game_state.places[place].name);
            }
        }
        var roll = random_int(place_list.length);
        var destination = place_list[roll];
        move_character(game_state, destination);
        return game_state;
    },
    "kill": function(game_state) {
        game_state.message =
            "You kill " +
            game_state.persons[game_state.character.person].name + ".";
        game_state.persons[game_state.character.person].alive = false;
        game_state.character.is_threatened = false;
        game_state.character.person = null;
        return game_state;
    },
    "lose_fight": function(game_state) {
        game_state.message = 
            "You get killed by " + 
            game_state.persons[game_state.character.person].name + ".";
        game_state.character.is_dead = true;
        return game_state;
    },
    "meet_blind_bartender": function(game_state) {
        game_state.message = 
            "The blind bartender grumbles as he passes you a drink.";
        game_state.character.person = "blind_bartender";
        return game_state;
    },
    "moved": function(game_state) {
        game_state.message = "";
        var links = game_state.places[game_state.character.place].links
        var destination = links[random_int(links.length)];
        move_character(game_state, destination);
        return game_state;
    },
    "no_one_cares":function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },
}
