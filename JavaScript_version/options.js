"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/ 
/*global define */

var functions = require("./functions");
var items     = require("./items");
var raffle    = require("./raffle");

exports.get_options = function get_options(game_state) {

    var options = {"a": {}, "b": {}, "c": {}, "d": {} };
    if (game_state.character.is_dead || marriage_victory(game_state)) {
        set_game_over_options(options);
    } else if (game_state.outcome === "eve_name") {
        options.a = "Anna.";
        options.b = "Beth.";
        options.c = "Cass.";
        options.d = "Dina.";
        options.e = "Eve.";
    } else if (game_state.character.is_frog) {
        options.a = "Ribbit.";
        options.b = "Hop.";
        options.c = "Croak.";
        options.d = "Eat a fly.";
        options.e = "";
    } else if (game_state.character.is_monstrosity) {
        options.a = "Annihilate everything.";
        options.b = "Terrorize the kingdom.";
        options.c = "Go on a rampage.";
        options.d = "Destroy all human civilizations.";
        options.e = "";
    } else if (game_state.character.is_shrub) {
        options.a = "Continue being a shrub.";
        options.b = "Continue being a shrub.";
        options.c = "Continue being a shrub.";
        options.d = "Continue being a shrub.";
        options.e = "";
    } else if (game_state.marriage === true) {
        options.a = "MARRY";
        options.b = "Run like the Devil.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else if (game_state.outcome === "felicity_loves_you") {
        options.a = "Say you love her too.";
        options.b = "Blow her off.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else if (game_state.outcome === "hire_assassin" ||
               game_state.outcome === "already_dead") {
        options.a = "Tell him to assassinate Lord Arthur.";
        options.b = "Tell him to assassinate Lord Bartholomew.";
        options.c = "Tell him to assassinate Lord Carlos.";
        options.d = "Tell him to assassinate Lord Daniel.";
        options.e = "";
    } else if (burned_everything_victory(game_state)) {
        var messages = [
            " Some people just like to watch the world " +
            "burn. You are one of them. You win.",
            " You are satisfied with how everything has been burned. You win.",
        ];
        game_state.message += messages[functions.random_int(messages.length)];
        set_game_over_options(options);
    } else if (lords_victory(game_state)) {
        var lords_messages = [
            " With the last of the four lords dead, you have destroyed the " +
            "establishment and brought about a Utopian anarchy... " +
            "more or less. You win!",
        ];
        game_state.message += lords_messages[
            functions.random_int(lords_messages.length)
        ];
        set_game_over_options(options);
    } else if (Math.floor(Math.random() * 250) === 0 && 
               game_state.places[
                   game_state.character.place
               ].burnable === true) {
        set_pyro_options(options);
    } else {
        
        get_character_options(game_state, options);
        get_default_options(game_state, options);
        get_item_options(game_state, options);
        get_outcome_options(game_state, options);
        get_person_options(game_state, options);
        get_place_options(game_state, options);

        options.a = raffle.get(options.a);
        options.b = raffle.get(options.b);
        options.c = raffle.get(options.c);
        options.d = raffle.get(options.d);

        if (Math.floor(Math.random() * 250) === 0 &&
            game_state.outcome !== "think_four_ideas" &&
            game_state.character.place !== "void") {
            options.e = "Enter the void.";
        } else if (Math.floor(Math.random() * 4) === 0 &&
                   game_state.outcome !== "think_four_ideas" &&
                   game_state.character.place === "void") {
            options.e = "Exit the void.";
        } else {
            options.e = "";
        }
    }

    set_destination(game_state, options.c);
    game_state.marriage = false;

    return options;
};

exports.starting_options = {"a": "Ask about assassins.",
                            "b": "Buy a drink.",
                            "c": "Leave in a huff.",
                            "d": "Sing a song.",
                            "e": ""};

function burned_everything_victory(game_state) {

    for (var place in game_state.places) {
        if (game_state.places[place].burnable) {
            return false;
        }
    }
    game_state.score = parseInt(game_state.score) + 100;
    return true;
} 

