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

//outcome ids map to outcome objects
persons = {
    "assassin":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "an assassin",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "female", 
    },
    "assassins":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "some assassins",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "group", 
    },
    "black_market_merchant":
    {
        "alive": true,
        "attack": 4,
        "attracted": 0,
        "name": "a merchant of ill repute",
        "prefered_attack": "kill",
        "sells": ["deep_cave_newt", "love_potion", "many_colored_mushroom", 
                  "white_mushroom", "black_mushroom", "fire_proof_cloak",
                  "strength_potion"],
        "type": "female",
    },
    "blind_bartender":
    {
        "alive": true,
        "attack": 1,
        "attracted": 0,
        "name": "the blind bartender",
        "prefered_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "eve":
    {
        "alive": true,
        "attack": 4,
        "attracted": 1,
        "name": "Lord Carlos' daughter",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "female", 
    },
    "felicity":
    {
        "alive": true,
        "attack": 4,
        "attracted": 1,
        "name": "the fat lady",
        "prefered_attack": "kill",
        "sells": [],
        "type": "female", 
    },
    "guards":
    {
        "alive": true,
        "attack": 4,
        "attracted": 0,
        "name": "the guards",
        "prefered_attack": "arrest",
        "sells": [],
        "type": "group", 
    },
    "lord_arthur":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "Lord Arthur",
        "prefered_attack": "walk_the_plank",
        "sells": [],
        "type": "male", 
    },
    "lord_bartholomew":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "Lord Bartholomew",
        "prefered_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "lord_carlos":
    {
        "alive": true,
        "attack": 5,
        "attracted": 0,
        "name": "Lord Carlos",
        "prefered_attack": "assassinate",
        "sells": [],
        "type": "male", 
    },
    "lord_daniel":
    {
        "alive": true,
        "attack": 8,
        "attracted": 0,
        "name": "Lord Daniel",
        "prefered_attack": "arrest",
        "sells": [],
        "type": "male",
    },
    "merchant":
    {
        "alive": true,
        "attack": 3,
        "attracted": 0,
        "name": "the merchant woman",
        "prefered_attack": "drown",
        "sells": ["ax", "flowers", "sailor_peg", "pearl", "fish"],
        "type": "female",
    },
    "mermaid":
    {
        "alive": true,
        "attack": 3,
        "attracted": 1,
        "name": "the mermaid",
        "prefered_attack": "drown",
        "sells": [],
        "type": "female", 
    },
    "mob":
    {
        "alive": true,
        "attack": 9,
        "attracted": 0,
        "name": "the angry mob",
        "prefered_attack": "burn",
        "sells": [],
        "type": "group", 
    },
    "nymph_queen":
    {
        "alive": true,
        "attack": 10,
        "attracted": 1,
        "name": "the nymph queen",
        "prefered_attack": "hex",
        "sells": [],
        "type": "female", 
    },
    "olga":
    {
        "alive": true,
        "attack": 1,
        "attracted": 1,
        "name": "the pretty lady",
        "prefered_attack": "kill",
        "sells": [],
        "type": "female", 
    },
    "other_lunatics":
    {
        "alive": true,
        "attack": -1,
        "attracted": 0,
        "name": "the other lunatics",
        "prefered_attack": "kill",
        "sells": [],
        "type": "group", 
    },
    "peasant_lass":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the peasant lass",
        "prefered_attack": "kill",
        "sells": ["many_colored_mushroom", "white_mushroom"],
        "type": "female", 
    },
    "pirates":
    {
        "alive": true,
        "attack": 6,
        "attracted": 0,
        "name": "the pirates",
        "prefered_attack": "kill",
        "type": "group", 
    },
    "simple_peasant":
    {
        "alive": true,
        "attack": -1,
        "attracted": 0,
        "name": "the simple peasant",
        "prefered_attack": "kill",
        "sells": [],
        "type": "male", 
    },
    "st_george":
    {
        "alive": true,
        "attack": 100,
        "attracted": 0,
        "name": "St. George",
        "prefered_attack": "smite",
        "sells": [],
        "type": "male", 
    },
    "war_merchant":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the wealthy war merchant",
        "prefered_attack": "kill",
        "sells": ["dagger", "poison_dagger", "cutlass", "jeweled_cutlass", 
                  "hammer", "iron_hammer"],
        "type": "male", 
    },
    "witch":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the witch",
        "prefered_attack": "toad",
        "sells": ["love_potion", "tail_potion", "strength_potion"],
        "type": "female", 
    },
    "wizard":
    {
        "alive": true,
        "attack": 7,
        "attracted": 0,
        "name": "the wizard",
        "prefered_attack": "toad",
        "sells": [],
        "type": "male", 
    },
};

