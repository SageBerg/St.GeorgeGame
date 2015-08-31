"use strict";

var game_state = {};

function random_int(n) {
    return Math.floor(Math.random() * n);
}

function request_initial_world() {
    $.get("request_initial_world.json", {}, handle_new_world);
}

function request_outcome_of_action(action) {
    game_state.action = action;
    $.get("request_outcome_of_action.json", 
           game_state,
           handle_new_world);
}

function get_destination(game_sate) {
    var links = game_state.places[game_state.character.place].links;
    var destination = links[random_int(links.length)];
    return destination;
}

function handle_new_world(resp) {

    game_state = resp;

    if (game_state.character.is_dead) {
        game_state.message += " You are dead."; 
    }

    for (var i = 0; i < 5; i++) {
        document.getElementById("abcde"[i]).style.color = "black";
    }

    document.getElementById("message").innerHTML = game_state.message;
    if (game_state.options.a === "Attack") {
        document.getElementById("a").innerHTML = 
            "a. Attack " + resp.persons[resp.character.person].name + ".";
    } else {
        document.getElementById("a").innerHTML = "a. " + game_state.options.a;
    }
    document.getElementById("b").innerHTML = "b. " + game_state.options.b;
    if (game_state.options.c !== "") {
        if (game_state.options.c === "GO_TO") {
            var dest = get_destination(game_state);
            document.getElementById("c").innerHTML = "c. Go to " + 
                game_state.places[dest].name;
                game_state.destination = dest;
        } else {
            document.getElementById("c").innerHTML = "c. " + 
                game_state.options.c;
        }
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
            a_execute();
        } else if (ascii == 50 || ascii == 66 || ascii == 98) {
            b_execute();
        } else if (ascii == 51 || ascii == 67 || ascii == 99 
                   && game_state.options.c !== "") {
            execute("c");
        } else if (ascii == 52 || ascii == 68 || ascii == 100
                   && game_state.options.d !== "") {
            execute("d");
        } else if (ascii == 53 || ascii == 69 || ascii == 101
                   && game_state.options.e !== "") {
            execute("e");
        }
    }
}

function a_execute() {
    document.getElementById("a").style.color = "white";
    if (game_state.options.a === "Play again.") {
        request_initial_world();
    } else {
        request_outcome_of_action(game_state.options.a);
    }
}

function b_execute() {
    document.getElementById("b").style.color = "white";
    if (game_state.options.b === "Don't play again.") {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    } else {
        request_outcome_of_action(game_state.options.b);
    }
}

function execute(letter) {
    document.getElementById(letter).style.color = "white";
    request_outcome_of_action(game_state.options[letter]);
}

$(document).ready(main);