function get_character_options(game_state, options) {

    if (game_state.character.money === "large_fortune" &&
        game_state.character.strength > 5 &&
        Math.floor(Math.random() * 3) === 0) {
        raffle.add(options.c, "Quit while you're ahead.", 1);
    }

    if (game_state.places[game_state.character.place].locked === false &&
        game_state.character.is_threatened === false) {
        raffle.add(options.c, "GO_TO", 4);
    }

    if (game_state.character.is_threatened === true) {
        if (game_state.character.person !== "guards") {
            raffle.add(options.b, "Play dead.", 1);
            raffle.add(options.d, "Panic!", 1);
        }
        raffle.add(options.c, "Run like the Devil.", 90);
        raffle.add(options.c, "Waddle like God.", 10);
    }

    if ((game_state.character.money === "large_fortune" ||
        game_state.character.money === "small_fortune") &&
        game_state.places[game_state.character.place].town === true
        ) {
        raffle.add(options.d, "Flaunt your wealth.", 1);
    }
}

function get_default_options(game_state, options) {

    raffle.add(options.a, "Think.", 1);
    if (game_state.character.place !== "void") {
        raffle.add(options.a, "LICK_THE_GROUND", 1);
        raffle.add(options.c, "Leave in a puff.", 1);
    }
    raffle.add(options.b, "Pray to a higher power.", 1);
    raffle.add(options.c, "Go to sleep.", 1);
    raffle.add(options.d, "Sing a song.", 1);
    raffle.add(options.d, "Dance a jig.", 1);
}

function get_item_options(game_state, options) {

    if (game_state.character.items["bag of jewels"] > 0) {
        raffle.add(options.a, "Admire your jewels.", 1);
    }

    if (game_state.character.items["ball of sap"] > 0 &&
        game_state.character.items["bouquet of flowers"] > 0 &&
        game_state.character.items["many-colored mushroom"] > 0 &&
        game_state.character.person === "witch") {
        raffle.add(options.b, "Ask the witch to brew you a potion.", 100);
    }

    if (game_state.character.items["black mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your black mushroom.", 1);
    }

    if (game_state.character.items["bouquet of flowers"] > 0 && 
        (game_state.character.person === "eve" ||
         game_state.character.person === "mermaid" ||
         game_state.character.person === "nymph_queen" ||
         game_state.character.person === "olga" ||
         game_state.character.place === "prison")) {
        raffle.add(options.b, "GIVE_FLOWERS", 100);
    }

    if (game_state.character.items.cat > 0) {
        raffle.add(options.d, "Swing your cat.", 1);
    }

    if (game_state.character.items.cat > 0 &&
        game_state.character.items.pearl> 0 &&
        game_state.character.person === "witch") {
        raffle.add(options.b, "Ask the witch to brew you a potion.", 100);
    }

    if (game_state.character.items.cat > 0 &&
        (game_state.character.person === "eve" ||
         game_state.character.person === "olga")) {
        raffle.add(options.a, "GIVE_HER_CAT", 5);
    }

    if (game_state.character.items["deep-cave newt"] > 0 &&
        game_state.character.items["white mushroom"] > 0 &&
        game_state.character.person === "witch") {
        raffle.add(options.b, "Ask the witch to brew you a potion.", 100);
    }

    if (game_state.character.items.donkey > 0) {
        raffle.add(options.c, "GO_TO", 6);
    }

    if (game_state.character.items.frog > 0 &&
        game_state.places[game_state.character.place].locked === false) {
        raffle.add(options.b, "Kiss your frog.", 1);
    }

    if (game_state.character.items["many-colored mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your many-colored mushroom.", 2);
    }

    if (game_state.character.items["potion of strength"] > 0) {
        raffle.add(options.d, "Slurp down your potion of strength.", 2);
    }

    if (game_state.character.items["potion of tail growth"] > 0) {
        raffle.add(options.d, "Slurp down your potion of tail growth.", 2);
    }

    if (game_state.character.items["potion of love"] > 0 && 
        (game_state.character.person === "eve" ||
        game_state.character.person === "mermaid" ||
        game_state.character.person === "olga" ||
        game_state.character.person === "nymph_queen" ||
        game_state.character.person === "priestess")) {
        raffle.add(options.b, "LOVE_POTION", 10000);
    }

    if (game_state.character.items["shiny foreign coin"] > 0 &&
        (game_state.character.person === "dragon_blue" ||
         game_state.character.person === "dragon_red" ||
         game_state.character.person === "lord_arthur" ||
         game_state.character.person === "lord_bartholomew" ||
         game_state.character.person === "lord_carlos" ||
         game_state.character.person === "lord_daniel")) {
        raffle.add(options.b, "SHOW_COIN", 100);
    }

    if (game_state.character.items["handful of void dust"] > 0 &&
        game_state.character.person === "wizard") {
        raffle.add(options.d, "Trade your void dust to the wizard.", 10000);
    }

    if (game_state.character.items["white mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your white mushroom.", 1);
    }

    if (game_state.character.items["yellow mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your yellow mushroom.", 1);
    }

}

