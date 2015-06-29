var express = require('express'),
    http = require('http'),
    port = 3000,
    app,
    server;

app = express();
server = http.createServer(app);
server.listen(port);

app.use(express.urlencoded());
app.use(express.static(__dirname + "/client"));

console.log("Server started!");

app.post("/take_action.json", take_action_handler);

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function take_action_handler(req, res) {
    console.log("action:", strip_action(req.body.action));
    console.log("place:", req.body.game_state.place);
    
    var outcome_raffle = {"size": 0};
    build_outcome_raffle(outcome_raffle, strip_action(req.body.action));
    var outcome = raffle_get(outcome_raffle);

    //set up raffles for the options
    //get the options
    //sent the outcome and options the the client

    if (req.body.game_state.place == "the tavern" && 
        strip_action(req.body.action) == "Leave in a huff.") {
        console.log("you go to the streets");
    }
    var response = {"new_game": false,
                    "message": "You are soon assassinated.",
                    "options": {"a": "Play again."},
                   };
    res.json(response); 
}

function build_outcome_raffle(outcome_raffle, action) { 

}

var places = {"the tavern": ["the streets"],
              "the streets": ["the market", "the tower", "the church", 
                              "a dark alley", "the docks", "the countryside"],
              "the tower": ["the streets"],
              "the chuch": ["the streets"],
              "the docks": ["the streets", "the market", "the ocean", 
                            "the woods"],
              "the woods": ["the docks", "the countryside"],
             }

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
