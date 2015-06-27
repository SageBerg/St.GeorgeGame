var game_state = {"place": "the_tavern", 
                  "person": null, 
                  "character": {"items": ["cat"]},
                 };

var message = "You are in a tavern. The local assassins hate you.";

function handle_take_action(resp) {
    if (resp.new_game) {
        location.reload();
    }
    document.getElementById("message").innerHTML = resp.message;
    document.getElementById("a").innerHTML = "a. " + resp.options["a"];
    if (resp.options["b"]) {
        document.getElementById("b").innerHTML = "b. " + resp.options["b"];
    } else {
        document.getElementById("b").innerHTML = "";
    }
    if (resp.options["c"]) {
        document.getElementById("c").innerHTML = "c. " + resp.options["c"];
    } else {
        document.getElementById("c").innerHTML = "";
    }
    if (resp.options["d"]) {
        document.getElementById("d").innerHTML = "d. " + resp.options["d"];
    } else {
        document.getElementById("d").innerHTML = "";
    }
    if (resp.options["e"] != "") {
        document.getElementById("e").innerHTML = "e. " + resp.options["e"];
    } else {
        document.getElementById("e").innerHTML = "";
    }
}

function main() {
    document.onkeypress = function(event) {
        switch (event.which) {
            case 65:
                console.log("you pressed A");
                break;
            case 97:
                console.log("you pressed a");
                $.post("take_action.json", 
                       {"action": document.getElementById("a").innerHTML,
                        "game_state": game_state}, 
                       handle_take_action);
                break;
            case 66:
                console.log("you pressed B");
                break;
            case 98:
                console.log("you pressed b");
                break;
            case 67:
                console.log("you pressed C");
                break;
            case 99:
                console.log("you pressed c");
                break;
            case 68:
                console.log("you pressed D");
                break;
            case 100:
                console.log("you pressed d");
                break;
        }
    }
}

$(document).ready(main);
