"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var actions     = require("./actions").actions;
var character   = require("./character").starting_character_state;
var options     = require("./options");
var outcomes    = require("./outcomes");
var persons     = require("./persons").persons;
var places      = require("./places").places;

exports.validate = function validate(game_state) {
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

        validate_character(game_state),
        validate_options(game_state),
        validate_persons(game_state),
        validate_places(game_state),

        typeof(game_state.score) === "string" &&
        !isNaN(parseInt(game_state.score)),
    ];

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
                console.log("character attributes are wrong");
                return false;
            }
        }
    } else {
        console.log("character_keys", character_keys);
        console.log("input_character_keys", input_character_keys);
        console.log("expected:", character_keys.length,
                    "got:", input_character_keys.length);
        console.log("character is wrong size");
        return false;
    }

    var conditions = [
        typeof(game_state.character)                 === "object",
        typeof(game_state.character.equipped_weapon) === "string",
        game_state.character.equipped_weapon === "" ||
        game_state.character.equipped_weapon === "pitchfork" ||
        game_state.character.equipped_weapon === "dagger" ||
        game_state.character.equipped_weapon === "cutlass" ||
        game_state.character.equipped_weapon === "hammer" ||
        game_state.character.equipped_weapon === "long_pitchfork" ||
        game_state.character.equipped_weapon === "poison_dagger" ||
        game_state.character.equipped_weapon === "jeweled_cutlass" ||
        game_state.character.equipped_weapon === "iron_hammer" ||
        game_state.character.equipped_weapon === "sword_of_great_evil" ||
        game_state.character.equipped_weapon === "sword_of_great_good",
        typeof(game_state.character.excuse)  === "string",

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

        typeof(game_state.character.person) === "string" &&
        (typeof(persons[game_state.character.person]) === "object" ||
         game_state.character.person === ""),

        typeof(game_state.character.person) === "string" &&
        (typeof(places[game_state.character.place]) === "object" ||
         game_state.character.place === ""),

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
    if (typeof(game_state.options) !== "object") {
        console.log("options is not an object");
        return false;
    } else if (typeof(actions[game_state.options.a]) !== "function") {
        console.log("option a:", game_state.options.a,
            "does not map to a function");
        return false;
    } else if (typeof(actions[game_state.options.b]) !== "function") {
        console.log("option b does not map to a function");
        return false;
    } else if (Object.keys(game_state.options).length !==
               Object.keys(options.starting_options).length) {
        console.log("wrong amount of options");
        return false;
    } else if (typeof(actions[game_state.options.c]) !== "function" &&
               game_state.options.c !== "") {
        console.log("problem with option c");
        return false;
    } else if (typeof(actions[game_state.options.d]) !== "function" &&
               game_state.options.d !== "") {
        console.log("problem with option d");
        return false;
    } else if (typeof(actions[game_state.options.e]) !== "function" &&
               game_state.options.e !== "") {
        console.log("problem with option e");
        return false;
    }
    return true;
}

function validate_persons(game_state) {

    if (typeof(game_state.persons) !== "object") {
        return false;
    }

    var input_persons = Object.keys(game_state.persons);
    var default_persons    = Object.keys(persons);
    var person_traits   = ["alive", "attack", "attracted", "name",
                           "preferred_attack", "type"];
    var input_trait;
    var default_trait;

    if (input_persons.length !== default_persons.length) {
        return false;
    }

    for (var i = 0; i < default_persons.length; i++) {

        if (typeof(persons[input_persons[i]]) !== "object" ||
            Object.keys(persons[default_persons[i]]).length !==
            Object.keys(game_state.persons[input_persons[i]]).length) {
            return false;
        }

        for (var j = 0; j < person_traits.length; j++) {
            input_trait =
                game_state.persons[input_persons[i]][person_traits[j]];
            default_trait = persons[default_persons[i]][person_traits[j]];
            if ((person_traits[j] === "alive" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (person_traits[j] === "attack" &&
                 isNaN(parseInt(input_trait))) ||
                (person_traits[j] === "attracted" &&
                 isNaN(parseInt(input_trait))) ||
                (person_traits[j] === "type" &&
                 input_trait !== "female" &&
                 input_trait !== "group" &&
                 input_trait !== "male")) {
                return false;
            }
        } //end for loop j
    } //end for loop i

    return true;
}

function validate_places(game_state) {

    if (typeof(game_state.places) !== "object") {
        return false;
    }

    var input_places   = Object.keys(game_state.places);
    var default_places = Object.keys(places);

    var input_trait;
    var default_trait;
    var place_traits = ["burnable", "links", "locked", "name", "outside",
                        "populated", "town", "trashable",];

    if (input_places.length !== default_places.length) {
        return false;
    }

    for (var i = 0; i < default_places.length; i++) {

        if (typeof(places[input_places[i]]) !== "object") {
            return false;
        }

        if (places[input_places[i]].links.length > 0) {
            for (var p = 0;
                 p < game_state.places[input_places[i]].links.length;
                 p++) {
                if (typeof(places[
                    game_state.places[input_places[i]].links[p]
                    ]) !== "object") {
                    return false;
                }
            }
        }

        for (var j = 0; j < place_traits.length; j++) {
            input_trait =
                game_state.places[input_places[i]][place_traits[j]];
            default_trait = places[default_places[i]][place_traits[j]];
            if ((place_traits[j] === "burnable" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (place_traits[j] === "locked" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (place_traits[j] === "outside" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (place_traits[j] === "populated" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (place_traits[j] === "town" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (place_traits[j] === "trashable" &&
                 input_trait !== "false" &&
                 input_trait !== "true") ||
                (place_traits[j] === "name" &&
                 typeof(game_state.places[input_places[i]].name) !== "string")
                ) {
                return false;
            }
        } //end for loop j
    } //end for loop i

    return true;
}
