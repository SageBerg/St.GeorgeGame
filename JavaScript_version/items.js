"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/ 
/*global define */

exports.money_map = {
    "none":          {"value": 0, "name": "no money"},
    "pittance":      {"value": 1, "name": "a pittance"},
    "small_fortune": {"value": 2, "name": "a small fortune"},
    "large_fortune": {"value": 3, "name": "a large fortune"}
};

exports.weapons_map = {
    "pitchfork": {
        "name": "pitchfork", 
        "attack": 1, 
        "cost": "pittance"
    },
    "dagger": {
        "name": "dagger", 
        "attack": 2, 
        "cost": "pittance"
    },
    "cutlass": {
        "name": "cutlass", 
        "attack": 3, 
        "cost": "pittance"
    },
    "hammer": { 
        "name": "hammer", 
        "attack": 4, 
        "cost": "pittance"
    },
    "long_pitchfork": {
        "name": "long pitchfork", 
        "attack": 5, 
        "cost": "pittance"
    },
    "poison_dagger": {
        "name": "poison dagger", 
        "attack": 6, 
        "cost": "small_fortune"
    },
    "jeweled_cutlass": { 
        "name": "jeweled cutlass",
        "attack": 7,
        "cost": "large_fortune"
    },
    "iron_hammer": {
        "name": "iron hammer",
        "attack": 8,
        "cost": "small_fortune"
    },
    "sword_of_great_evil": {
        "name": "sword of great evil",
        "attack": 101,
        "cost": "large_fortune"
    },
    "sword_of_great_good": {
        "name": "sword of great good",
        "attack": 102,
        "cost": "large_fortune"
    },
};