function get_person_options(game_state, options) {

    if (game_state.character.person !== null) {
        raffle.add(options.a, "ATTACK", 20);
        raffle.add(options.b, "Boast of your bravery.", 1);
    }

    switch (game_state.character.person) {

        case "blind_bartender":
            raffle.add(options.c, "Chat with the blind bartender.", 14);
            break;

        case "dog":
            if (game_state.character.items.fish > 0) {
                raffle.add(options.b, "Bribe the dog with a fish.", 1000);
            }
            if (game_state.character.items.cat > 0) {
                raffle.add(options.c, "Throw your cat at the dog.", 10000);
            }
            raffle.add(options.d, "Try to reason with the dog.", 100);
            break;

        case "dragon_blue":
        case "dragon_red":
            raffle.add(options.c, "Chat with the dragon.", 10);
            raffle.add(options.d, "Try to steal some of the dragon's " +
                "treasure.", 10);
            break;

        case "eve":
        case "nymph_queen":
        case "olga":
            raffle.add(options.d, "FLIRT_WITH", 100);
            break;

        case "lord_arthur":
            raffle.add(options.b, "SUCK_UP", 10);
            break;

        case "lord_bartholomew":
            raffle.add(options.a, "Ask for asylum.", 10);
            raffle.add(options.b, "SUCK_UP", 10);
            raffle.add(options.c, "Chat with Lord Bartholomew.", 10);
            raffle.add(options.d, 
                "Challenge Lord Bartholomew to a game of chess.", 10);
            break;

        case "lord_carlos":
            if (game_state.character.money === "large_fortune" && 
                game_state.character.money === "small_fortune") {
                raffle.add(options.a, "Repay your debts.", 10);
            }
            raffle.add(options.b, "SUCK_UP", 5);
            raffle.add(options.b, "Grovel.", 10);
            raffle.add(options.c,  
                "Challenge Lord Carlos to a game of chess.", 15);
            raffle.add(options.d, 
                "Make it hard for Lord Carlos to kill you.", 15);
            break;

        case "lord_daniel":
            raffle.add(options.b, "SUCK_UP", 10);
            raffle.add(options.c, 
                "Complain about unfair imprisonment policies.", 10);
            break;

        case "mermaid":
            raffle.add(options.c, 
                "Ask the mermaid to take you back to land.", 15);
            raffle.add(options.d, "FLIRT_WITH", 100);
            break;

        case "mob":
            raffle.add(options.d, "Try to reason with the mob.", 10);
            break;

        case "peasant_lass":
        case "simple_peasant":
            raffle.add(options.d, "Ask for directions.", 100);
            break;

        case "pirates":
            raffle.add(options.c, 
                "Challenge the pirates to a game of chess.", 10);
            break;

        case "st_george":
            raffle.add(options.b, "Beg for money.", 100);
            break;

        case "war_merchant":
            var weapons = ["cutlass", "dagger", "hammer", "iron_hammer", 
                           "jeweled_cutlass", "long_pitchfork", "pitchfork",
                           "poison_dagger", ];
            var weapon = functions.random_choice(weapons);
            game_state.for_sell = weapon;
            raffle.add(options.d, "BUY_WEAPON", 10000);
            break;

        case "witch":
            raffle.add(options.b, "Ask the witch to brew you a potion.", 10);
            break;

        case "wizard":
            raffle.add(options.b, "Ask the wizard for advice.", 10);
            raffle.add(options.d, "Pull on the wizard's beard to make sure " +
                "it's real.", 10);
            break;

    }
}

