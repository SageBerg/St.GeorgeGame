/* raffle should be an object with an attribute "size" initially set to 0 */ 
function raffle_add(raffle, outcome, votes) {
    raffle["size"] += votes;
    if (raffle[outcome]) {
        raffle[outcome] += votes;
    } else {
        raffle[outcome] = votes;
    }
}

/* this raffle is designed and intended for single drawings */
function raffle_get(raffle) {
    var roll = randint(raffle.size);
    for (key in raffle) {
        if (key != "size") { 
        // the "size" attribute is part of the raffle, but shouldn't be drawn 
            roll -= raffle[key];
            if (roll <= 0) {
                break;
            }
        }
    }
    return key;
}

function randint(n) {
    return Math.floor(Math.random() * n);
}
