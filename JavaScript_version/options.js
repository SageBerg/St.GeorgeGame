"use strict";

var raffle = require("./raffle");

exports.default_options = {"a": "Ask about assassins.",
                           "b": "Buy a drink.",
                           "c": "Leave in a huff.",
                           "d": "Sing a song.",
                           "e": ""};

exports.get_options = function get_options(game_state) {
    var options = {"a": {}, "b": {}, "c": {}, "d": {} };
    if (game_state.character.is_dead || 
        game_state.character.has_found_true_love) {
        options.a = "Play again.";
        options.b = "Don't play again.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else if (game_state.marriage === true) {
        options.a = "MARRY";
        options.b = "Run like the Devil.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else {

        get_default_options(options.a, options.b, options.c, options.d);
        get_character_options(game_state, options.a, options.b, options.c, 
                              options.d);
        get_place_options(game_state, options.a, options.b, options.c, 
                          options.d);
        get_person_options(game_state, options.a, options.b, options.c, 
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

    }

    game_state.marriage = false;

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

    if (game_state.places[game_state.character.place].locked === false) {
        raffle.add(raffle_c, "GO_TO", 200);
    }

    if (game_state.character.person !== null) {
        raffle.add(raffle_a, "Attack", 10);
    }

    if (game_state.character.is_threatened === true) {
        raffle.add(raffle_c, "Run like the Devil.", 100);
        //raffle.add(raffle_c, "Waddle like God.", 10);
    }

    if (game_state.character.items["many colored mushroom"] > 0) {
        raffle.add(raffle_d, "Chow down on your many colored mushroom.", 1);
    }

}

function get_place_options(game_state, raffle_a, raffle_b, raffle_c, 
                           raffle_d) {

    if (game_state.places[game_state.character.place].town) {
        raffle.add(raffle_c, "Look for a cat.", 1);
        if (game_state.character.person !== "st_george") {
            raffle.add(raffle_d, "Look for St. George.", 1);
        }
    }

    if (game_state.character.person !== "war_merchant" &&
        game_state.character.place === "market") {
        raffle.add(raffle_d, "Look for a weapon.", 10);
    }

    if (game_state.character.place === "woods") {
        raffle.add(raffle_a, "Go mushroom picking.", 2);
    }

    if (game_state.character.place === "countryside" || 
        game_state.character.place === "woods" ||
        game_state.character.place === "lord_bartholomew_manor") {
        raffle.add(raffle_b, "Go flower picking.", 2);
    }

}

function get_person_options(game_state, raffle_a, raffle_b, raffle_c, 
                            raffle_d) {
    if (game_state.character.person === "war_merchant") {
        raffle.add(raffle_d, "Buy a weapon.", 10000);
    }

    if (game_state.character.person === "olga") {
        raffle.add(raffle_d, "Flirt with", 100);
        //game_state.persons[game_state.character.person].name + ".", 10000);
    }
}