function get_outcome_options(game_state, options) {

    switch (game_state.outcome) {
        case "bronzed":
        case "boast_and_get_money":
        case "chop_down_tree":
        case "impress_simple_peasant":
        case "kill":
        case "kill_lord_carlos":
        case "panic_and_escape":
        case "save_cat":
        case "swim_to_woods":
        case "throw_cat_and_keep_cat":
        case "train_and_win":
        case "you_get_away_with_it":
            raffle.add(options.a, "Thump yourself on the chest.", 1);
            break;

        case "cat_smells_fish":
        case "club_a_seal":
        case "eat_fish_in_igloo":
        case "eat_seal_in_igloo":
        case "find_sea_turtle":
        case "gambling_win":
        case "god_showers_you_with_gold":
        case "pace_and_get_frog":
        case "raise_sail_and_get_to_land":
        case "wake_up_richer":
            raffle.add(options.c, "Celebrate your success.", 2);
            break;

        case "cat_burning":
            raffle.add(options.a, "Try to save the cat.", 100);
            break;

        case "cannot_afford":
        case "cannot_find_cat":
        case "cannot_find_lava":
        case "cannot_tip_cow":
        case "celebrate_uncreatively":
        case "dance_in_puddle":
        case "fail_at_new_career":
        case "fail_to_find_mermaids":
        case "fail_to_steal_keys":
        case "find_st_george_instead":
        case "ignored":
        case "lose_ax":
        case "miss_olga":
        case "no_flowers":
        case "no_one_believes_you":
        case "no_one_wants_to_talk":
        case "no_sea_turtle":
        case "no_way_out":
        case "pinguins_dont_care":
        case "pirates_ruin_song":
        case "priest_disagrees":
        case "see_ship":
        case "sunburnt":
        case "think_think_think":
        case "too_poor_to_hire_assassin":
        case "train_thrown_out":
        case "trash_nothing":
        case "waiting_for_seal":
        case "wake_up_robbed":
        case "wealthy_people_sneer":
        case "wizard_leaves_without_you":
            raffle.add(options.a, "Kill yourself in frustration.", 1);
            if (game_state.places[game_state.character.place].locked === 
                false) {
                raffle.add(options.c, "Leave in a huff.", 2);
            }
            break;

        case "chance_to_escape":
            raffle.add(options.c, "Leave in a puff.", 100);
            raffle.add(options.c, "Run like the Devil.", 1000);
            break;

        case "chess_lose_to_pirates":
        case "fish_pirates_laugh":
        case "think_pirates_laugh":
            raffle.add(options.a, "Kill yourself in frustration.", 1);
            raffle.add(options.a, "Kill everybody in a fit of rage.", 1);
            raffle.add(options.d, "Challenge them to an arm wrestling match " +
                "to reclaim your dignity.", 15);
            break;

        case "directions_to_manor":
        case "directions_to_town":
        case "directions_to_volcano":
        case "directions_to_woods":
            raffle.add(options.c, "GO_TO", 1000);
            break;

        case "disguise_guards_laugh":
        case "gambling_lose":
        case "peasants_laugh_at_you":
            raffle.add(options.a, "Kill everybody in a fit of rage.", 1);
            break;
  
        case "dragon_coin_trade":
            raffle.add(options.a, "Trade it for a fancy paladin sword.", 
                10000);
            raffle.add(options.b, "Trade it for a potion of love.", 10000);
            if (game_state.persons.lord_carlos.alive === true &&
                game_state.places.lord_carlos_manor.burnable === true) {
                raffle.add(options.c, "Ask the blue dragon to kill Lord " +
                    "Carlos.", 10000);
            } 
            raffle.add(options.d, "Trade it for a large fortune.", 10000);
            break;
  
        case "fail_to_save_cat":
            raffle.add(options.a, "Kill yourself in frustration.", 2);
            raffle.add(options.d, 
                "Look up into the sky and yell, \"NOOOOOOOOOOOOO!\"", 100);
            break;

        case "god_shows_you_the_way":
            if (functions.get_place(game_state).locked === false) {
                raffle.add(options.c, "GO_TO", 10000);
            }
            break;

        case "guards_stop_you_dancing":
            game_state.character.excuse = "happy";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;

        case "guards_stop_you_killing":
            game_state.character.excuse = "mad";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;

        case "guards_stop_you_licking":
            game_state.character.excuse = "hungry";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;

        case "guards_stop_you_rich":
            game_state.character.excuse = "rich";
            raffle.add(options.d, "Tell the guards you're a lunatic.", 10000);
            break;

        case "guards_stop_you_singing":
            game_state.character.excuse = "talented";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;

        case "guards_stop_you_swinging":
            game_state.character.excuse = "insane";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;

        case "hide":
            raffle.add(options.c, "GO_TO", 10000);
            break;
  
        case "hit_assassin_with_cat":
            raffle.add(options.a, "Tell her you're sorry.", 100);
            break;
  
        case "keep_swimming":
            raffle.add(options.c, "Just keep swimming.", 10000);
            break;

        case "lord_bartholomew_chess":
            raffle.add(options.a, "A3.", 10000);
            raffle.add(options.b, "Nf3.", 10000);
            raffle.add(options.c, "E4.", 10000);
            raffle.add(options.d, 
                "Play poorly and turn the board around once you're losing.", 
                10000);
            break;

        case "lord_carlos_chess":
            raffle.add(options.a, "A3.", 10000);
            raffle.add(options.b, "Nf3.", 10000);
            raffle.add(options.c, "E4.", 10000);
            raffle.add(options.d, "Ask for a draw.", 10000);
            break;

        case "lose_peg":
            raffle.add(options.a, "Yell, \"I've lost my leg!\"", 10000);
            break;

        case "merchant_ship_nest":
        case "merchant_ship_sail":
        case "merchant_ship_scrub":
            raffle.add(options.a, "Fire a cannon.", 10000);
            raffle.add(options.b, "Hide beneath the deck.", 10000);
            raffle.add(options.c, "Swing on a rope.", 10000);
            raffle.add(options.d, "Do some swashbuckling.", 10000);
            break;

        case "no_progress_swimming":
        case "see_ship":
            raffle.add(options.c, "Keep swimming.", 10000);
            break;

        case "notice_pattern":
            raffle.add(options.a, 
                "Laugh about the warden doing it alone on holidays.", 10000);
            raffle.add(options.b, 
                "Try to snatch the keys the first chance you get.", 10000);
            raffle.add(options.d, 
                "Wait for a holiday to make your move.", 10000);
            break;

        case "penguins":
            raffle.add(options.a, "Yell that there aren't penguins in the " +
                    "Arctic.", 10000);
            break;

        case "riot":
            raffle.add(options.a, "ATTACK", 10000);
            raffle.add(options.b, "BURN", 10000);
            raffle.add(options.c, "Trash the place.", 10000);
            raffle.add(options.d, "Loot.", 10000);
            break;

        case "see_wizard_with_penguins":
            raffle.add(options.a, "Yell, \"Don't leave without me!\"", 10000);
            break;

        case "suck_up_to_lord_arthur_ocean":
            raffle.add(options.a, "Look for sea turtles.", 10000);
            break;

        case "think_four_ideas":
            if (game_state.character.place !== "void") {
                raffle.add(options.a, "LICK_THE_GROUND", 10);
            }
            break;

        case "think_elaborate_scheme":
            raffle.add(options.b, "Enact your elaborate scheme.", 10000);
            break;

        case "wait_here_please":
            raffle.add(options.a, "Wait where you are.", 10000);
            break;

        case "witch_burning":
            raffle.add(options.a, "Try to save the witch.", 100);
            break;

        case "wizard_wants_mushroom":
            raffle.add(options.a, "Give the wizard what he wants.", 10000);
            break;
    }
}

