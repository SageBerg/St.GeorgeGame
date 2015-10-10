"use strict";

var functions = require("./functions");
var items     = require("./items");
var raffle    = require("./raffle");

exports.actions = {

    //a

    "A3.": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "lord_bartholomew":
                raffle.add(possible_outcomes, "stupid_move_and_lose", 1);
                break;
            case "lord_carlos":
                raffle.add(possible_outcomes, "stupid_move_and_die", 4);
                raffle.add(possible_outcomes, "stupid_move_and_win", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Admire your jewels.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "admire_jewels", 2);
        raffle.add(possible_outcomes, "admire_jewels_and_die", 1);
        raffle.add(possible_outcomes, "find_pearl_in_jewels", 1);
        if (game_state.places[game_state.character.place].town === true) {
            raffle.add(possible_outcomes, "guards_stop_you_naked", 1);
        }
        return possible_outcomes;
    },

    "Anna.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "anna_death", 1);
        return possible_outcomes;
    },

    "Annihilate everything.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "apocalypse", 1);
        return possible_outcomes;
    },

    "Challenge them to an arm wrestling match to reclaim your dignity.":
        function(game_state, possible_outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "arm_wrestle_and_impressment", 1);
        }
        raffle.add(possible_outcomes, "arm_wrestle_pirates", 1);
        raffle.add(possible_outcomes, "arm_wrestle_pirates_ocean", 1);
        return possible_outcomes;
    },

    "Ask about assassins.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "assassinated", 1);
        if (game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "no_one_wants_to_talk", 2);
            if (game_state.persons.olga.alive === true) {
                raffle.add(possible_outcomes, "meet_olga", 1);
            }
        }
        if (game_state.character.place === "lord_carlos_manor") {
            raffle.add(possible_outcomes, "wait_here_please", 3);
            raffle.add(possible_outcomes, "ask_eve", 1);
        }
        return possible_outcomes;
    },

    "Ask for a draw.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "enrage_lord_carlos", 1);
        raffle.add(possible_outcomes, "enrage_lord_carlos_and_die", 1);
        return possible_outcomes;
    },

    "Ask for an audience with Lord Bartholomew.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, 
            "denied_audience_with_lord_bartholomew", 1);
        raffle.add(possible_outcomes, "audience_with_lord_bartholomew", 2);
        return possible_outcomes;
    },

    "Ask for an audience with Lord Daniel.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "denied_audience_with_lord_daniel", 1);
        raffle.add(possible_outcomes, "audience_with_lord_daniel", 1);
        return possible_outcomes;
    },

    "Ask for asylum.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_asylum_and_win", 1);
        raffle.add(possible_outcomes, "get_asylum_and_get_arrested", 1);
        return possible_outcomes;
    },

    "Ask for directions.": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "peasant_lass":
                raffle.add(possible_outcomes, "directions_peasant_lass", 1);
                raffle.add(possible_outcomes, "directions_to_manor", 1);
                raffle.add(possible_outcomes, "directions_to_town", 1);
                raffle.add(possible_outcomes, "directions_to_woods", 1);
                break;
            case "simple_peasant":
                raffle.add(possible_outcomes, "directions_simple_peasant", 2);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Ask the witch to brew you a potion.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "witch_says_no", 1);
        if (game_state.character.items["ball of sap"] > 0 &&
            game_state.character.items["bouquet of flowers"] > 0 &&
            game_state.character.items["many-colored mushroom"] > 0) {
            raffle.add(possible_outcomes, "witch_makes_potion_love", 5);
        }
        if (game_state.character.items["cat"] > 0 &&
            game_state.character.items["pearl"] > 0) {
            raffle.add(possible_outcomes, "witch_makes_potion_tail_growth", 5);
        }
        if (game_state.character.items["deep-cave newt"] > 0 &&
            game_state.character.items["white mushroom"] > 0) {
            raffle.add(possible_outcomes, "witch_makes_potion_strength", 5);
        }
        return possible_outcomes;
    },

    "Ask the mermaid to take you back to land.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "mermaid_gives_you_fish", 1);
        raffle.add(possible_outcomes, "mermaid_refuses", 1);
        raffle.add(possible_outcomes, "mermaid_strands_you", 1);
        raffle.add(possible_outcomes, "mermaid_takes_you_back_to_land", 1);
        return possible_outcomes;
    },
 
    "ATTACK": function(game_state, possible_outcomes) {
        var weapon_bonus = 0; 
        if (game_state.character.equipped_weapon !== "") {
            weapon_bonus = items.weapons_map[
                game_state.character.equipped_weapon
            ].attack;
        }
        if (game_state.character.strength + weapon_bonus > 
            game_state.persons[game_state.character.person].attack) {
            raffle.add(possible_outcomes, "kill", 1);
        } else {
            raffle.add(possible_outcomes, "lose_fight", 1);
        }
        return possible_outcomes;
    },
             
    //b

    "Beg for money.": function(game_state, possible_outcomes) {
        game_state.outcome === "st_george_gives_you_money" 
            ?
        raffle.add(possible_outcomes, "st_george_kills_you", 1)
            :
        raffle.add(possible_outcomes, "st_george_gives_you_money", 1);
        return possible_outcomes;
    },

    "Beth.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "beth_death", 1);
        return possible_outcomes;
    },

    "Bide your time.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "bide_your_time", 3);
        raffle.add(possible_outcomes, "bide_your_time_and_die", 1);
        raffle.add(possible_outcomes, "bide_your_time_and_escape", 1);
        raffle.add(possible_outcomes, "notice_pattern", 1);
        dead_lunatic_repercussions(game_state, possible_outcomes);
        if (game_state.character.person !== "other_lunatics" &&
            game_state.persons.other_lunatics.alive === true) {
            raffle.add(possible_outcomes, "more_lunatics", 3);
        } else {
            raffle.add(possible_outcomes, "lunatics_laugh_at_you", 1);
        }
        return possible_outcomes;
    },

    "Blow her off.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "felicity_gone", 1);
        return possible_outcomes;
    },

    "Boast of your bravery.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "not_impressed", 1);
        switch (game_state.character.person) {
            case "blind_bartender":
                raffle.add(possible_outcomes, "annoy_blind_bartender", 3);
                break;
            case "eve":
                raffle.add(possible_outcomes, "annoy_eve", 3);
                break;
            case "lord_arthur":
                raffle.add(possible_outcomes, "impress_lord_arthur_brave", 3);
                break;
            case "olga":
                raffle.add(possible_outcomes, "annoy_olga", 2);
                raffle.add(possible_outcomes, "impress_olga", 1);
                break;
            case "simple_peasant":
                raffle.add(possible_outcomes, "annoy_simple_peasant", 1);
                raffle.add(possible_outcomes, "impress_simple_peasant", 2);
                break;
            case "st_george":
                raffle.add(possible_outcomes, "annoy_st_george", 3);
                raffle.add(possible_outcomes, "annoy_st_george_and_die", 2);
                raffle.add(possible_outcomes, "boast_and_get_money", 1);
                break;
            case "wizard":
                raffle.add(possible_outcomes, "annoy_wizard", 3);
        }
        return possible_outcomes;
    },

    "Build an igloo.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cannot_build_igloo", 1);
        if (game_state.character.items["seal carcass"] >= 1) {
            raffle.add(possible_outcomes, "eat_seal_in_igloo", 20);
        } else if (game_state.character.items["fish"] >= 3) {
            raffle.add(possible_outcomes, "eat_fish_in_igloo", 20);
        }else { 
            raffle.add(possible_outcomes, "starve_in_igloo", 1);
        }
        return possible_outcomes;
    },

    "BURN": function(game_state, possible_outcomes) {
        // people will stop you from burning things if you're interacting 
        // with them, except for the blind bartender, since he's blind
        if (game_state.character.person === null ||
            game_state.character.person === "blind_bartender") {
            raffle.add(possible_outcomes, "burn", 5);
            if (game_state.character.items["fancy red cloak"] < 1) {
                raffle.add(possible_outcomes, "set_self_on_fire", 1);
            }
        } else {
            raffle.add(possible_outcomes, "burn", 1);
            raffle.add(possible_outcomes, "someone_stops_you_burning", 1);
        }
        return possible_outcomes;
    },

    "Buy a drink.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "assassins_sit_down", 1);
        raffle.add(possible_outcomes, "buy_a_drink_and_die", 1);
        raffle.add(possible_outcomes, "buy_a_drink_and_meet_olga", 2);
        if (game_state.character.person !== "blind_bartender" &&
            game_state.persons.blind_bartender.alive === true) {
            raffle.add(possible_outcomes, "meet_blind_bartender", 6);
        }
        raffle.add(possible_outcomes, "overhear_stuff", 2);
        return possible_outcomes;
    },

    "BUY_ITEM": function(game_state, possible_outcomes, destination) {
        if (game_state.character.money !== "none") { 
            raffle.add(possible_outcomes, "buy_an_item", 1);
        } else {
            raffle.add(possible_outcomes, "cannot_afford", 1);
        }
        return possible_outcomes;
    },

    "BUY_WEAPON": function(game_state, possible_outcomes) {
        if (items.money_map[items.weapons_map[game_state.for_sell].cost].value 
            <= items.money_map[game_state.character.money].value) {
            raffle.add(possible_outcomes, "buy_a_weapon", 1);
        } else {
            raffle.add(possible_outcomes, "cannot_afford", 1);
        }
        return possible_outcomes;
    },

    //c

    "Cass.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cass_answer", 1);
        return possible_outcomes;
    },

    "Celebrate your success.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "celebrate", 2);
        raffle.add(possible_outcomes, "celebrate_uncreatively", 1);
        if (game_state.places[game_state.character.place].burnable === true) {
            raffle.add(possible_outcomes, "burn", 2);
        }
        if (game_state.places[game_state.character.place].town === true) {
            raffle.add(possible_outcomes, "celebrate_at_brothel", 1);
            if (game_state.places.market.burnable === true) {
                raffle.add(possible_outcomes, "celebrate_at_market", 1);
            }
            if (game_state.character.money !== "none") {
                raffle.add(possible_outcomes, "make_it_rain", 1);
            }
        }
        if (game_state.character.place === "tavern") {
            if (game_state.persons.lord_arthur.alive === true) {
                raffle.add(possible_outcomes,
                    "black_out_and_become_pirate", 1);
            }
            raffle.add(possible_outcomes, "black_out_and_die", 1);
            raffle.add(possible_outcomes, "black_out_and_move", 1);
            raffle.add(possible_outcomes, "black_out_and_win", 1);
        }
        return possible_outcomes;
    },

    "Challenge Lord Bartholomew to a game of chess.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "lord_bartholomew_chess", 1);
        return possible_outcomes;
    },

    "Challenge Lord Carlos to a game of chess.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "lord_carlos_chess", 1);
        return possible_outcomes;
    },

    "Challenge the pirates to a game of chess.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "chess_cutlass", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "chess_impressment", 1);
        }
        raffle.add(possible_outcomes, "chess_lose_to_pirates", 1);
        return possible_outcomes;
    },

    "Chat with the blind bartender.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "chat_with_blind_bartender", 15);
        raffle.add(possible_outcomes, "chat_with_blind_bartender_and_die", 1);
        return possible_outcomes;
    },

    "Chat with Lord Bartholomew.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "chat_with_lord_bartholomew", 1);
        return possible_outcomes;
    },

    "Choke on fumes.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "choke_on_fumes", 1);
        raffle.add(possible_outcomes, "choke_on_fumes_and_die", 1);
        raffle.add(possible_outcomes, "choke_and_saved_by_blue_dragon", 1);
        return possible_outcomes;
    },

    "Chop down a tree with your ax.": 
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "chop_down_tree", 2);
        raffle.add(possible_outcomes, "chop_down_tree_and_die", 2);
        raffle.add(possible_outcomes, "get_sap", 2);
        raffle.add(possible_outcomes, "lose_ax", 1);
        return possible_outcomes;
    },

    "Chow down on your black mushroom.":
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "mushroom_kills_you", 1);
        return possible_outcomes;
    },

    "Chow down on your many-colored mushroom.":
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "start_tripping", 1);
        return possible_outcomes;
    },

    "Chow down on your white mushroom.":
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "mushroom_makes_you_bigger", 1);
        if (game_state.character.place === "countryside" ||
            game_state.character.place === "woods") {
            raffle.add(possible_outcomes, "mushroom_makes_you_smaller", 1);
        }
        return possible_outcomes;
    },

    "Chow down on your yellow mushroom.":
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "mushroom_tastes_bad", 1);
        return possible_outcomes;
    },

    "Climb into the crow's nest.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "climb_and_die", 2);
        raffle.add(possible_outcomes, "climb_and_get_sap", 1);
        raffle.add(possible_outcomes, "merchant_ship_nest", 1);
        raffle.add(possible_outcomes, "watch_duty", 4);
        return possible_outcomes;
    },

    "Climb to the top of the volcano.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "volcano_die", 3);
        raffle.add(possible_outcomes, "volcano_exercise", 2);
        raffle.add(possible_outcomes, "volcano_nothing", 2);
        return possible_outcomes;
    },

    "Climb up the top sails.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "lose_peg", 1);
        return possible_outcomes;
    },

    "Club a seal.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "club_a_seal", 2);
        raffle.add(possible_outcomes, "die_waiting_for_seal", 2);
        raffle.add(possible_outcomes, "waiting_for_seal", 2);
        return possible_outcomes;
    },

    "Complain about unfair imprisonment.":
        function(game_state, possible_outcomes) {
        if (game_state.character.person === "lord_daniel") {
            raffle.add(possible_outcomes, "lord_daniel_throws_you_out", 1);
            raffle.add(possible_outcomes, "lord_daniel_lectures_you", 2);
        } else {
            raffle.add(possible_outcomes, "complaining_is_useless", 2);
            raffle.add(possible_outcomes, "guards_argue_with_you", 2);
            raffle.add(possible_outcomes, "guards_stop_you_complaining", 4);
        }
        return possible_outcomes;
    },

    "Continue being a shrub.": 
    function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "be_shrub", 8);
        raffle.add(possible_outcomes, "be_shrub_and_die", 3);
        raffle.add(possible_outcomes, "saved_by_witch", 2);
        return possible_outcomes;
    },

    "Croak.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "croak", 4);
        raffle.add(possible_outcomes, "attract_lady_frog", 1);
        return possible_outcomes;
    },

    //d

    "Dance a jig.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "dance_a_jig", 4);
        
        if (game_state.character.place !== "void" &&
            game_state.character.place !== "ocean") {
                raffle.add(possible_outcomes, "dance_and_die", 1);
            if (functions.get_place(game_state).outside === true) {
                raffle.add(possible_outcomes, "dance_in_puddle", 1);
            }
        }

        if ((game_state.character.place === "tavern" && 
             game_state.places.tavern.burnable === true) || 
            (game_state.character.place === "lord_carlos_manor" &&
             game_state.places.lord_carlos_manor.burnable === true)) {
            raffle.add(possible_outcomes, "assassins_notice_dance", 4);
        }

        if (game_state.character.place === "ocean") {
            raffle.add(possible_outcomes, "dance_and_drown", 1);
            raffle.add(possible_outcomes, "swim_a_jig", 1);
            raffle.add(possible_outcomes, "cannot_dance", 1);
        }

        if (game_state.character.place === "woods" &&
            game_state.places.woods.burnable === true) {
            raffle.add(possible_outcomes, 
                "dance_with_woodland_creatures", 12);
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
            functions.get_place(game_state).town === true) {
            raffle.add(possible_outcomes, "dance_with_peasants", 2);
            raffle.add(possible_outcomes, "dance_for_coin", 2);
        }

        if (functions.get_place(game_state).town === true) {
            raffle.add(possible_outcomes, "guards_stop_you_dancing", 2);
        }

        if (game_state.character.person === "mermaid") {
            raffle.add(possible_outcomes, "mermaid_likes_your_dance", 8);
        }

        if (game_state.character.person !== null) {
            raffle.add(possible_outcomes, "not_impressed", 2);
        }

        return possible_outcomes;
    },

    "Destroy all human civilizations.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "killed_by_hero", 1);
        return possible_outcomes;
    },

    "Dina.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "dina_death", 1);
        return possible_outcomes;
    },

    "Dive for pearls.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "dive_and_die", 3);
        raffle.add(possible_outcomes, "get_pearl", 1);
        raffle.add(possible_outcomes, "diving_saved_by_mermaid", 1);
        return possible_outcomes;
    },

    "Do some farm work.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "farm_work", 4);
        raffle.add(possible_outcomes, "farm_work_and_coin", 1);
        raffle.add(possible_outcomes, "farm_work_and_die", 1);
        raffle.add(possible_outcomes, "farm_work_and_pitchfork", 1);
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

    "Do some swashbuckling.": function(game_state, possible_outcomes) {
        if (game_state.character.items.cutlass > 0) {
            raffle.add(possible_outcomes, "kill_merchants", 1);
        } else {
            raffle.add(possible_outcomes, "no_cutlass", 1);
        }
        raffle.add(possible_outcomes, "swashbuckle_and_die", 1);
        if (game_state.character.has_lost_leg === false &&
            game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "lose_leg", 2);
        }
        raffle.add(possible_outcomes, "hold_your_own", 1);
        return possible_outcomes;
    },

    "Donate to the church.": function(game_state, possible_outcomes) {
        if (game_state.persons.lord_carlos.alive === true) {
            raffle.add(possible_outcomes, "assassinated_in_church", 1);
        }
        if (game_state.persons.priestess.alive === true) {
            raffle.add(possible_outcomes, "blessed", 2);
        }
        raffle.add(possible_outcomes, "feel_bad_about_donation", 3);
        raffle.add(possible_outcomes, "feel_good_about_donation", 5);
        if (game_state.persons.st_george.alive === true) {
            raffle.add(possible_outcomes, "hammer_from_st_george", 1);
        }
        return possible_outcomes;
    },

    "Drink a random potion.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "drink_piss", 2);
        raffle.add(possible_outcomes, "grow_tail", 2);
        raffle.add(possible_outcomes, "monstrosity_potion", 1);
        raffle.add(possible_outcomes, "random_strength", 2);
        if (game_state.persons.wizard.alive === true) {
            raffle.add(possible_outcomes, "random_death", 2);
        } 
        raffle.add(possible_outcomes, "start_tripping", 1);
        return possible_outcomes;
    },

    "Drop anchor.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cannot_drop_anchor", 2);
        raffle.add(possible_outcomes, "drop_anchor_and_die", 2);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "drop_anchor_and_kill_whale", 1);
            raffle.add(possible_outcomes, "drop_anchor_and_save_ship", 1);
            raffle.add(possible_outcomes, "get_punished", 5);
        }
        return possible_outcomes;
    },

    "Drown.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "drown", 1);
        return possible_outcomes;
    },

    //e
        
    "E4.": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "lord_bartholomew":
                raffle.add(possible_outcomes, "e4_lose_bartholomew", 1);
                raffle.add(possible_outcomes, "e4_win_bartholomew", 1);
                break;
            case "lord_carlos":
                raffle.add(possible_outcomes, "e4_lose_carlos", 1);
                raffle.add(possible_outcomes, "e4_win_carlos", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Eat a fly.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "fly_tastes_good", 1);
        raffle.add(possible_outcomes, "human_with_fly_in_mouth", 1);
        if (functions.get_place(game_state).populated === true) {
            raffle.add(possible_outcomes, "stepped_on", 1);
        }
        return possible_outcomes;
    },

    "Enact your elaborate scheme.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "steal_cutlass", 1);
        raffle.add(possible_outcomes, "fail_at_new_career", 2);
        if (game_state.persons.lord_carlos.alive === true) {
            raffle.add(possible_outcomes, "kill_lord_carlos", 1);
        }
        raffle.add(possible_outcomes, "killed_by_dragon", 1);
        return possible_outcomes;
    },

    "Engulf everything in flames.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "burn", 1);
        return possible_outcomes;
    },

    "Enter the void.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "enter_the_void", 1);
        return possible_outcomes;
    },

    "Eve.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "right_name", 1);
        return possible_outcomes;
    },

    "Exit the void.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "leave_in_a_puff", 1);
        return possible_outcomes;
    },
    
    //f

    "Fill the place with fire.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "burn", 1);
        return possible_outcomes;
    },

    "Fire a cannon.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "fire_cannon_and_die", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "fire_cannon_and_get_flogged", 1);
            raffle.add(possible_outcomes, "fire_cannon_and_get_rewarded", 1);
        }
        return possible_outcomes;
    },

    "Flaunt your wealth.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "guards_stop_you_rich", 1);
        if (game_state.persons.st_george.alive === true) {
            raffle.add(possible_outcomes, "st_george_warns_you", 1);
        }
        raffle.add(possible_outcomes, "wealthy_people_sneer", 1);
        raffle.add(possible_outcomes, "you_get_mobbed", 1);
        return possible_outcomes;
    },

    "FLIRT_WITH": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "eve":
                raffle.add(possible_outcomes, "wowed_eve", 8);
                raffle.add(possible_outcomes, "killed_by_eve", 1);
                if (game_state.outcome !== "right_name") {
                    raffle.add(possible_outcomes, "eve_name", 1);
                }
                raffle.add(possible_outcomes, "eve_loses_you_in_woods", 1);
                if (game_state.persons.eve.attracted >= 4) {
                    raffle.add(possible_outcomes, "forced_to_marry_eve", 1000);
                }
                if (game_state.character.has_tail === true) {
                    raffle.add(possible_outcomes, "tail_eve", 2);
                }
                break;
            case "mermaid":
                raffle.add(possible_outcomes, "wowed_mermaid", 8);
                raffle.add(possible_outcomes, 
                    "flirt_with_mermaid_and_die", 2);
                if (game_state.character.has_tail === true) {
                    raffle.add(possible_outcomes, "tail_mermaid", 1);
                }
                break;
            case "nymph_queen":
                raffle.add(possible_outcomes, "flirt_and_shrub", 1);
                break;
            case "olga":
                var name = 
                    game_state.persons[game_state.character.person].name;
                if (name === "the pretty lady") {
                    raffle.add(possible_outcomes, "rebuffed_by_olga", 1);
                    raffle.add(possible_outcomes, "killed_by_olga", 1);
                    raffle.add(possible_outcomes, "wowed_olga", 8);
                    if (game_state.character.has_tail === true) {
                        raffle.add(possible_outcomes, "tail_olga", 1);
                    }
                } else if (name === "Olga") {
                    if (game_state.character.place === "tavern") {
                        raffle.add(possible_outcomes, 
                            "go_upstairs_with_olga", 9);
                        raffle.add(possible_outcomes,
                            "go_upstairs_and_die", 1);
                    } else {
                        raffle.add(possible_outcomes, 
                            "wowed_olga_upstairs", 1);
                    }
                }
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Flirt with Felicity.": function(game_state, possible_outcomes) {
        if (game_state.persons.felicity.attracted > 5) { 
            raffle.add(possible_outcomes, "felicity_loves_you", 1);
        } else {
            raffle.add(possible_outcomes, "rebuffed_by_felicity", 1);
            raffle.add(possible_outcomes, "wowed_felicity", 6);
        }
        return possible_outcomes;
    },

    "Flirt with the fat lady who feeds you.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "rebuffed_by_fat_lady", 2);
        raffle.add(possible_outcomes, "wowed_fat_lady", 5);
        if (game_state.character.person = "other_lunatics") {
            raffle.add(possible_outcomes, "lunatics_jeer", 2);
        }
        return possible_outcomes;
    },

    "Freeze to death.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "freeze", 3);
        raffle.add(possible_outcomes, "saved_by_inuits", 1);
        if (game_state.persons.wizard.alive === true) {
            raffle.add(possible_outcomes, "see_wizard_with_penguins", 1);
        }
        return possible_outcomes;
    },

    //g
    
    "Gather void dust.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_void_dust", 1);
        raffle.add(possible_outcomes, "get_no_void_dust", 1);
        return possible_outcomes;
    },

    // this special action interrupts your action when you're threatened and
    // you don't choose to fight or run away
    "GET_ATTACKED": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_attacked", 1);
        return possible_outcomes;
    },
  
    "GIVE_FLOWERS": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "eve":
                raffle.add(possible_outcomes, "give_flowers_eve", 1);
                break;
            case "mermaid":
                raffle.add(possible_outcomes, "give_flowers_mermaid", 1);
                break;
            case "nymph_queen":
                raffle.add(possible_outcomes, "give_flowers_nymph_queen", 1);
                break;
            case "olga":
                raffle.add(possible_outcomes, "give_flowers_olga", 1);
                break;
            default:
                // Felicity is not actually there when you're interacting
                // with her; if we get here in the logic, the character
                // should be in the prison
                raffle.add(possible_outcomes, "give_flowers_felicity", 1);
        }
        return possible_outcomes;
    },

    "GIVE_HER_CAT": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "eve":
                raffle.add(possible_outcomes, "give_cat_eve", 1);
                break;
            case "olga":
                raffle.add(possible_outcomes, "give_cat_olga", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Give the wizard what he wants.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "wizard_compensates_you", 1);
        raffle.add(possible_outcomes, "wizard_dies", 1);
        raffle.add(possible_outcomes, "wizard_eats_mushroom", 2);
        raffle.add(possible_outcomes, "wizard_unjust", 1);
        return possible_outcomes;
    },

    "Go fishing.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "catch_a_lot_of_fish", 1);
        raffle.add(possible_outcomes, "catch_big_fish", 1);
        raffle.add(possible_outcomes, "catch_fish", 4);
        raffle.add(possible_outcomes, "no_fish", 4);
        if (game_state.character.place === "docks") {
            raffle.add(possible_outcomes, "fish_up_ax", 1);
            raffle.add(possible_outcomes, "fish_up_pitchfork", 1);
            raffle.add(possible_outcomes, "fish_pirates_laugh", 2);
            raffle.add(possible_outcomes, "assassins_catch_you_fishing", 1);
        }
        return possible_outcomes;
    },

    "Go flower picking.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_a_four-leaf_clover", 2);
        raffle.add(possible_outcomes, "get_a_bouquet", 4);
        raffle.add(possible_outcomes, "no_flowers", 1);
        raffle.add(possible_outcomes, "no_flowers_frog", 1);
        return possible_outcomes;
    },

    "Go mushroom picking.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "pick_black_mushroom", 1);
        raffle.add(possible_outcomes, "pick_many_colored_mushroom", 1);
        raffle.add(possible_outcomes, "pick_white_mushroom", 1);
        raffle.add(possible_outcomes, "pick_yellow_mushroom", 1);
        raffle.add(possible_outcomes, "no_mushroom_frog", 1);
        return possible_outcomes;
    },

    "Go on a rampage.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "starve", 1);
        return possible_outcomes;
    },

    "Go swimming in a pool of lava.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cannot_find_lava", 1);
        if (game_state.character.items["fancy red cloak"] < 1) {
            raffle.add(possible_outcomes, "lava_and_die", 2);
        } else {
            raffle.add(possible_outcomes, "lava_swim", 2);
        }
        return possible_outcomes;
    },

    "GO_TO": function(game_state, possible_outcomes, destination) {
        raffle.add(possible_outcomes, "go_to", 1);
        return possible_outcomes;
    },

    "Go to sleep.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "wake_up", 5);
        raffle.add(possible_outcomes, "wake_up_dead", 1);

        if (functions.get_place(game_state).locked === false) {
            raffle.add(possible_outcomes, "wake_up_somewhere_else", 1);
        }

        if (functions.get_place(game_state).populated) {
            raffle.add(possible_outcomes, "wake_up_assassinated", 1);
            raffle.add(possible_outcomes, "wake_up_richer", 1);
            raffle.add(possible_outcomes, "wake_up_robbed", 1);
            raffle.add(possible_outcomes, "wake_up_with_cat", 1);
        }

        switch (game_state.character.place) {
            case "arctic":
                raffle.add(possible_outcomes, "freeze_in_sleep", 6);
                break;
            case "lord_carlos_manor":
                if (game_state.places.lord_carlos_manor.burnable === true) {
                    raffle.add(possible_outcomes, "wake_up_in_dungeon", 2);
                }
                break;
            case "ocean":
                raffle.add(possible_outcomes, "wake_up_drown", 10000);
                break;
            case "prison":
                raffle.add(possible_outcomes, "wake_up_weasel", 2);
                break;
            case "tower":
                raffle.add(possible_outcomes, "wake_up_in_prison", 2);
                break;
        }
        return possible_outcomes;
    },

    "Grovel.": function(game_state, possible_outcomes, destination) {
        raffle.add(possible_outcomes, "grovel_and_die", 2);
        raffle.add(possible_outcomes, "grovel_and_go_to_woods", 1);
        return possible_outcomes;
    },

    //h
    
    "Hide.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "hide", 2);
        raffle.add(possible_outcomes, "hide_and_die", 2);
        return possible_outcomes;
    },

    "Hide beneath the deck.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "hide_and_fight_rat", 1);
        raffle.add(possible_outcomes, "hide_and_miss_out", 2);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "hide_beneath_deck_and_die", 1);
        }
        return possible_outcomes;
    },

    "Hop.": function(game_state, possible_outcomes) {
        if (functions.get_place(game_state).outside === true) {
            raffle.add(possible_outcomes, "eaten_by_bird", 1);
        }
        raffle.add(possible_outcomes, "hop", 1);
        raffle.add(possible_outcomes, "hop_a_lot", 1);
        return possible_outcomes;
    },

    //i
    
    "Ignite an inferno.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "burn", 1);
        return possible_outcomes;
    },

    //j
    
    "Just keep swimming.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "swim_to_arctic", 2);
        raffle.add(possible_outcomes, "swim_to_woods", 2);
        raffle.add(possible_outcomes, "swim_to_the_end", 1);
        raffle.add(possible_outcomes, "swim_and_die", 1);
        return possible_outcomes;
    },

    //k

    "Keep swimming.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "keep_swimming", 2);
        raffle.add(possible_outcomes, "arrive_at_mermaid_rock", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "rescued_by_lord_arthur", 1);
        }
        raffle.add(possible_outcomes, "swim_and_die", 2);
        return possible_outcomes;
    },

    "Kill everybody in a fit of rage.": function(game_state, 
                                                 possible_outcomes) {
        raffle.add(possible_outcomes, "kill_self_in_fit_of_rage", 2);
        raffle.add(possible_outcomes, "kill_nobody", 1);
        if (functions.get_place(game_state).town) {
            raffle.add(possible_outcomes, "guards_stop_you_killing", 1);
        }
        return possible_outcomes;
    },

    "Kill yourself in frustration.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "kill_self", 9);
        switch (game_state.character.place) {
            case "arctic":
            case "docks":
            case "mermaid_rock":
                raffle.add(possible_outcomes, "kill_self_in_ocean", 10);
                break;
            case "church":
            case "market":
            case "streets":
                if (game_state.persons.st_george.alive === true) {
                    raffle.add(possible_outcomes, "saved_by_st_george", 5);
                }
                break;
        }
        return possible_outcomes;
    },

    "Kiss your frog.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "kiss_frog_and_die", 2);
        raffle.add(possible_outcomes, "kiss_frog_cat", 1);
        raffle.add(possible_outcomes, "kiss_frog_jewels", 1);
        raffle.add(possible_outcomes, "kiss_frog_mushrooms", 1);
        raffle.add(possible_outcomes, "kiss_frog_lose_frog", 3);
        raffle.add(possible_outcomes, "kiss_frog_no_effect", 2);
        return possible_outcomes;
    },

    //l

    "Laugh about the warden doing it alone on holidays.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "laugh_about_warden", 1);
        return possible_outcomes;
    },

    "Leave in a huff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "random_move", 10);
        return possible_outcomes;
    },

    "Leave in a puff.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "leave_in_a_puff", 10000);
        return possible_outcomes;
    },

    "Gawk at women.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "leer_at_cat", 1);
        raffle.add(possible_outcomes, "leer_and_get_assassinated", 1);
        raffle.add(possible_outcomes, "leer_at_women", 4);
        if (game_state.character.has_tail === true) {
            raffle.add(possible_outcomes, "women_gawk_at_you", 2);
        }
        return possible_outcomes;
    },

    "LICK_THE_GROUND": function(game_state, possible_outcomes) {

        if (game_state.outcome === "burn" || 
            game_state.character.place === "smoking_volcano") {
            raffle.add(possible_outcomes, "lick_ash", 10000);
        }

        raffle.add(possible_outcomes, "distasteful", 5);
        raffle.add(possible_outcomes, "infection", 1);

        if (game_state.outcome === "kill") {
            raffle.add(possible_outcomes, "lick_blood", 10000);
        }

        raffle.add(possible_outcomes, "distasteful", 5);
        raffle.add(possible_outcomes, "infection", 1);

        if (functions.get_place(game_state).town) {
            raffle.add(possible_outcomes, "guards_stop_you_licking", 6);
        }

        if (game_state.character.place === "arctic") {
            raffle.add(possible_outcomes, "ground_tastes_cold", 6);
        }

        if (game_state.character.place === "mermaid_rock") {
            raffle.add(possible_outcomes, "lick_the_salt", 6);
        }

        if (game_state.character.place === "ocean") {
            raffle.add(possible_outcomes, "lick_the_ocean", 10000);
        }

        if (game_state.character.place === "wizard_lab" &&
            game_state.places.wizard_lab.burnable === true) {
            raffle.add(possible_outcomes, "monstrosity", 6);
        }

        return possible_outcomes;
    },

    "Look for assassins.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "alley_is_clear", 1);
        raffle.add(possible_outcomes, "do_not_see_assassins", 1);
        return possible_outcomes;
    },

    "Look for a cat.": function(game_state, possible_outcomes) {
        if (game_state.character.items.fish > 0 &&
            game_state.character.items.cat === 0) {
            raffle.add(possible_outcomes, "cat_smells_fish", 20);
        }
        raffle.add(possible_outcomes, "cannot_find_cat", 3);
        raffle.add(possible_outcomes, "chase_cat_to_dark_alley", 1);
        raffle.add(possible_outcomes, "ferocious_cat", 1);
        raffle.add(possible_outcomes, "find_a_cat", 4);
        if (game_state.persons.st_george.alive === true) {
            raffle.add(possible_outcomes, "find_st_george_instead", 1);
        }
        return possible_outcomes;
    },

    "Look for a way out.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_a_way_out", 1);
        raffle.add(possible_outcomes, "find_deep_cave_newt", 1);
        raffle.add(possible_outcomes, "no_way_out", 3);
        raffle.add(possible_outcomes, "slip_and_die", 1);
        return possible_outcomes;
    },

    "Look for a weapon.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_a_war_merchant", 1);
        return possible_outcomes;
    },

    "Look for dragons.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cannot_find_dragon", 1);
        raffle.add(possible_outcomes, "dragon_and_die", 2);
        raffle.add(possible_outcomes, "meet_dragon_blue", 1);
        raffle.add(possible_outcomes, "meet_dragon_red", 1);
        return possible_outcomes;
    },

    "Look for Lord Carlos' daughter.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "meet_eve", 4);
        raffle.add(possible_outcomes, "sneak_eve_and_die", 1);
        return possible_outcomes;
    },

    "Look for mermaids.": function(game_state, possible_outcomes) {
        switch (game_state.character.place) {
            case "mermaid_rock":
                raffle.add(possible_outcomes, "meet_mermaid", 4);
                raffle.add(possible_outcomes, "look_for_mermaids_and_die", 1);
                raffle.add(possible_outcomes, "find_lost_treasure", 1);
                raffle.add(possible_outcomes, "find_shiny_coin", 1);
                break;
            case "ocean":
                raffle.add(possible_outcomes, "fail_to_find_mermaids", 3);
                raffle.add(possible_outcomes, "find_mermaid_rock", 1);
                raffle.add(possible_outcomes, "find_wooden_mermaid", 1);
                raffle.add(possible_outcomes, "look_for_mermaids_and_drown", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Look for nymphs.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cannot_find_nymphs", 2);
        raffle.add(possible_outcomes, "fall_into_cave", 1);
        raffle.add(possible_outcomes, "find_assassin_instead", 1);
        raffle.add(possible_outcomes, "find_nymphs", 2);
        raffle.add(possible_outcomes, "look_for_nymphs_and_die", 1);
        if (game_state.persons.nymph_queen.alive === true) {
            raffle.add(possible_outcomes, "meet_nymph_queen", 2);
        } 
        return possible_outcomes;
    },

    "Look for Olga.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_olga", 1);
        return possible_outcomes;
    },

    "Look for sea turtles.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_sea_turtle", 1);
        raffle.add(possible_outcomes, "find_mermaid_instead", 1);
        raffle.add(possible_outcomes, "find_sea_turtle_and_drown", 1);
        raffle.add(possible_outcomes, "no_sea_turtle", 3);
        return possible_outcomes;
    },

    "Look for St. George.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "find_st_george", 3);
        if (game_state.places.church.burnable === true) {
            raffle.add(possible_outcomes, "find_st_george_in_church", 5);
        }
        raffle.add(possible_outcomes, "trip_over_a_cat", 1);
        raffle.add(possible_outcomes, "forget_what_you_were_doing", 1);
        return possible_outcomes;
    },

    "Look for the wizard.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "frog", 2);
        raffle.add(possible_outcomes, "frog_and_die", 1);
        if (game_state.character.items["yellow mushroom"] > 0) {
            raffle.add(possible_outcomes, "wizard_wants_mushroom", 10);
        }
        raffle.add(possible_outcomes, "find_wizard", 6);
        raffle.add(possible_outcomes, "find_wizard_get_frog", 1);
        return possible_outcomes;
    },

    "Look for witches.": function(game_state, possible_outcomes) {
        if (game_state.places.woods.burnable === true) {
            raffle.add(possible_outcomes, "meet_witch", 1);
        }
        raffle.add(possible_outcomes, "cannot_find_witch", 1);
        return possible_outcomes;
    },

    "Look through the trash.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "guards_stop_you_trash", 1);
        raffle.add(possible_outcomes, "trash_ax", 1);
        raffle.add(possible_outcomes, "trash_cat", 1);
        raffle.add(possible_outcomes, "trash_die", 1);
        raffle.add(possible_outcomes, "trash_nothing", 3);
        return possible_outcomes;
    },

    "Look up into the sky and yell, \"NOOOOOOOOOOOOO!\"": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "god_resurrects_cat", 1);
        raffle.add(possible_outcomes, "yelling_doesnt_help", 2);
        return possible_outcomes;
    },

    "Loot.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "loot_and_die", 1);
        raffle.add(possible_outcomes, "loot_arrested", 1);
        raffle.add(possible_outcomes, "loot_item", 2);
        raffle.add(possible_outcomes, "loot_items", 1);
        raffle.add(possible_outcomes, "loot_weapon", 1);
        return possible_outcomes;
    },

    "LOVE_POTION": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "eve":
                raffle.add(possible_outcomes, "miss_eve", 1);
                raffle.add(possible_outcomes, "potion_eve", 1);
                break;
            case "mermaid":
                raffle.add(possible_outcomes, "potion_mermaid", 2);
                break;
            case "nymph_queen":
                raffle.add(possible_outcomes, "miss_nymph_queen", 1);
                raffle.add(possible_outcomes, "potion_nymph_queen", 1);
                break;
            case "olga":
                raffle.add(possible_outcomes, "potion_olga", 1);
                if (game_state.character.place === "tavern" &&
                    game_state.persons.blind_bartender.alive) {
                    raffle.add(possible_outcomes, "miss_olga", 1);
                }
                break;
            case "priestess":
                raffle.add(possible_outcomes, "miss_priestess", 1);
                raffle.add(possible_outcomes, "potion_priestess", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    //m

    "Make a shady deal.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "deal_with_assassin", 2);
        raffle.add(possible_outcomes, "buy_black_market_item", 7);
        return possible_outcomes;
    },

    "Make it hard for Lord Carlos to kill you.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "chance_to_escape", 1);
        raffle.add(possible_outcomes, "die_anyway", 7);
        raffle.add(possible_outcomes, "escape_to_cave", 1);
        raffle.add(possible_outcomes, "escape_to_arctic", 1);
        return possible_outcomes;
    },

    "MARRY": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "married", 1);
        return possible_outcomes;
    },

    //n
    
    "Nf3.": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "lord_bartholomew":
                raffle.add(possible_outcomes, "nf3_lose_bartholomew", 1);
                raffle.add(possible_outcomes, "nf3_win_bartholomew", 1);
                break;
            case "lord_carlos":
                raffle.add(possible_outcomes, "nf3_lose_carlos", 1);
                raffle.add(possible_outcomes, "nf3_win_carlos", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    //o
    
    //p

    "Pace around.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "pace", 5);
        raffle.add(possible_outcomes, "pace_and_die", 1);
        raffle.add(possible_outcomes, "pace_and_get_frog", 1);
        raffle.add(possible_outcomes, "pace_and_get_mushroom", 1);
        dead_lunatic_repercussions(game_state, possible_outcomes);
        if (game_state.character.person !== "other_lunatics" &&
            game_state.persons.other_lunatics.alive === true) {
            raffle.add(possible_outcomes, "more_lunatics", 3);
        } else {
            raffle.add(possible_outcomes, "lunatics_trip_you", 1);
        }
        return possible_outcomes;
    },

    "Panic!": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "panic_and_die", 2);
        raffle.add(possible_outcomes, "panic_and_escape", 1);
        return possible_outcomes;
    },

    "Play dead.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "play_dead_and_die", 3);
        raffle.add(possible_outcomes, "play_dead_works", 1);
        return possible_outcomes;
    },

    "Play in the snow.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "play_in_the_snow", 4);
        raffle.add(possible_outcomes, "penguins", 2);
        return possible_outcomes;
    },

    "Play poorly and turn the board around once you're losing.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "turn_board_around", 3);
        return possible_outcomes;
    },

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

        if (game_state.character.place === "tavern" &&
            game_state.places.tavern.burnable === true) {
            raffle.add(possible_outcomes, "god_gives_you_jewels", 2);
        }

        if (game_state.places[game_state.character.place].town &&
            game_state.persons.st_george.alive === true) {
            raffle.add(possible_outcomes, "st_george_joins_you_in_prayer", 1);
        }

        return possible_outcomes;
    },

    //q
    
    "Quit while you're ahead.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "fail_to_die", 3);
        raffle.add(possible_outcomes, "kill_self", 1);
        return possible_outcomes;
    },

    //r
    
    "Raise a sail.": function(game_state, possible_outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "impress_lord_arthur", 1);
            raffle.add(possible_outcomes, "killed_by_lord_arthur", 1);
            raffle.add(possible_outcomes, "lord_arthur_tells_sail", 2);
            raffle.add(possible_outcomes, "merchant_ship_sail", 1);
        }
        raffle.add(possible_outcomes, "raise_sail_and_get_to_land", 4);
        return possible_outcomes;
    },

    "Read a spellbook.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "read_and_die", 1);
        raffle.add(possible_outcomes, "read_clover", 1);
        raffle.add(possible_outcomes, "read_spell_book", 7);
        return possible_outcomes;
    },

    "Release your inner arsonist.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "burn", 1);
        return possible_outcomes;
    },

    "Repay your debts.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "repay_and_die", 1);
        raffle.add(possible_outcomes, "repay_and_live", 1);
        return possible_outcomes;
    },

    "Ribbit.": function(game_state, possible_outcomes) {
        if (game_state.character.place !== "ocean") {
            raffle.add(possible_outcomes, "eaten_by_weasel", 1);
        }
        raffle.add(possible_outcomes, "human", 1);
        raffle.add(possible_outcomes, "ribbit", 1);
        return possible_outcomes;
    },

    "Run like the Devil.": function(game_state, possible_outcomes) {
        if (game_state.character.is_threatened) {
            raffle.add(possible_outcomes, "escape", 9);
            if (game_state.character.has_tail === true) {
                raffle.add(possible_outcomes, "caught_by_tail_and_die", 1);
            } else {
                if (game_state.persons[
                        game_state.character.person
                    ].preferred_attack === "arrest") {
                    raffle.add(possible_outcomes, "caught_and_arrested", 1);
                } else {
                    raffle.add(possible_outcomes, "caught_and_die", 1);
                }
            }
        } else if (game_state.character.person === "olga") {
            raffle.add(possible_outcomes, "escape_unmarried", 1);
            raffle.add(possible_outcomes, "caught_by_olga", 1);
        } else if (game_state.character.person === "felicity") {
            raffle.add(possible_outcomes, "escape_unmarried", 1);
        } else {
            // there must always be at least one outcome added to the raffle
            raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    //s

    "Say you love her too.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "felicity_lets_you_out", 9);
        raffle.add(possible_outcomes, "what_a_shame", 1);
        return possible_outcomes;
    },

    "Scrub the deck.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "scrub_the_deck", 3);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "scrub_get_thrown_off_ship", 1);
            raffle.add(possible_outcomes, "lord_arthur_tells_scrub", 2);
            raffle.add(possible_outcomes, "impress_lord_arthur", 1);
            raffle.add(possible_outcomes, "merchant_ship_scrub", 1);
        }
        return possible_outcomes;
    },

    "SHOW_COIN": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "dragon_blue":
                raffle.add(possible_outcomes, "dragon_coin_trade", 1);
                break;
            case "dragon_red":
                raffle.add(possible_outcomes, "dragon_coin_die", 1);
                break;
            case "lord_arthur":
                raffle.add(possible_outcomes, "lose_coin_arthur", 1);
                break;
            case "lord_bartholomew":
                raffle.add(possible_outcomes, "lose_coin_bartholomew", 1);
                break;
            case "lord_carlos":
                raffle.add(possible_outcomes, "lose_coin_carlos", 1);
                break;
            case "lord_daniel":
                raffle.add(possible_outcomes, "lose_coin_daniel", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Sing a song.": function(game_state, possible_outcomes) {
        
        if (game_state.topic === "assassins") {
            raffle.add(possible_outcomes, "assassin_song", 10000);
        }

        raffle.add(possible_outcomes, "no_one_cares", 2);

        if (game_state.topic === null) {
            raffle.add(possible_outcomes, "sing_about_stuff", 5);
        }

        if (game_state.character.place === "streets" || 
            game_state.character.place === "market") {
            raffle.add(possible_outcomes, "guards_stop_you_singing", 2);
        }

        if (game_state.character.place === "streets" || 
            game_state.character.place === "market" ||
            game_state.character.place === "tavern") {
            raffle.add(possible_outcomes, "earn_small_fortune_in_coins", 3);
            raffle.add(possible_outcomes, "crowd_hates_your_voice", 1);
        }

        if (functions.get_place(game_state).town) {
            if (game_state.character.has_tail === false) {
                raffle.add(possible_outcomes, "cannot_hear_assassin", 1);
            } else {
                raffle.add(possible_outcomes, "saved_by_tail", 1);
            }
        }

        if (game_state.character.place === "tavern" &&
            game_state.places.tavern.burnable === true) {
            raffle.add(possible_outcomes, "assassins_approach", 5);
        }

        if (game_state.character.place === "church" &&
            game_state.places.church.burnable === true) {
            raffle.add(possible_outcomes, "priestess_takes_offense", 10);
        }

        if (game_state.character.place === "docks") {
            raffle.add(possible_outcomes, "pirates_ruin_song", 10);
        }

        if (game_state.character.place === "mermaid_rock" &&
            game_state.character.person !== "mermaid") {
            raffle.add(possible_outcomes, "sing_to_greeks", 10);
        }

        if (game_state.character.place === "lord_carlos_manor" &&
            game_state.places.lord_carlos_manor.burnable === true) {
            raffle.add(possible_outcomes, "sing_at_lord_carlos_manor", 10);
        }

        if (functions.get_place(game_state).locked === false) {
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
            functions.get_person(game_state).name === "Olga") {
            raffle.add(possible_outcomes, "sing_to_olga", 100);
        }

        if (game_state.character.person !== null) {
            raffle.add(possible_outcomes, "not_impressed", 1);
        }
        
        return possible_outcomes;
    },

    "Sink.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "drown", 3);
        raffle.add(possible_outcomes, "saved_by_mermaid", 1);
        return possible_outcomes;
    },

    "Slurp down your potion of strength.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "grow_stronger_potion", 1);
        return possible_outcomes;
    },

    "Slurp down your potion of tail growth.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "grow_tail_potion", 1);
        return possible_outcomes;
    },

    "Sneak around.": function(game_state, possible_outcomes) {
        if (game_state.character.place === "lord_carlos_manor") {
            raffle.add(possible_outcomes, "sneak_and_die", 4);
            raffle.add(possible_outcomes, "get_poison_dagger", 1);
            if (game_state.persons.lord_carlos.alive === true) {
                raffle.add(possible_outcomes, "killed_by_lord_carlos", 1);
                raffle.add(possible_outcomes, "meet_lord_carlos", 4);
            }
            if (game_state.persons.eve.alive === true) {
                raffle.add(possible_outcomes, "meet_eve", 4);
            }
        } else if (game_state.character.place === "lord_bartholomew_manor") {
            raffle.add(possible_outcomes, "sneak_and_die_bartholomew", 1);
            raffle.add(possible_outcomes, "sneak_bartholomew", 3);
            raffle.add(possible_outcomes, "sneak_pitchfork", 1);
        }
        return possible_outcomes;
    },

    "Snoop around.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_frog", 1);
        raffle.add(possible_outcomes, "red_cloak", 1);
        raffle.add(possible_outcomes, "snoop_around_and_die", 1);
        if (game_state.persons.wizard.alive === true) {
            raffle.add(possible_outcomes, "wizard_sends_you_to_arctic", 1);
        } 
        return possible_outcomes;
    },

    "SUCK_UP": function(game_state, possible_outcomes) {
        switch (game_state.character.person) {
            case "lord_arthur":
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_arthur_cutlass", 1);
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_arthur_ocean", 1);
                break;
            case "lord_bartholomew":
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_bartholomew", 1);
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_bartholomew_countryside", 1);
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_bartholomew_pitchfork", 1);
                break;
            case "lord_carlos":
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_carlos_and_die", 1);
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_carlos_woods", 1);
                break;
            case "lord_daniel":
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_daniel", 1);
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_daniel_hammer", 1);
                raffle.add(possible_outcomes, 
                    "suck_up_to_lord_daniel_streets", 1);
                break;
            default:
                raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Sun yourself on a rock.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "bronzed", 1);
        raffle.add(possible_outcomes, "eaten_by_roc", 1);
        raffle.add(possible_outcomes, "sunburnt", 1);
        raffle.add(possible_outcomes, "sunbathe_with_mermaid", 1);
        return possible_outcomes;
    },

    "Swim.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_progress_swimming", 3);
        raffle.add(possible_outcomes, "see_ship", 1);
        raffle.add(possible_outcomes, "swim_and_die", 2);
        if (game_state.character.has_tail === true) {
            raffle.add(possible_outcomes, "tail_helps_you_swim", 2);
        }
        return possible_outcomes;
    },

    "Swing on a rope.": function(game_state, possible_outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "swing_into_captain", 1);
        }
        raffle.add(possible_outcomes, "swing_into_ocean", 1);
        raffle.add(possible_outcomes, "swing_on_rope_and_die", 1);
        return possible_outcomes;
    },

    "Swing your cat.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cat_escapes", 1);
        if (game_state.places[game_state.character.place].town === true) {
            raffle.add(possible_outcomes, "hit_assassin_with_cat", 3);
            raffle.add(possible_outcomes, "guards_stop_you_swinging_cat", 1);
        }
        return possible_outcomes;
    },

    //t

    "Tell a priest God doesn't exist.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "god_smites_you", 1);
        raffle.add(possible_outcomes, "priest_agrees", 2);
        return possible_outcomes;
    },

    "Tell a priest he's fat.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "priest_fat", 1);
        return possible_outcomes;
    },

    "Tell a priest you're the chosen one.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "priest_takes_pity", 1);
        raffle.add(possible_outcomes, "priest_disagrees", 2);
        return possible_outcomes;
    },

    "Tell her you're sorry.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "apologize", 2);
        raffle.add(possible_outcomes, "apologize_and_die", 1);
        return possible_outcomes;
    },

    "Tell the next person you meet that you're Lord Arthur.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    raffle.add(possible_outcomes, 
                        "disguise_meet_lord_bartholomew", 1);
                }
                break;
            case "lord_carlos_manor":
                if (game_state.persons.lord_carlos.alive === true) {
                raffle.add(possible_outcomes, 
                    "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    raffle.add(possible_outcomes,
                        "disguise_meet_lord_daniel", 1);
                }
                break;
        }
        return possible_outcomes;
    },

    "Tell the next person you meet that you're Lord Bartholomew.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_carlos_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    raffle.add(possible_outcomes, 
                        "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                raffle.add(possible_outcomes, "disguise_and_arrested", 1);
                break;
        }
        return possible_outcomes;
    },

    "Tell the next person you meet that you're Lord Carlos.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    raffle.add(possible_outcomes, 
                        "disguise_meet_lord_bartholomew", 1);
                }
                break;
            case "lord_carlos_manor":
                raffle.add(possible_outcomes, "disguise_and_die", 3);
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    raffle.add(possible_outcomes,
                        "disguise_meet_lord_daniel", 1);
                }
                break;
        }
        return possible_outcomes;
    },

    "Tell the next person you meet that you're Lord Daniel.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                raffle.add(possible_outcomes, "disguise_daniel_die", 1);
                break;
            case "lord_carlos_manor":
                if (game_state.persons.lord_carlos.alive === true) {
                    raffle.add(possible_outcomes, 
                        "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    raffle.add(possible_outcomes, "disguise_guards_laugh", 1);
                }
                break;
        }
        return possible_outcomes;
    },

    "Tell the next person you meet that you're St. George.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    raffle.add(possible_outcomes, 
                        "disguise_meet_lord_bartholomew", 1);
                }
                break;
            case "lord_carlos_manor":
                if (game_state.persons.lord_carlos.alive === true) {
                raffle.add(possible_outcomes, 
                    "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    raffle.add(possible_outcomes,
                        "disguise_meet_lord_daniel", 1);
                }
                break;
        }
        return possible_outcomes;
    },

    "Tell the guards you're a lunatic.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "a_rich_lunatic", 1);
        return possible_outcomes;
    },

    "TELL_GUARDS": function(game_state, possible_outcomes) {
        game_state.character.excuse === "rich" 
            ? 
        raffle.add(possible_outcomes, "a_rich_lunatic", 1)
            :
        raffle.add(possible_outcomes, "an_excuse_lunatic", 1);
        return possible_outcomes;
    },

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

        if (game_state.character.place === "tower" &&
            game_state.places.tower.burnable === true) {
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

    "Thump yourself on the chest.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "feel_manly", 9);
        raffle.add(possible_outcomes, "thump_self_and_die", 1);
        if (game_state.places[game_state.character.place].populated === true
            || game_state.character.place === "countryside") {
            raffle.add(possible_outcomes, "peasant_woman_impressed", 1);
            raffle.add(possible_outcomes, "peasants_laugh_at_you", 2);
        }
        if (game_state.character.person === "wizard") {
            raffle.add(possible_outcomes, "wizard_gorilla", 20);
        }
        return possible_outcomes;
    },

    "Tip a cow.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cannot_tip_cow", 4);
        raffle.add(possible_outcomes, "tip_cow_and_die", 1);
        raffle.add(possible_outcomes, "tip_cow_and_lynch_mob", 1);
        return possible_outcomes;
    },

    "Trade your void dust to the wizard.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "get_sword_of_great_evil", 1);
        return possible_outcomes;
    },

    "Train with the guards.": function(game_state, possible_outcomes) {
        if (game_state.character.strength > 3) {
            raffle.add(possible_outcomes, "train_and_win", 2);
        }
        raffle.add(possible_outcomes, "train_and_die", 1);
        raffle.add(possible_outcomes, "train_stronger", 3);
        raffle.add(possible_outcomes, "train_thrown_out", 1);
        return possible_outcomes;
    },

    "Trash the place.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "trash_the_place", 4);
        if (game_state.character.place === "wizard_lab") {
            raffle.add(possible_outcomes, "trash_the_place_and_die", 2);
            raffle.add(possible_outcomes, "blow_up_the_lab", 1);
            if (game_state.persons.wizard.alive === true) {
                raffle.add(possible_outcomes, "wizard_stops_you_trashing", 1);
            }
        }
        if (game_state.character.place === "market") {
            raffle.add(possible_outcomes, "trash_the_market_and_die", 2);
        }
        return possible_outcomes;
    },

    "Try to reason with the mob.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "mob_kills_you", 4);
        raffle.add(possible_outcomes, "mob_lets_you_off_the_hook", 1);
        return possible_outcomes;
    },

    "Try to save the cat.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "fail_to_save_cat", 1);
        raffle.add(possible_outcomes, "beat_up_by_kids", 1);
        raffle.add(possible_outcomes, "save_cat", 1);
        return possible_outcomes;
    },

    "Try to save the witch.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "provoke_the_mob", 1);
        raffle.add(possible_outcomes, "killed_by_mob", 1);
        raffle.add(possible_outcomes, "save_witch", 1);
        return possible_outcomes;
    },

    "Try to snatch the keys the first chance you get.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "beat_up_by_guards", 3);
        raffle.add(possible_outcomes, "steal_keys_and_die", 1);
        raffle.add(possible_outcomes, "steal_keys_and_escape", 1);
        return possible_outcomes;
    },

    //u

    //v
    
    //w
    
    "Waddle like God.": function(game_state, possible_outcomes) {
        if (game_state.character.is_threatened) {
            raffle.add(possible_outcomes, "escape_like_god", 1);
            if (game_state.persons[
                    game_state.character.person
                ].preferred_attack === "arrest") {
                raffle.add(possible_outcomes, 
                           "caught_and_arrested_like_god", 9);
            } else {
                raffle.add(possible_outcomes, "caught_like_god", 9);
            }
        } else {
            // there must always be at least one outcome added to the raffle
            raffle.add(possible_outcomes, "universe_blows_up", 1);
        }
        return possible_outcomes;
    },

    "Wait for a holiday to make your move.":
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "carefully_steal_keys", 1);
        raffle.add(possible_outcomes, "fail_to_steal_keys", 1);
        raffle.add(possible_outcomes, "saved_by_lord_bartholomew", 1);
        return possible_outcomes;
    },

    "Wait where you are.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "wait_and_die", 2);
        if (game_state.persons.eve.alive === true) {
            raffle.add(possible_outcomes, "wait_and_meet_eve", 1);
        }
        if (game_state.persons.lord_carlos.alive === true) {
            raffle.add(possible_outcomes, "wait_and_meet_lord_carlos", 1);
        }
        return possible_outcomes;
    },

    "Walk the plank.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "walk_across_board", 1);
        raffle.add(possible_outcomes, "walk_into_ocean", 1);
        return possible_outcomes;
    },

    "Wander the countryside.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "cat_burning", 1);
        if (game_state.persons.peasant_lass.alive === true) {
            raffle.add(possible_outcomes, "meet_peasant_lass", 1);
        } 
        if (game_state.persons.simple_peasant.alive === true) {
            raffle.add(possible_outcomes, "meet_simple_peasant", 1);
        }
        raffle.add(possible_outcomes, "wander_the_countryside", 6);
        raffle.add(possible_outcomes, "witch_burning", 1);
        if (game_state.character.has_tail === true) {
            raffle.add(possible_outcomes, "peasants_laugh_at_tail", 1);
        }
        return possible_outcomes;
    },

    "Watch a play.": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "watch_play", 3);
        raffle.add(possible_outcomes, "riot", 1);
        return possible_outcomes;
    },

    //x

    //y

    "Yell that there aren't penguins in the Arctic.": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "penguins_dont_care", 1);
        return possible_outcomes;
    },

    "YELL_A_PIRATE_PHRASE": function(game_state, possible_outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "impress_lord_arthur", 1);
            raffle.add(possible_outcomes, "no_true_pirate_says_that", 1);
            raffle.add(possible_outcomes, "thrown_off_ship", 1);
        } else {
            raffle.add(possible_outcomes, "you_get_away_with_it", 1);
        }
        return possible_outcomes;
    },

    "Yell, \"Don't leave without me!\"": 
        function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "wizard_leaves_without_you", 1);
        return possible_outcomes;
    },

    "Yell, \"I've lost my leg!\"": function(game_state, possible_outcomes) {
        raffle.add(possible_outcomes, "no_one_care_about_your_leg", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            raffle.add(possible_outcomes, "lord_arthur_helps", 1);
        }
        return possible_outcomes;
    },

    //z

}

function dead_lunatic_repercussions(game_state, possible_outcomes) {
    if (game_state.persons.other_lunatics.alive === false) {
        raffle.add(possible_outcomes, "guards_take_away_bodies", 6);
        raffle.add(possible_outcomes, "guards_kill_you_for_homicide", 6);
    }
}
