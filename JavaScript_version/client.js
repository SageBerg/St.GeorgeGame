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

function get_item(game_state) {
    var items = ["ax", "bouquet of flowers", "fish", "pearl", "sailor peg"];
    var item  = items[random_int(items.length)];
    return item;
}

function get_person_name(game_state) {
    return game_state.persons[game_state.character.person].name;
}

function get_place_name(game_state) {
    return game_state.places[game_state.character.place].name;
}

function get_weapon(game_state) {
    var weapons = game_state.persons[game_state.character.person].sells;
    var weapon  = weapons[random_int(weapons.length)];
    return weapon;
}

function handle_new_world(resp) {
    if (resp.message === "error") {
        handle_world_error(game_state);
    } else {
        game_state = resp;

        for (var i = 0; i < 5; i++) {
            document.getElementById("abcde"[i]).style.color = "white";
        }

        if (game_state.character.is_dead) {
            game_state.message += " You are dead."; 
        }

        set_message(game_state);
        set_a(game_state);
        set_b(game_state);
        set_c(game_state);
        set_d(game_state);
        set_e(game_state);
        $("#score").text("Score: " + game_state.score);

        if (parseInt(game_state.score) === 0) {
        //we only need to bind the keys if this is the first frame of the game
        //and the player has a score of 0 at the first frame of the game
        
        //I am binding the keys at the end of the handle_new_world function
        //to prevent the client from being able to make a bad server request
        //before the server has given the client the initial game state 
            bind_keys();
        }
    }
}

function handle_world_error(game_state) {
    $("#message").text("The universe rips apart and everyone dies.");
    $("#a").text("Play again.");
    $("#b").text("Don't play again.");
    $("#c").text("");
    $("#d").text("");
    $("#e").text("");
    game_state.options.a = "Play again.";
    game_state.options.b = "Don't play again.";
    game_state.options.c = "";
    game_state.options.d = "";
    game_state.options.e = "";
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
    text = text.replace(/\./g, "");
    text = text.replace(/,/g, "");
    text = text.replace(/\?/g, "");
    text = text.replace(/!/g, "");
    text = text.replace(/"/g, "");

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

function set_a(game_state) {
    switch (game_state.options.a) {
        case "ATTACK":
            $("#a").text("a. Attack " + get_person_name(game_state) + ".");
            break;

        case "GIVE_HER_CAT":
            var cat = "your cat";
            if (game_state.character.items["cat"] > 1) {
                cat = "one of your cats";
            }
            $("#a").text("a. Give " + get_person_name(game_state) + cat + ".");
            break;

        case "MARRY":
            $("#a").text("a. Marry " + get_person_name(game_state) + ".");
            break;

        case "Think.":
            if (game_state.action === "Think.") {
                $("#a").text("a. Think some more.");
            } else {
                $("#a").text("a. Think.");
            }
            break;

        case "YELL_A_PIRATE_PHRASE":
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
            break;

        default:
            $("#a").text("a. " + game_state.options.a);
    }
}

function set_b(game_state) {
    switch (game_state.options.b) {
        case "BURN":
            $("#b").text("b. Burn " +  get_place_name(game_state) +
                " to the ground.");
            break;

        case "GIVE_FLOWERS":
            if (game_state.character.place === "prison") {
                if (game_state.persons.felicity.name === "the fat lady") {
                    $("#b").text("b. Give the fat lady who feeds you a " +
                        "bouquet of flowers.");
                } else {
                    $("#b").text("b. Give Felicity your bouquet of flowers.");
                }
            } else {
                $("#b").text("b. Give her your bouquet of flowers.");
            }
            break;

        case "LOVE_POTION":
            $("#b").text("b. Use your love potion on " + 
                get_person_name(game_state) + ".");
            break;

        case "SHOW_COIN":
            $("#b").text("b. Show " + get_person_name(game_state) + 
                " your shiny foreign coin.");
            break;

        case "SUCK_UP":
            $("#b").text("b. Suck up to " + get_person_name(game_state) + ".");
            break;

        default:
            $("#b").text("b. " + game_state.options.b);
    }
}

function set_c(game_state) {
    if (game_state.options.c !== "") {
        switch (game_state.options.c) {
            case "GO_TO":
                var dest = game_state.destination;
                $("#c").text("c. Go to " + game_state.places[dest].name + ".");
                break;

            case "GO_SHOPPING":
                var item = get_item(game_state);
                $("#c").text("c. Buy " + a_or_an(item[0]) + " " + item + ".");
                game_state.for_sell = item;
                break;

            default:
                $("#c").text("c. " + game_state.options.c);
        }
    } else {
        $("#c").text("");
    }
}

function set_d(game_state) {
    if (game_state.options.d !== "") {
        switch (game_state.options.d) {
            case "BUY_WEAPON": 
                var weapon = get_weapon(game_state);
                $("#d").text("d. Buy " + a_or_an(weapons_map[weapon][0]) + " " +
                    weapons_map[weapon] + ".");
                game_state.for_sell = weapon;
                break;

            case "FLIRT_WITH":
                $("#d").text("d. Flirt with " + 
                    get_person_name(game_state) + ".");
                break;

            case "Sing a song.":
                if (game_state.topic !== null) {
                    $("#d").text("d. Sing a song about " + 
                        game_state.topic + ".");
                } else {
                    $("#d").text("d. Sing a song.");
                }
                break;

            case "TELL_GUARDS":
                $("#d").text("d. Tell the guards you're not a lunatic, " +
                    "you're just " + game_state.character.excuse + ".");
                break;

            default:
                $("#d").text("d. " + game_state.options.d);
        }
    } else {
        $("#d").text("");
    }
}

function set_e(game_state) {
    if (game_state.options.e !== "") {
        $("#e").text("e. " + game_state.options.e);
    } else {
        $("#e").text("");
    }
}

function set_message(game_state) {
    if (game_state.character.is_tripping) {
        $("#message").text(scramble(game_state.message));
    } else {
        $("#message").text(game_state.message);
    }
}

var weapons_map = {
    "cutlass": "cutlass",
    "dagger": "dagger",
    "hammer": "hammer",
    "iron_hammer": "iron hammer",
    "jeweled_cutlass": "jeweled cutlass",
    "pitchfork": "pitchfork",
    "long_pitchfork": "long pitchfork",
    "poison_dagger": "poison dagger",
}

$(document).ready(request_initial_world);