function get_place_options(game_state, options) {

    if (game_state.places[game_state.character.place].burnable) {
        raffle.add(options.b, "BURN", 1);
    }

    switch (game_state.character.place) {
        case "arctic":
            raffle.add(options.a, "Go fishing.", 4);
            raffle.add(options.b, "Build an igloo.", 4);
            raffle.add(options.b, "Play in the snow.", 2);
            raffle.add(options.c, "Club a seal.", 8);
            raffle.add(options.d, "Freeze to death.", 2);
            break;

        case "cave":
            raffle.add(options.c, "Look for a way out.", 10);
            break;

        case "church":
            if (functions.get_place(game_state).burnable === true) {
                if (game_state.character.person === null) {
                    raffle.add(options.a, "Tell a priest he's fat.", 2);
                    raffle.add(options.a, 
                        "Tell a priest God doesn't exist.", 2);
                    raffle.add(options.a, 
                        "Tell a priest you're the chosen one.", 2);
                }
                if (items.money_map[game_state.character.money].value > 0) {
                    raffle.add(options.d, "Donate to the church.", 6);
                }
            }
            break;

        case "countryside":
            raffle.add(options.a, "Go flower picking.", 4);
            raffle.add(options.b, "Tip a cow.", 4);
            raffle.add(options.c, "Wander the countryside.", 20);
            raffle.add(options.d, "Do some farm work.", 4);
            break;

        case "dark_alley":
            raffle.add(options.a, "Look for assassins.", 6);
            raffle.add(options.b, "Make a shady deal.", 6);
            raffle.add(options.c, "Hide.", 4);
            raffle.add(options.d, "Look through the trash.", 6);
            break;

        case "docks":
            raffle.add(options.c, "Go fishing.", 8);
            raffle.add(options.d, "Do some gambling.", 2);
            break;

        case "lord_bartholomew_manor":
            if (functions.get_place(game_state).burnable === true) {
                if (game_state.character.person === null) {
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Arthur.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Bartholomew.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Daniel.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Carlos.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're St. George.", 1);
                }
                if (game_state.persons.lord_bartholomew.alive === true && 
                    game_state.character.person !== "lord_bartholomew") {
                    raffle.add(options.a, 
                        "Ask for an audience with Lord Bartholomew.", 4);
                }
                raffle.add(options.d, "Sneak around.", 4);
            }
            break;

        case "lord_carlos_manor":
            if (functions.get_place(game_state).burnable === true) {
                if (game_state.character.person === null) {
                    raffle.add(options.a, "Ask about assassins.", 4);
                    //raffle.add(options.a, "Hire an assassin.", 4);
                    raffle.add(options.b, "BURN", 5);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Arthur.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Bartholomew.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Daniel.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Carlos.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're St. George.", 1);
                }
                if (game_state.character.person !== "eve" &&
                    game_state.persons.eve.alive === true) {
                    raffle.add(options.c, "Look for Lord Carlos' daughter.", 4);
                }
                raffle.add(options.d, "Sneak around.", 8);
            }
            break;

        case "market":
            if (functions.get_place(game_state).burnable === true &&
                functions.get_place(game_state).trashable === true) {
                if (game_state.character.person !== "war_merchant" &&
                    game_state.persons.war_merchant.alive === true) {
                    raffle.add(options.a, "Look for a weapon.", 10);
                }
                if (game_state.persons.wizard.alive === true && 
                    game_state.character.person !== "wizard") {
                    raffle.add(options.b, "Look for the wizard.", 1);
                }
                if (game_state.character.person === null) {
                    var stuff = ["ax", "bouquet of flowers", "donkey", "fish", 
                                 "pearl", "sailor peg"];
                    var item  = functions.random_choice(stuff);
                    game_state.for_sell = item;
                    raffle.add(options.b, "BUY_ITEM", 6);
                }
                raffle.add(options.d, "Watch a play.", 2);
            }
            break;

        case "mermaid_rock":
            if (game_state.character.person !== "mermaid") {
                raffle.add(options.a, "Look for mermaids.", 10);
            }
            raffle.add(options.c, "Go fishing.", 20);
            raffle.add(options.d, "Sun yourself on a rock.", 4);
            break;

        case "ocean":
            raffle.add(options.a, "Look for mermaids.", 5);
            if (game_state.outcome !== "fail_to_find_mermaids_find_turtle") {
                raffle.add(options.a, "Look for sea turtles.", 5);
            }
            raffle.add(options.b, "Sink.", 10);
            raffle.add(options.c, "Swim.", 20);
            raffle.add(options.d, "Dive for pearls.", 5);
            raffle.add(options.d, "Drown.", 1);
            break;

        case "pirate_ship":
            raffle.add(options.a, "YELL_A_PIRATE_PHRASE", 6);
            raffle.add(options.b, "Raise a sail.", 8);
            raffle.add(options.b, "Scrub the deck.", 8);
            raffle.add(options.c, "Walk the plank.", 2);
            if (game_state.character.items["sailor peg"] > 0) {
                raffle.add(options.c, "Climb up the top sails.", 10);
            }
            if (game_state.outcome !== "climb_and_get_sap" &&
                game_state.outcome !== "merchant_ship_nest" &&
                game_state.outcome !== "watch_duty") {
                raffle.add(options.c, "Climb into the crow's nest.", 8);
            } 
            raffle.add(options.d, "Drop anchor.", 7);
            break;

        case "prison":
            raffle.add(options.b, "Bide your time.", 6);
            raffle.add(options.c, "Pace around.", 20);
            if (game_state.persons.felicity.attracted > 0) {
                if (game_state.persons.felicity.name === "the fat lady") {
                    raffle.add(options.d, 
                        "Flirt with the fat lady who feeds you.", 10);
                } else {
                    raffle.add(options.d, "Flirt with Felicity.",10);
                }
            }
            break;

        case "smoking_volcano":
            if (game_state.character.person === null) {
                raffle.add(options.a, "Look for dragons.", 6);
            }
            raffle.add(options.b, "Choke on fumes.", 2);
            raffle.add(options.c, "Climb to the top of the volcano.", 4);
            raffle.add(options.d, "Go swimming in a pool of lava.", 2);
            break;

        case "streets":
            raffle.add(options.a, "Look for a cat.", 2);
            raffle.add(options.b, "Gawk at women.", 2);
            raffle.add(options.c, "GO_TO", 2);
            if (game_state.character.person !== "st_george" && 
                game_state.persons.st_george.alive === true) {
                raffle.add(options.d, "Look for St. George.", 2);
            }
            break;

        case "tavern":
            if (functions.get_place(game_state).burnable === true) {
                raffle.add(options.a, "Ask about assassins.", 4);
                raffle.add(options.b, "Buy a drink.", 4);
                raffle.add(options.d, "Do some gambling.", 4);
                if (game_state.persons.olga.alive === true &&
                    game_state.persons.olga.name === "Olga" &&
                    game_state.character.person !== "olga") {
                    raffle.add(options.b, "Look for Olga.", 10);
                }
            }
            break;

        case "tower":
            if (functions.get_place(game_state).burnable === true) {
                if (game_state.character.person === null) {
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Arthur.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Bartholomew.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Daniel.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're Lord Carlos.", 1);
                    raffle.add(options.b, "Tell the next person you meet " +
                            "that you're St. George.", 1);
                }
                if (game_state.persons.lord_daniel.alive === true && 
                    game_state.character.person !== "lord_daniel") {
                    raffle.add(options.a, 
                        "Ask for an audience with Lord Daniel.", 4);
                }
                raffle.add(options.c, "Complain about unfair imprisonment policies.", 4);
                raffle.add(options.d, "Train with the guards.", 8);
            }
            break;

        case "void":
            raffle.add(options.d, "Gather void dust.", 2);
            break;

        case "woods":
            if (functions.get_place(game_state).burnable === true) {
                raffle.add(options.a, "Go mushroom picking.", 4);
                if (game_state.character.items.ax > 0) {
                    raffle.add(options.c, "Chop down a tree with your ax.", 10);
                }
                if (game_state.character.person !== "nymph_queen") {
                    raffle.add(options.d, "Look for nymphs.", 4);
                }
            }
            if (game_state.character.person !== "witch") {
                raffle.add(options.b, "Look for witches.", 4);
            }
            break;

        case "wizard_lab":
            if (functions.get_place(game_state).burnable === true) {
                if (game_state.places.wizard_lab.trashable === true &&
                    game_state.outcome !== "wizard_stops_you_trashing") {
                    raffle.add(options.a, "Trash the place.", 4);
                }
                raffle.add(options.b, "Read a spellbook.", 4);
                raffle.add(options.c, "Snoop around.", 6);
                raffle.add(options.d, "Drink a random potion.", 4);
            }
            break;

    }
}

