"use strict";

var raffle = require("./raffle");

exports.starting_options = {"a": "Ask about assassins.",
                            "b": "Buy a drink.",
                            "c": "Leave in a huff.",
                            "d": "Sing a song.",
                            "e": ""};

function burned_everything(game_state) {
    for (var place in game_state.places) {
        if (game_state.places[place].burnable) {
            return false;
        }
    }
    return true;
} 

function random_int(n) {
    return Math.floor(Math.random() * n);
}

exports.get_options = function get_options(game_state) {
    var options = {"a": {}, "b": {}, "c": {}, "d": {} };
    if (game_state.character.is_dead || 
        game_state.character.has_found_true_love) {
        options.a = "Play again.";
        options.b = "Don't play again.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else if (burned_everything(game_state)) {
        var messages = [
            "Some people just like to watch the world " +
            "burn. You are one of them. You win.",
            "You are satisfied with how everything has been burned. You win.",
        ] 
        game_state.message = messages[random_int(messages.length)];
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
    } else if (game_state.character.is_monstrosity) {
        options.a = "Annihilate everything.";
        options.b = "Terrorize the kingdom.";
        options.c = "Go on a rampage.";
        options.d = "Destroy all human civilizations.";
        options.e = "";
    } else {

        get_default_options(options.a, options.b, options.c, options.d);
        get_character_options(game_state, options.a, options.b, options.c, 
                              options.d);
        get_outcome_options(game_state, options.a, options.b, options.c, 
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
    raffle.add(raffle_c, "Go to sleep.", 1000); //fix
    //raffle.add(raffle_c, "Leave in a puff.", 1);
    raffle.add(raffle_d, "Sing a song.", 1);
    raffle.add(raffle_d, "Dance a jig.", 1);
}

function get_character_options(game_state, raffle_a, raffle_b, raffle_c, 
                               raffle_d) {

    if (game_state.places[game_state.character.place].locked === false) {
        //raffle.add(raffle_c, "GO_TO", 2);
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

    if (game_state.places[game_state.character.place].burnable) {
        raffle.add(raffle_b, "BURN", 1);
    }

    if (game_state.places[game_state.character.place].town) {
        raffle.add(raffle_c, "Look for a cat.", 1);
        if (game_state.character.person !== "st_george") {
            raffle.add(raffle_d, "Look for St. George.", 1);
        }
    }

    if (game_state.character.place === "countryside" || 
        game_state.character.place === "woods" ||
        game_state.character.place === "lord_bartholomew_manor") {
        raffle.add(raffle_b, "Go flower picking.", 2);
    }

    if (game_state.character.place === "market" &&
        game_state.character.person !== "war_merchant") {
        raffle.add(raffle_d, "Look for a weapon.", 10);
    }

    if (game_state.character.place === "tavern") {
        raffle.add(raffle_a, "Ask about assassins.", 1);
        raffle.add(raffle_b, "Buy a drink.", 1);
        if (game_state.persons.olga.alive &&
            game_state.persons.olga.name === "Olga" &&
            game_state.character.person !== "olga") {
            raffle.add(raffle_d, "Look for Olga.", 10);
            }
    }

    if (game_state.character.place === "woods") {
        raffle.add(raffle_a, "Go mushroom picking.", 2);
    }

}

function get_person_options(game_state, raffle_a, raffle_b, raffle_c, 
                            raffle_d) {
    if (game_state.character.person === "war_merchant") {
        raffle.add(raffle_d, "Buy a weapon.", 10000);
    }

    if (game_state.character.person === "olga" ||
        game_state.character.person === "eve" ||
        game_state.character.person === "felicty" ||
        game_state.character.person === "memaid" ||
        game_state.character.person === "nymph_queen"
       ) {
        raffle.add(raffle_d, "Flirt with", 100);
    }
}

function get_outcome_options(game_state, raffle_a, raffle_b, raffle_c, 
                            raffle_d) {
    if (game_state.outcome === "ignored" ||
        game_state.outcome === "think_pirates_laugh"   
       ) {
        raffle.add(raffle_a, "Kill yourself in frustration.", 1);
    }
}
