"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var actions   = require("./actions").actions;
var functions = require("./functions");
var items     = require("./items");
var outcomes  = require("./outcomes").outcomes;
var raffle    = require("./raffle");

// the order of BURNABLE_PLACES matters based on the story
var BURNABLE_PLACES = [
    "lord_bartholomew_manor",
    "woods",
    "lord_carlos_manor",
    "tower",
    "market",
    "wizard_lab",
    "church",
    "tavern",
];
var NONE = "none";

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

Game.prototype.add_next_target_suggestion = function() {
    var burned_count = 0;
    var still_burnable = [];
    for (var i = 0; i < BURNABLE_PLACES.length; i++) {
        if (this.places[BURNABLE_PLACES[i]].burnable === false) {
            burned_count += 1;
        } else {
            still_burnable.push(BURNABLE_PLACES[i]);
        }
    }
    if (burned_count >= BURNABLE_PLACES.length / 2 &&
        burned_count < BURNABLE_PLACES.length) {
        var next_target = this.places[
            functions.random_choice(still_burnable)
        ].name;
        var burn_messages = [
            " God tells you to burn down " + next_target + " next.",
            " It irks you that you still haven't burned down " +
            next_target + ".",
            " That was so fun you feel like burning down " +
            next_target + " now.",
            " You think you should celebrate your success by burning down " +
            next_target + ".",
        ];
        this.message += functions.random_choice(burn_messages);
    }
};

Game.prototype.arrested = function() {
    this.lose_all_items();
    this.move_character("prison");
    this.character.person = "other_lunatics";
};

Game.prototype.are_or_is = function() {
    if (this.persons[this.character.person].type === "group") {
        return "are";
    }
    return "is";
};

Game.prototype.burn = function() {
    this.places[this.character.place].burnable = false;
    this.places[this.character.place].name =
        "the smoldering remains of " +
        this.places[this.character.place].name;
    this.character.person = null;
    this.message = "You find yourself in " +
    this.places[this.character.place].name + ".";
    this.add_next_target_suggestion();
    if (functions.random_int(3) === 0) {
        this.spread_fire();
    }
};

Game.prototype.burn_a_bunch_of_places = function() {
    var number_of_places_burned = functions.random_int(8);
    for (var i = 0; i < number_of_places_burned; i++) {
        if (this.places[BURNABLE_PLACES[i]].burnable === true) {
            this.places[BURNABLE_PLACES[i]].burnable = false;
            this.places[BURNABLE_PLACES[i]].name = "the smoldering remains " +
            "of " + this.places[BURNABLE_PLACES[i]].name;
        }
    }
};

// kills character if he or she doesn't have a four-leaf clover
Game.prototype.clover = function() {
    if (this.character.items["four-leaf clover"] < 1) {
        this.character.is_dead = true;
    } else {
        this.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
};

// conjugates a verb to singular or plural
Game.prototype.conjugate = function(word) {
    if (this.persons[this.character.person].type !== "group") {
        return word + "s";
    }
    return word;
};

Game.prototype.decrement_money = function() {
    switch (this.character.money) {
        case "large_fortune":
            this.character.money = "small_fortune";
            this.message += " You now only have a small fortune.";
            break;
        case "small_fortune":
            this.character.money = "pittance";
            this.message += " You now only have a pittance.";
            break;
        case "pittance":
            this.character.money = NONE;
            this.message += " You now have no money.";
            break;
    }
};

Game.prototype.enact_outcome = function() {
    outcomes[this.outcome](this);
};

Game.prototype.set_outcome = function() {
    var possible_outcomes;
    if (this.character.is_threatened === true &&
        this.action !== "A3." &&
        this.action !== "Apologize." &&
        this.action !== "ATTACK" &&
        this.action !== "Bribe the dog with a fish." &&
        this.action !== "Challenge Lord Carlos to a this of chess." &&
        this.action !== "E4." &&
        this.action !== "Enter the void." &&
        this.action !== "Grovel." &&
        this.action !== "Leave in a puff." &&
        this.action !== "Make it hard for Lord Carlos to kill you." &&
        this.action !== "Nf3." &&
        this.action !== "Panic!" &&
        this.action !== "Play dead." &&
        this.action !== "Repay your debts." &&
        this.action !== "Run like the Devil." &&
        this.action !== "SHOW_COIN" &&
        this.action !== "SUCK_UP" &&
        this.action !== "TELL_GUARDS" &&
        this.action !== "Tell her you're sorry." &&
        this.action !== "Throw your cat at the dog." &&
        this.action !== "Try to reason with the dog." &&
        this.action !== "Try to reason with the mob." &&
        this.action !== "Waddle like God.") {
        possible_outcomes = actions.GET_ATTACKED(this.get_state(), {});
    } else {
        possible_outcomes = actions[this.action](this.get_state(), {});
    }
    this.outcome = raffle.get(possible_outcomes);
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
