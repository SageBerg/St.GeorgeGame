"use strict";

var game_state = {};

function a_execute() {
    document.getElementById("a").style.color = "white";
    if (game_state.options.a === "Play again.") {
        request_initial_world();
    } else {
        request_outcome_of_action(game_state.options.a);
    }
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

function b_execute() {
    document.getElementById("b").style.color = "white";
    if (game_state.options.b === "Don't play again.") {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    } else {
        request_outcome_of_action(game_state.options.b);
    }
}

function bind_keys() {
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

function execute(letter) {
    document.getElementById(letter).style.color = "white";
    request_outcome_of_action(game_state.options[letter]);
}

function get_destination(game_sate) {
    var links = game_state.places[game_state.character.place].links;
    var destination = links[random_int(links.length)];
    return destination;
}

function get_item(game_state) {
    var items = ["ax", "bouquet of flowers", "fish", "pearl", "sailor peg"];
    var item  = items[random_int(items.length)];
    return item;
}

function get_weapon(game_state) {
    var weapons = game_state.persons[game_state.character.person].sells;
    var weapon  = weapons[random_int(weapons.length)];
    return weapon;
}

function handle_new_world(resp) {

    if (resp.message === "invalid input") {
        alert("invalid input: please refresh the page");
        return;
    }

    game_state = resp;

    if (game_state.outcome === "sing_in_deep_voice") {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }

    if (game_state.character.is_dead) {
        game_state.message += " You are dead."; 
    }

    document.getElementById("score").innerHTML = "Score: " + game_state.score;

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
        $("#a").text("a. Attack " + 
                resp.persons[resp.character.person].name + ".");
    } else if (game_state.options.a === "MARRY") {
        $("#a").text("a. Marry " + 
            game_state.persons[game_state.character.person].name + ".");
    } else if (game_state.options.a === "Think." &&
               game_state.action === "Think.") {
        $("#a").text("a. Think some more.");
    } else if (game_state.options.a === "YELL_A_PIRATE_PHRASE") {
        $("#a").text("a. Yell, \"" + 
            random_choice([
                "Ahoy",
                "All hands on deck",
                "Arr Matey",
                "Avast",
                "Aye Aye",
                "Dead men tell no tales",
                "Hoist the Jolly Roger",
                "Land ho",
                "Send 'em to Davy Jones' locker",
                "Shiver me timbers",
                "Thare she blows",
                "Walk the plank",
                "X marks the spot",
                "Yo, ho, ho, and a bottle of rum",
            ]) + "!\"");
    } else {
        $("#a").text("a. " + game_state.options.a);
    }

//Option b.
    if (game_state.options.b === "BURN") {
        $("#b").text("b. Burn " + 
            game_state.places[game_state.character.place].name + 
            " to the ground.");
    } else if (game_state.options.b === "LOVE_POTION") {
        $("#b").text("b. Use your love potion on " +
            game_state.persons[game_state.character.person].name + ".");
    } else {
        $("#b").text("b. " + game_state.options.b);
    }
    
//Option c.
    if (game_state.options.c !== "") {
        if (game_state.options.c === "GO_TO") {
            var dest = get_destination(game_state);
            $("#c").text("c. Go to " + game_state.places[dest].name + ".");
            game_state.destination = dest;
        } else if (game_state.options.c === "GO_SHOPPING") {
            var item = get_item(game_state);
            $("#c").text("c. Buy " + a_or_an(item[0]) + " " + item + ".");
            game_state.for_sell = item;
        } else {
            $("#c").text("c. " + game_state.options.c);
        }
    } else {
        $("#c").text("");
    }

//Option d.
    if (game_state.options.d !== "") {
        if (game_state.options.d === "Buy a weapon.") {
            var weapon = get_weapon(game_state);
            $("#d").text("d. Buy " + a_or_an(weapons_map[weapon][0]) + " " +
                weapons_map[weapon] + ".");
            game_state.for_sell = weapon;
        } else if (game_state.options.d === "Flirt with") {
            $("#d").text("d. Flirt with " +
                game_state.persons[game_state.character.person].name + ".");
        } else if (game_state.options.d === "TELL_GUARDS") {
            $("#d").text("d. Tell the guards you're not a lunatic, you're " +
                "just " + game_state.character.excuse + ".");
        } else {
            $("#d").text("d. " + game_state.options.d);
        }
    } else {
        $("#d").text("");
    }

//Option e.
    if (game_state.options.e !== "") {
        $("#e").text("e. " + game_state.options.e);
    } else {
        $("#e").text("");
    }

    bind_keys();

}

function random_choice(array) {
    return array[random_int(array.length)]; 
}

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

// CREDITS: funcction based on top answer by community wiki at:
// http://stackoverflow.com/questions/2450954/
//        how-to-randomize-shuffle-a-javascript-array
function scramble(text) {
    for (var i in "?\"\'!.,:;") {
        text = text.replace("?\"\'!.,:;"[i], "");
    }
    text = text.toLowerCase();
    var array = text.split(" ");
    var current_index = array.length, temporary_value, random_index ;

    while (0 !== current_index) {
        random_index = Math.floor(Math.random() * current_index);
        current_index -= 1;
        temporary_value = array[current_index];
        array[current_index] = array[random_index];
        array[random_index] = temporary_value;
    }

    var return_text = "";
    for (var i = 0; i < array.length; i++) {
        return_text += array[i] + " ";
    }

    return return_text;
}

var weapons_map = {
    "dagger": "dagger",
    "poison_dagger": "poison dagger",
    "cutlass": "cutlass",
    "jeweled_cutlass": "jeweled cutlass",
    "hammer": "hammer",
    "iron_hammer": "iron hammer"
}

$(document).ready(request_initial_world);
