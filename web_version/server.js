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

app.post("/take_action.json", take_action_handler);

console.log("Server started!");

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function take_action_handler(req, res) {
  
    if (strip_action(req.body.action) === "Play again.") {
        res.json({"reload": true});
    }

    //argument formatting
    var action = strip_action(req.body.action);
    
    //get outcome
    var possible_outcomes = get_possible_outcomes_of_action({}, action);
    var outcome = {"new_game": false,
                   "message": raffle_get(possible_outcomes),
                   "moved": false,
                   "options": {"a": "", 
                               "b": "", 
                               "c": "", 
                               "d": "", 
                               "e": ""},
                   "game_state": req.body.game_state 
                  };
    outcome.new_game = all_outcomes[outcome.message].new_game;
    if (all_outcomes[outcome.message].moved) {
        outcome.moved = true;
    }
    
    //get options
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
    if (action === "Ask about assassins.") {
        raffle_add(raffle, 
                    "The first person you ask happens to be an assassin. " +
                    "The assassin assassinates you."
                   , 5);
        /*
        raffle_add(raffle, 
                    "No one wants to talk to you."
                   , 5);
        raffle_add(raffle, 
                    "During your investigation, " +
                    "you find yourself talking to a pretty lady."
                   , 5);
        */
    }
    if (action === "Buy a drink.") {
        raffle_add(raffle, 
                   "The blind bartender grumbles as he serves you a drink."
                   , 5);
    }
    if (action === "Leave in a huff.") {
        raffle_add(raffle, 
                   ""
                   , 5);
    }
    return raffle;
}

function get_player_options(game_state, outcome) {
    raffle_a = {};
    raffle_b = {};
    raffle_c = {};
    raffle_d = {};
    get_default_player_options(game_state, raffle_a, raffle_b, raffle_c, 
                               raffle_d);
    get_outcome_player_options(outcome.message, raffle_a, raffle_b,
                               raffle_c, raffle_d);
    get_place_player_options(game_state, raffle_a, raffle_b, raffle_c, 
                             raffle_d);
    return [raffle_get(raffle_a),
            raffle_get(raffle_b),
            raffle_get(raffle_c),
            raffle_get(raffle_d)]
}

function get_default_player_options(game_state, raffle_a, raffle_b, 
                                    raffle_c, raffle_d) {
    raffle_add(raffle_a, "Think.", 1);
    raffle_add(raffle_a, "Lick the ground.", 1);
    raffle_add(raffle_b, "Pray to a higher power.", 1);
    raffle_add(raffle_c, "Go to sleep.", 1);
    //raffle_add(raffle_c, "Go to" + get_adjacent_place(game_state) + ".", 1);
    raffle_add(raffle_c, "Leave in a puff.", 1);
    raffle_add(raffle_d, "Sing a song.", 1);
    raffle_add(raffle_d, "Dance a jig.", 1);
}

function get_outcome_player_options(message, raffle_a, raffle_b, 
                                    raffle_c, raffle_d) {
    if (message == 
            "During your investigation, " +
            "you find yourself talking to a pretty lady."
       ) {
        raffle_add(raffle_b, "Flirt with the pretty lady.", 100);
    }
}

function get_place_player_options(game_state, raffle_a, raffle_b, 
                                  raffle_c, raffle_d) {
    if (game_state.place == "the tavern") {
        raffle_add(raffle_a, "Ask about assassins.", 1);
        raffle_add(raffle_b, "Buy a drink.", 2);
        raffle_add(raffle_d, "Do some gambling.", 2);
    }
}

var places = {"the tavern":  ["the streets"],
              "the streets": ["the market", "the tower", "the church", 
                              "a dark alley", "the docks", "the countryside"],
              "the tower":   ["the streets"],
              "the church":  ["the streets"],
              "the docks":   ["the streets", "the market", "the ocean", 
                              "the woods"],
              "the woods":   ["the docks", "the countryside"],
             }

var locked = ["prison", "a dark cave", "a pirate ship"];

var all_outcomes = {
    "The first person you ask happens to be an assassin. The assassin assassinates you."
    : {
        "new_game": true,
    },
    "The blind bartender grumbles as he serves you a drink."
    : {
        "new_game": true,
    },
    ""
    : {
        "new_game": true,
        "moved": "true", 
    },
};

function raffle_add(raffle, outcome, votes) {
    if (raffle[outcome]) {
        raffle[outcome] += votes;
    } else {
        raffle[outcome] = votes;
    }
}

function raffle_get(raffle) {
    var raffle_size = 0;
    for (key in raffle) {
        raffle_size += raffle[key]; 
    }
    var roll = Math.floor(Math.random() * raffle_size);
    for (key in raffle) {
        roll -= raffle[key];
        if (roll <= 0) {
            break;
        }
    }
    return key;
}
