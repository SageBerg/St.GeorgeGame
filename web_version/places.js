"use strict";

exports.places = {
    "arctic": 
    {
        "burnable":  false,
        "links":     ["ocean"],
        "locked":    false,
        "name":      "the Arctic",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "cave": 
    {
        "burnable":  false,
        "links":     ["ocean"],
        "locked":    true,
        "name":      "a dark cave",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "church": 
    {
        "burnable":  true,
        "links":     ["market", "streets"],
        "locked":    false,
        "name":      "the church",
        "outside":   false,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "countryside": 
    {
        "burnable":  false,
        "links":     ["lord_bartholomew_manor", "streets", "woods"],
        "locked":    false,
        "name":      "the countryside",
        "outside":   true,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "dark_alley": 
    {
        "burnable":  false,
        "links":     ["streets"],
        "locked":    false,
        "name":      "a dark alley",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "docks": 
    {
        "burnable":  false,
        "links":     ["market", "ocean", "streets", "woods"],
        "locked":    false,
        "name":      "the docks",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "lord_bartholomew_manor": 
    {
        "burnable":  true,
        "links":     ["countryside"],
        "locked":    false,
        "name":      "Lord Bartholomew's Manor",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "lord_carlos_manor": 
    {
        "burnable":  true,
        "links":     ["woods"],
        "locked":    false,
        "name":      "Lord Carlos' Manor",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": true,
    },
    "market": 
    {
        "burnable":  true,
        "links":     ["church", "streets", "docks", "wizard_lab"],
        "locked":    false,
        "name":      "the market",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": true,
    },
    "mermaid_rock":
    {
        "burnable":  false,
        "links":     ["ocean"],
        "locked":    false,
        "name":      "the docks",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "ocean": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the ocean",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "pirate_ship": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "Lord Arthur's Pirate Ship",
        "outside":   true,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "prison": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the docks",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "streets":
    {
        "burnable":  false,
        "links":     ["church", "countryside", "market", "tavern", "tower"],
        "locked":    false,
        "name":      "the streets",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "tavern":
    {
        "burnable":  true,
        "links":     ["streets"],
        "locked":    false,
        "name":      "the tavern",
        "outside":   false,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "tower":
    {
        "burnable":  true,
        "links":     ["streets"],
        "locked":    false,
        "name":      "the tower",
        "outside":   false,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "upstairs":
    {
        "burnable":  false,
        "links":     ["tavern"],
        "locked":    false,
        "name":      "the docks",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": true,
    },
    "void": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the void",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "wizard_lab": 
    {
        "burnable":  true,
        "links":     ["market"],
        "locked":    false,
        "name":      "the wizard's lab",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": true,
    },
    "woods": 
    {
        "burnable":  true,
        "links":     ["countryside", "lord_carlos_manor", "ocean", "docks"],
        "locked":    false,
        "name":      "the woods",
        "outside":   true,
        "populated": false,
        "town":      false, 
        "trashable": false,
    },
};
