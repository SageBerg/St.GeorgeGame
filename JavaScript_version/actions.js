"use strict";

var raffle = require("./raffle");

exports.actions = {
    "Leave in a huff": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "moved", 10);
        return possible_outcomes;
    },
}
