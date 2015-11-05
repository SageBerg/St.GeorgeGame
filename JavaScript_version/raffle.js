"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

exports.add = function raffle_add(raffle, outcome, votes) {
    if (raffle[outcome]) {
        raffle[outcome] += votes;
    } else {
        raffle[outcome] = votes;
    }
};

exports.get = function raffle_get(raffle) {
    var raffle_size = 0;
    for (var key in raffle) {
        raffle_size += raffle[key];
    }
    var roll = Math.floor(Math.random() * raffle_size) + 1;
    for (key in raffle) {
        roll -= raffle[key];
        if (roll <= 0) {
            break;
        }
    }
    return key;
};
