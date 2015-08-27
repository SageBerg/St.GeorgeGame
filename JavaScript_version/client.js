"use strict";

var game_state = {};

function request_initial_world() {
    $.get("request_initial_world.json", {}, handle_new_world);
}

function request_outcome_of_action(action) {
    game_state.action = action;
    $.get("request_outcome_of_action.json", 
           game_state,
           handle_new_world);
}

function handle_new_world(resp) {
    game_state = resp;
    document.getElementById("message").innerHTML = resp.message;
    document.getElementById("a").innerHTML = "a. " + resp.options.a;
    document.getElementById("b").innerHTML = "b. " + resp.options.b;
    if (resp.options.c !== "") {
        document.getElementById("c").innerHTML = "c. " + resp.options.c;
    } else {
        document.getElementById("c").innerHTML = "";
    }
    if (resp.options.d !== "") {
        document.getElementById("d").innerHTML = "d. " + resp.options.d;
    } else {
        document.getElementById("d").innerHTML = "";
    }
    if (resp.options.e !== "") {
        document.getElementById("e").innerHTML = "e. " + resp.options.e;
    } else {
        document.getElementById("e").innerHTML = "";
    }
}

function main() {
    request_initial_world();
    //TODO see if you can break it by punching a key before the initial world has loaded 
    document.onkeypress = function(event) {
        var ascii = event.which;
        if (ascii == 49 || ascii == 65 || ascii == 97) {
            if (game_state.options.a === "Play again.") {
                request_initial_world();
            } else {
                request_outcome_of_action(game_state.options.a);
            }
        } else if (ascii == 50 || ascii == 66 || ascii == 98) {
            if (game_state.options.b === "Don't play again.") {
                window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            } else {
                request_outcome_of_action(game_state.options.b);
            }
        } else if (ascii == 51 || ascii == 67 || ascii == 99 
                   && game_state.options.c !== "") {
            request_outcome_of_action(game_state.options.c);
        } else if (ascii == 52 || ascii == 68 || ascii == 100
                   && game_state.options.d !== "") {
            request_outcome_of_action(game_state.options.d);
        } else if (ascii == 53 || ascii == 69 || ascii == 101
                   && game_state.options.e !== "") {
            request_outcome_of_action("e");
        }
    }
}

$(document).ready(main);
