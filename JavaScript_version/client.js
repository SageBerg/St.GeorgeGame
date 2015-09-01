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

function get_weapon(game_state) {
    var weapons = game_state.persons[game_state.character.person].sells   
    var weapon  = weapons[random_int(weapons.length)];
    return weapon;
}

var weapons_map = {
    "dagger": "dagger",
    "poison_dagger": "poison dagger",
    "cutlass": "cutlass",
    "jeweled_cutlass": "jeweled cutlass",
    "hammer": "hammer",
    "iron_hammer": "iron hammer"
}

//TODO factor this out to helper_functions.js
function a_or_an(next_letter) {
    if (next_letter === "a" ||
        next_letter === "e" ||
        next_letter === "i" ||
        next_letter === "o" ||
        next_letter === "u") {
        return "an";
    }
    return "a";
}

function scramble(text) {
    for (var i in "?\"\'!.,:;") {
        text = text.replace("?\"\'!.,:;"[i], "");
    }
    text = text.toLowerCase();
    var array = text.split(" ");
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    var return_text = "";
    for (var i = 0; i < array.length; i++) {
        return_text += array[i] + " ";
    }

    return return_text;
}

function handle_new_world(resp) {

    game_state = resp;

    if (game_state.character.is_dead) {
        game_state.message += " You are dead."; 
    }

    for (var i = 0; i < 5; i++) {
        document.getElementById("abcde"[i]).style.color = "black";
    }

    if (game_state.character.is_tripping) {
        document.getElementById("message").innerHTML = 
        scramble(game_state.message);
    } else {
        document.getElementById("message").innerHTML = game_state.message;
    }

//Option a.
    if (game_state.options.a === "Attack") {
        document.getElementById("a").innerHTML = 
            "a. Attack " + resp.persons[resp.character.person].name + ".";
    } else if (game_state.options.a === "MARRY") {
        document.getElementById("a").innerHTML = "a. Marry " +
            game_state.persons[game_state.character.person].name + ".";
    } else {
        document.getElementById("a").innerHTML = "a. " + game_state.options.a;
    }

//Option b.
    if (game_state.options.b === "BURN") {
        document.getElementById("b").innerHTML = "b. Burn " + 
            game_state.places[game_state.character.place].name + 
            " to the ground.";
    } else {
        document.getElementById("b").innerHTML = "b. " + game_state.options.b;
    }
//Option c.
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

//Option d.
    if (game_state.options.d !== "") {
        if (game_state.options.d === "Buy a weapon.") {
            var weapon = get_weapon(game_state);
            document.getElementById("d").innerHTML = 
                "d. Buy " + a_or_an(weapons_map[weapon][0]) + " " +
                weapons_map[weapon] + ".";
            game_state.for_sell = weapon;
        } else if (game_state.options.d === "Flirt with") {
            document.getElementById("d").innerHTML = "d. Flirt with " +
                game_state.persons[game_state.character.person].name + ".";
        } else {
            document.getElementById("d").innerHTML = "d. " +
                game_state.options.d;
        }
    } else {
        document.getElementById("d").innerHTML = "";
    }

//Option e.
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
