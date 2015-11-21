"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

exports.starting_character_state = {
    "equipped_weapon": "",
    "excuse": "",
    "has_begged_st_george": false,
    "has_found_true_love": false,
    "has_lost_leg": false,
    "has_tail": false,
    "is_dead": false,
    "is_frog": false,
    "is_monstrosity": false,
    "is_shrub": false,
    "is_threatened": false,
    "is_tripping": false,
    "items":
    {
        "dagger": 0,
        "cutlass": 0,
        "hammer": 0,
        "iron_hammer": 0,
        "jeweled_cutlass": 0,
        "long_pitchfork": 0,
        "pitchfork": 0,
        "poison_dagger": 0,
        "sword_of_great_evil": 0,
        "sword_of_great_good": 0,

        "ax": 0,
        "apple": 0,
        "bag of jewels": 0,
        "ball of sap": 0,
        "black mushroom": 0,
        "bouquet of flowers": 0,
        "cake": 0,
        "cat": 0,
        "deep-cave newt": 0,
        "donkey": 0,
        "fancy red cloak": 0,
        "fish": 0,
        "four-leaf clover": 0,
        "frog": 0,
        "handful of void dust": 0,
        "many-colored mushroom": 0,
        "pearl": 0,
        "potion of love": 0,
        "potion of strength": 0,
        "potion of tail growth": 0,
        "potion of transformation": 0,
        "sailor peg": 0,
        "seal carcass": 0,
        "shiny foreign coin": 0,
        "white mushroom": 0,
        "yellow mushroom": 0,
    },
    "money": "none",
    "person": "",
    "place": "tavern",
    "sex": "male",
    "sins": 
    {
        "envy": 0,
        "gluttony": 0,
        "greed": 0,
        "lust": 0,
        "pride": 0,
        "sloth": 0,
        "wrath": 0,
    },
    "strength": 0
};

var Character = function(character_state) {
    this.equipped_weapon      = character_state.equipped_weapon;
    this.excuse               = character_state.excuse;
    this.has_begged_st_george = character_state.has_begged_st_george;
    this.has_found_true_love  = character_state.has_found_true_love;
    this.has_lost_leg         = character_state.has_lost_leg;
    this.has_tail             = character_state.has_tail;
    this.is_dead              = character_state.is_dead;
    this.is_frog              = character_state.is_frog;
    this.is_monstrosity       = character_state.is_monstrosity;
    this.is_shrub             = character_state.is_shrub;
    this.is_threatened        = character_state.is_threatened;
    this.is_tripping          = character_state.is_tripping;
    this.items                = character_state.items;
    this.money                = character_state.money;
    this.person               = character_state.person;
    this.place                = character_state.place;
    this.sex                  = character_state.sex;
    this.sins                 = character_state.sins;
    this.strength             = character_state.strength;
};

//so we can send the state of the character without sending the game logic 
Character.prototype.get_state = function() {
    var character_state = {};
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            character_state[property] = this[property];
        }
    }
    return character_state;
};

exports.Character = Character;
