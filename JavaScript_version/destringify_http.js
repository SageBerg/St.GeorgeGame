"use strict";

exports.destringify = function destringify(game_state) {

    for (var attribute in game_state.character) {
        if (game_state.character[attribute] === "false") {
            game_state.character[attribute] = false;
        } else if (game_state.character[attribute] === "true") {    
            game_state.character[attribute] = true;
        } else if (!isNaN(parseInt(game_state.character[attribute]))) {
            game_state.character[attribute] = 
            parseInt(game_state.character[attribute]);
        }
    }

    if (game_state.character.person === "") {
        game_state.character.person = null;
    }

    for (var item in game_state.character.items) {
        game_state.character.items[item] =
        parseInt(game_state.character.items[item]);
    }

    for (var person in game_state.persons) {

        if (game_state.persons[person].alive === "true") {
            game_state.persons[person].alive = true;
        } else {
            game_state.persons[person].alive = false; 
        }

        game_state.persons[person].attack =
        parseInt(game_state.persons[person].attack);

        game_state.persons[person].attracted =
        parseInt(game_state.persons[person].attracted);

    } 

    for (var place in game_state.places) {

        if (game_state.places[place].burnable === "true") {
            game_state.places[place].burnable = true;
        } else {
            game_state.places[place].burnable = false;
        }

        if (game_state.places[place].locked === "true") {
            game_state.places[place].locked = true;
        } else {
            game_state.places[place].locked = false;
        }

        if (game_state.places[place].outside === "true") {
            game_state.places[place].outside = true;
        } else {
            game_state.places[place].outside = false;
        }

        if (game_state.places[place].populated === "true") {
            game_state.places[place].populated = true;
        } else {
            game_state.places[place].populated = false;
        }

        if (game_state.places[place].town === "true") {
            game_state.places[place].town = true;
        } else {
            game_state.places[place].town = false;
        }

        if (game_state.places[place].trashable === "true") {
            game_state.places[place].trashable = true;
        } else {
            game_state.places[place].trashable = false;
        }

    }
    
    return game_state;

}
