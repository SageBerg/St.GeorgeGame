var game_state = {"place": "the tavern", 
                  "person": null, 
                  "character": {"items": ["cat"]},
                 };

var message = "You are in a tavern. The local assassins hate you.";

function handle_take_action(resp) {
    if (resp.reload) {
        location.reload();
    }
    if (resp.moved) {
        resp.message += " You find yourself in " + game_state.place + "."; 
    }
    game_state = resp.game_state;
    console.log(resp);
    document.getElementById("message").innerHTML = resp.message;
    document.getElementById("a").innerHTML = "a. " + resp.options["a"];
    var letters = "abcd";
    var letter;
    for (index in letters) {
        letter = letters[index];
        if (resp.options[letter]) {
            document.getElementById(letter).innerHTML = 
                letter + ". " + resp.options[letter];
        } else {
            document.getElementById(letter).innerHTML = "";
        }
    }
}

function call_post(letter) {
    $.post("take_action.json", 
           {"action": document.getElementById(letter).innerHTML,
            "game_state": game_state}, 
           handle_take_action);
}

function main() {
    document.onkeypress = function(event) {
        var ascii = event.which;
        if (ascii == 49 || ascii == 65 || ascii == 97) {
            call_post("a");
        } else if (ascii == 50 || ascii == 66 || ascii == 98) {
            call_post("b");
        } else if (ascii == 51 || ascii == 67 || ascii == 99) {
            call_post("c");
        } else if (ascii == 52 || ascii == 68 || ascii == 100) {
            call_post("d");
        } else if (ascii == 53 || ascii == 69 || ascii == 101) {
            call_post("e");
        }
    }
}

$(document).ready(main);