places = {
    "arctic": 
    {
        "burnable":  false,
        "links":     ["ocean"],
        "locked":    false,
        "name":      "the Arctic",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "cave": 
    {
        "burnable":  false,
        "links":     ["ocean"],
        "locked":    true,
        "name":      "a dark cave",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "church": 
    {
        "burnable":  true,
        "links":     ["market", "streets"],
        "locked":    false,
        "name":      "the church",
        "outside":   false,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "countryside": 
    {
        "burnable":  false,
        "links":     ["lord_bartholomew_manor", "streets", "woods"],
        "locked":    false,
        "name":      "the countryside",
        "outside":   true,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "dark_alley": 
    {
        "burnable":  false,
        "links":     ["streets"],
        "locked":    false,
        "name":      "a dark alley",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "docks": 
    {
        "burnable":  false,
        "links":     ["market", "ocean", "streets", "woods"],
        "locked":    false,
        "name":      "the docks",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "lord_bartholomew_manor": 
    {
        "burnable":  true,
        "links":     ["countryside"],
        "locked":    false,
        "name":      "Lord Bartholomew's Manor",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "lord_carlos_manor": 
    {
        "burnable":  true,
        "links":     ["woods"],
        "locked":    false,
        "name":      "Lord Carlos' Manor",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": true,
    },
    "market": 
    {
        "burnable":  true,
        "links":     ["church", "streets", "docks", "wizard_lab"],
        "locked":    false,
        "name":      "the market",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": true,
    },
    "mermaid_rock":
    {
        "burnable":  false,
        "links":     ["ocean"],
        "locked":    false,
        "name":      "the docks",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "ocean": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the ocean",
        "outside":   true,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "pirate_ship": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "Lord Arthur's Pirate Ship",
        "outside":   true,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "prison": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the docks",
        "outside":   false,
        "populated": true,
        "town":      false,
        "trashable": false,
    },
    "streets": 
    {
        "burnable":  false,
        "links":     ["church", "countryside", "market", "tavern", "tower"],
        "locked":    false,
        "name":      "the streets",
        "outside":   true,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "tavern": 
    {
        "burnable":  true,
        "links":     ["streets"],
        "locked":    false,
        "name":      "the tavern",
        "outside":   false,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "tower": 
    {
        "burnable":  true,
        "links":     ["streets"],
        "locked":    false,
        "name":      "the tower",
        "outside":   false,
        "populated": true,
        "town":      true,
        "trashable": false,
    },
    "upstairs": 
    {
        "burnable":  false,
        "links":     ["tavern"],
        "locked":    false,
        "name":      "the docks",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": true,
    },
    "void": 
    {
        "burnable":  false,
        "links":     [],
        "locked":    true,
        "name":      "the void",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": false,
    },
    "wizard_lab": 
    {
        "burnable":  true,
        "links":     ["market"],
        "locked":    false,
        "name":      "the wizard's lab",
        "outside":   false,
        "populated": false,
        "town":      false,
        "trashable": true,
    },
    "woods": 
    {
        "burnable":  true,
        "links":     ["countryside", "lord_carlos_manor", "ocean", "docks"],
        "locked":    false,
        "name":      "the woods",
        "outside":   true,
        "populated": false,
        "town":      false, 
        "trashable": false,
    },
};

actions = {
    "assassinated_in_tavern": 
        {"dead": true, 
         "message": 
             "The first person you meet turns out to be an assassin. " +
             "She assassinates you.",
        },
    "assassins_notice_singing":
        {"message":
            "Some men in dark cloaks notice your singing and start edging " +
            "towards you.",
         "character_edits": {"person": persons.assassins, "threatened": true},
         "game_state_edits": {"person": persons.assassins},
        },
    "find_a_pretty_lady":
        {"message":
            "During your investigation, you find yourself talking to a " +
            "pretty lady.",
         "game_state_edits": {"person": persons.olga},
        },
    "no_one_wants_to_talk":
        {"message":
            "No one wants to talk to you.",
            //add kill yourself in frustration
        },
    "bartender_grumbles":
        {"message":
            "The blind bartender grumbles as a he passes you a drink.",
         "game_state_edits": {"person": persons.blind_bartender},
        },
    "random_move":
        {"message":
            "",
         "moved": true,
        },
    "you_get_killed": 
        {"dead": true, 
         "message": 
             "You get killed.",
        },
    "you_kill": 
        {
         "message": 
             "You kill",
         "game_state_edits": {"person": ""},
        },
};

// Functions

function action_handler(req, res) {
    if (strip_action(req.body.action) === "Play again.") {
        res.json({"reload": true});
        return;
    }
    var client_action = strip_action(req.body.action);
    var outcome_raffle = get_possible_outcomes_of_action(req.body.game_state, 
                                                         client_action);
    var outcome_id = raffle_get(outcome_raffle);
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
    res.json(outcome);
}

function complete_message_based_on_context(outcome) {
    if (outcome.message === "You kill") {
        outcome.message += " " + outcome.game_state.person.name + ".";
        outcome.game_state.person.alive = false;
    }
}

function make_game_state_edits(game_state, game_state_edits) {
    for (key in game_state_edits) {
        if (key === "person") {
            game_state.person = game_state_edits.person;
        }
    }
}

function make_character_edits(game_state, character_edits) {
    for (key in character_edits) {
        if (key === "person") {
            game_state.character.person = character_edits.person;
        }
        if (key === "threatened") {
            game_state.character.threatened = character_edits.threatened;
        }
    }
}

function strip_action(string) {
    return string.trim().slice(3, string.trim().length);
}

function create_outcome_template() {
    return {"character_edits": {},
            "dead": false,
            "game_state": {},
            "game_state_edits": {},
            "found_love": false,
            "message": "error: (you shouldn't be seeing this message)",
            "moved": false,
            "options": {"a": "", "b": "", "c": "", "d": "", "e": "",},
            "redload": false, //factor this out
           };
}

function get_outcome(game_state, outcome_id) {
    outcome = create_outcome_template();
    for (key in actions[outcome_id]) {
        outcome[key] = actions[outcome_id][key];        
    }
    outcome.game_state = game_state;
    complete_message_based_on_context(outcome);
    make_game_state_edits(outcome.game_state, outcome.game_state_edits);
    make_character_edits(outcome.game_state, outcome.character_edits);
    return outcome;
}

function fight(game_state, raffle) {
    if (game_state.character.attack_strength > game_state.person.attack) {
        raffle_add(raffle, "you_kill", 1);
    } else {
        raffle_add(raffle, "you_get_killed", 1);
    }
}

function get_possible_outcomes_of_action(game_state, action) { 
    raffle = {};
    if (action.split(" ")[0] === "Attack" || 
        game_state.character.threatened === true &&
        action !== "Run like the Devil." &&
        action !== "Waddle like God." && 
        action !== "Leave in a puff.") {
        fight(game_state, raffle);
    }

    if (action === "Ask about assassins.") {
        //raffle_add(raffle, "assassinated_in_tavern", 5);
        raffle_add(raffle, "no_one_wants_to_talk", 5);
        //raffle_add(raffle, "find_a_pretty_lady", 5);
    }
    if (action === "Buy a drink.") {
        raffle_add(raffle, "bartender_grumbles", 5);
    }
    if (action === "Leave in a huff.") {
        raffle_add(raffle, "random_move", 1);
        game_state.place = 
            places[game_state.place].links[
                randint(places[game_state.place].links.length)];
    }
    if (action === "Sing a song.") {
        if (game_state.place === "tavern") {
            raffle_add(raffle, "assassins_notice_singing", 1);
        }
    }
    return raffle;
}

function randint(n) {
    return Math.floor(Math.random() * n);
}

function get_player_options(outcome) {
    var a = {}, b = {}, c = {}, d = {};
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
    //raffle_add(raffle_c, "Go to sleep.", 1);
    if (places[game_state.place].links.length > 0) {
        //raffle_add(raffle_c, 
        //           "Go to " + get_adjacent_place(game_state.place) + ".", 10);
        raffle_add(raffle_c, "Leave in a huff.", 1);
    }
    //raffle_add(raffle_c, "Leave in a puff.", 1);
    raffle_add(raffle_d, "Sing a song.", 1);
    raffle_add(raffle_d, "Dance a jig.", 1);
}

function get_adjacent_place(place) {
    raffle = {};
    for (i in place.links) {
        raffle_add(raffle, places[place.links[i]].name, 1);
    }
    return raffle_get(raffle);
}

function get_outcome_player_options(message, raffle_a, raffle_b, 
                                             raffle_c, raffle_d) {
}

function get_place_player_options(game_state, raffle_a, raffle_b, 
                                              raffle_c, raffle_d) {
    if (game_state.place === "the tavern") {
        raffle_add(raffle_a, "Ask about assassins.", 1);
        raffle_add(raffle_b, "Buy a drink.", 2);
        raffle_add(raffle_d, "Do some gambling.", 2);
    }
}

function get_npc_player_options(npc, raffle_a, raffle_b, 
                                     raffle_c, raffle_d) {
    if (npc !== null && npc !== "") {
        raffle_add(raffle_a, "Attack " + get_her_him_or_them(npc) + ".", 10);
    }
    if (npc.name === "pretty_lady") {
        raffle_add(raffle_b, "Flirt with the pretty lady.", 100);
    }
}

function get_her_him_or_them(npc) {
    switch (npc.type) {
        case "female":
            return "her";
        case "group":
            return "them";
        case "male":
            return "him";
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
