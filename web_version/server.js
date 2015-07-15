/*
 * The St. George Game (server)
 * by Sage Berg
 * developed in JavaScript 23 June 2015 
 *                      to XX XXXX 2015
 */



// Server Setup

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

app.post("/action.json", action_handler);

console.log("Server started!"); //because feedback is nice



// Game Data (will be stored in db if the size of the game gets unweidly)

actions = {
    "assassinated_in_tavern": 
        {"dead": true, 
         "message": 
             "The first person you meet turns out to be an assassin. " +
             "She assassinates you.",
        },
    "find_a_pretty_lady":
        {"message":
            "During your investigation, you find yourself talking to a " +
            "pretty lady.",
         "game_state_edits": {"person": "pretty_lady"},
        },
};



// Functions (listed in alphabetical order)

function action_handler(req, res) {
    if (strip_action(req.body.action) === "Play again.") {
        res.json({"reload": true});
        return;
    }
    var client_action = strip_action(req.body.action);
    var outcome_id = raffle_get(get_possible_outcomes_of_action(client_action));
    var outcome = get_outcome(req.body.game_state, outcome_id);
    
    if (!outcome.dead && !outcome.found_love) {
        options = get_player_options(outcome);
        outcome.options.a = options[0];
        outcome.options.b = options[1];
        outcome.options.c = options[2];
        outcome.options.d = options[3];
    } else {
        outcome.options.a = "Play again.";
        outcome.options.b = "Don't play again.";
    }
    console. log("server sending:", outcome);
    res.json(outcome);
}

function make_game_state_edits(game_state, game_state_edits) {
    for (key in game_state_edits) {
        if (key === "person") {
            game_state.person = game_state_edits.person;
        }
    }
}

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function create_outcome_template() {
    return {"dead": false,
            "game_state": {},
            "game_state_edits": {},
            "found_love": false,
            "message": "default message (you shouldn't be seeing this message)",
            "options": {"a": "", "b": "", "c": "", "d": "", "e": "",},
            "redload": false,
           };
}

function get_outcome(game_state, outcome_id) {
    outcome = create_outcome_template();
    for (key in actions[outcome_id]) {
        outcome[key] = actions[outcome_id][key];        
    }
    outcome.game_state = game_state;
    make_game_state_edits(outcome.game_state, outcome.game_state_edits);
    return outcome;
}

function get_possible_outcomes_of_action(action) { 
    raffle = {};
    if (action === "Ask about assassins.") {
        raffle_add(raffle, "assassinated_in_tavern", 5);
        //raffle_add(raffle, "no_one_wants_to_talk", 5);
        raffle_add(raffle, "find_a_pretty_lady", 5);
    }
    if (action === "Buy a drink.") {
        //raffle_add(raffle, "blind_bartender_grumbles", 5);
    }
    if (action === "Leave in a huff.") {
        //raffle_add(raffle, "", 5);
    }
    return raffle;
}

function get_player_options(outcome) {
    var a = {}, b = {}, c = {}, d = {};
    console.log("outcome.game_state:", outcome.game_state);
    get_default_player_options(outcome.game_state, a, b, c, d);
    get_npc_player_options(outcome.game_state.person, a, b, c, d);
    get_outcome_player_options(outcome.message, a, b, c, d);
    get_place_player_options(outcome.game_state, a, b, c, d);
    return [raffle_get(a), raffle_get(b), raffle_get(c), raffle_get(d)];
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
}

function get_place_player_options(game_state, raffle_a, raffle_b, 
                                              raffle_c, raffle_d) {
    if (game_state.place == "the tavern") {
        raffle_add(raffle_a, "Ask about assassins.", 1);
        raffle_add(raffle_b, "Buy a drink.", 2);
        raffle_add(raffle_d, "Do some gambling.", 2);
    }
}

function get_npc_player_options(npc, raffle_a, raffle_b, 
                                                raffle_c, raffle_d) {
    if (npc === "pretty_lady") {
        raffle_add(raffle_b, "Flirt with the pretty lady.", 100);
    }
}

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
