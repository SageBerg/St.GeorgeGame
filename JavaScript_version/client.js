"use strict";

var game_state = {};

function request_initial_world() {
    $.get("request_initial_world.json", {}, handle_new_world);
}

function request_outcome_of_action(action) {
    game_state.action = action;
    console.log("sending:", game_state);
    $.get("request_outcome_of_action.json", 
           {"game_state": game_state}, 
           handle_new_world);
}

function handle_new_world(resp) {
    game_state = resp;
    document.getElementById("message").innerHTML = resp.message;
    document.getElementById("a").innerHTML = "a. " + resp.options.a + ".";
    document.getElementById("b").innerHTML = "b. " + resp.options.b + ".";
    document.getElementById("c").innerHTML = "c. " + resp.options.c + ".";
    document.getElementById("d").innerHTML = "d. " + resp.options.d + ".";
}

function main() {
    request_initial_world();
    document.onkeypress = function(event) {
        var ascii = event.which;
        if (ascii == 49 || ascii == 65 || ascii == 97) {
            request_outcome_of_action(game_state.options.a);
        } else if (ascii == 50 || ascii == 66 || ascii == 98) {
            request_outcome_of_action(game_state.options.b);
        } else if (ascii == 51 || ascii == 67 || ascii == 99) {
            request_outcome_of_action(game_state.options.c);
        } else if (ascii == 52 || ascii == 68 || ascii == 100) {
            request_outcome_of_action(game_state.options.d);
        } //else if (ascii == 53 || ascii == 69 || ascii == 101) {
        //    request_outcome_of_action("e");
        //}
    }
}

$(document).ready(main);
