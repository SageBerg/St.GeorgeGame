function main() {
    document.onkeypress = function(event) {
        switch (event.which) {
            case 97:
                console.log("you pressed a");
                break;
            case 98:
                console.log("you pressed b");
                break;
            case 99:
                console.log("you pressed c");
                break;
            case 100:
                console.log("you pressed d");
                break;
        }
    }
}

$(document).ready(main);
