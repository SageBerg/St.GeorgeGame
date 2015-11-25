"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var functions = require("./functions");
var items     = require("./items");
//var raffle    = require("./raffle");

var FEMALE    = "female";
var MALE      = "male";

exports.actions = {

    //a

    "A3.": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "lord_bartholomew":
                outcomes.add("stupid_move_and_lose", 1);
                break;
            case "lord_carlos":
                outcomes.add("stupid_move_and_die", 4);
                outcomes.add("stupid_move_and_win", 1);
                break;
        }
        return outcomes;
    },

    "Admire your jewels.": function(game_state, outcomes) {
        outcomes.add("admire_jewels", 2);
        outcomes.add("admire_jewels_and_die", 1);
        outcomes.add("find_pearl_in_jewels", 1);
        if (game_state.places[game_state.character.place].town === true &&
            game_state.character.sex === MALE) {
            outcomes.add("guards_stop_you_naked", 1);
        }
        return outcomes;
    },

    "Admire your own bosoms.": function(game_state, outcomes) {
        outcomes.add("admire_your_bosoms", 1);
        switch (game_state.character.person) {
            case "drunk":
                outcomes.add("bosoms_drunk", 9);
                break;
            case "olga":
                outcomes.add("bosoms_olga", 9);
                break;
            case "st_george":
                outcomes.add("bosoms_st_george", 9);
                break;
            case "witch":
                outcomes.add("bosoms_witch", 9);
                break;
            case "wizard":
                outcomes.add("bosoms_wizard", 9);
                break;
        }
        return outcomes;
    },

    "Anna.": function(game_state, outcomes) {
        outcomes.add("anna_death", 1);
        return outcomes;
    },

    "Annihilate everything.": function(game_state, outcomes) {
        outcomes.add("apocalypse", 1);
        return outcomes;
    },

    "Challenge them to an arm wrestling match to reclaim your dignity.":
        function(game_state, outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add(
                    "arm_wrestle_and_impressment_not", 1000);
            } else {
                outcomes.add(
                    "arm_wrestle_and_impressment", 1);
            }
        }
        outcomes.add("arm_wrestle_pirates", 1);
        outcomes.add("arm_wrestle_pirates_ocean", 1);
        return outcomes;
    },

    "Ask about assassins.": function(game_state, outcomes) {
        if (game_state.character.sex === MALE) {
            outcomes.add("assassinated", 1);
        }
        if (game_state.character.place === "tavern") {
            outcomes.add("no_one_wants_to_talk", 3);
            if (game_state.persons.olga.alive === true) {
                outcomes.add("meet_olga", 3);
            }
            outcomes.add("learn_about_assassins", 4);
        }
        if (game_state.character.place === "lord_carlos_manor") {
            outcomes.add("wait_here_please", 3);
            outcomes.add("ask_eve", 1);
        }
        return outcomes;
    },

    "Ask for a draw.": function(game_state, outcomes) {
        outcomes.add("enrage_lord_carlos", 1);
        outcomes.add("enrage_lord_carlos_and_die", 1);
        return outcomes;
    },

    "Ask for an audience with Lord Bartholomew.":
        function(game_state, outcomes) {
        outcomes.add(
            "denied_audience_with_lord_bartholomew", 1);
        outcomes.add("audience_with_lord_bartholomew", 2);
        return outcomes;
    },

    "Ask for an audience with Lord Daniel.":
        function(game_state, outcomes) {
        outcomes.add("denied_audience_with_lord_daniel", 1);
        outcomes.add("audience_with_lord_daniel", 1);
        return outcomes;
    },

    "Ask for asylum.": function(game_state, outcomes) {
        if (game_state.character.sex === MALE) {
            outcomes.add("get_asylum_and_win", 1);
        }
        outcomes.add("get_asylum_and_get_arrested", 1);
        return outcomes;
    },

    "Ask for directions.": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "peasant_lass":
                outcomes.add("directions_peasant_lass", 1);
                outcomes.add("directions_to_manor", 1);
                outcomes.add("directions_to_town", 1);
                outcomes.add("directions_to_woods", 1);
                break;
            case "simple_peasant":
                outcomes.add("directions_simple_peasant", 2);
                outcomes.add("directions_to_volcano", 1);
                break;
        }
        return outcomes;
    },

    "Ask him to teleport you to the Arctic.":
        function(game_state, outcomes) {
        outcomes.add("wizard_teleport_arctic", 1);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Ask him to teleport you to Lord Arthur's pirate ship.":
        function(game_state, outcomes) {
        outcomes.add("wizard_teleport_pirate_ship", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Ask the blue dragon to kill Lord Carlos.":
        function(game_state, outcomes) {
        outcomes.add("trade_coin_for_lord_carlos", 1);
        return outcomes;
    },

    "Ask the mermaid to take you back to land.":
        function(game_state, outcomes) {
        outcomes.add("mermaid_gives_you_fish", 1);
        outcomes.add("mermaid_refuses", 1);
        outcomes.add("mermaid_strands_you", 1);
        outcomes.add("mermaid_takes_you_back_to_land", 1);
        return outcomes;
    },

    "Ask the witch to brew you a potion.":
        function(game_state, outcomes) {
        outcomes.add("witch_says_no", 1);
        if (game_state.character.items.apple > 0 &&
            game_state.character.items["ball of sap"] > 0 &&
            game_state.character.items["black mushroom"] > 0) {
            outcomes.add(
                "witch_makes_potion_transformation", 1);
        }
        if (game_state.character.items["ball of sap"] > 0 &&
            game_state.character.items["bouquet of flowers"] > 0 &&
            game_state.character.items["many-colored mushroom"] > 0) {
            outcomes.add("witch_makes_potion_love", 1);
        }
        if (game_state.character.items.cat > 0 &&
            game_state.character.items.pearl > 0) {
            outcomes.add(
                "witch_makes_potion_tail_growth", 1);
        }
        if (game_state.character.items["deep-cave newt"] > 0 &&
            game_state.character.items["white mushroom"] > 0) {
            outcomes.add(
                "witch_makes_potion_strength", 1);
        }
        return outcomes;
    },

    "Ask the wizard for advice.":
        function(game_state, outcomes) {
        outcomes.add("frog_advice", 5);
        outcomes.add("wizard_gives_you_advice", 10);
        outcomes.add("wizard_gives_you_item", 5);
        outcomes.add("wizard_gives_you_sword", 1);
        return outcomes;
    },

    "ATTACK": function(game_state, outcomes) {
        var weapon_bonus = 0;
        if (game_state.character.equipped_weapon !== "") {
            weapon_bonus = items.weapons_map[
                game_state.character.equipped_weapon
            ].attack;
        }
        if (check_if_sword_of_great_good_stops_you(game_state) === true) {
            outcomes.add("your_sword_stops_you", 1);
        } else if (game_state.character.strength + weapon_bonus >
            game_state.persons[game_state.character.person].attack) {
            outcomes.add("kill", 1);
        } else {
            outcomes.add("lose_fight", 1);
        }
        return outcomes;
    },

    //b

    "Beg for money.": function(game_state, outcomes) {
        if (game_state.character.has_begged_st_george === true) {
            outcomes.add("st_george_kills_you", 1);
        } else {
            outcomes.add("st_george_gives_you_money", 9);
            outcomes.add("st_george_gives_you_apple", 1);
        }
        return outcomes;
    },

    "Beg him to teleport you to Lord Bartholomew's manor.":
        function(game_state, outcomes) {
        outcomes.add(
            "wizard_teleport_lord_bartholomew_manor", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Beg him to teleport you to the woods.":
        function(game_state, outcomes) {
        outcomes.add("wizard_teleport_woods", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Beth.": function(game_state, outcomes) {
        outcomes.add("beth_death", 1);
        return outcomes;
    },

    "Bide your time.": function(game_state, outcomes) {
        outcomes.add("bide_your_time", 3);
        outcomes.add("bide_your_time_and_die", 1);
        outcomes.add("bide_your_time_and_escape", 1);
        outcomes.add("notice_pattern", 1);
        dead_lunatic_repercussions(game_state, outcomes);
        if (game_state.character.person !== "other_lunatics") {
            outcomes.add("more_lunatics", 3);
        } else {
            outcomes.add("lunatics_laugh_at_you", 1);
        }
        return outcomes;
    },

    "Blow her off.": function(game_state, outcomes) {
        outcomes.add("felicity_gone", 1);
        return outcomes;
    },

    "Boast of your bravery.": function(game_state, outcomes) {
        outcomes.add("not_impressed", 1);
        switch (game_state.character.person) {
            case "blind_bartender":
                outcomes.add("annoy_blind_bartender", 3);
                break;
            case "eve":
                outcomes.add("annoy_eve", 3);
                break;
            case "lord_arthur":
                if (game_state.character.sex === FEMALE) {
                    outcomes.add(
                        "impress_lord_arthur_brave_as_woman", 6);
                } else {
                    outcomes.add(
                        "impress_lord_arthur_brave", 3);
                }
                break;
            case "olga":
                outcomes.add("annoy_olga", 2);
                outcomes.add("impress_olga", 1);
                break;
            case "simple_peasant":
                outcomes.add("annoy_simple_peasant", 1);
                outcomes.add("impress_simple_peasant", 2);
                break;
            case "st_george":
                outcomes.add("annoy_st_george", 3);
                outcomes.add("annoy_st_george_and_die", 2);
                outcomes.add("boast_and_get_money", 1);
                break;
            case "wizard":
                outcomes.add("annoy_wizard", 1);
                if (game_state.character.sex === MALE) {
                    outcomes.add("turn_to_woman", 1);
                }
        }
        return outcomes;
    },

    "Breed your cats.": function(game_state, outcomes) {
        outcomes.add("breed_cats", 3);
        outcomes.add("breed_cats_fail", 3);
        outcomes.add("breed_cats_lose_cats", 1);
        if (game_state.character.place === "church" &&
            game_state.places.church.burnable === true) {
            outcomes.add("priest_asks_you_to_breed_cats_elsewhere", 12);
        }
        return outcomes;
    },

    "Breed your deep-cave newts.": function(game_state, outcomes) {
        outcomes.add("breed_newts", 3);
        outcomes.add("breed_newts_fail", 1);
        return outcomes;
    },

    "Bribe the dog with a fish.": function(game_state, outcomes) {
        outcomes.add("dog_takes_fish", 1);
        return outcomes;
    },

    "Build an igloo.": function(game_state, outcomes) {
        outcomes.add("cannot_build_igloo", 1);
        if (game_state.character.items["seal carcass"] >= 1) {
            outcomes.add("eat_seal_in_igloo", 20);
        } else if (game_state.character.items.fish >= 1) {
            outcomes.add("eat_fish_in_igloo", 20);
        }else {
            outcomes.add("starve_in_igloo", 1);
        }
        return outcomes;
    },

    "BURN": function(game_state, outcomes) {
        // people will stop you from burning things if you're interacting
        // with them, except for the blind bartender, since he's blind
        if (game_state.character.person === null ||
            game_state.character.person === "blind_bartender") {
            outcomes.add("burn", 5);
            if (game_state.character.items["fancy red cloak"] < 1) {
                outcomes.add("set_self_on_fire", 1);
            }
        } else {
            outcomes.add("burn", 1);
            game_state.character.person === "guards" ?
            outcomes.add("guards_stop_you_burning", 1) :
            outcomes.add("someone_stops_you_burning", 1);
        }
        return outcomes;
    },

    "Buy a drink.": function(game_state, outcomes) {
        outcomes.add("assassins_sit_down", 1);
        if (game_state.character.sex === MALE) {
            outcomes.add("buy_a_drink_and_die", 2);
        }
        outcomes.add("buy_a_drink_and_meet_olga", 3);
        if (game_state.character.person !== "blind_bartender" &&
            game_state.persons.blind_bartender.alive === true) {
            outcomes.add("meet_blind_bartender", 8);
        }
        outcomes.add("overhear_stuff", 6);
        return outcomes;
    },

    "BUY_ITEM": function(game_state, outcomes, destination) {
        if (game_state.character.money !== "none") {
            outcomes.add("buy_an_item", 1);
        } else {
            outcomes.add("cannot_afford", 1);
        }
        return outcomes;
    },

    "BUY_WEAPON": function(game_state, outcomes) {
        if (items.money_map[
                items.weapons_map[game_state.for_sell
            ].cost].value <=
            items.money_map[game_state.character.money].value) {
            outcomes.add("buy_a_weapon", 1);
        } else {
            outcomes.add("cannot_afford_weapon", 2);
            outcomes.add("war_merchant_annoyed", 2);
            if (game_state.for_sell === "dagger" ||
                game_state.for_sell === "poison_dagger") {
                outcomes.add("killed_at_weapon_store", 8);
            }
        }
        return outcomes;
    },

    //c

    "Cass.": function(game_state, outcomes) {
        outcomes.add("cass_answer", 1);
        return outcomes;
    },

    "Celebrate your success.": function(game_state, outcomes) {
        outcomes.add("celebrate", 2);
        outcomes.add("celebrate_uncreatively", 1);
        if (game_state.places[game_state.character.place].burnable === true) {
            outcomes.add("burn", 2);
        }
        if (game_state.places[game_state.character.place].town === true) {
            if (game_state.character.sex === MALE) {
                outcomes.add("celebrate_at_brothel", 1);
            }
            if (game_state.places.market.burnable === true) {
                outcomes.add("celebrate_at_market", 1);
            }
            if (game_state.character.money !== "none") {
                outcomes.add("make_it_rain", 1);
            }
        }
        if (game_state.character.place === "tavern") {
            if (game_state.persons.lord_arthur.alive === true &&
                game_state.character.sex === MALE) {
                outcomes.add(
                    "black_out_and_become_pirate", 1);
            }
            outcomes.add("black_out_and_die", 1);
            outcomes.add("black_out_and_move", 1);
            if (game_state.character.sex === MALE) {
                outcomes.add("black_out_and_win", 1);
            }
        }
        return outcomes;
    },

    "Challenge Lord Bartholomew to a game of chess.":
        function(game_state, outcomes) {
        outcomes.add("lord_bartholomew_chess", 1);
        return outcomes;
    },

    "Challenge Lord Carlos to a game of chess.":
        function(game_state, outcomes) {
        outcomes.add("lord_carlos_chess", 1);
        return outcomes;
    },

    "Challenge the pirates to a game of chess.":
        function(game_state, outcomes) {
        outcomes.add("chess_cutlass", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add("chess_impressment_not", 1);
            } else {
                outcomes.add("chess_impressment", 1);
            }
        }
        outcomes.add("chess_lose_to_pirates", 1);
        return outcomes;
    },

    "Chat with Lord Bartholomew.": function(game_state, outcomes) {
        outcomes.add("chat_with_lord_bartholomew", 1);
        return outcomes;
    },

    "Chat with St. George.": function(game_state, outcomes) {
        outcomes.add("chat_with_st_george", 1);
        return outcomes;
    },

    "Chat with the blind bartender.":
        function(game_state, outcomes) {
        outcomes.add("chat_with_blind_bartender", 16);
        if (game_state.character.sex === MALE) {
            outcomes.add(
                "chat_with_blind_bartender_and_die", 1);
        }
        return outcomes;
    },

    "Chat with the dragon.": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "dragon_blue":
                outcomes.add("chat_with_dragon_blue", 3);
                outcomes.add("dragon_teleports_you", 1);
                break;
            case "dragon_red":
                outcomes.add("chat_with_dragon_red", 2);
                outcomes.add("dragon_burns_stuff", 1);
                outcomes.add("killed_by_dragon_red", 1);
                break;
        }
        return outcomes;
    },

    "Choke on fumes.": function(game_state, outcomes) {
        outcomes.add("choke_on_fumes", 1);
        outcomes.add("choke_on_fumes_and_die", 1);
        outcomes.add("choke_and_saved_by_blue_dragon", 1);
        return outcomes;
    },

    "Chop down a tree with your ax.":
    function(game_state, outcomes) {
        outcomes.add("chop_down_tree", 2);
        outcomes.add("chop_down_tree_and_die", 2);
        outcomes.add("get_sap", 2);
        outcomes.add("lose_ax", 1);
        return outcomes;
    },

    "Chow down on your apple.": function(game_state, outcomes) {
        outcomes.add("eat_apple", 3);
        outcomes.add("eat_apple_and_die", 1);
        outcomes.add("eat_apple_strength", 2);
        return outcomes;
    },

    "Chow down on your ball of sap.": function(game_state, outcomes) {
        outcomes.add("eat_sap", 1);
        return outcomes;
    },

    "Chow down on your black mushroom.":
    function(game_state, outcomes) {
        outcomes.add("mushroom_kills_you", 1);
        return outcomes;
    },

    "Chow down on your many-colored mushroom.":
    function(game_state, outcomes) {
        outcomes.add("start_tripping", 1);
        return outcomes;
    },

    "Chow down on your white mushroom.":
    function(game_state, outcomes) {
        outcomes.add("mushroom_makes_you_bigger", 1);
        if (game_state.character.place === "countryside" ||
            game_state.character.place === "woods") {
            outcomes.add("mushroom_makes_you_smaller", 1);
        }
        return outcomes;
    },

    "Chow down on your yellow mushroom.":
    function(game_state, outcomes) {
        outcomes.add("mushroom_tastes_bad", 1);
        return outcomes;
    },

    "Climb into the crow's nest.": function(game_state, outcomes) {
        outcomes.add("climb_and_die", 2);
        outcomes.add("climb_and_get_sap", 1);
        outcomes.add("merchant_ship_nest", 1);
        outcomes.add("watch_duty", 4);
        return outcomes;
    },

    "Climb to the top of the volcano.":
        function(game_state, outcomes) {
        outcomes.add("volcano_die", 3);
        outcomes.add("volcano_exercise", 2);
        outcomes.add("volcano_nothing", 2);
        return outcomes;
    },

    "Climb up the top sails.": function(game_state, outcomes) {
        outcomes.add("lose_peg", 1);
        return outcomes;
    },

    "Club a seal.": function(game_state, outcomes) {
        outcomes.add("club_a_seal", 2);
        outcomes.add("die_waiting_for_seal", 2);
        outcomes.add("waiting_for_seal", 2);
        return outcomes;
    },

    "Command him to teleport you to the countryside.":
        function(game_state, outcomes) {
        outcomes.add("wizard_teleport_countryside", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Command him to teleport you to Lord Carlos' manor.":
        function(game_state, outcomes) {
        outcomes.add(
            "wizard_teleport_lord_carlos_manor", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Complain about unfair imprisonment policies.":
        function(game_state, outcomes) {
        if (game_state.character.person === "lord_daniel") {
            outcomes.add("lord_daniel_throws_you_out", 1);
            outcomes.add("lord_daniel_lectures_you", 2);
        } else {
            outcomes.add("complaining_is_useless", 2);
            outcomes.add("guards_argue_with_you", 2);
            outcomes.add("guards_stop_you_complaining", 4);
        }
        return outcomes;
    },

    "Continue being a shrub.":
    function(game_state, outcomes) {
        outcomes.add("be_shrub", 8);
        outcomes.add("be_shrub_and_die", 3);
        outcomes.add("saved_by_witch", 2);
        return outcomes;
    },

    "Croak.": function(game_state, outcomes) {
        if (game_state.character.sex === FEMALE) {
            outcomes.add("croak_not", 1);
        } else {
            outcomes.add("attract_lady_frog", 1);
            outcomes.add("croak", 2);
        }
        return outcomes;
    },

    //d

    "Dance a jig.": function(game_state, outcomes) {
        outcomes.add("dance_a_jig", 4);

        if (game_state.character.place !== "void" &&
            game_state.character.place !== "ocean") {
                outcomes.add("dance_and_die", 1);
            if (functions.get_place(game_state).outside === true) {
                outcomes.add("dance_in_puddle", 1);
            }
        }

        if ((game_state.character.place === "tavern" &&
             game_state.places.tavern.burnable === true) ||
            (game_state.character.place === "lord_carlos_manor" &&
             game_state.places.lord_carlos_manor.burnable === true) &&
            game_state.character.sex === MALE) {
            outcomes.add("assassins_notice_dance", 4);
        }

        if (game_state.character.place === "ocean") {
            outcomes.add("dance_and_drown", 1);
            outcomes.add("swim_a_jig", 1);
            outcomes.add("cannot_dance", 1);
        }

        if (game_state.character.place === "woods" &&
            game_state.places.woods.burnable === true) {
            outcomes.add(
                "dance_with_woodland_creatures", 12);
            outcomes.add("dance_with_goblins", 2);
        }

        if (game_state.character.place === "cave") {
            outcomes.add("dance_fails_to_cheer", 4);
            outcomes.add("dance_and_slip", 4);
        }

        if (game_state.character.place === "arctic") {
            outcomes.add("dance_and_freeze", 4);
        }

        if (game_state.character.place === "countryside" ||
            game_state.character.place === "lord_bartholomew_manor" ||
            functions.get_place(game_state).town === true) {
            outcomes.add("dance_with_peasants", 2);
            outcomes.add("dance_for_coin", 2);
        }

        if (game_state.character.place === "void") {
            outcomes.add("void_dance", 8);
        }

        if (functions.get_place(game_state).town === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add("guards_watch_you_dancing", 2);
            } else if (game_state.character.sex === MALE) {
                outcomes.add("guards_stop_you_dancing", 2);
            }
        }

        if (game_state.character.person === "mermaid") {
            outcomes.add("mermaid_likes_your_dance", 8);
        }

        if (game_state.character.person === "wizard") {
            outcomes.add("turn_to_woman", 4);
        }

        if (game_state.character.person !== null) {
            outcomes.add("not_impressed", 2);
        }

        return outcomes;
    },

    "Demand that he teleport you to the smoking volcano.":
        function(game_state, outcomes) {
        outcomes.add("wizard_teleport_smoking_volcano", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Demand that he teleport you to the tower.":
        function(game_state, outcomes) {
        outcomes.add("wizard_teleport_tower", 5);
        outcomes.add("wizard_teleport_random", 1);
        return outcomes;
    },

    "Destroy all human civilizations.":
        function(game_state, outcomes) {
        outcomes.add("killed_by_hero", 1);
        return outcomes;
    },

    "Dina.": function(game_state, outcomes) {
        outcomes.add("dina_death", 1);
        return outcomes;
    },

    "Dive for pearls.": function(game_state, outcomes) {
        outcomes.add("dive_and_die", 3);
        outcomes.add("get_pearl", 1);
        outcomes.add("diving_saved_by_mermaid", 1);
        return outcomes;
    },

    "Do some farm work.": function(game_state, outcomes) {
        outcomes.add("farm_work", 3);
        outcomes.add("farm_work_and_apple", 1);
        outcomes.add("farm_work_and_coin", 1);
        outcomes.add("farm_work_and_die", 1);
        outcomes.add("farm_work_and_donkey", 1);
        outcomes.add("farm_work_and_pitchfork", 1);
        return outcomes;
    },

    "Do some gambling.": function(game_state, outcomes) {
        outcomes.add("gambling_lose", 1);
        outcomes.add("gambling_win", 1);
        if (game_state.character.place === "tavern") {
            if (game_state.character.sex === MALE) {
                outcomes.add("gambling_die", 1);
            } else {
                outcomes.add("gambling_die_not", 1);
            }
            if (game_state.persons.olga.alive === true) {
                outcomes.add("gambling_lady", 1);
            }
        }
        return outcomes;
    },

    "Do some swashbuckling.": function(game_state, outcomes) {
        if (game_state.character.items.cutlass > 0) {
            outcomes.add("kill_merchants", 1);
        } else {
            outcomes.add("no_cutlass", 1);
        }
        outcomes.add("swashbuckle_and_die", 1);
        if (game_state.character.has_lost_leg === false &&
            game_state.persons.lord_arthur.alive === true) {
            outcomes.add("lose_leg", 2);
        }
        outcomes.add("hold_your_own", 1);
        return outcomes;
    },

    "Donate to the church.": function(game_state, outcomes) {
        if (game_state.persons.lord_carlos.alive === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add(
                    "assassinated_in_church_not", 1);
            } else {
                outcomes.add("assassinated_in_church", 1);
            }
        }
        if (game_state.persons.priestess.alive === true) {
            outcomes.add("blessed", 2);
        }
        outcomes.add("feel_bad_about_donation", 3);
        outcomes.add("feel_good_about_donation", 5);
        if (game_state.persons.st_george.alive === true) {
            outcomes.add("hammer_from_st_george", 1);
        }
        return outcomes;
    },

    "Drink a random potion.": function(game_state, outcomes) {
        outcomes.add("drink_piss", 2);
        outcomes.add("grow_tail", 2);
        outcomes.add("monstrosity_potion", 1);
        outcomes.add("random_strength", 2);
        outcomes.add("random_transform", 2);
        if (game_state.persons.wizard.alive === true) {
            if (game_state.character.sex === MALE) {
                outcomes.add("random_killed_by_wizard", 1);
            } else {
                outcomes.add("random_out_of_lab", 1000);
            }
        }
        outcomes.add("random_death", 1);
        outcomes.add("start_tripping", 1);
        return outcomes;
    },

    "Drop anchor.": function(game_state, outcomes) {
        outcomes.add("cannot_drop_anchor", 2);
        outcomes.add("drop_anchor_and_die", 2);
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("drop_anchor_and_kill_whale", 1);
            outcomes.add("drop_anchor_and_save_ship", 1);
            outcomes.add("get_punished", 5);
        }
        return outcomes;
    },

    "Drown.": function(game_state, outcomes) {
        outcomes.add("drown", 1);
        return outcomes;
    },

    //e

    "E4.": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "lord_bartholomew":
                outcomes.add("e4_lose_bartholomew", 1);
                outcomes.add("e4_win_bartholomew", 1);
                break;
            case "lord_carlos":
                outcomes.add("e4_lose_carlos", 1);
                outcomes.add("e4_win_carlos", 1);
                break;
        }
        return outcomes;
    },

    "Eat a fly.": function(game_state, outcomes) {
        outcomes.add("fly_tastes_good", 1);
        outcomes.add("human_with_fly_in_mouth", 1);
        if (functions.get_place(game_state).populated === true) {
            outcomes.add("stepped_on", 1);
        }
        return outcomes;
    },

    "Enact your elaborate scheme.": function(game_state, outcomes) {
        outcomes.add("steal_cutlass", 1);
        outcomes.add("fail_at_new_career", 2);
        if (game_state.persons.lord_carlos.alive === true) {
            outcomes.add("kill_lord_carlos", 1);
        }
        outcomes.add("killed_by_dragon", 1);
        return outcomes;
    },

    "Engulf everything in flames.": function(game_state, outcomes) {
        outcomes.add("burn", 1);
        return outcomes;
    },

    "Enter your deep-cave newt in the race.":
        function(game_state, outcomes) {
        outcomes.add("enter_newt_and_lose", 1);
        outcomes.add("enter_newt_and_provoke_mob", 1);
        outcomes.add("enter_newt_and_win_donkey", 1);
        outcomes.add("enter_newt_and_win_money", 1);
        outcomes.add("enter_newt_and_win_pitchfork", 1);
        return outcomes;
    },

    "Enter the void.": function(game_state, outcomes) {
        outcomes.add("enter_the_void", 1);
        return outcomes;
    },

    "Eve.": function(game_state, outcomes) {
        outcomes.add("right_name", 1);
        return outcomes;
    },

    "Exit the void.": function(game_state, outcomes) {
        outcomes.add("leave_in_a_puff", 1);
        return outcomes;
    },

    //f

    "Fill the place with fire.": function(game_state, outcomes) {
        outcomes.add("burn", 1);
        return outcomes;
    },

    "Fire a cannon.": function(game_state, outcomes) {
        outcomes.add("fire_cannon_and_die", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("fire_cannon_and_get_flogged", 1);
            outcomes.add("fire_cannon_and_get_rewarded", 1);
        }
        return outcomes;
    },

    "Float through the void.": function(game_state, outcomes) {
        outcomes.add("void_float", 2);
        outcomes.add("void_float_dust", 1);
        outcomes.add("void_killed_by_anomaly", 1);
        outcomes.add("void_strength", 1);
        return outcomes;
    },

    "Flaunt your wealth.": function(game_state, outcomes) {
        if (game_state.character.sex === FEMALE) {
            outcomes.add("guards_watch_you_rich", 1);
        } else {
            outcomes.add("guards_stop_you_rich", 1);
        }
        if (game_state.persons.st_george.alive === true) {
            outcomes.add("st_george_warns_you", 1);
        }
        outcomes.add("wealthy_people_sneer", 1);
        outcomes.add("you_get_mobbed", 1);
        return outcomes;
    },

    "FLIRT_WITH": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "eve":
                if (game_state.character.sex === FEMALE) {
                    //outcomes.add("killed_by_eve_not", 1);
                    outcomes.add("lesbian_flirt_with_eve", 1);
                } else {
                    outcomes.add("killed_by_eve", 1);
                    outcomes.add("wowed_eve", 8);
                    outcomes.add("eve_loses_you_in_woods", 1);
                    if (game_state.outcome !== "right_name") {
                        outcomes.add("eve_name", 1);
                    }
                    if (game_state.persons.eve.attracted >= 4) {
                        outcomes.add(
                            "forced_to_marry_eve", 1000);
                    }
                    if (game_state.character.has_tail === true) {
                        outcomes.add("tail_eve", 2);
                    }
                }
                break;
            case "mermaid":
                outcomes.add("wowed_mermaid", 8);
                outcomes.add(
                    "flirt_with_mermaid_and_die", 2);
                if (game_state.character.has_tail === true) {
                    outcomes.add("tail_mermaid", 1);
                }
                break;
            case "nymph_queen":
                outcomes.add("flirt_and_shrub", 1);
                break;
            case "olga":
                var name =
                    game_state.persons[game_state.character.person].name;
                if (name === "the pretty lady") {
                    if (game_state.character.sex === FEMALE) {
                        outcomes.add("killed_by_olga_not", 1);
                    } else {
                        outcomes.add("killed_by_olga", 1);
                    }
                    outcomes.add("rebuffed_by_olga", 1);
                    outcomes.add("wowed_olga", 8);
                    if (game_state.character.has_tail === true) {
                        outcomes.add("tail_olga", 2);
                    }
                } else if (name === "Olga") {
                    if (game_state.character.place === "tavern") {
                        outcomes.add(
                            "go_upstairs_with_olga", 9);
                        if (game_state.character.sex === FEMALE) {
                            outcomes.add(
                                "go_upstairs_and_die_not", 1);
                        } else {
                            outcomes.add(
                                "go_upstairs_and_die", 1);
                        }
                    } else {
                        outcomes.add(
                            "wowed_olga_upstairs", 1);
                    }
                }
                break;
        }
        return outcomes;
    },

    "Flirt with Felicity.": function(game_state, outcomes) {
        if (game_state.character.sex === FEMALE) {
            outcomes.add("lesbian_flirt_with_felicity", 1);
        } else {
            if (game_state.persons.felicity.attracted > 5) {
                outcomes.add("felicity_loves_you", 1);
            } else {
                outcomes.add("rebuffed_by_felicity", 1);
                outcomes.add("wowed_felicity", 6);
            }
        }
        return outcomes;
    },

    "Flirt with the fat lady who feeds you.":
        function(game_state, outcomes) {
        if (game_state.character.sex === FEMALE) {
            outcomes.add("lesbian_flirt_with_felicity", 2);
        } else {
            outcomes.add("rebuffed_by_fat_lady", 2);
            outcomes.add("wowed_fat_lady", 5);
            if (game_state.character.person === "other_lunatics") {
                outcomes.add("lunatics_jeer", 2);
            }
        }
        return outcomes;
    },

    "Freeze to death.": function(game_state, outcomes) {
        outcomes.add("freeze", 3);
        outcomes.add("saved_by_inuits", 1);
        if (game_state.persons.wizard.alive === true) {
            outcomes.add("see_wizard_with_penguins", 1);
        }
        return outcomes;
    },

    //g

    "Gather void dust.": function(game_state, outcomes) {
        outcomes.add("get_void_dust", 1);
        outcomes.add("get_no_void_dust", 1);
        return outcomes;
    },

    "Gawk at men.": function(game_state, outcomes) {
        outcomes.add("gawk_at_men", 4);
        //outcomes.add("gawk_at_men_and_meet_nobleman", 2);
        outcomes.add("gawk_at_men_and_meet_drunk", 1);
        if (game_state.character.has_tail === true) {
            outcomes.add("men_gawk_at_you", 2);
        }
        return outcomes;
    },

    "Gawk at women.": function(game_state, outcomes) {
        outcomes.add("gawk_and_get_assassinated", 1);
        outcomes.add("gawk_and_get_money", 1);
        outcomes.add("gawk_at_cat", 1);
        outcomes.add("gawk_at_cake", 1);
        outcomes.add("gawk_at_women", 4);
        if (game_state.character.has_tail === true) {
            outcomes.add("women_gawk_at_you", 2);
        }
        return outcomes;
    },

    // this special action interrupts your action when you're threatened and
    // you don't choose to fight or run away
    "GET_ATTACKED": function(game_state, outcomes) {
        outcomes.add("get_attacked", 1);
        return outcomes;
    },

    "Give your apple to an orphan.": function(game_state, outcomes) {
        outcomes.add("give_apple_to_orphan", 2);
        outcomes.add("give_apple_to_orphan_rebuffed", 1);
        outcomes.add("give_apple_to_self", 1);
        return outcomes;
    },

    "GIVE_FLOWERS": function(game_state, outcomes) {
        if (game_state.outcome === "give_flowers_felicity" ||
            game_state.outcome === "give_flowers_eve" ||
            game_state.outcome === "give_flowers_mermaid" ||
            game_state.outcome === "give_flowers_nymph_queen" ||
            game_state.outcome === "give_flowers_olga") {
            outcomes.add("give_flowers_twice", 1);
        } else if (game_state.outcome === "give_flowers_twice" ||
                   game_state.outcome === "give_flowers_more_than_twice") {
            outcomes.add("give_flowers_more_than_twice", 1);
        } else {
            switch (game_state.character.person) {
                case "eve":
                    outcomes.add("give_flowers_eve", 1);
                    break;
                case "mermaid":
                    outcomes.add(
                        "give_flowers_mermaid", 1);
                    break;
                case "nymph_queen":
                    outcomes.add(
                        "give_flowers_nymph_queen", 1);
                    break;
                case "olga":
                    outcomes.add("give_flowers_olga", 1);
                    break;
                default:
                    // Felicity is not actually there when you're interacting
                    // with her; if we get here in the logic, the character
                    // should be in the prison
                    outcomes.add("give_flowers_felicity", 1);
            }
        }
        return outcomes;
    },

    "GIVE_HER_CAT": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "eve":
                outcomes.add("give_cat_eve", 1);
                break;
            case "olga":
                outcomes.add("give_cat_olga", 1);
                break;
        }
        return outcomes;
    },

    "Give the wizard what he wants.": function(game_state, outcomes) {
        outcomes.add("wizard_compensates_you", 1);
        outcomes.add("wizard_dies", 1);
        outcomes.add("wizard_eats_mushroom", 2);
        outcomes.add("wizard_unjust", 1);
        return outcomes;
    },

    "Give your cat to the witch.": function(game_state, outcomes) {
        outcomes.add("witch_cat_nothing", 2);
        outcomes.add("witch_cat_refuse", 1);
        outcomes.add("witch_cat_trade", 3);
        return outcomes;
    },

    "Go deeper.": function(game_state, outcomes) {
        outcomes.add("go_deeper_and_die", 2);
        outcomes.add("go_deeper_to_hell", 2);
        outcomes.add("go_deeper_out", 1);
        return outcomes;
    },

    "Go fishing.": function(game_state, outcomes) {
        outcomes.add("catch_a_lot_of_fish", 1);
        outcomes.add("catch_big_fish", 1);
        outcomes.add("catch_fish", 4);
        outcomes.add("no_fish", 4);
        if (game_state.character.place === "docks") {
            outcomes.add("fish_up_ax", 1);
            outcomes.add("fish_up_pitchfork", 1);
            if (game_state.character.sex === MALE) {
                outcomes.add("fish_pirates_laugh", 2);
                outcomes.add(
                    "assassins_catch_you_fishing", 1);
            }
        }
        return outcomes;
    },

    "Go flower picking.": function(game_state, outcomes) {
        outcomes.add("get_a_four-leaf_clover", 2);
        outcomes.add("get_a_bouquet", 4);
        outcomes.add("killed_by_bee", 1);
        outcomes.add("no_flowers", 1);
        outcomes.add("no_flowers_frog", 1);
        return outcomes;
    },

    "Go mushroom picking.": function(game_state, outcomes) {
        outcomes.add("pick_mushroom", 8);
        outcomes.add("meet_stray_dog", 1);
        outcomes.add("no_mushroom_frog", 1);
        return outcomes;
    },

    "Go on a rampage.": function(game_state, outcomes) {
        outcomes.add("starve", 1);
        return outcomes;
    },

    "Go swimming in a pool of lava.": function(game_state, outcomes) {
        outcomes.add("cannot_find_lava", 1);
        if (game_state.character.items["fancy red cloak"] < 1) {
            outcomes.add("lava_and_die", 2);
        } else {
            outcomes.add("lava_swim", 2);
        }
        return outcomes;
    },

    "GO_TO": function(game_state, outcomes, destination) {
        outcomes.add("go_to", 1);
        return outcomes;
    },

    "Go to sleep.": function(game_state, outcomes) {
        if (functions.get_place(game_state).locked === false) {
            outcomes.add("wake_up_somewhere_else", 1);
        }

        if (functions.get_place(game_state).populated) {
            if (game_state.character.sex === MALE) {
                outcomes.add("wake_up_assassinated", 1);
            }
            outcomes.add("wake_up_richer", 1);
            outcomes.add("wake_up_robbed", 1);
            outcomes.add("wake_up_with_cat", 1);
        }

        switch (game_state.character.place) {
            case "arctic":
                outcomes.add("freeze_in_sleep", 6);
                break;
            case "lord_carlos_manor":
                if (game_state.places.lord_carlos_manor.burnable === true &&
                    game_state.character.sex === MALE) {
                    outcomes.add("wake_up_in_dungeon", 2);
                }
                break;
            case "ocean":
                outcomes.add("wake_up_drown", 10000);
                return outcomes;
                break;
            case "prison":
                if (game_state.character.sex === MALE) {
                    outcomes.add("wake_up_weasel", 2);
                }
                break;
            case "tower":
                if (game_state.character.sex === MALE) {
                    outcomes.add("wake_up_in_prison", 2);
                } else {
                    //outcomes.add("wake_up_in_prison_not", 2);
                }
                break;
            case "void":
                outcomes.add("void_sleep", 12);
                outcomes.add("wake_in_world", 6);
                break;
        }
        outcomes.add("wake_up", 5);
        outcomes.add("wake_up_dead", 1);

        return outcomes;
    },

    "Go to the other end of the rainbow.":
        function(game_state, outcomes, destination) {
        outcomes.add("another_pot_of_gold", 1);
        return outcomes;
    },

    "Grovel.": function(game_state, outcomes, destination) {
        outcomes.add("grovel_and_die", 2);
        outcomes.add("grovel_and_go_to_woods", 1);
        return outcomes;
    },

    //h

    "Have your cake and eat it too.": function(game_state, outcomes) {
        outcomes.add("have_cake_keep_cake", 2);
        outcomes.add("have_cake_lose_cake", 2);
        if (game_state.character.place !== "void") {
            outcomes.add("have_cake_void", 1);
        }
        return outcomes;
    },

    "Hide.": function(game_state, outcomes) {
        outcomes.add("hide", 3);
        outcomes.add("hide_and_die", 3);
        outcomes.add("hide_and_find_coins", 1);
        outcomes.add("hide_in_void", 1);
        return outcomes;
    },

    "Hide beneath the deck.": function(game_state, outcomes) {
        outcomes.add("hide_and_fight_rat", 1);
        outcomes.add("hide_and_miss_out", 2);
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("hide_beneath_deck_and_die", 1);
        }
        return outcomes;
    },

    "Hire an assassin.": function(game_state, outcomes) {
        if (game_state.character.sex === MALE) {
            outcomes.add("hire_assassin_and_die", 1);
        }
        if (game_state.character.money === "small_fortune" ||
            game_state.character.money === "large_fortune") {
            outcomes.add("hire_assassin", 4);
        } else {
            outcomes.add("too_poor_to_hire_assassin", 4);
        }
        return outcomes;
    },

    "Hop.": function(game_state, outcomes) {
        if (functions.get_place(game_state).outside === true) {
            outcomes.add("eaten_by_bird", 1);
        }
        outcomes.add("hop", 1);
        outcomes.add("hop_a_lot", 1);
        return outcomes;
    },

    //i

    "Ignite an inferno.": function(game_state, outcomes) {
        outcomes.add("burn", 1);
        return outcomes;
    },

    //j

    "Just keep swimming.": function(game_state, outcomes) {
        outcomes.add("swim_to_arctic", 2);
        outcomes.add("swim_to_woods", 2);
        outcomes.add("swim_to_the_end", 1);
        outcomes.add("swim_and_die", 1);
        return outcomes;
    },

    //k

    "Keep swimming.": function(game_state, outcomes) {
        outcomes.add("keep_swimming", 2);
        outcomes.add("arrive_at_mermaid_rock", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add(
                    "rescued_by_lord_arthur_as_woman", 6);
            } else {
                outcomes.add("rescued_by_lord_arthur", 1);
            }
        }
        outcomes.add("swim_and_die", 2);
        return outcomes;
    },

    "Kill everybody in a fit of rage.": function(game_state,
                                                 outcomes) {
        outcomes.add("kill_self_in_fit_of_rage", 2);
        outcomes.add("kill_nobody", 1);
        if (functions.get_place(game_state).town) {
            outcomes.add("guards_stop_you_killing", 1);
        }
        return outcomes;
    },

    "Kill yourself in frustration.": function(game_state, outcomes) {
        outcomes.add("kill_self_fail", 1);
        outcomes.add("kill_self", 2);
        if (game_state.character.items.dagger > 0 ||
            game_state.character.items.poison_dagger > 0 ||
            game_state.character.items.cutlass > 0 ||
            game_state.character.items.jeweled_cutlass > 0) {
            outcomes.add("seppuku", 12);
        }
        switch (game_state.character.place) {
            case "arctic":
            case "docks":
            case "mermaid_rock":
                outcomes.add("kill_self_in_ocean", 2);
                break;
            case "market":
            case "streets":
                if (game_state.persons.st_george.alive === true) {
                    outcomes.add("saved_by_st_george", 1);
                }
                outcomes.add("killed_by_horse", 2);
                break;
            case "countryside":
                outcomes.add("killed_by_horse", 2);
                break;
        }
        if (functions.get_place(game_state).town === true &&
            game_state.persons.st_george.alive === true) {
            outcomes.add("suicide_by_st_george", 1);
        }
        return outcomes;
    },

    "Kiss your frog.": function(game_state, outcomes) {
        if (game_state.character.sex === FEMALE) {
            outcomes.add("kiss_frog_and_die_not", 4);
        } else {
            outcomes.add("kiss_frog_and_die", 2);
        }
        outcomes.add("kiss_frog_cat", 1);
        outcomes.add("kiss_frog_jewels", 1);
        outcomes.add("kiss_frog_mushrooms", 1);
        outcomes.add("kiss_frog_lose_frog", 3);
        outcomes.add("kiss_frog_no_effect", 2);
        return outcomes;
    },

    //l

    "Laugh about the warden doing it alone on holidays.":
        function(game_state, outcomes) {
        outcomes.add("laugh_about_warden", 1);
        return outcomes;
    },

    "Leave in a huff.": function(game_state, outcomes) {
        outcomes.add("random_move", 1);
        return outcomes;
    },

    "Leave in a puff.": function(game_state, outcomes) {
        outcomes.add("leave_in_a_puff", 1);
        return outcomes;
    },

    "Let yourself have cake.": function(game_state, outcomes) {
        outcomes.add("eat_cake", 2);
        return outcomes;
    },

    "LICK_THE_GROUND": function(game_state, outcomes) {

        if (game_state.character.place === "ocean") {
            outcomes.add("lick_the_ocean", 10000);
            return outcomes;
        }

        if (game_state.outcome === "burn" ||
            game_state.character.place === "smoking_volcano") {
            outcomes.add("lick_ash", 10000);
        }

        outcomes.add("distasteful", 5);
        outcomes.add("infection", 1);

        if (game_state.outcome === "kill") {
            outcomes.add("lick_blood", 10000);
        }

        if (functions.get_place(game_state).town) {
            outcomes.add("guards_stop_you_licking", 6);
        }

        if (functions.get_place(game_state).populated) {
            outcomes.add("find_dagger", 1);
        }

        if (game_state.character.place === "arctic") {
            outcomes.add("ground_tastes_cold", 6);
        }

        if (game_state.character.place === "mermaid_rock") {
            outcomes.add("lick_the_salt", 6);
        }

        if (game_state.character.place === "wizard_lab" &&
            game_state.places.wizard_lab.burnable === true) {
            outcomes.add("monstrosity", 6);
        }

        return outcomes;
    },

    "Look for assassins.": function(game_state, outcomes) {
        outcomes.add("alley_is_clear", 1);
        if (game_state.character.sex === MALE) {
            outcomes.add("do_not_see_assassins", 1);
        }
        return outcomes;
    },

    "Look for a cat.": function(game_state, outcomes) {
        if (game_state.character.items.fish > 0 &&
            game_state.character.items.cat === 0) {
            outcomes.add("cat_smells_fish", 20);
        }
        outcomes.add("cannot_find_cat", 3);
        outcomes.add("chase_cat_to_dark_alley", 1);
        outcomes.add("ferocious_cat", 1);
        outcomes.add("find_a_cat", 4);
        if (game_state.persons.st_george.alive === true) {
            outcomes.add("find_st_george_instead", 1);
        }
        return outcomes;
    },

    "Look for a way out.": function(game_state, outcomes) {
        outcomes.add("find_a_way_out", 2);
        outcomes.add("find_deep_cave_newt", 2);
        outcomes.add("no_way_out", 3);
        outcomes.add("look_for_a_way_out_and_die", 3);
        return outcomes;
    },

    "Look for a weapon.": function(game_state, outcomes) {
        outcomes.add("find_a_war_merchant", 1);
        return outcomes;
    },

    "Look for dragons.": function(game_state, outcomes) {
        outcomes.add("cannot_find_dragon", 1);
        outcomes.add("dragon_and_die", 2);
        outcomes.add("meet_dragon_blue", 1);
        outcomes.add("meet_dragon_red", 1);
        return outcomes;
    },

    "Look for Lord Carlos' daughter.":
        function(game_state, outcomes) {
        outcomes.add("meet_eve", 4);
        outcomes.add("sneak_eve_and_die", 1);
        return outcomes;
    },

    "Look for mermaids.": function(game_state, outcomes) {
        switch (game_state.character.place) {
            case "mermaid_rock":
                outcomes.add("meet_mermaid", 4);
                outcomes.add("look_for_mermaids_and_die", 1);
                outcomes.add("find_lost_treasure", 1);
                outcomes.add("find_shiny_coin", 1);
                break;
            case "ocean":
                outcomes.add("fail_to_find_mermaids", 2);
                outcomes.add(
                        "fail_to_find_mermaids_find_turtle", 1);
                outcomes.add("find_mermaid_rock", 1);
                if (game_state.character.sex === FEMALE) {
                    outcomes.add(
                        "find_wooden_mermaid_as_woman", 1);
                } else {
                    outcomes.add("find_wooden_mermaid", 1);
                }
                outcomes.add(
                    "look_for_mermaids_and_drown", 1);
                break;
        }
        return outcomes;
    },

    "Look for nymphs.": function(game_state, outcomes) {
        if (game_state.character.sex === MALE) {
            outcomes.add("find_assassin_instead", 1);
            outcomes.add("look_for_nymphs_and_die", 1);
            outcomes.add("make_out_with_dryad", 2);
        }
        outcomes.add("cannot_find_nymphs", 3);
        outcomes.add("cannot_find_nymphs_find_apple", 1);
        outcomes.add("fall_into_cave", 1);
        outcomes.add("find_nymphs", 2);
        if (game_state.persons.nymph_queen.alive === true) {
            outcomes.add("meet_nymph_queen", 3);
        }
        return outcomes;
    },

    "Look for Olga.": function(game_state, outcomes) {
        outcomes.add("find_olga", 1);
        return outcomes;
    },

    "Look for sea turtles.": function(game_state, outcomes) {
        outcomes.add("find_sea_turtle", 1);
        outcomes.add("find_mermaid_instead", 1);
        outcomes.add("find_sea_turtle_and_drown", 1);
        outcomes.add("no_sea_turtle", 3);
        return outcomes;
    },

    "Look for St. George.": function(game_state, outcomes) {
        outcomes.add("find_st_george", 3);
        if (game_state.places.church.burnable === true) {
            outcomes.add("find_st_george_in_church", 5);
        }
        outcomes.add("trip_over_a_cat", 1);
        outcomes.add("forget_what_you_were_doing", 1);
        return outcomes;
    },

    "Look for the wizard.": function(game_state, outcomes) {
        outcomes.add("frog", 4);
        outcomes.add("frog_and_die", 2);
        if (game_state.character.items["yellow mushroom"] > 0) {
            outcomes.add("wizard_wants_mushroom", 10000);
        }
        outcomes.add("find_wizard_teleport", 4);
        outcomes.add("find_wizard", 6);
        outcomes.add("find_wizard_get_frog", 2);
        return outcomes;
    },

    "Look for witches.": function(game_state, outcomes) {
        if (game_state.places.woods.burnable === true) {
            outcomes.add("meet_witch", 1);
        }
        outcomes.add("cannot_find_witch", 1);
        return outcomes;
    },

    "Look through the trash.": function(game_state, outcomes) {
        if (game_state.character.sex === MALE) {
            outcomes.add("guards_stop_you_trash", 1);
            outcomes.add("trash_die", 1);
        }
        outcomes.add("trash_ax", 1);
        outcomes.add("trash_cat", 1);
        outcomes.add("meet_stray_dog", 1);
        outcomes.add("trash_nothing", 3);
        return outcomes;
    },

    "Look up into the sky and yell, \"NOOOOOOOOOOOOO!\"":
        function(game_state, outcomes) {
        outcomes.add("god_resurrects_cat", 1);
        outcomes.add("yelling_doesnt_help", 2);
        return outcomes;
    },

    "Loot.": function(game_state, outcomes) {
        outcomes.add("loot_and_die", 1);
        outcomes.add("loot_arrested", 1);
        outcomes.add("loot_item", 2);
        outcomes.add("loot_items", 1);
        outcomes.add("loot_weapon", 1);
        return outcomes;
    },

    "LOVE_POTION": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "eve":
                outcomes.add("miss_eve", 1);
                outcomes.add("potion_eve", 2);
                break;
            case "lord_arthur":
                outcomes.add("potion_lord_arthur", 1);
                break;
            case "lord_bartholomew":
                outcomes.add("potion_lord_bartholomew", 1);
                break;
            case "lord_carlos":
                outcomes.add("potion_lord_carlos", 1);
                break;
            case "lord_daniel":
                outcomes.add("potion_lord_daniel", 1);
                break;
            case "mermaid":
                outcomes.add("potion_mermaid", 1);
                break;
            case "nobleman":
                outcomes.add("potion_nobleman", 1);
                break;
            case "nymph_queen":
                outcomes.add("miss_nymph_queen", 1);
                outcomes.add("potion_nymph_queen", 2);
                break;
            case "olga":
                outcomes.add("potion_olga", 1);
                if (game_state.character.place === "tavern" &&
                    game_state.persons.blind_bartender.alive) {
                    outcomes.add("miss_olga", 1);
                }
                break;
            case "priestess":
                outcomes.add("miss_priestess", 1);
                outcomes.add("potion_priestess", 2);
                break;
            case "st_george":
                outcomes.add("potion_st_george", 1);
                break;
        }
        return outcomes;
    },

    //m

    "Make a shady deal.": function(game_state, outcomes) {
        outcomes.add("deal_with_assassin", 2);
        outcomes.add("buy_black_market_item", 7);
        return outcomes;
    },

    "Make it hard for Lord Carlos to kill you.":
        function(game_state, outcomes) {
        outcomes.add("chance_to_escape", 1);
        outcomes.add("die_anyway", 7);
        outcomes.add("escape_to_cave", 1);
        outcomes.add("escape_to_arctic", 1);
        return outcomes;
    },

    "MARRY": function(game_state, outcomes) {
        outcomes.add("married", 1);
        return outcomes;
    },

    //n

    "Nf3.": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "lord_bartholomew":
                outcomes.add("nf3_lose_bartholomew", 1);
                outcomes.add("nf3_win_bartholomew", 1);
                break;
            case "lord_carlos":
                outcomes.add("nf3_lose_carlos", 1);
                outcomes.add("nf3_win_carlos", 1);
                break;
        }
        return outcomes;
    },

    //o

    //p

    "Pace around.": function(game_state, outcomes) {
        outcomes.add("pace", 5);
        outcomes.add("pace_and_die", 1);
        outcomes.add("pace_and_get_frog", 1);
        outcomes.add("pace_and_get_mushroom", 1);
        dead_lunatic_repercussions(game_state, outcomes);
        if (game_state.character.person !== "other_lunatics" &&
            game_state.persons.other_lunatics.alive === true) {
            outcomes.add("more_lunatics", 3);
        } else {
            outcomes.add("lunatics_trip_you", 1);
        }
        return outcomes;
    },

    "Panic!": function(game_state, outcomes) {
        outcomes.add("panic_and_die", 2);
        outcomes.add("panic_and_escape", 1);
        return outcomes;
    },

    "Pat yourself on the back.": function(game_state, outcomes) {
        outcomes.add("feel_accomplished", 1);
        return outcomes;
    },

    "Play dead.": function(game_state, outcomes) {
        outcomes.add("play_dead_and_die", 3);
        outcomes.add("play_dead_works", 1);
        return outcomes;
    },

    "Play in the snow.": function(game_state, outcomes) {
        outcomes.add("play_in_the_snow", 4);
        outcomes.add("penguins", 2);
        return outcomes;
    },

    "Play poorly and turn the board around once you're losing.":
        function(game_state, outcomes) {
        outcomes.add("turn_board_around", 3);
        return outcomes;
    },

    "Pray to a higher power.": function(game_state, outcomes) {

        if (game_state.character.sex === MALE) {
            outcomes.add("assassin_prayer_answered", 1);
        }
        outcomes.add("god_gives_you_a_spouse", 1);
        outcomes.add("god_gives_you_holy_strength", 1);
        outcomes.add("god_shows_you_the_way", 1);
        outcomes.add("god_showers_you_with_gold", 1);
        outcomes.add("god_tells_you_stuff", 3);
        outcomes.add("god_tells_you_to_burn_stuff", 1);
        outcomes.add("ignored", 3);

        for (var item in game_state.character.items) {
            if (game_state.character.items[item] > 0 ||
                game_state.character.money !== "none") {
                outcomes.add("god_tests_you", 1);
                break;
            }
        }

        if (game_state.places[game_state.character.place].burnable) {
            outcomes.add("god_commits_arson", 2);
        }

        if (game_state.character.place === "tavern" &&
            game_state.places.tavern.burnable === true) {
            outcomes.add("god_gives_you_jewels", 3);
        }

        if (game_state.character.place === "void") {
            outcomes.add("void_prayer", 12);
        }

        if (game_state.places[game_state.character.place].town &&
            game_state.persons.st_george.alive === true) {
            outcomes.add("st_george_joins_you_in_prayer", 1);
        }

        return outcomes;
    },

    "Pull on the wizard's beard to make sure it's real.":
        function(game_state, outcomes) {
        outcomes.add("pull_beard_and_die", 1);
        outcomes.add("pull_beard_and_frog", 1);
        outcomes.add("pull_beard_and_teleport", 1);
        return outcomes;
    },

    //q

    "Quit while you're ahead.": function(game_state, outcomes) {
        outcomes.add("fail_to_die", 3);
        outcomes.add("kill_self", 1);
        return outcomes;
    },

    //r

    "Raise a sail.": function(game_state, outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("impress_lord_arthur", 1);
            outcomes.add("killed_by_lord_arthur", 1);
            outcomes.add("lord_arthur_tells_sail", 2);
            outcomes.add("merchant_ship_sail", 1);
        }
        outcomes.add("raise_sail_and_get_to_land", 4);
        return outcomes;
    },

    "Read a spellbook.": function(game_state, outcomes) {
        outcomes.add("read_and_die", 2);
        outcomes.add("read_clover", 2);
        outcomes.add("read_spell_book", 12);
        return outcomes;
    },

    "Release your inner arsonist.": function(game_state, outcomes) {
        outcomes.add("burn", 1);
        return outcomes;
    },

    "Repay your debts.": function(game_state, outcomes) {
        outcomes.add("repay_and_die", 1);
        outcomes.add("repay_and_live", 1);
        return outcomes;
    },

    "Ribbit.": function(game_state, outcomes) {
        if (game_state.character.place !== "ocean") {
            outcomes.add("eaten_by_weasel", 1);
        }
        outcomes.add("human", 1);
        outcomes.add("ribbit", 1);
        return outcomes;
    },

    "Run around like a chicken with its head cut off.":
        function(game_state, outcomes) {
        outcomes.add("run_like_chicken", 1);
        return outcomes;
    },

    "Run away with your head.":
        function(game_state, outcomes) {
        outcomes.add("run_away_with_head_die", 1);
        if (game_state.persons.wizard.alive === true && 
            game_state.places.wizard_lab.burnable === true) {
            outcomes.add("run_away_with_head_survive", 3);
        }
        return outcomes;
    },

    "Run away without your head.":
        function(game_state, outcomes) {
        outcomes.add("run_away_without_head", 1);
        return outcomes;
    },

    "Run like the Devil.": function(game_state, outcomes) {
        if (game_state.character.is_threatened) {
            if (game_state.character.person === "dog") {
                outcomes.add("dog_catches_you", 9);
            } else {
                outcomes.add("escape", 9);
            }
            if (game_state.character.has_tail === true) {
                outcomes.add("caught_by_tail_and_die", 1);
            } else {
                if (game_state.persons[
                        game_state.character.person
                    ].preferred_attack === "arrest") {
                    outcomes.add("caught_and_arrested", 1);
                } else {
                    outcomes.add("caught_and_die", 1);
                }
            }
        } else if (game_state.character.person === "olga") {
            outcomes.add("escape_unmarried", 1);
            outcomes.add("caught_by_olga", 1);
        } else if (game_state.character.person === "felicity") {
            outcomes.add("escape_unmarried", 1);
        }
        return outcomes;
    },

    //s

    "Say you love her too.": function(game_state, outcomes) {
        outcomes.add("felicity_lets_you_out", 9);
        outcomes.add("what_a_shame", 1);
        return outcomes;
    },

    "Scrub the deck.": function(game_state, outcomes) {
        outcomes.add("scrub_the_deck", 3);
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("scrub_get_thrown_off_ship", 1);
            outcomes.add("lord_arthur_tells_scrub", 2);
            outcomes.add("impress_lord_arthur", 1);
            outcomes.add("merchant_ship_scrub", 1);
        }
        return outcomes;
    },

    "SHOW_COIN": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "dragon_blue":
                outcomes.add("dragon_coin_trade", 1);
                break;
            case "dragon_red":
                outcomes.add("dragon_coin_die", 1);
                break;
            case "lord_arthur":
                outcomes.add("lose_coin_arthur", 1);
                break;
            case "lord_bartholomew":
                outcomes.add("lose_coin_bartholomew", 1);
                break;
            case "lord_carlos":
                outcomes.add("lose_coin_carlos", 1);
                break;
            case "lord_daniel":
                outcomes.add("lose_coin_daniel", 1);
                break;
        }
        return outcomes;
    },

    "Sing a song.": function(game_state, outcomes) {

        outcomes.add("no_one_cares", 2);
        outcomes.add("sing_about_stuff", 5);

        if (functions.get_place(game_state).town) {
            if (game_state.character.has_tail === false) {
                if (game_state.character.sex === MALE) {
                    outcomes.add("cannot_hear_assassin", 1);
                }
            } else {
                outcomes.add("saved_by_tail", 1);
            }
        }

        if (functions.get_place(game_state).locked === false) {
            outcomes.add("wander_while_singing", 1);
        }

        if (game_state.character.person !== null) {
            outcomes.add("not_impressed", 1);
        }

        switch (game_state.character.place) {
            case "church":
                if (game_state.places.church.burnable === true) {
                    outcomes.add(
                        "priestess_takes_offense", 10);
                }
                break;
            case "docks":
                outcomes.add("pirates_ruin_song", 10);
                break;
            case "streets":
            case "market":
                outcomes.add("crowd_hates_your_voice", 1);
                outcomes.add(
                    "earn_small_fortune_in_coins", 3);
                if (game_state.character.sex === FEMALE) {
                    outcomes.add(
                        "guards_watch_you_singing", 2);
                } else {
                    outcomes.add(
                        "guards_stop_you_singing", 2);
                }
                break;
            case "mermaid_rock":
                if (game_state.character.person !== "mermaid") {
                    outcomes.add("sing_to_greeks", 10);
                }
                break;
            case "lord_carlos_manor":
                if (game_state.places.lord_carlos_manor.burnable === true) {
                    outcomes.add(
                        "sing_at_lord_carlos_manor", 10);
                }
                break;
            case "tavern":
                if (game_state.places.tavern.burnable === true) {
                    if (game_state.character.sex === MALE) {
                        outcomes.add(
                            "assassins_approach", 5);
                        outcomes.add(
                            "song_cut_short", 1);
                    }
                    outcomes.add(
                        "crowd_hates_your_voice", 1);
                    outcomes.add(
                        "earn_small_fortune_in_coins", 3);
                    outcomes.add("tavern_song", 3);
                    if (game_state.persons.olga.alive === true) {
                        outcomes.add(
                            "tavern_song_and_meet_olga", 2);
                    }
                    if (game_state.persons.drunk.alive === true) {
                        outcomes.add(
                            "tavern_song_and_meet_drunk", 2);
                    }
                }
                break;
            case "void":
                outcomes.add("void_song", 9);
                break;
        }

        switch (game_state.character.person) {
            case "mermaid":
                outcomes.add("mermaid_dislikes_your_song", 5);
                outcomes.add("sing_to_mermaid", 10);
                break;
            case "olga":
                if (game.get_plerson().name === "Olga") {
                    outcomes.add("sing_to_olga", 100);
                }
                break;
            case "wizard":
                outcomes.add("wizard_complains", 10);
                if (game_state.character.sex === MALE) {
                    outcomes.add("turn_to_woman", 10);
                }
                break;
        }

        return outcomes;
    },

    "Sink.": function(game_state, outcomes) {
        outcomes.add("drown", 3);
        outcomes.add("saved_by_mermaid", 1);
        return outcomes;
    },

    "Slurp down your potion of strength.":
        function(game_state, outcomes) {
        outcomes.add("grow_stronger_potion", 1);
        return outcomes;
    },

    "Slurp down your potion of tail growth.":
        function(game_state, outcomes) {
        outcomes.add("grow_tail_potion", 1);
        return outcomes;
    },

    "Slurp down your potion of transformation.":
        function(game_state, outcomes) {
        outcomes.add("transform", 1);
        return outcomes;
    },

    "Sneak around.": function(game_state, outcomes) {
        if (game_state.character.place === "lord_carlos_manor") {
            if (game_state.character.sex === MALE) {
                outcomes.add("sneak_and_die", 4);
            } else {
                outcomes.add("sneak_and_die_not", 3);
            }
            outcomes.add("get_poison_dagger", 1);
            if (game_state.persons.lord_carlos.alive === true) {
                if (game_state.character.sex === FEMALE) {
                    //outcomes.add(
                    //    "meet_lord_carlos_as_woman", 4);
                } else {
                    outcomes.add("killed_by_lord_carlos", 1);
                    outcomes.add("meet_lord_carlos", 4);
                }
            }
            if (game_state.persons.eve.alive === true) {
                outcomes.add("meet_eve", 4);
            }
        } else if (game_state.character.place === "lord_bartholomew_manor") {
            outcomes.add("sneak_and_die_bartholomew", 1);
            outcomes.add("sneak_bartholomew", 3);
            outcomes.add("sneak_pitchfork", 1);
            outcomes.add("sneak_cake", 1);
        }
        return outcomes;
    },

    "Snoop around.": function(game_state, outcomes) {
        outcomes.add("get_frog", 1);
        outcomes.add("red_cloak", 1);
        outcomes.add("snoop_around_and_die", 1);
        if (game_state.persons.wizard.alive === true) {
            outcomes.add("wizard_sends_you_to_arctic", 1);
        }
        return outcomes;
    },

    "SUCK_UP": function(game_state, outcomes) {
        switch (game_state.character.person) {
            case "lord_arthur":
                outcomes.add(
                    "suck_up_to_lord_arthur_cutlass", 1);
                outcomes.add(
                    "suck_up_to_lord_arthur_ocean", 1);
                break;
            case "lord_bartholomew":
                outcomes.add(
                    "suck_up_to_lord_bartholomew", 1);
                outcomes.add(
                    "suck_up_to_lord_bartholomew_countryside", 1);
                outcomes.add(
                    "suck_up_to_lord_bartholomew_pitchfork", 1);
                break;
            case "lord_carlos":
                if (game_state.character.sex === MALE) {
                    outcomes.add(
                        "suck_up_to_lord_carlos_and_die", 1);
                }
                outcomes.add(
                    "suck_up_to_lord_carlos_woods", 1);
                break;
            case "lord_daniel":
                outcomes.add(
                    "suck_up_to_lord_daniel", 1);
                outcomes.add(
                    "suck_up_to_lord_daniel_hammer", 1);
                outcomes.add(
                    "suck_up_to_lord_daniel_streets", 1);
                break;
        }
        return outcomes;
    },

    "Sun yourself on a rock.": function(game_state, outcomes) {
        outcomes.add("bronzed", 1);
        outcomes.add("eaten_by_roc", 1);
        outcomes.add("sunburnt", 1);
        outcomes.add("sunbathe_with_mermaid", 1);
        return outcomes;
    },

    "Swim.": function(game_state, outcomes) {
        outcomes.add("no_progress_swimming", 3);
        outcomes.add("see_ship", 1);
        outcomes.add("swim_and_die", 2);
        if (game_state.character.has_tail === true) {
            outcomes.add("tail_helps_you_swim", 2);
        }
        return outcomes;
    },

    "Swing on a rope.": function(game_state, outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("swing_into_captain", 1);
        }
        outcomes.add("swing_into_ocean", 1);
        outcomes.add("swing_on_rope_and_die", 1);
        return outcomes;
    },

    "Swing your cat.": function(game_state, outcomes) {
        outcomes.add("cat_escapes", 1);
        if (game_state.places[game_state.character.place].town === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add(
                    "guards_watch_you_swinging_cat", 1);
                outcomes.add("hit_assassin_with_cat_not", 3);
            } else {
                outcomes.add(
                    "guards_stop_you_swinging_cat", 1);
                outcomes.add("hit_assassin_with_cat", 3);
            }
        }
        return outcomes;
    },

    //t

    "Take the cake.": function(game_state, outcomes) {
        outcomes.add("take_the_cake", 1);
        return outcomes;
    },

    "Tell a priest God doesn't exist.":
        function(game_state, outcomes) {
        outcomes.add("god_smites_you", 1);
        outcomes.add("priest_agrees", 2);
        return outcomes;
    },

    "Tell a priest he's fat.":
        function(game_state, outcomes) {
        outcomes.add("priest_fat", 3);
        if (game_state.character.sex === FEMALE) {
            outcomes.add("priest_sexist_fat", 2);
        }
        return outcomes;
    },

    "Tell a priest you're the chosen one.":
        function(game_state, outcomes) {
        outcomes.add("priest_takes_pity", 1);
        outcomes.add("priest_disagrees", 2);
        if (game_state.character.sex === FEMALE) {
            outcomes.add("priest_sexist_chosen_one", 4);
        }
        return outcomes;
    },

    "Tell her you're sorry.": function(game_state, outcomes) {
        outcomes.add("apologize", 2);
        outcomes.add("apologize_and_die", 1);
        return outcomes;
    },

    "Tell him to assassinate Lord Arthur.":
        function(game_state, outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("assassinate_lord_arthur", 1);
        } else {
            outcomes.add("already_dead", 1);
        }
        return outcomes;
    },

    "Tell him to assassinate Lord Bartholomew.":
        function(game_state, outcomes) {
        if (game_state.persons.lord_bartholomew.alive === true) {
            outcomes.add("assassinate_lord_bartholomew", 1);
        } else {
            outcomes.add("already_dead", 1);
        }
        return outcomes;
    },

    "Tell him to assassinate Lord Carlos.":
        function(game_state, outcomes) {
        outcomes.add("offend_assassin", 1);
        return outcomes;
    },

    "Tell him to assassinate Lord Daniel.":
        function(game_state, outcomes) {
        if (game_state.persons.lord_daniel.alive === true) {
            outcomes.add("assassinate_lord_daniel", 1);
        } else {
            outcomes.add("already_dead", 1);
        }
        return outcomes;
    },

    "Tell the next person you meet that you're Lord Arthur.":
        function(game_state, outcomes) {
        outcomes.add("no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_bartholomew", 1);
                }
                break;
            case "lord_carlos_manor":
                if (game_state.persons.lord_carlos.alive === true) {
                outcomes.add(
                    "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_daniel", 1);
                }
                break;
        }
        return outcomes;
    },

    "Tell the next person you meet that you're Lord Bartholomew.":
        function(game_state, outcomes) {
        outcomes.add("no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_carlos_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                outcomes.add("disguise_and_arrested", 1);
                break;
        }
        return outcomes;
    },

    "Tell the next person you meet that you're Lord Carlos.":
        function(game_state, outcomes) {
        outcomes.add("no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_bartholomew", 1);
                }
                break;
            case "lord_carlos_manor":
                outcomes.add("disguise_and_die", 3);
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_daniel", 1);
                }
                break;
        }
        return outcomes;
    },

    "Tell the next person you meet that you're Lord Daniel.":
        function(game_state, outcomes) {
        outcomes.add("no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                outcomes.add("disguise_daniel_die", 1);
                break;
            case "lord_carlos_manor":
                if (game_state.persons.lord_carlos.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    outcomes.add("disguise_guards_laugh", 1);
                }
                break;
        }
        return outcomes;
    },

    "Tell the next person you meet that you're St. George.":
        function(game_state, outcomes) {
        outcomes.add("no_one_believes_you", 1);
        switch (game_state.character.place) {
            case "lord_bartholomew_manor":
                if (game_state.persons.lord_bartholomew.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_bartholomew", 1);
                }
                break;
            case "lord_carlos_manor":
                if (game_state.persons.lord_carlos.alive === true) {
                outcomes.add(
                    "disguise_meet_lord_carlos", 1);
                }
                break;
            case "tower":
                if (game_state.persons.lord_daniel.alive === true) {
                    outcomes.add(
                        "disguise_meet_lord_daniel", 1);
                }
                break;
        }
        return outcomes;
    },

    "Tell the guards you're a lunatic.":
        function(game_state, outcomes) {
        outcomes.add("a_rich_lunatic", 1);
        return outcomes;
    },

    "TELL_GUARDS": function(game_state, outcomes) {
        game_state.character.excuse === "rich" ?
        outcomes.add("a_rich_lunatic", 1) :
        outcomes.add("an_excuse_lunatic", 1);
        return outcomes;
    },

    "Terrorize the kingdom.": function(game_state, outcomes) {
        outcomes.add("killed_in_future", 1);
        return outcomes;
    },

    "Think.": function(game_state, outcomes) {
        outcomes.add("think", 8);
        outcomes.add("think_discouraged", 2);
        outcomes.add("think_four_ideas", 1);

        if (game_state.places[game_state.character.place].locked === false) {
            outcomes.add("think_elaborate_scheme", 1);
        }
        if (game_state.character.place !== "tavern") {
            outcomes.add("think_about_olga", 1);
        }

        if (game_state.character.place === "lord_carlos_manor" ||
            game_state.character.place === "wizard_lab") {
            outcomes.add("think_you_shouldnt_be_here", 3);
        }

        if ((game_state.character.place === "tavern" ||
            game_state.character.place === "dark_alley" ||
            game_state.character.place === "lord_carlos_manor") &&
            game_state.character.sex === MALE) {
            outcomes.add("think_of_getting_stabbed", 2);
        }

        if (game_state.character.place === "docks" ||
            game_state.character.place === "pirate_ship") {
            outcomes.add("think_pirates_laugh", 3);
        }

        if (game_state.character.place === "docks" ||
            game_state.character.place === "pirate_ship" ||
            game_state.character.place === "ocean" ||
            game_state.character.place === "mermaid_rock") {
            outcomes.add("think_ocean_is_big", 2);
            outcomes.add("think_bad_smell", 2);
        }

        if (game_state.character.place === "docks" &&
            game_state.persons.lord_arthur.alive) {
            outcomes.add("think_about_lord_arthur", 4);
        }

        if (game_state.character.place === "tower" &&
            game_state.places.tower.burnable === true) {
            if (game_state.character.sex === FEMALE) {
                outcomes.add("think_guard_men", 4);
            }
            outcomes.add("think_ax", 2);
            outcomes.add("think_jump", 4);
        }

        if (game_state.character.place === "countryside") {
            outcomes.add("think_about_lord_bartholomew", 2);
            if (game_state.character.sex === MALE) {
                outcomes.add("think_peasant_women", 4);
            }
        }

        if (game_state.character.place === "woods") {
            outcomes.add("think_fire", 2);
        }

        if (game_state.character.place === "arctic") {
            outcomes.add("think_ice", 2);
            outcomes.add("think_cold", 2);
        }

        if (game_state.character.place === "cave") {
            outcomes.add("think_bats", 2);
            outcomes.add("think_darkness", 2);
            outcomes.add("think_death", 2);
            outcomes.add("think_suffocation", 2);
        }

        if (game_state.character.place === "church") {
            outcomes.add("think_meaning_of_life", 2);
        }

        if (game_state.character.place === "void") {
            outcomes.add("think_void", 8);
        }

        if (game_state.outcome === "distasteful") {
            outcomes.add("think_should_not_lick_ground", 50);
        }

        if (game_state.character.person !== null) {
            outcomes.add("zone_out", 4);
        }

        return outcomes;
    },

    "Throw three of your cats at the giant three-headed dog.":
        function(game_state, outcomes) {
        outcomes.add("throw_cats_at_cerberus", 1);
        return outcomes;
    },

    "Throw your cat at the dog.": function(game_state, outcomes) {
        outcomes.add("throw_cat_and_keep_cat", 1);
        return outcomes;
    },

    "Thump yourself on the chest.": function(game_state, outcomes) {
        outcomes.add("feel_manly", 9);
        outcomes.add("thump_self_and_die", 1);
        if (game_state.places[
                game_state.character.place
            ].populated === true ||
            game_state.character.place === "countryside") {
            outcomes.add("peasant_woman_impressed", 1);
            outcomes.add("peasants_laugh_at_you", 2);
        }
        if (game_state.character.person === "wizard") {
            outcomes.add("wizard_gorilla", 20);
        }
        return outcomes;
    },

    "Tip a cow.": function(game_state, outcomes) {
        outcomes.add("cannot_tip_cow", 4);
        outcomes.add("tip_cow_and_die", 1);
        outcomes.add("tip_cow_and_lynch_mob", 1);
        return outcomes;
    },

    "Trade it for a fancy paladin sword.":
        function(game_state, outcomes) {
        outcomes.add("trade_coin_for_sword_of_great_good", 1);
        return outcomes;
    },

    "Trade it for a potion of love.":
        function(game_state, outcomes) {
        outcomes.add("trade_coin_for_potion_of_love", 1);
        return outcomes;
    },

    "Trade it for a large fortune.":
        function(game_state, outcomes) {
        outcomes.add("trade_coin_for_large_fortune", 1);
        return outcomes;
    },

    "Trade your void dust to the wizard.":
        function(game_state, outcomes) {
        outcomes.add("get_sword_of_great_evil", 1);
        return outcomes;
    },

    "Train with the guards.": function(game_state, outcomes) {
        if (game_state.character.strength > 3) {
            outcomes.add("train_and_win", 2);
        }
        outcomes.add("train_and_die", 1);
        outcomes.add("train_stronger", 3);
        outcomes.add("train_thrown_out", 1);
        return outcomes;
    },

    "Trash the place.": function(game_state, outcomes) {
        outcomes.add("trash_the_place", 4);
        if (game_state.character.place === "wizard_lab") {
            outcomes.add("trash_the_place_and_die", 2);
            outcomes.add("blow_up_the_lab", 1);
            if (game_state.persons.wizard.alive === true) {
                outcomes.add("wizard_stops_you_trashing", 1);
            }
        }
        if (game_state.character.place === "market") {
            outcomes.add("trash_the_market_and_die", 2);
        }
        return outcomes;
    },

    "Try to find the bottom of the rainbow.":
        function(game_state, outcomes) {
        outcomes.add("rainbow_gold", 2);
        outcomes.add("rainbow_fail", 1);
        outcomes.add("rainbow_die", 1);
        return outcomes;
    },

    "Try to reason with the dog.": function(game_state, outcomes) {
        outcomes.add("dog_kills_you", 1);
        outcomes.add("dog_lets_you_off_the_hook", 4);
        return outcomes;
    },

    "Try to reason with the mob.": function(game_state, outcomes) {
        outcomes.add("mob_kills_you", 4);
        outcomes.add("mob_lets_you_off_the_hook", 1);
        return outcomes;
    },

    "Try to save the cat.": function(game_state, outcomes) {
        outcomes.add("fail_to_save_cat", 1);
        outcomes.add("beat_up_by_kids", 1);
        outcomes.add("save_cat", 1);
        return outcomes;
    },

    "Try to save the witch.": function(game_state, outcomes) {
        outcomes.add("provoke_the_mob", 1);
        outcomes.add("killed_by_mob", 1);
        outcomes.add("save_witch", 1);
        return outcomes;
    },

    "Try to snatch the keys the first chance you get.":
        function(game_state, outcomes) {
        outcomes.add("beat_up_by_guards", 3);
        outcomes.add("steal_keys_and_die", 1);
        outcomes.add("steal_keys_and_escape", 1);
        return outcomes;
    },

    "Try to steal some of the dragon's treasure.":
        function(game_state, outcomes) {
        outcomes.add("steal_dragon_treasure", 1);
        outcomes.add("steal_and_die", 1);
        return outcomes;
    },

    //u

    //v

    //w

    "Waddle like God.": function(game_state, outcomes) {
        if (game_state.character.is_threatened) {
            outcomes.add("escape_like_god", 1);
            if (game_state.persons[
                    game_state.character.person
                ].preferred_attack === "arrest") {
                outcomes.add("caught_and_arrested_like_god", 9);
            } else {
                outcomes.add("caught_like_god", 9);
            }
        }
    },

    "Wait for a holiday to make your move.":
        function(game_state, outcomes) {
        outcomes.add("carefully_steal_keys", 1);
        outcomes.add("fail_to_steal_keys", 1);
        outcomes.add("saved_by_lord_bartholomew", 1);
        return outcomes;
    },

    "Wait where you are.": function(game_state, outcomes) {
        outcomes.add("wait_and_die", 2);
        if (game_state.persons.eve.alive === true) {
            outcomes.add("wait_and_meet_eve", 1);
        }
        if (game_state.persons.lord_carlos.alive === true) {
            outcomes.add("wait_and_meet_lord_carlos", 1);
        }
        return outcomes;
    },

    "Walk the plank.": function(game_state, outcomes) {
        outcomes.add("walk_across_board", 1);
        outcomes.add("walk_into_ocean", 1);
        return outcomes;
    },

    "Wander the countryside.": function(game_state, outcomes) {
        outcomes.add("cat_burning", 1);
        outcomes.add("go_to", 2);
        outcomes.add("meet_stray_dog", 1);
        outcomes.add("meet_stray_donkey", 1);
        outcomes.add("newt_race", 2);
        outcomes.add("rainbow", 1);
        outcomes.add("wander_the_countryside", 9);
        outcomes.add("witch_burning", 1);
        if (game_state.character.has_tail === true) {
            outcomes.add("peasants_laugh_at_tail", 2);
        }
        if (game_state.persons.peasant_lass.alive === true) {
            outcomes.add("meet_peasant_lass", 2);
        }
        if (game_state.persons.simple_peasant.alive === true) {
            outcomes.add("meet_simple_peasant", 1);
        }
        return outcomes;
    },

    "Watch a play.": function(game_state, outcomes) {
        outcomes.add("watch_play", 3);
        outcomes.add("riot", 1);
        return outcomes;
    },

    "Watch yourself run around like a chicken with its head cut off.":
        function(game_state, outcomes) {
        outcomes.add("run_like_chicken_watch", 1);
        return outcomes;
    },

    //x

    //y

    "Yell that there aren't penguins in the Arctic.":
        function(game_state, outcomes) {
        outcomes.add("penguins_dont_care", 1);
        return outcomes;
    },

    "YELL_A_PIRATE_PHRASE": function(game_state, outcomes) {
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("impress_lord_arthur", 1);
            outcomes.add("no_true_pirate_says_that", 1);
            outcomes.add("thrown_off_ship", 1);
        } else {
            outcomes.add("you_get_away_with_it", 1);
        }
        return outcomes;
    },

    "Yell, \"Don't leave without me!\"":
        function(game_state, outcomes) {
        outcomes.add("wizard_leaves_without_you", 1);
        return outcomes;
    },

    "Yell, \"I've lost my leg!\"": function(game_state, outcomes) {
        outcomes.add("no_one_cares_about_your_leg", 1);
        if (game_state.persons.lord_arthur.alive === true) {
            outcomes.add("lord_arthur_helps", 1);
        }
        return outcomes;
    },

    //z

};

function check_if_sword_of_great_good_stops_you(game_state) {
    if (game_state.character.equipped_weapon === "sword_of_great_good") {
       switch (game_state.character.person) {
            case "assassin":
            case "assassins":
            case "eve":
            case "dragon_red":
            case "lord_arthur":
            case "lord_carlos":
            case "lord_daniel":
            case "pirates":
            case "wizard":
                // the good sword will allow you to kill evil people
                return false;
            default:
                // the good sword does not allow you to kill innocents
                return true;
       }
    } else {
        return false;
    }
}

function dead_lunatic_repercussions(game_state, outcomes) {
    if (game_state.persons.other_lunatics.alive === false) {
        outcomes.add("warden_executes_you_for_homicide", 6);
        outcomes.add("guards_take_away_bodies", 6);
        outcomes.add("guards_kill_you_for_homicide", 6);
    }
}
