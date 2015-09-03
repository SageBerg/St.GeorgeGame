"use strict";

exports.money_map = {
    "none":          {"value": 0, "name": "no money"},
    "pittance":      {"value": 1, "name": "a pittance"},
    "small_fortune": {"value": 2, "name": "a small fortune"},
    "large_fortune": {"value": 3, "name": "a large fortune"}
}

exports.weapons_map = {
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
    }
}