function lords_victory(game_state) {

    if (game_state.persons.lord_arthur.alive === false && 
        game_state.persons.lord_bartholomew.alive === false && 
        game_state.persons.lord_carlos.alive === false && 
        game_state.persons.lord_daniel.alive === false) {
        game_state.score = parseInt(game_state.score) + 100;
        return true;
    }
    return false;
} 

function marriage_victory(game_state) {

    if (game_state.character.has_found_true_love) {
        game_state.score = parseInt(game_state.score) + 100;
        return true;
    }
    return false;
}

function set_destination(game_state, option) {
    if (option === "GO_TO" || option === "Wander the countryside.") {
        game_state.destination = 
            functions.get_random_adjacent_destination(game_state);
    }

    switch (game_state.outcome) {
        case "directions_to_manor":
            game_state.destination = "lord_bartholomew_manor";
            break;
        case "directions_to_town":
            game_state.destination = "streets";
            break;
        case "directions_to_volcano":
            game_state.destination = "smoking_volcano";
            break;
        case "directions_to_woods":
            game_state.destination = "woods";
            break;
    }
}

function set_game_over_options(options) {

    options.a = "Play again.";
    options.b = "Don't play again.";
    options.c = "";
    options.d = "";
    options.e = "";
}

function set_pyro_options(options) {

    options.a = "Fill the place with fire.";
    options.b = "Ignite an inferno.";
    options.c = "Release your inner arsonist.";
    options.d = "Engulf everything in flames.";
    options.e = "";
}
