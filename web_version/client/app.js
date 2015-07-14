game_state = {"place": "the tavern", 
              "person": null, 
              "character": {"items": ["cat"]},
             };

message = "You are in a tavern. The local assassins hate you.";

function handle_action(resp) {
    console.log("client receiving:", resp);
    if (resp.reload) {
        location.reload();
    }
    if (resp.moved) {
        resp.message += " You find yourself in " + game_state.place + "."; 
    }
    game_state = resp.game_state;
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

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function call_post(letter) {
    if (strip_action(document.getElementById(letter).innerHTML) === 
            "Don't play again.") {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    } else {
        $.post("action.json", 
               {"action": document.getElementById(letter).innerHTML,
                "game_state": game_state}, 
               handle_action);
    }
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
