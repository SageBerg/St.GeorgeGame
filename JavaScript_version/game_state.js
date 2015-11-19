"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var character   = require("./character").character;
var options     = require("./options");
var persons     = require("./persons").persons;
var places      = require("./places").places;

exports.GameState = function() {
    this.action =      null;
    this.character =   character;
    this.destination = null;
    this.for_sell =    null;
    this.marriage =    false;
    this.message =     "You are in a tavern. The local assassins hate you.";
    this.options =     options.starting_options;
    this.outcome =     null;
    this.persons =     persons;
    this.places =      places;
    this.score =       0;
};
