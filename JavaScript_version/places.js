"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/ 
/*global define */

exports.places = {
    "arctic": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the Arctic",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "cave": 
    {
        "burnable":  false,
        "links":     [],
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
        "links":     ["streets", "tavern"],
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
        "links":     ["market", "streets", "woods"],
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
        "name":      "Lord Bartholomew's manor",
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
        "name":      "Lord Carlos' manor",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": true,
    },
    "market": 
    {
        "burnable":  true,
        "links":     ["church", "countryside", "streets", "docks", 
                      "wizard_lab"],
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
        "links":     [],
        "locked":    true,
        "name":      "a mermaid rock",
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
        "name":      "Lord Arthur's pirate ship",
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
        "name":      "prison",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "smoking_volcano":
    {
        "burnable":  false,
        "links":     ["countryside", "lord_bartholomew_manor"],
        "locked":    false,
        "name":      "the smoking volcano",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "streets":
    {
        "burnable":  false,
        "links":     ["church", "countryside", "dark_alley", "market", 
                      "tavern", "tower"],
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
        "name":      "the upstairs of the tavern",
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
        "links":     ["countryside", "lord_carlos_manor"],
        "locked":    false,
        "name":      "the woods",
        "outside":   true,
        "populated": false,
        "town":      false, 
        "trashable": false,
    },
};
