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

var her_him_them = {
    "female": "her",
    "male": "him",
    "group": "them"
}

function handle_new_world(resp) {
    game_state = resp;
    if (game_state.character.is_dead) {
        game_state.message += " You are dead."; 
    }
    document.getElementById("message").innerHTML = game_state.message;
    if (game_state.options.a === "Attack") {
        document.getElementById("a").innerHTML = 
            "a. Attack " + 
            her_him_them[resp.persons[resp.character.person].type] + ".";
    } else {
        document.getElementById("a").innerHTML = "a. " + game_state.options.a;
    }
    document.getElementById("b").innerHTML = "b. " + game_state.options.b;
    if (game_state.options.c !== "") {
        document.getElementById("c").innerHTML = "c. " + game_state.options.c;
    } else {
        document.getElementById("c").innerHTML = "";
    }
    if (game_state.options.d !== "") {
        document.getElementById("d").innerHTML = "d. " + game_state.options.d;
    } else {
        document.getElementById("d").innerHTML = "";
    }
    if (game_state.options.e !== "") {
        document.getElementById("e").innerHTML = "e. " + game_state.options.e;
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
