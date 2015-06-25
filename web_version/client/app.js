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
    var raffle = {"size": 0};
    raffle_add(raffle, "action", 10);
    console.log(raffle);
    raffle_get(raffle);
}

$(document).ready(main);
