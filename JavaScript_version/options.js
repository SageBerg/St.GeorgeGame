"use strict";

var raffle = require("./raffle");
var items  = require("./items");


exports.starting_options = {"a": "Ask about assassins.",
                            "b": "Buy a drink.",
                            "c": "Leave in a huff.",
                            "d": "Sing a song.",
                            "e": ""};

function burned_everything_victory(game_state) {
    for (var place in game_state.places) {
        if (game_state.places[place].burnable) {
            return false;
        }
    }
    game_state.score = parseInt(game_state.score) + 100;
    return true;
} 

function lords_victory(game_state) {
    if (game_state.persons.lord_arthur.alive === false ||
        game_state.persons.lord_bartholomew.alive === false ||
        game_state.persons.lord_carlos.alive === false ||
        game_state.persons.lord_daniel.alive === false) {
        game_state.score = parseInt(game_state.score) + 100;
        return true;
    }
    return false;
} 

function marriage_victory(game_state) {
    if (game_state.character.has_found_true_love) {
        game_state.score = parseInt(game_state.score) + 100;
        return true;
    }
    return false;
}

function random_int(n) {
    return Math.floor(Math.random() * n);
}

function set_game_over_options(options) {
        options.a = "Play again.";
        options.b = "Don't play again.";
        options.c = "";
        options.d = "";
        options.e = "";
}

exports.get_options = function get_options(game_state) {
    var options = {"a": {}, "b": {}, "c": {}, "d": {} };
    if (game_state.character.is_dead || marriage_victory(game_state)) {
        set_game_over_options(options);
    } else if (burned_everything_victory(game_state)) {
        var messages = [
            " Some people just like to watch the world " +
            "burn. You are one of them. You win.",
            " You are satisfied with how everything has been burned. You win.",
        ] 
        game_state.message += messages[random_int(messages.length)];
        set_game_over_options(options);
    } else if (lords_victory(game_state)) {
        var messages = [
            " With the last of the four lords dead, you have destroyed the " +
            "establishment and brought about a utopian anarchy... " +
            "more or less. You win!",
        ] 
        game_state.message += messages[random_int(messages.length)];
        set_game_over_options(options);
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

        get_default_options(game_state, options.a, options.b, options.c, 
                            options.d);
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

        if (Math.floor(Math.random() * 1) === 0 &&
            game_state.character.place !== "void") {
            options.e = "Enter the void.";
        } else if (Math.floor(Math.random() * 8) === 0 &&
                   game_state.character.place === "void") {
            options.e = "Exit the void.";
        } else {
            options.e = "";
        }

    }

    game_state.marriage = false;

    return options;
}

function get_default_options(game_state, raffle_a, raffle_b, raffle_c, 
                             raffle_d) {
    raffle.add(raffle_a, "Think.", 1);
    if (game_state.character.place !== "void") {
        raffle.add(raffle_a, "Lick the ground.", 1);
        raffle.add(raffle_c, "Leave in a puff.", 1);
    }
    raffle.add(raffle_b, "Pray to a higher power.", 1);
    raffle.add(raffle_c, "Go to sleep.", 1);
    raffle.add(raffle_d, "Sing a song.", 1);
    raffle.add(raffle_d, "Dance a jig.", 1);
}

