"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var Game = function(game_state) {
    this.action =      game_state.action; 
    this.character =   game_state.character;
    this.destination = game_state.destination;
    this.for_sell =    game_state.for_sell;
    this.marriage =    game_state.marriage;
    this.message =     game_state.message;
    this.options =     game_state.options;
    this.outcome =     game_state.outcome;
    this.persons =     game_state.persons;
    this.places =      game_state.places;
    this.score =       game_state.score;
};

Game.prototype.die = function() {
    this.character.is_dead = true;
};

//so we can send the state of the game sending the game logic 
Game.prototype.get_state = function() {
    var game_state = {};
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            game_state[property] = this[property];
        }
    }
    return game_state;
};

exports.Game = Game;
