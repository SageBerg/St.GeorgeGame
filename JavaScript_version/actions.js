"use strict";

var raffle = require("./raffle");

exports.actions = {
    "Buy a drink.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "meet_blind_bartender", 10);
    },
    "Leave in a huff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "moved", 10);
    },
    "Leave in a puff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "left_in_a_puff", 10000);
    },
}
