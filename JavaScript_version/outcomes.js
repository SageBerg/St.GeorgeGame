"use strict";

exports.get_outcome = function get_outcome(game_state) {
    return "assassinated";
}

exports.apply_outcome = function apply_outcome(outcome, game_state) {
    if (outcome === "assassinated") {
        game_state.message = "You get assassinated.";
        game_state.character.is_dead = true;
    } else {
        game_state.message = "Error: No outcome!";
    }
    game_state.action = null; //the player hasn't chosen a new action yet
    return game_state
}
