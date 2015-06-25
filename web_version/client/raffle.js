/* raffle should be an object with an attribute "size" initially set to 0 */ 
function raffle_add(raffle, outcome, votes) {
    raffle["size"] += votes;
    if (raffle[outcome]) {
        raffle[outcome] += votes;
    } else {
        raffle[outcome] = votes;
    }
}

function raffle_get(raffle) {
    var countdown = raffle.size;
    var roll = randint(countdown);
    console.log(roll);
    var temp_key, keys = [];
    for (temp_key in raffle) {
        if (raffle.hasOwnProperty(temp_key)) { //and key != size
            keys.push(temp_key);
        }
    }
    for (key in keys) {
        console.log(key);
    }
    /*
    while (roll) {
        if (roll <= ) {
            return 
        }
        roll -=  
    }
    */
}

function randint(n) {
    return Math.floor(Math.random() * n);
}
