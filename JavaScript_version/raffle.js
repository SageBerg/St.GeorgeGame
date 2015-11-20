"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var Raffle = function() {};

Raffle.prototype.add = function(outcome, votes) {
    this[outcome] ? this[outcome] += votes : this[outcome] = votes;
};

Raffle.prototype.get = function() {
    var raffle_size = 0;
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            raffle_size += this[key];
        }
    }
    var roll = Math.floor(Math.random() * raffle_size) + 1;
    for (key in this) {
        if (this.hasOwnProperty(key)) {
            roll -= this[key];
            if (roll <= 0) {
                break;
            }
        }
    }
    return key;
};

exports.Raffle = Raffle;
