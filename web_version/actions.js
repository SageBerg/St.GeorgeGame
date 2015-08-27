"use strict";

var persons = require("./persons");
var places  = require("./places");

exports.actions = {
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
         "character_edits": {"person": persons.persons.assassins, "threatened": true},
         "game_state_edits": {"person": persons.persons.assassins},
        },
    "find_a_pretty_lady":
        {"message":
            "During your investigation, you find yourself talking to a " +
            "pretty lady.",
         "game_state_edits": {"person": persons.persons.olga},
        },
    "no_one_wants_to_talk":
        {"message":
            "No one wants to talk to you.",
            //add kill yourself in frustration
        },
    "bartender_grumbles":
        {"message":
            "The blind bartender grumbles as a he passes you a drink.",
         "game_state_edits": {"person": persons.persons.blind_bartender},
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

