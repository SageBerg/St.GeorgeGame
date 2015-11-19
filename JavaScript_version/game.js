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
var FEMALE    = "female";
var MALE      = "male";
var NONE = "none";

var HE_SHE_THEY = {
    FEMALE: "she",
    MALE: "he",
    "group": "they"
};

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

Game.prototype.die = function() {
    this.character.is_dead = true;
};

Game.prototype.equip_best_weapon = function() {
    var found_weapon_flag = false;
    var keys = Object.keys(items.weapons_map);
    for (var i = 0; i < keys.length; i++) {
        if (this.character.equipped_weapon === "" &&
            this.character.items[keys[i]] > 0) {
            this.character.equipped_weapon = keys[i];
            found_weapon_flag = true;
        } else if (this.character.items[keys[i]] > 0 &&
                   items.weapons_map[keys[i]].attack >=
                   items.weapons_map[
                       this.character.equipped_weapon
                   ].attack) {
            this.character.equipped_weapon = keys[i];
            found_weapon_flag = true;
        }
    }
    if (found_weapon_flag === false) {
        this.character.equipped_weapon = "";
    }
};

Game.prototype.get_ground = function() {
    switch (this.character.place) {
        case "pirate_ship":
            return "deck";
        case "docks":
            return "docks";
    }
    if (functions.get_place(this).outside === false) {
        //if a place has been burned down, you can't lick its floor
        if (functions.get_place(this).burnable === false &&
            (this.character.place === "church" ||
             this.character.place === "lord_bartholomew_manor" ||
             this.character.place === "lord_carlos_manor" ||
             this.character.place === "tavern" ||
             this.character.place === "tower" ||
             this.character.place === "wizard_lab")) {
            return "ground";
        }
        return "floor";
    }
    return "ground";
};

Game.prototype.get_item = function(item) {
    if (this.character.items[item] === 0) {
        this.message += " You now have " + functions.a_or_an(item[0]) +
        " " + item + ".";
    } else {
        this.message += " You now have another " + item + ".";
    }
    this.character.items[item] += 1;
};

Game.prototype.get_money = function(money) {
    if (items.money_map[this.character.money].value <
        items.money_map[money].value) {
        this.character.money = money;
        this.message += " You now have " +
            items.money_map[money].name + ".";
    } else {
        this.message +=
        " You still have " +
        items.money_map[this.character.money].name + ".";
    }
};

Game.prototype.get_name = function() {
    return this.persons[this.character.person].name;
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

Game.prototype.get_subject = function() {
    return HE_SHE_THEY[this.persons[this.character.person].type];
};

Game.prototype.get_weapon = function(weapon) {
    if (this.character.items[weapon] === 0) {
        this.message += " You now have " +
        functions.a_or_an(items.weapons_map[weapon].name[0]) + " " +
        items.weapons_map[weapon].name + ".";
    } else {
        this.message += " You now have another " +
        items.weapons_map[weapon].name + ".";
    }
    this.character.items[weapon] += 1;
    this.equip_best_weapon();
};

Game.prototype.get_wizard_teleport_message = function() {
    return functions.random_choice([
        "The wizard conks you on the head with his staff.",
        "The wizard douses you with a potion.",
        "The wizard grabs your arm and spins you around.",
        "The wizard makes you leave in a puff.",
        "The wizard starts reading some magic words from a scroll. " +
        "He keeps reading for a while so you get bored and try to " +
        "sneak away. You must have sneaked pretty well.",
    ]);
};

Game.prototype.grow_tail = function() {
    if (this.character.has_tail === false) {
        this.character.has_tail = true;
        this.message = "You grow a " +
            functions.random_choice(["alligator", "beaver", "donkey", "horse",
                                     "monkey", "pig", "rat"]) + " tail.";
    } else {
        this.message = "The potion has no effect.";
    }
};

Game.prototype.leave_donkey_behind = function() {
    if (this.character.items.donkey === 1) {
        this.character.items.donkey = 0;
        this.message += " You have no idea where your donkey went.";
    } else if (this.character.items.donkey > 1) {
        this.character.items.donkey = 0;
        this.message += " You have no idea where your donkeys went.";
    }
}

Game.prototype.lose_all_items = function() {
    for (var item in this.character.items) {
        this.character.items[item] = 0;
    }
    this.equip_best_weapon();
    this.character.money = NONE;
    this.message += " You now have no items.";
    this.message += " You now have no money.";
}

Game.prototype.lose_item = function(item) {
    this.character.items[item] -= 1;
    this.character.items[item] === 0 ?
    this.message += " You no longer have " +
        functions.a_or_an(item[0]) + " " :
    this.message += " You have one less ";
    this.message += item + "." ;
};

Game.prototype.move_character = function(destination) {
    this.character.place = destination;
    this.character.is_threatened = false;
    this.character.person = null;
    if (destination === "docks" ||
        destination === "mermaid_rock" ||
        destination === "pirate_ship") {
        this.message += " You find yourself on ";
    } else if (destination === "gates_of_hell" ||
               destination === "smoking_volcano") {
        this.message += " You find yourself at ";
    } else {
        this.message += " You find yourself in ";
    }
    this.message += this.places[destination].name + ".";
    if (destination === "gates_of_hell" &&
        this.persons.cerberus.alive === true) {
        this.character.person = "cerberus";
        this.message += " A giant three-headed dog is blocking " +
            "your way."; 
    }
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

Game.prototype.spread_fire = function() {
    var burnables = [];
    var links = functions.get_place(this).links;
    for (var i = 0; i < links.length; i++) {
        if (this.places[links[i]].burnable === true) {
            burnables.push(links[i]);
        }
    }
    if (burnables.length === 0) {
        return; // nothing left to do if fire can't spread
    }
    var next_fire = functions.random_choice(burnables);
    if (this.places[next_fire].burnable === true) {
        this.message += functions.random_choice([
            " The blaze also takes out ",
            " The fire spreads to ",
            " The fire also destroys ",
            " The flames spread to ",
        ]) + this.places[next_fire].name + ".";
        this.places[next_fire].burnable = false;
        this.places[next_fire].name = "the smoldering remains of " +
            this.places[next_fire].name;
    }
};

Game.prototype.teleport = function() {
    var place_list = [];
    for (var place in this.places) {
        if (this.places[place] !==
            this.places[this.character.place] &&
            place !== "gates_of_hell" &&
            place !== "upstairs" &&
            place !== "void") {
            place_list.push(place);
        }
    }
    var roll = functions.random_int(place_list.length);
    var destination = place_list[roll];
    this.move_character(destination);
    this.leave_donkey_behind();
};

Game.prototype.trash = function() {
    this.places[this.character.place].trashable = false;
    this.places[this.character.place].name =
        "the trashed remains of " +
        this.places[this.character.place].name;
    this.character.person = null;
    this.message = "You find yourself in " +
    this.places[this.character.place].name + ".";
};

exports.Game = Game;