function get_character_options(game_state, raffle_a, raffle_b, raffle_c, 
                               raffle_d) {

    if (game_state.places[game_state.character.place].locked === false) {
        raffle.add(raffle_c, "GO_TO", 2);
    }

    if (game_state.character.person !== null) {
        raffle.add(raffle_a, "Attack", 10);
    }

    if (game_state.character.is_threatened === true) {
        raffle.add(raffle_c, "Run like the Devil.", 90);
        raffle.add(raffle_c, "Waddle like God.", 10);
    }

    if (game_state.character.items["many colored mushroom"] > 0) {
        raffle.add(raffle_d, "Chow down on your many colored mushroom.", 1);
    }

    if (game_state.character.money === "large_fortune" ||
        game_state.character.money === "small_fortune") {
        raffle.add(raffle_d, "Flaunt your wealth.", 1);
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

    if (game_state.character.place === "church") {
        //raffle.add(raffle_a, "Tell a priest he's fat.", 1);
        //raffle.add(raffle_a, "Tell a priest God doesn't exist.", 1);
        //raffle.add(raffle_a, "Tell a priest you're the chosen one.", 1);
        if (items.money_map[game_state.character.money].value > 0) {
            raffle.add(raffle_d, "Donate to the church.", 2000);
        }
    }

    if (game_state.character.place === "countryside" || 
        game_state.character.place === "woods" ||
        game_state.character.place === "lord_bartholomew_manor") {
        raffle.add(raffle_b, "Go flower picking.", 2);
    }

    if (game_state.character.place === "docks") {
        raffle.add(raffle_d, "Do some gambling.", 2);
    }

    if (game_state.character.place === "market" &&
        game_state.character.person !== "war_merchant") {
        raffle.add(raffle_d, "Look for a weapon.", 10);
    }

    if (game_state.character.place === "tavern") {
        raffle.add(raffle_a, "Ask about assassins.", 1);
        raffle.add(raffle_b, "Buy a drink.", 1);
        raffle.add(raffle_d, "Do some gambling.", 1);
        if (game_state.persons.olga.alive &&
            game_state.persons.olga.name === "Olga" &&
            game_state.character.person !== "olga") {
            raffle.add(raffle_b, "Look for Olga.", 10);
        }
    }

    if (game_state.character.place === "streets") {
        raffle.add(raffle_b, "Leer at women.", 2);
    }

    if (game_state.character.place === "void") {
        raffle.add(raffle_d, "Gather void dust.", 2);
    }

    if (game_state.character.place === "woods") {
        raffle.add(raffle_a, "Go mushroom picking.", 2);
    }

}

function get_person_options(game_state, raffle_a, raffle_b, raffle_c, 
                            raffle_d) {

    if (
        game_state.character.person === "eve" ||
        game_state.character.person === "felicty" ||
        game_state.character.person === "memaid" ||
        game_state.character.person === "nymph_queen" ||
        game_state.character.person === "olga"
       ) {
        raffle.add(raffle_d, "Flirt with", 10);
    }

    if (game_state.character.person === "st_george") {
        raffle.add(raffle_b, "Beg for money.", 10);
    }

    if (game_state.character.person === "war_merchant") {
        raffle.add(raffle_d, "Buy a weapon.", 10000);
    }

}

function get_outcome_options(game_state, raffle_a, raffle_b, raffle_c, 
                            raffle_d) {

    if (
        game_state.outcome === "cannot_afford" ||
        game_state.outcome === "dance_in_puddle" ||
        game_state.outcome === "fail_at_new_career" ||
        game_state.outcome === "ignored" ||
        game_state.outcome === "think_pirates_laugh" ||
        game_state.outcome === "pirates_ruin_song" ||
        game_state.outcome === "wake_up_robbed" ||
        game_state.outcome === "wealthy_people_sneer"
       ) {
        raffle.add(raffle_a, "Kill yourself in frustration.", 1);
    }

    else if (game_state.outcome === "guards_stop_you_dancing") {
        game_state.character.excuse = "happy";
        raffle.add(raffle_b, "TELL_GUARDS", 10000);
    }

    else if (game_state.outcome === "guards_stop_you_killing") {
        game_state.character.excuse = "mad";
        raffle.add(raffle_b, "TELL_GUARDS", 10000);
    }

    else if (game_state.outcome === "guards_stop_you_licking") {
        game_state.character.excuse = "hungry";
        raffle.add(raffle_b, "TELL_GUARDS", 10000);
    }

    else if (game_state.outcome === "guards_stop_you_rich") {
        game_state.character.excuse = "rich";
        raffle.add(raffle_b, "TELL_GUARDS", 10000);
    }

    else if (game_state.outcome === "guards_stop_you_singing") {
        game_state.character.excuse = "talented";
        raffle.add(raffle_b, "TELL_GUARDS", 10000);
    }

    else if (
             game_state.outcome === "gambling_lose"
            ) {
        raffle.add(raffle_a, "Kill everybody in a fit of rage.", 1);
    }

    else if (
             game_state.outcome === "think_elaborate_scheme"
            ) {
        raffle.add(raffle_b, "Enact your elaborate scheme.", 10000);
    }

}
