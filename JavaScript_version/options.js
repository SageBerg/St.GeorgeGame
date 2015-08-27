"use strict";

var raffle = require("./raffle");

exports.default_options = {"a": "Ask about assassins.",
                           "b": "Buy a drink.",
                           "c": "Leave in a huff.",
                           "d": "Sing a song.",
                           "e": ""};

exports.get_options = function get_options(game_state) {
    var options = {"a": {}, "b": {}, "c": {}, "d": {} };
    if (game_state.character.is_dead === false) {
        get_default_options(options.a, options.b, options.c, options.d);
        get_character_options(game_state, options.a, options.b, options.c, 
                              options.d);
        options.a = raffle.get(options.a);
        options.b = raffle.get(options.b);
        options.c = raffle.get(options.c);
        options.d = raffle.get(options.d);
        if (Math.floor(Math.random() * 250) === 0) {
            options.e = "Enter the void.";
        } else {
            options.e = "";
        }
    } else {
        options.a = "Play again.";
        options.b = "Don't play again.";
        options.c = "";
        options.d = "";
        options.e = "";
    }
    return options;
}

function get_default_options(raffle_a, raffle_b, raffle_c, raffle_d) {
    raffle.add(raffle_a, "Think.", 1);
    raffle.add(raffle_a, "Lick the ground.", 1);
    raffle.add(raffle_b, "Pray to a higher power.", 1);
    raffle.add(raffle_c, "Go to sleep.", 1);
    raffle.add(raffle_c, "Leave in a puff.", 1);
    raffle.add(raffle_d, "Sing a song.", 1);
    raffle.add(raffle_d, "Dance a jig.", 1);
}

function get_character_options(game_state, raffle_a, raffle_b, raffle_c, 
                               raffle_d) {
    if (game_state.character.person !== null) {
        raffle.add(raffle_a, "Attack", 10);
    }
}
