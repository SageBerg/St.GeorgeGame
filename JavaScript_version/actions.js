"use strict";

var raffle = require("./raffle");
var items   = require("./items");

exports.actions = {

    //a

    "Annihilate everything.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "apocalypse", 1);
        return possible_outcomes;
    },

    "Ask about assassins.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "assassinated", 1);
        if (game_state.persons.olga.alive) {
            raffle.add(possible_outcomes, "meet_olga", 1000); //TODO fix prob
        }
        return possible_outcomes;
    },

    "Attack": function(game_state, possible_outcomes) {
        if (game_state.character.strength > 
            game_state.persons[game_state.character.person].attack) {
            raffle.add(possible_outcomes, "kill", 10000);
        } else {
            raffle.add(possible_outcomes, "lose_fight", 10000);
        }
        return possible_outcomes;
    },

    //b

    "BURN": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "burn", 3);
        raffle.add(possible_outcomes, "set_self_on_fire", 1);
        return possible_outcomes;
    },

    "Buy a drink.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "meet_blind_bartender", 10);
        return possible_outcomes;
    },

    "Buy a weapon.": function(game_state, possible_outcomes) {
        if (items.money_map[items.weapons_map[game_state.for_sell].cost].value 
            <= items.money_map[game_state.character.money].value) {
            raffle.add(possible_outcomes, "bought_a_weapon", 1);
        } else {
            raffle.add(possible_outcomes, "cannot_afford", 1);
        }
        return possible_outcomes;
    },

    //c

    "Chow down on your many colored mushroom.": 
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "start_tripping", 1);
        return possible_outcomes;
    },

    //d

    "Destroy all human civilizations.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "killed_by_hero", 1);
        return possible_outcomes;
    },

    //e
    
    //f

    "Flirt with": function(game_state, possible_outcomes) {
        if (game_state.persons[game_state.character.person].name === 
            "the pretty lady") {
            raffle.add(possible_outcomes, "rebuffed_by_olga", 1);
            raffle.add(possible_outcomes, "killed_by_olga", 1);
            raffle.add(possible_outcomes, "wowed_olga", 8);
        } else if (game_state.persons[game_state.character.person].name ===
                   "Olga") {
            if (game_state.character.place === "tavern") {
                raffle.add(possible_outcomes, "go_upstairs_with_olga", 9);
                raffle.add(possible_outcomes, "go_upstairs_and_die", 1);
            } else {
                raffle.add(possible_outcomes, "wowed_olga_upstairs", 1);
            }
        }
        return possible_outcomes;
    },

    //g
    
    //this special action interrupts your action when you're threatened and
    //you don't choose to fight or run away
    "GET_ATTACKED": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_attacked", 1);
        return possible_outcomes;
    },

    "Go mushroom picking.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "pick_many_colored_mushroom", 1);
        return possible_outcomes;
    },

    "Go flower picking.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_a_four-leaf_clover", 1);
        return possible_outcomes;
    },

    "Go on a rampage.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "starve", 1);
        return possible_outcomes;
    },

    "GO_TO": function(game_state, possible_outcomes, destination) {
        raffle.add(possible_outcomes, "go_to", 1);
        return possible_outcomes;
    },

    //h
    
    //i
    
    //j
    
    //k

    //l

    "Leave in a huff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "moved", 10);
        return possible_outcomes;
    },

    "Leave in a puff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "left_in_a_puff", 10000);
        return possible_outcomes;
    },

    "Lick the ground.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "distasteful", 1);
        if (game_state.character.place === "wizard_lab") {
            raffle.add(possible_outcomes, "monstrosity", 1);
        }
        return possible_outcomes;
    },

    "Look for a cat.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_a_cat", 10000);
        return possible_outcomes;
    },

    "Look for Olga.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_olga", 1);
        return possible_outcomes;
    },

    "Look for St. George.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_st_george", 5);
        raffle.add(possible_outcomes, "trip_over_a_cat", 1);
        return possible_outcomes;
    },

    "Look for a weapon.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_a_war_merchant", 10000);
        return possible_outcomes;
    },

    //m

    "MARRY": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "married", 1);
        return possible_outcomes;
    },

    //n
    
    //o
    
    //p

    "Pray to a higher power.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "assassin_prayer_answered", 1);
        raffle.add(possible_outcomes, "god_gives_you_a_wife", 1);
        raffle.add(possible_outcomes, "god_showers_you_with_gold", 1);
        raffle.add(possible_outcomes, "god_shows_you_the_way", 1);
        raffle.add(possible_outcomes, "god_tells_you_to_marry", 1);
        raffle.add(possible_outcomes, "god_tests_you", 1);
        raffle.add(possible_outcomes, "ignored", 1);

        if (game_state.places[game_state.character.place].burnable) {
            raffle.add(possible_outcomes, "god_commits_arson", 1);
        }

        if (game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "god_gives_you_jewels", 1);
        }

        if (game_state.places[game_state.character.place].town) {
            raffle.add(possible_outcomes, "st_george_joins_you_in_prayer", 1);
        }

        return possible_outcomes;
    },

    //q
    
    //r
    
    "Run like the Devil.": function(game_state, possible_outcomes) {
        if (game_state.character.is_threatened) {
            raffle.add(possible_outcomes, "escaped", 9);
            raffle.add(possible_outcomes, "caught", 1);
        } else if (game_state.character.person === "olga") {
            raffle.add(possible_outcomes, "escaped_unmarried", 1);
            raffle.add(possible_outcomes, "caught_by_olga", 1);
        }
        return possible_outcomes;
    },

    //s

    "Sing a song.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_cares", 1);
        if (game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "assassins_approach", 10);
        }
        if (game_state.character.place === "streets" || 
            game_state.character.place === "market" ||
            game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "earn_small_fortune_in_coins", 1);
        }
        return possible_outcomes;
    },

    //t

    "Terrorize the kingdom.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "killed_in_future", 1);
        return possible_outcomes;
    },

    //u

    //v
    
    //w
    
    //x

    //y

    //z
}
