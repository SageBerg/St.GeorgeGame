"use strict";

var raffle = require("./raffle");
var items   = require("./items");

function get_place(game_state) {
    return game_state.places[game_state.character.place];
}

function get_person(game_state) {
    return game_state.persons[game_state.character.person];
}

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

    "Dance a jig.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "dance_a_jig", 4);
        
        if (game_state.character.place !== "void" &&
            game_state.character.place !== "ocean") {
                raffle.add(possible_outcomes, "dance_and_die", 1);
            if (get_place(game_state).outside === true) {
                raffle.add(possible_outcomes, "dance_in_puddle", 1);
            }
        }

        if (game_state.character.place === "tavern" ||
            game_state.character.place === "lord_carlos_manor") {
            raffle.add(possible_outcomes, "assassins_notice_dance", 4);
        }

        if (game_state.character.place === "ocean") {
            raffle.add(possible_outcomes, "dance_and_drown", 1);
            raffle.add(possible_outcomes, "swim_a_jig", 1);
            raffle.add(possible_outcomes, "cannot_dance", 1);
        }

        if (game_state.character.place === "woods") {
            raffle.add(possible_outcomes, "dance_with_woodland_creatures", 12);
            raffle.add(possible_outcomes, "dance_with_goblins", 2);
        }

        if (game_state.character.place === "cave") {
            raffle.add(possible_outcomes, "dance_fails_to_cheer", 4);
            raffle.add(possible_outcomes, "dance_and_slip", 4);
        }

        if (game_state.character.place === "arctic") {
            raffle.add(possible_outcomes, "dance_and_freeze", 4);
        }

        if (game_state.character.place === "countryside" ||
            game_state.character.place === "lord_bartholomew_manor" ||
            get_place(game_state).town === true) {
            raffle.add(possible_outcomes, "dance_with_peasants", 2);
            raffle.add(possible_outcomes, "dance_for_coin", 2);
        }

        if (get_place(game_state).town === true) {
            raffle.add(possible_outcomes, "guards_stop_you_dancing", 2);
        }

        if (game_state.character.person === "mermaid") {
            raffle.add(possible_outcomes, "mermaid_likes_your_dance", 8000);
        }

        if (game_state.character.person !== null) {
            raffle.add(possible_outcomes, "not_impressed", 2);
        }

        return possible_outcomes;
    },

    "Destroy all human civilizations.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "killed_by_hero", 1);
        return possible_outcomes;
    },

    "Do some gambling.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "gambling_lose", 1);
        raffle.add(possible_outcomes, "gambling_win", 1);
        if (game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "gambling_die", 1);
            if (game_state.persons.olga.alive === true) {
                raffle.add(possible_outcomes, "gambling_lady", 1);
            }
        }
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

    "Go to sleep.": function(game_state, possible_outcomes, destination) {
        raffle.add(possible_outcomes, "wake_up", 4);
        raffle.add(possible_outcomes, "wake_up_dead", 1);

        if (get_place(game_state).locked === false) {
            raffle.add(possible_outcomes, "wake_up_somewhere_else", 1);
        }

        if (get_place(game_state).populated) {
            raffle.add(possible_outcomes, "wake_up_assassinated", 1);
            raffle.add(possible_outcomes, "wake_up_richer", 1);
            raffle.add(possible_outcomes, "wake_up_robbed", 1);
            raffle.add(possible_outcomes, "wake_up_with_cat", 1);
        }

        if (game_state.character.place === "lord_carlos_manor") {
            raffle.add(possible_outcomes, "wake_up_in_dungeon", 2);
        }

        if (game_state.character.place === "ocean") {
            raffle.add(possible_outcomes, "wake_up_drown", 100000);
        }

        if (game_state.character.place === "prison") {
            raffle.add(possible_outcomes, "wake_up_weasel", 2);
        }

        if (game_state.character.place === "tower") {
            raffle.add(possible_outcomes, "wake_up_in_prison", 2);
        }

        return possible_outcomes;
    },

    //h
    
    //i
    
    //j
    
    //k

    "Kill yourself in frustration.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "kill_self", 9);
        return possible_outcomes;
    },

    //l

    "Leave in a huff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "moved", 10);
        return possible_outcomes;
    },

    "Leave in a puff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "left_in_a_puff", 10000);
        return possible_outcomes;
    },

    "Leer at women.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "leer_at_cat", 1);
        raffle.add(possible_outcomes, "leer_and_get_assassinated", 1);
        raffle.add(possible_outcomes, "leer_at_women", 4);
        return possible_outcomes;
    },

    "Lick the ground.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "distasteful", 5);
        raffle.add(possible_outcomes, "infection", 1);

        if (get_place(game_state).town) {
            raffle.add(possible_outcomes, "guards_stop_you_licking", 6);
        }

        if (game_state.character.place === "arctic") {
            raffle.add(possible_outcomes, "ground_tastes_cold", 6);
        }

        if (game_state.character.place === "ocean") {
            raffle.add(possible_outcomes, "lick_the_ocean", 100000);
        }

        if (game_state.character.place === "wizard_lab") {
            raffle.add(possible_outcomes, "monstrosity", 6);
        }

        return possible_outcomes;
    },

    "Look for a cat.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_a_cat", 1);
        return possible_outcomes;
    },

    "Look for a weapon.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_a_war_merchant", 1);
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
        raffle.add(possible_outcomes, "ignored", 2);

        if (game_state.places[game_state.character.place].burnable) {
            raffle.add(possible_outcomes, "god_commits_arson", 2);
        }

        if (game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "god_gives_you_jewels", 2);
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
            if (game_state.persons[game_state.character.person].prefered_attack
                === "arrest") {
                raffle.add(possible_outcomes, "caught_and_arrested", 1);
            } else {
                raffle.add(possible_outcomes, "caught", 1);
            }
        } else if (game_state.character.person === "olga") {
            raffle.add(possible_outcomes, "escaped_unmarried", 1);
            raffle.add(possible_outcomes, "caught_by_olga", 1);
        }
        return possible_outcomes;
    },

    //s

    "Sing a song.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_cares", 2);
        raffle.add(possible_outcomes, "sing_about_lords", 1);

        if (game_state.character.place === "streets" || 
            game_state.character.place === "market") {
            raffle.add(possible_outcomes, "guards_stop_you_singing", 2);
        }

        if (game_state.character.place === "streets" || 
            game_state.character.place === "market" ||
            game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "earn_small_fortune_in_coins", 2);
            raffle.add(possible_outcomes, "crowd_hates_your_voice", 1);
        }

        if (get_place(game_state).town) {
            raffle.add(possible_outcomes, "cannot_hear_assassin", 1);
        }

        if (game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "assassins_approach", 10);
        }

        if (game_state.character.place === "church") {
            raffle.add(possible_outcomes, "priestess_takes_offense", 10);
        }

        if (game_state.character.place === "docks") {
            raffle.add(possible_outcomes, "pirates_ruin_song", 10);
        }

        if (game_state.character.place === "mermaid_rock" &&
            game_state.character.person !== "mermaid") {
            raffle.add(possible_outcomes, "sing_to_greeks", 10);
        }

        if (game_state.character.place === "lord_carlos_manor") {
            raffle.add(possible_outcomes, "sing_at_lord_carlos_manor", 10);
        }

        if (get_place(game_state).locked === false) {
            raffle.add(possible_outcomes, "wander_while_singing", 1);
        }

        if (game_state.character.person === "wizard") {
            raffle.add(possible_outcomes, "wizard_complains", 10);
        }

        if (game_state.character.person === "mermaid") {
            raffle.add(possible_outcomes, "sing_to_mermaid", 10);
            raffle.add(possible_outcomes, "mermaid_dislikes_your_song", 5);
        }

        if (game_state.character.person === "olga" && 
            get_person(game_state).name === "Olga") {
            raffle.add(possible_outcomes, "sing_to_olga", 100);
        }

        if (game_state.character.person !== null) {
            raffle.add(possible_outcomes, "not_impressed", 1);
        }

        return possible_outcomes;
    },

    //t

    "Terrorize the kingdom.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "killed_in_future", 1);
        return possible_outcomes;
    },

    "Think.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "think_about_sex", 1);
        raffle.add(possible_outcomes, "think_elaborate_scheme", 1);
        raffle.add(possible_outcomes, "think_four_ideas", 1);
        raffle.add(possible_outcomes, "think_get_lost", 1);
        raffle.add(possible_outcomes, "think_reevaluate_life", 1);
        raffle.add(possible_outcomes, "think_think_think", 1);

        if (game_state.character.place !== "tavern") {
            raffle.add(possible_outcomes, "think_about_olga", 1);
        }

        if (game_state.character.place === "lord_carlos_manor" ||
            game_state.character.place === "wizard_lab") {
            raffle.add(possible_outcomes, "think_you_shouldnt_be_here", 1);
        }

        if (game_state.character.place === "tavern" ||
            game_state.character.place === "dark_alley" ||
            game_state.character.place === "lord_carlos_manor") {
            raffle.add(possible_outcomes, "think_of_getting_stabbed", 2);
        }
      
        if (game_state.character.place === "docks" ||
            game_state.character.place === "pirate_ship") {
            raffle.add(possible_outcomes, "think_pirates_laugh", 2);
        }

        if (game_state.character.place === "docks" ||
            game_state.character.place === "pirate_ship" ||
            game_state.character.place === "ocean" ||
            game_state.character.place === "mermaid_rock"
           ) {
            raffle.add(possible_outcomes, "think_ocean_is_big", 2);
            raffle.add(possible_outcomes, "think_bad_smell", 2);
        }

        if (game_state.character.place === "docks" &&
            game_state.persons.lord_arthur.alive) {
            raffle.add(possible_outcomes, "think_about_lord_arthur", 2);
        }

        if (game_state.character.place === "tower") {
            raffle.add(possible_outcomes, "think_ax", 2);
            raffle.add(possible_outcomes, "think_jump", 2);
        }

        if (game_state.character.place === "countryside") {
            raffle.add(possible_outcomes, "think_about_lord_bartholomew", 2);
            raffle.add(possible_outcomes, "think_peasant_women", 2);
        }

        if (game_state.character.place === "woods") {
            raffle.add(possible_outcomes, "think_fire", 2);
        }

        if (game_state.character.place === "arctic") {
            raffle.add(possible_outcomes, "think_ice", 2);
            raffle.add(possible_outcomes, "think_cold", 2);
        }

        if (game_state.character.place === "cave") {
            raffle.add(possible_outcomes, "think_bats", 2);
            raffle.add(possible_outcomes, "think_darkness", 2);
            raffle.add(possible_outcomes, "think_death", 2);
            raffle.add(possible_outcomes, "think_suffocation", 2);
        }

        if (game_state.character.place === "church") {
            raffle.add(possible_outcomes, "think_meaning_of_life", 2);
        }

        if (game_state.character.person !== null) {
            raffle.add(possible_outcomes, "zone_out", 4);
        }

        return possible_outcomes;
    },

    //u

    //v
    
    //w
    
    //x

    //y

    //z
}
