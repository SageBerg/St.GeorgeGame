var game_state = {"place": "the_tavern", 
                  "person": null, 
                  "character": {"items": ["cat"]}
                 };

var message = "You are in a tavern. The local assassins hate you.";

function handle_take_action(resp) {
    console.log(resp.message);
}

function main() {
    document.onkeypress = function(event) {
        switch (event.which) {
            case 65:
                console.log("you pressed A");
                break;
            case 97:
                console.log("you pressed a");
                $.post("take_action.json", {}, handle_take_action);
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
