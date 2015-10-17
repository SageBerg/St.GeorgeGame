"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/ 
/*global define */
 
exports.a_or_an = function a_or_an(next_letter) {
    if (next_letter === "a" ||
        next_letter === "e" ||
        next_letter === "i" ||
        next_letter === "o" ||
        next_letter === "u") {
        return "an";
    }
    return "a";
}

exports.get_person = function get_person(game_state) {
    return game_state.persons[game_state.character.person];
};

exports.get_place = function get_place(game_state) {
    return game_state.places[game_state.character.place];
};

exports.get_random_adjacent_destination =
    function get_random_adjacent_destination(game_state) {
    var links = game_state.places[game_state.character.place].links;
    var dest = links[exports.random_int(links.length)];
    return dest;
};

exports.random_choice = function random_choice(array) {
    return array[exports.random_int(array.length)]; 
};

exports.random_int = function random_int(n) {
    return Math.floor(Math.random() * n);
};
