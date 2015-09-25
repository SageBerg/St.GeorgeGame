"use strict";

exports.get_person = function get_person(game_state) {
    return game_state.persons[game_state.character.person];
}

exports.get_place = function get_place(game_state) {
    return game_state.places[game_state.character.place];
}

exports.random_choice = function random_choice(array) {
    return array[exports.random_int(array.length)]; 
}

exports.random_int = function random_int(n) {
    return Math.floor(Math.random() * n);
}
