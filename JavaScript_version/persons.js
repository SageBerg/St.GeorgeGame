"use strict";

//outcome ids map to outcome objects

exports.persons = {
    "assassin":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "an assassin",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "female", 
    },
    "assassins":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the assassins",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "group", 
    },
    "black_market_merchant":
    {
        "alive": true,
        "attack": 4,
        "attracted": 0,
        "name": "a merchant of ill repute",
        "prefered_attack": "kill",
        "sells": ["deep_cave_newt", "love_potion", "many_colored_mushroom", 
                  "white_mushroom", "black_mushroom", "fire_proof_cloak",
                  "strength_potion"],
        "type": "female",
    },
    "blind_bartender":
    {
        "alive": true,
        "attack": 1,
        "attracted": 0,
        "name": "the blind bartender",
        "prefered_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "eve":
    {
        "alive": true,
        "attack": 4,
        "attracted": 1,
        "name": "Lord Carlos' daughter",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "female", 
    },
    "felicity":
    {
        "alive": true,
        "attack": 4,
        "attracted": 1,
        "name": "the fat lady",
        "prefered_attack": "kill",
        "sells": [],
        "type": "female", 
    },
    "guards":
    {
        "alive": true,
        "attack": 4,
        "attracted": 0,
        "name": "the guards",
        "prefered_attack": "arrest",
        "sells": [],
        "type": "group", 
    },
    "lord_arthur":
    {
        "alive": true,
        //"alive": false,
        "attack": 6,
        "attracted": 0,
        "name": "Lord Arthur",
        "prefered_attack": "walk_the_plank",
        "sells": [],
        "type": "male", 
    },
    "lord_bartholomew":
    {
        "alive": true,
        //"alive": false,
        "attack": 4,
        "attracted": 0,
        "name": "Lord Bartholomew",
        "prefered_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "lord_carlos":
    {
        "alive": true,
        //"alive": false,
        "attack": 5,
        "attracted": 0,
        "name": "Lord Carlos",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "male", 
    },
    "lord_daniel":
    {
        "alive": true,
        //"alive": false,
        "attack": 7,
        "attracted": 0,
        "name": "Lord Daniel",
        "prefered_attack": "arrest",
        "sells": [],
        "type": "male",
    },
    "merchant":
    {
        "alive": true,
        "attack": 3,
        "attracted": 0,
        "name": "the merchant woman",
        "prefered_attack": "drown",
        "sells": ["ax", "flowers", "sailor_peg", "pearl", "fish"],
        "type": "female",
    },
    "mermaid":
    {
        "alive": true,
        "attack": 3,
        "attracted": 1,
        "name": "the mermaid",
        "prefered_attack": "drown",
        "sells": [],
        "type": "female", 
    },
    "mob":
    {
        "alive": true,
        "attack": 9,
        "attracted": 0,
        "name": "the angry mob",
        "prefered_attack": "burn",
        "sells": [],
        "type": "group", 
    },
    "nymph_queen":
    {
        "alive": true,
        "attack": 10,
        "attracted": 1,
        "name": "the nymph queen",
        "prefered_attack": "hex",
        "sells": [],
        "type": "female", 
    },
    "olga":
    {
        "alive": true,
        "attack": 1,
        "attracted": 1,
        "name": "the pretty lady",
        "prefered_attack": "kill",
        "sells": [],
        "type": "female", 
    },
    "other_lunatics":
    {
        "alive": true,
        "attack": -1,
        "attracted": 0,
        "name": "the other lunatics",
        "prefered_attack": "kill",
        "sells": [],
        "type": "group", 
    },
    "peasant_lass":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the peasant lass",
        "prefered_attack": "kill",
        "sells": ["many_colored_mushroom", "white_mushroom"],
        "type": "female", 
    },
    "pirates":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "the pirates",
        "prefered_attack": "kill",
        "type": "group", 
    },
    "priestess":
    {
        "alive": true,
        "attack": 2,
        "attracted": 0,
        "name": "the priestess",
        "prefered_attack": "kill",
        "type": "female", 
    },
    "simple_peasant":
    {
        "alive": true,
        "attack": -1,
        "attracted": 0,
        "name": "the simple peasant",
        "prefered_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "st_george":
    {
        "alive": true,
        "attack": 100,
        "attracted": 0,
        "name": "St. George",
        "prefered_attack": "smite",
        "sells": [],
        "type": "male", 
    },
    "war_merchant":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the wealthy war merchant",
        "prefered_attack": "kill",
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
        "prefered_attack": "frog",
        "sells": ["love_potion", "tail_potion", "strength_potion"],
        "type": "female", 
    },
    "wizard":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the wizard",
        "prefered_attack": "frog",
        "sells": [],
        "type": "male", 
    },
};
