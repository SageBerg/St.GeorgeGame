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
    var outcome_message = raffle_get(outcomes);
    var outcome  = {"new_game": false,
                    "message": "",
                    "options": {"a": "", 
                                "b": "", 
                                "c": "", 
                                "d": "", 
                                "e": ""},
                    "game_state": {},
                   };
    outcome.message = outcome_message;
    outcome.game_state = req.body.game_state;
    if (outcome.message == "The first person you ask happens to be an assassin"
            + ".The assassin assassinates you.") {
        outcome.new_game = true;
    }
    if (!outcome.new_game) {
        options = get_player_options(req.body.game_state, outcome);
        outcome.options.a = options[0];
        outcome.options.b = options[1];
        outcome.options.c = options[2];
        outcome.options.d = options[3];
    } else {
        outcome.options.a = "Play again.";
    }
    res.json(outcome);
}

function get_possible_outcomes_of_action(raffle, action) { 
    var outcome;
    if (action == "Ask about assassins.") {
        outcome = "The first person you ask happens to be an assassin. " +
            "The assassin assassinates you.";
        raffle_add(raffle, outcome, 10);
        raffle_add(raffle, "No one wants to talk to you.", 5);
        raffle_add(raffle, 
            "During your investigation, " +
            "you find yourself talking to a pretty lady."
            , 5); //fix
    }
    return raffle;
}

function get_player_options(game_state, outcome) {
    raffle_a = {"size": 0};
    raffle_b = {"size": 0};
    raffle_c = {"size": 0};
    raffle_d = {"size": 0};

    console.log("outcome.message", outcome.message);

    if (outcome.message == 
            "During your investigation, " +
            "you find yourself talking to a pretty lady."
       ) {
        raffle_add(raffle_b, "Flirt with the pretty lady.", 100); //fix
    }

    raffle_add(raffle_a, "Think.", 1);
    raffle_add(raffle_a, "Lick the ground.", 1);
    raffle_add(raffle_b, "Pray to a higher power.", 1);
    raffle_add(raffle_c, "Go to sleep.", 1);
    raffle_add(raffle_c, "Leave in a puff.", 1);
    raffle_add(raffle_d, "Sing a song.", 1);
    raffle_add(raffle_d, "Dance a jig.", 1);

    if (game_state.place == "the tavern") {
        raffle_add(raffle_a, "Ask about assassins.", 1);
        raffle_add(raffle_b, "Buy a drink.", 2);
        raffle_add(raffle_d, "Do some gambling.", 2);
    }

    return [raffle_get(raffle_a),
            raffle_get(raffle_b),
            raffle_get(raffle_c),
            raffle_get(raffle_d)]
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
            if (roll <= 0) {
                break;
            }
            roll -= raffle[key];
        }
    }
    return key;
}

function randint(n) {
    return Math.floor(Math.random() * n);
}
