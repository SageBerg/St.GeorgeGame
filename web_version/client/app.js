function handle_take_action(resp_body) {
    request = {};
    $.post("take_action.json", request, null);
}

function main() {
    document.onkeypress = function(event) {
        switch (event.which) {
            case 65:
                console.log("you pressed A");
                break;
            case 97:
                console.log("you pressed a");
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
    /* testing raffle */
    /* 
    var raffle = {"size": 0};
    raffle_add(raffle, "action1", 10);
    raffle_add(raffle, "action1", 10);
    raffle_add(raffle, "action2", 10);
    raffle_add(raffle, "action3", 5);
    console.log(raffle);
    for (var i = 0; i < 3; i++) {
        console.log(raffle_get(raffle));
    }
    */
}

$(document).ready(main);
