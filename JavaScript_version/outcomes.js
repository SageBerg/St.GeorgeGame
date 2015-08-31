"use strict";

var actions = require("./actions").actions;
var items   = require("./items");
var raffle  = require("./raffle");

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes;
    if (game_state.character.is_threatened === true && 
        game_state.action !== "Attack" &&
        game_state.action !== "Leave in a puff." &&
        game_state.action !== "Run like the Devil." &&
        game_state.action !== "Waddle like God.") {
        possible_outcomes = actions["GET_ATTACKED"](game_state, {});
    } else {
        possible_outcomes = actions[game_state.action](game_state, {});
    }
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
    game_state.message += " You find yourself in " + 
        game_state.places[destination].name + ".";
}

function a_or_an(next_letter) {
    if (next_letter === "a" ||
        next_letter === "e" ||
        next_letter === "i" ||
        next_letter === "o" ||
        next_letter === "u") {
        return "an";
    }
    return "a";
}

/*
var he_she_they = {
    "female": "she",
    "male": "he",
    "group": "they"
}
*/

function conjugate(game_state, word) {
    if (game_state.persons[game_state.character.person].type !== "group") {
        return word + "s"; 
    }
    return word
} 

function get_subject(game_state) {
    return he_she_they[game_state.persons[game_state.character.person].type];
}

function get_name(game_state) {
    return game_state.persons[game_state.character.person].name;
}

function get_item(game_state, item) {
    if (game_state.character.items[item] === 0) {
        game_state.message += " You now have " + a_or_an(item[0]) + item + ".";
    } else {
        game_state.message += " You now have another " + item + ".";
    }
    game_state.character.items[item] += 1;
}

function get_money(game_state, money) {
    if (items.money_map[game_state.character.money].value < 
        items.money_map[money].value) {
        game_state.character.money = money;
        game_state.message += " You now have " + 
            items.money_map[money].name + ".";
    } else {
        game_state.message += 
        " You still have " + 
        items.money_map[game_state.character.money].name + ".";
    }
}

function add_move_message(game_state) {
    game_state.message += "You find yourself in " + 
        game_state.places[game_state.character.place].name + ".";
}

var outcomes = {

    "assassinated": function(game_state) {
        game_state.message = "The first woman you talk to turns out to be an " +
        "assasin. She assassinates you.";
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

    "bought_a_weapon": function(game_state) {
        game_state.message = "";
        if (game_state.character.items[game_state.for_sell] === 0) {
            game_state.message += " You now have " + 
            a_or_an(items.weapons_map[game_state.for_sell].name[0]) + " " +
            items.weapons_map[game_state.for_sell].name + ".";
        } else {
            game_state.message += " You now have another " +
            items.weapons_map[game_state.for_sell].name + ".";
        }
        game_state.character.items[game_state.for_sell] += 1;
        if (game_state.character.strength <= 
            items.weapons_map[game_state.for_sell].attack) {
            //TODO made white mushrooms and weapons stack in this way
            game_state.character.strength = 
            items.weapons_map[game_state.for_sell].attack;
        }
        return game_state;
    },

    "cannot_afford": function(game_state) {
        game_state.message = "You cannot afford this item." 
        return game_state;
    },

    "caught": function(game_state) {
        game_state.message = 
            "You run like the Devil, but " + get_name(game_state) +
            " also " + conjugate(game_state, "run") + " like thd Devil and " +
            conjugate(game_state, "overtake") + " you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "earn_small_fortune_in_coins": function(game_state) {
        game_state.message = 
            "A crowd gathers to hear your singing and " + 
            "tosses you a small fortune in coins.";
        get_money(game_state, "small_fortune");
        return game_state;
    },

    "escaped": function(game_state) {
        game_state.message = 
            "The Devil is very fast, so you manage to get away.";
        var links = game_state.places[game_state.character.place].links
        var destination = links[random_int(links.length)];
        move_character(game_state, destination);
        return game_state;
    },

    "find_a_cat": function(game_state) {
        game_state.message = "You find a cat.";
        get_item(game_state, "cat");
        game_state.character.person = null;
        return game_state;
    },

    "find_a_war_merchant": function(game_state) {
        game_state.message = 
            "You find yourself talking to a wealthy war merchant.";
        game_state.character.person = "war_merchant";
        return game_state;
    },

    "find_st_george": function(game_state) {
        game_state.message = "You find St. George.";
        game_state.character.person = "st_george";
        return game_state;
    },

    "get_attacked": function(game_state) {
        var attempted_action = 
            game_state.action[0].toLowerCase() +
            game_state.action.slice(1, game_state.action.length - 1);
        game_state.message = 
            "You try to " + attempted_action + ", but " + 
            get_name(game_state) + " " +
            conjugate(game_state, "kill") + " you."
        game_state.character.is_dead = true;
        return game_state;
    },

    "go_to": function(game_state) {
        game_state.message = "";
        game_state.character.place = game_state.destination;
        game_state.destination = null;
        add_move_message(game_state);
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

    "left_in_a_puff": function(game_state) {
        game_state.message = "";
        var place_list = [];
        for (var place in game_state.places) {
            if (game_state.places[place] !== 
                game_state.places[game_state.character.place] &&
                place !== "void") {
                place_list.push(place);
            }
        }
        var roll = random_int(place_list.length);
        var destination = place_list[roll];
        move_character(game_state, destination);
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
        var links = game_state.places[game_state.character.place].links;
        var destination = links[random_int(links.length)];
        move_character(game_state, destination);
        return game_state;
    },

    "no_one_cares":function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },

}
