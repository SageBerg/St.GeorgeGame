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
    var outcomes = {"size": 0};
    var action = strip_action(req.body.action);
    outcomes = get_possible_outcomes_of_action(outcomes, action);
    var outcome = raffle_get(outcomes);
    console.log(outcome["message"]);
    //get_player_options(req.body.game_state, outcome.message);
    //outcome.options.a = "Play again.";
    res.json(outcome); //sent outcome to the client
}

function get_possible_outcomes_of_action(raffle, action) { 
    var outcome_template  = {"new_game": false,
                             "message": "",
                             "options": {"a": "", 
                                         "b": "", 
                                         "c": "", 
                                         "d": "", 
                                         "e": ""},
                            };
    var outcome;
    if (action == "Ask about assassins.") {
        outcome = outcome_template;
        outcome.new_game = true;
        outcome.message = "The first person you ask happens to be an assassin" +
            ". She assassinates you.";
        raffle_add(raffle, outcome, 10);
    }
    return raffle;
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
