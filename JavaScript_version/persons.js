"use strict";

//outcome ids map to outcome objects

exports.persons = {
    "assassin":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "the assassin",
        "preferred_attack": "assassinate",
        "sells": [],
        "type": "female", 
    },
    "assassins":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the assassins",
        "preferred_attack": "assassinate",
        "sells": [],
        "type": "group", 
    },
    "blind_bartender":
    {
        "alive": true,
        "attack": 1,
        "attracted": 0,
        "name": "the blind bartender",
        "preferred_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "eve":
    {
        "alive": true,
        "attack": 4,
        "attracted": 1,
        "name": "Lord Carlos' daughter",
        "preferred_attack": "assassinate",
        "sells": [],
        "type": "female", 
    },
    "felicity":
    {
        "alive": true,
        "attack": 4,
        "attracted": 1,
        "name": "the fat lady",
        "preferred_attack": "kill",
        "sells": [],
        "type": "female", 
    },
    "guards":
    {
        "alive": true,
        "attack": 4,
        "attracted": 0,
        "name": "the guards",
        "preferred_attack": "arrest",
        "sells": [],
        "type": "group", 
    },
    "lord_arthur":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "Lord Arthur",
        "preferred_attack": "walk_the_plank",
        "sells": [],
        "type": "male", 
    },
    "lord_bartholomew":
    {
        "alive": true,
        "attack": 4,
        "attracted": 0,
        "name": "Lord Bartholomew",
        "preferred_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "lord_carlos":
    {
        "alive": true,
        "attack": 5,
        "attracted": 0,
        "name": "Lord Carlos",
        "preferred_attack": "assassinate",
        "sells": [],
        "type": "male", 
    },
    "lord_daniel":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "Lord Daniel",
        "preferred_attack": "arrest",
        "sells": [],
        "type": "male",
    },
    "mermaid":
    {
        "alive": true,
        "attack": 3,
        "attracted": 1,
        "name": "the mermaid",
        "preferred_attack": "drown",
        "sells": [],
        "type": "female", 
    },
    "mob":
    {
        "alive": true,
        "attack": 9,
        "attracted": 0,
        "name": "the angry mob",
        "preferred_attack": "burn",
        "sells": [],
        "type": "male", 
    },
    "nymph_queen":
    {
        "alive": true,
        "attack": 10,
        "attracted": 1,
        "name": "the nymph queen",
        "preferred_attack": "hex",
        "sells": [],
        "type": "female", 
    },
    "olga":
    {
        "alive": true,
        "attack": 1,
        "attracted": 1,
        "name": "the pretty lady",
        "preferred_attack": "kill",
        "sells": [],
        "type": "female", 
    },
    "other_lunatics":
    {
        "alive": true,
        "attack": -1,
        "attracted": 0,
        "name": "the other lunatics",
        "preferred_attack": "kill",
        "sells": [],
        "type": "group", 
    },
    "peasant_lass":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the peasant lass",
        "preferred_attack": "kill",
        "sells": ["many_colored_mushroom", "white_mushroom"],
        "type": "female", 
    },
    "pirates":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "the pirates",
        "preferred_attack": "kill",
        "type": "group", 
    },
    "priestess":
    {
        "alive": true,
        "attack": 2,
        "attracted": 0,
        "name": "the priestess",
        "preferred_attack": "kill",
        "type": "female", 
    },
    "simple_peasant":
    {
        "alive": true,
        "attack": -1,
        "attracted": 0,
        "name": "the simple peasant",
        "preferred_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "st_george":
    {
        "alive": true,
        "attack": 100,
        "attracted": 0,
        "name": "St. George",
        "preferred_attack": "smite",
        "sells": [],
        "type": "male", 
    },
    "war_merchant":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the wealthy war merchant",
        "preferred_attack": "kill",
        "sells": ["dagger", "poison_dagger", "cutlass", "jeweled_cutlass", 
                  "hammer", "iron_hammer"],
        "type": "male", 
    },
    "witch":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the witch",
        "preferred_attack": "frog",
        "sells": ["love_potion", "tail_potion", "strength_potion"],
        "type": "female", 
    },
    "wizard":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the wizard",
        "preferred_attack": "frog",
        "sells": [],
        "type": "male", 
    },
};
