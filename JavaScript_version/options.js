"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var functions = require("./functions");
var items     = require("./items");
var Raffle    = require("./raffle").Raffle;

var FEMALE    = "female";
var MALE      = "male";

exports.starting_options = {"a": "Ask about assassins.",
                            "b": "Buy a drink.",
                            "c": "Leave in a huff.",
                            "d": "Sing a song.",
                            "e": ""};

var OptionsGenerator = function() {
    this.options = {"a": new Raffle(),
                    "b": new Raffle(),
                    "c": new Raffle(),
                    "d": new Raffle()};
};

OptionsGenerator.prototype.get_character_options = function(game) {
    if (game.character.money === "large_fortune" &&
        game.character.strength > 5 &&
        Math.floor(Math.random() * 3) === 0) {
        this.options.c.add("Quit while you're ahead.", 1);
    }
    if (game.places[game.character.place].locked === false &&
        game.character.is_threatened === false) {
        this.options.c.add("GO_TO", 4);
    }
    if (game.character.is_threatened === true) {
        if (game.character.person !== "guards") {
            this.options.b.add("Play dead.", 1);
            this.options.d.add("Panic!", 1);
        }
        this.options.c.add("Run like the Devil.", 90);
        this.options.c.add("Waddle like God.", 10);
    }
    if ((game.character.money === "large_fortune" ||
        game.character.money === "small_fortune") &&
        game.places[game.character.place].town === true
        ) {
        this.options.d.add("Flaunt your wealth.", 1);
    }
};

OptionsGenerator.prototype.get_default_options = function(game) {
    if (game.character.sex === FEMALE) {
        this.options.a.add("Admire your own bosoms.", 1);
    }
    this.options.a.add("Think.", 1);
    if (game.character.place !== "void") {
        this.options.a.add("LICK_THE_GROUND", 1);
        this.options.c.add("Leave in a puff.", 1);
    }
    this.options.b.add("Pray to a higher power.", 1);
    this.options.c.add("Go to sleep.", 1);
    this.options.d.add("Sing a song.", 1);
    this.options.d.add("Dance a jig.", 1);
};

OptionsGenerator.prototype.get_item_options = function(game) {
    if (game.character.items.apple > 0) {
        this.options.c.add("Chow down on your apple.", 2);
    }
    if (game.character.items["bag of jewels"] > 0) {
        this.options.a.add("Admire your jewels.", 1);
    }
    if (game.character.items["ball of sap"] > 0) {
        this.options.c.add("Chow down on your ball of sap.", 1);
    }
    if (game.character.items["ball of sap"] > 0 &&
        game.character.items["bouquet of flowers"] > 0 &&
        game.character.items["many-colored mushroom"] > 0 &&
        game.character.person === "witch") {
        this.options.b.add("Ask the witch to brew you a potion.", 100);
    }
    if (game.character.items["black mushroom"] > 0) {
        this.options.c.add("Chow down on your black mushroom.", 1);
    }
    if (game.character.items.cake > 0) {
        this.options.c.add("Let yourself have cake.", 1);
        this.options.d.add("Have your cake and eat it too.", 1);
    }
    if (game.character.items["bouquet of flowers"] > 0 &&
        (game.character.person === "eve" ||
         game.character.person === "mermaid" ||
         game.character.person === "nymph_queen" ||
         game.character.person === "olga" ||
         game.character.place === "prison")) {
        this.options.b.add("GIVE_FLOWERS", 100);
    }
    if (game.character.items.cat > 0) {
        this.options.d.add("Swing your cat.", 1);
        if (game.character.items.cat > 1) {
            this.options.b.add("Breed your cats.", 1);
        }
    }
    if (game.character.items.cat > 0 &&
        game.character.items.pearl > 0 &&
        game.character.person === "witch") {
        this.options.b.add("Ask the witch to brew you a potion.", 100);
    }
    if (game.character.items.cat > 0 &&
        (game.character.person === "eve" ||
         game.character.person === "olga")) {
        this.options.a.add("GIVE_HER_CAT", 5);
    }
    if (game.character.items["deep-cave newt"] > 1) {
        this.options.b.add("Breed your deep-cave newts.", 1);
    }
    if (game.character.items["deep-cave newt"] > 0 &&
        game.character.items["white mushroom"] > 0 &&
        game.character.person === "witch") {
        this.options.b.add("Ask the witch to brew you a potion.", 100);
    }
    if (game.character.items.donkey > 0) {
        this.options.c.add("GO_TO", 6);
    }
    if (game.character.items.frog > 0 &&
        game.places[game.character.place].locked === false) {
        this.options.b.add("Kiss your frog.", 2);
    }
    if (game.character.items["many-colored mushroom"] > 0) {
        this.options.c.add("Chow down on your many-colored mushroom.", 2);
    }
    if (game.character.items["potion of strength"] > 0) {
        this.options.d.add("Slurp down your potion of strength.", 2);
    }
    if (game.character.items["potion of tail growth"] > 0) {
        this.options.d.add("Slurp down your potion of tail growth.", 2);
    }
    if (game.character.items["potion of transformation"] > 0) {
        this.options.d.add("Slurp down your potion of transformation.", 4);
    }
    if (game.character.items["potion of love"] > 0 &&
        (game.character.person === "eve" ||
         game.character.person === "mermaid" ||
         game.character.person === "olga" ||
         game.character.person === "nymph_queen" ||
         game.character.person === "priestess")) {
        this.options.b.add("LOVE_POTION", 10000);
    }
    if (game.character.items["potion of love"] > 0 &&
        game.character.sex === FEMALE &&
        (game.character.person === "lord_arthur" ||
         game.character.person === "lord_bartholomew" ||
         game.character.person === "lord_carlos" ||
         game.character.person === "lord_daniel" ||
         game.character.person === "noblman" ||
         game.character.person === "st_george")) {
        this.options.b.add("LOVE_POTION", 10000);
    }
    if (game.character.items["shiny foreign coin"] > 0 &&
        (game.character.person === "dragon_blue" ||
         game.character.person === "dragon_red" ||
         game.character.person === "lord_arthur" ||
         game.character.person === "lord_bartholomew" ||
         game.character.person === "lord_carlos" ||
         game.character.person === "lord_daniel")) {
        this.options.b.add("SHOW_COIN", 100);
    }
    if (game.character.items["handful of void dust"] > 0 &&
        game.character.person === "wizard") {
        this.options.d.add("Trade your void dust to the wizard.", 10000);
    }
    if (game.character.items["white mushroom"] > 0) {
        this.options.c.add("Chow down on your white mushroom.", 2);
    }
    if (game.character.items["yellow mushroom"] > 0) {
        this.options.c.add("Chow down on your yellow mushroom.", 1);
    }
};

OptionsGenerator.prototype.get_outcome_options = function(game) {
    switch (game.outcome) {
        case "breed_cats_fail":
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
        case "rainbow_fail":
        case "see_ship":
        case "sunburnt":
        case "think_discouraged":
        case "too_poor_to_hire_assassin":
        case "train_thrown_out":
        case "trash_nothing":
        case "waiting_for_seal":
        case "wake_up_robbed":
        case "wealthy_people_sneer":
        case "wizard_leaves_without_you":
            this.options.a.add("Kill yourself in frustration.", 1);
            if (game.places[game.character.place].locked === false) {
                this.options.c.add("Leave in a huff.", 4);
            }
            break;
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
            if (game.character.sex === FEMALE) {
                this.options.a.add("Pat yourself on the back.", 1);
            } else {
                this.options.a.add("Thump yourself on the chest.", 1);
            }
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
            this.options.c.add("Celebrate your success.", 2);
            break;
        case "cat_burning":
            this.options.a.add("Try to save the cat.", 100);
            break;
        case "chance_to_escape":
            this.options.c.add("Leave in a puff.", 100);
            this.options.c.add("Run like the Devil.", 1000);
            break;
        case "chess_lose_to_pirates":
        case "fish_pirates_laugh":
        case "think_pirates_laugh":
            this.options.a.add("Kill yourself in frustration.", 1);
            this.options.a.add("Kill everybody in a fit of rage.", 1);
            this.options.d.add("Challenge them to an arm wrestling match " +
                "to reclaim your dignity.", 15);
            break;
        case "directions_to_manor":
        case "directions_to_town":
        case "directions_to_volcano":
        case "directions_to_woods":
            this.options.c.add("GO_TO", 1000);
            break;
        case "disguise_guards_laugh":
        case "gambling_lose":
        case "peasants_laugh_at_you":
            this.options.a.add("Kill everybody in a fit of rage.", 1);
            break;
        case "dragon_coin_trade":
            this.options.a.add("Trade it for a fancy paladin sword.",
                10000);
            this.options.b.add("Trade it for a potion of love.", 10000);
            if (game.persons.lord_carlos.alive === true &&
                game.places.lord_carlos_manor.burnable === true) {
                this.options.c.add("Ask the blue dragon to kill Lord " +
                    "Carlos.", 10000);
            }
            this.options.d.add("Trade it for a large fortune.", 10000);
            break;
        case "fail_to_save_cat":
            this.options.a.add("Kill yourself in frustration.", 2);
            this.options.d.add(
                "Look up into the sky and yell, \"NOOOOOOOOOOOOO!\"", 100);
            break;
        case "gawk_at_cake":
        case "sneak_cake":
            this.options.c.add("Take the cake.", 10000);
            break;
        case "god_shows_you_the_way":
            if (game.get_place().locked === false) {
                this.options.c.add("GO_TO", 10000);
            }
            break;
        case "god_tells_you_to_burn_stuff":
            if (game.get_place().burnable === true) {
                this.options.b.add("BURN", 10000);
            }
            break;
        case "guards_stop_you_burning":
            game.character.excuse = "cold";
            this.options.d.add("TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_dancing":
            game.character.excuse = "happy";
            this.options.d.add("TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_killing":
            game.character.excuse = "mad";
            this.options.d.add("TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_licking":
            game.character.excuse = "hungry";
            this.options.d.add("TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_rich":
            game.character.excuse = "rich";
            this.options.d.add("Tell the guards you're a lunatic.", 10000);
            break;
        case "guards_stop_you_singing":
            game.character.excuse = "talented";
            this.options.d.add("TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_swinging":
            game.character.excuse = "insane";
            this.options.d.add("TELL_GUARDS", 10000);
            break;
        case "hide":
            this.options.c.add("GO_TO", 10000);
            break;
        case "hit_assassin_with_cat":
            this.options.a.add("Tell her you're sorry.", 100);
            break;
        case "keep_swimming":
            this.options.c.add("Just keep swimming.", 10000);
            break;
        case "lord_bartholomew_chess":
            this.options.a.add("A3.", 10000);
            this.options.b.add("Nf3.", 10000);
            this.options.c.add("E4.", 10000);
            this.options.d.add(
                "Play poorly and turn the board around once you're losing.",
                10000);
            break;
        case "lord_carlos_chess":
            this.options.a.add("A3.", 10000);
            this.options.b.add("Nf3.", 10000);
            this.options.c.add("E4.", 10000);
            this.options.d.add("Ask for a draw.", 10000);
            break;
        case "lose_peg":
            this.options.a.add("Yell, \"I've lost my leg!\"", 10000);
            break;
        case "merchant_ship_nest":
        case "merchant_ship_sail":
        case "merchant_ship_scrub":
            this.options.a.add("Fire a cannon.", 10000);
            this.options.b.add("Hide beneath the deck.", 10000);
            this.options.c.add("Swing on a rope.", 10000);
            this.options.d.add("Do some swashbuckling.", 10000);
            break;
        case "newt_race":
            if (game.character.items["deep-cave newt"] > 0) {
                this.options.a.add("Enter your deep-cave newt in the race.",
                    10000);
            }
            break;
        case "rainbow":
            this.options.c.add("Try to find the bottom of the rainbow.", 10000);
            break;
        case "rainbow_gold":
            this.options.c.add("Go to the other end of the rainbow.", 30);
            break;
        case "no_progress_swimming":
        case "see_ship":
            this.options.c.add("Keep swimming.", 10000);
            break;
        case "notice_pattern":
            this.options.a.add(
                "Laugh about the warden doing it alone on holidays.", 10000);
            this.options.b.add(
                "Try to snatch the keys the first chance you get.", 10000);
            this.options.d.add(
                "Wait for a holiday to make your move.", 10000);
            break;
        case "penguins":
            this.options.a.add("Yell that there aren't penguins in the " +
                    "Arctic.", 10000);
            break;
        case "riot":
            this.options.a.add("ATTACK", 10000);
            this.options.b.add("BURN", 10000);
            this.options.c.add("Trash the place.", 10000);
            this.options.d.add("Loot.", 10000);
            break;
        case "see_wizard_with_penguins":
            this.options.a.add("Yell, \"Don't leave without me!\"", 10000);
            break;
        case "suck_up_to_lord_arthur_ocean":
            this.options.a.add("Look for sea turtles.", 10000);
            break;
        case "think_four_ideas":
            if (game.character.place !== "void") {
                this.options.a.add("LICK_THE_GROUND", 10);
            }
            break;
        case "think_elaborate_scheme":
            this.options.b.add("Enact your elaborate scheme.", 10000);
            break;
        case "wait_here_please":
            this.options.a.add("Wait where you are.", 10000);
            break;
        case "witch_burning":
            this.options.a.add("Try to save the witch.", 100);
            break;
        case "wizard_wants_mushroom":
            this.options.a.add("Give the wizard what he wants.", 10000);
            break;
    }
};

OptionsGenerator.prototype.get_person_options = function(game) {
    if (game.character.person !== null) {
        this.options.a.add("ATTACK", 20);
        this.options.b.add("Boast of your bravery.", 1);
    }
    switch (game.character.person) {
        case "blind_bartender":
            this.options.c.add("Chat with the blind bartender.", 14);
            break;
        case "cerberus":
            this.options.c.add(
                "Throw three of your cats at the giant three-headed dog.", 10000);
            break;
        case "dog":
            if (game.character.items.fish > 0) {
                this.options.b.add("Bribe the dog with a fish.", 1000);
            }
            if (game.character.items.cat > 0) {
                this.options.c.add("Throw your cat at the dog.", 10000);
            }
            this.options.d.add("Try to reason with the dog.", 100);
            break;
        case "dragon_blue":
        case "dragon_red":
            this.options.c.add("Chat with the dragon.", 10);
            this.options.d.add("Try to steal some of the dragon's " +
                "treasure.", 10);
            break;
        case "eve":
        case "nymph_queen":
        case "olga":
            this.options.d.add("FLIRT_WITH", 100);
            break;
        case "lord_arthur":
            this.options.b.add("SUCK_UP", 10);
            break;
        case "lord_bartholomew":
            this.options.a.add("Ask for asylum.", 10);
            this.options.b.add("SUCK_UP", 10);
            this.options.c.add("Chat with Lord Bartholomew.", 10);
            this.options.d.add(
                "Challenge Lord Bartholomew to a game of chess.", 10);
            break;
        case "lord_carlos":
            if (game.character.sex === MALE) {
                if (game.character.money === "large_fortune" &&
                    game.character.money === "small_fortune") {
                    this.options.a.add("Repay your debts.", 10);
                }
                this.options.b.add("SUCK_UP", 5);
                this.options.b.add("Grovel.", 10);
                this.options.c.add(
                    "Challenge Lord Carlos to a game of chess.", 15);
                this.options.d.add(
                    "Make it hard for Lord Carlos to kill you.", 15);
            } else {
                //this.options.d.add("FLIRT_WITH", 100);
            }
            break;
        case "lord_daniel":
            this.options.b.add("SUCK_UP", 10);
            this.options.c.add(
                "Complain about unfair imprisonment policies.", 10);
            break;
        case "mermaid":
            this.options.c.add(
                "Ask the mermaid to take you back to land.", 15);
            this.options.d.add("FLIRT_WITH", 100);
            break;
        case "mob":
            this.options.d.add("Try to reason with the mob.", 10);
            break;
        case "peasant_lass":
        case "simple_peasant":
            this.options.d.add("Ask for directions.", 100);
            break;
        case "pirates":
            this.options.c.add(
                "Challenge the pirates to a game of chess.", 10);
            break;
        case "st_george":
            this.options.b.add("Beg for money.", 100);
            this.options.c.add("Chat with St. George.", 2);
            break;
        case "war_merchant":
            var weapons = ["cutlass", "dagger", "hammer", "iron_hammer",
                           "jeweled_cutlass", "long_pitchfork", "pitchfork",
                           "poison_dagger", ];
            // you can't buy weapons you already have
            // available_weapons holds weapons you don't have
            var available_weapons = [];
            for (var i = 0; i < weapons.length; i++) {
                if (game.character.items[weapons[i]] === 0) {
                    available_weapons.push(weapons[i]);
                }
            }
            // if you have all of the weapons the merchant sells
            // then BUY_WEAPON will not be added to the raffle
            if (available_weapons.length === 0) {
                break;
            }
            var weapon = functions.random_choice(available_weapons);
            game.for_sell = weapon;
            this.options.d.add("BUY_WEAPON", 10000);
            break;
        case "witch":
            this.options.b.add("Ask the witch to brew you a potion.", 10);
            if (game.character.items.cat > 0) {
                this.options.c.add("Give your cat to the witch.", 20);
            }
            break;
        case "wizard":
            this.options.b.add("Ask the wizard for advice.", 10);
            this.options.d.add("Pull on the wizard's beard to make sure " +
                "it's real.", 10);
            break;
    }
};

OptionsGenerator.prototype.get_place_options = function(game) {
    if (game.places[game.character.place].burnable &&
        game.outcome != "guards_stop_you_burning") {
        this.options.b.add("BURN", 1);
    }
    switch (game.character.place) {
        case "arctic":
            this.options.a.add("Go fishing.", 4);
            this.options.b.add("Build an igloo.", 4);
            this.options.b.add("Play in the snow.", 2);
            this.options.c.add("Club a seal.", 8);
            this.options.d.add("Freeze to death.", 2);
            break;
        case "cave":
            this.options.c.add("Look for a way out.", 10);
            this.options.d.add("Go deeper.", 10);
            break;
        case "church":
            if (game.get_place().burnable === true) {
                if (game.character.person === null) {
                    this.options.a.add("Tell a priest he's fat.", 2);
                    this.options.a.add(
                        "Tell a priest God doesn't exist.", 2);
                    this.options.a.add(
                        "Tell a priest you're the chosen one.", 2);
                }
                if (items.money_map[game.character.money].value > 0) {
                    this.options.d.add("Donate to the church.", 6);
                }
            }
            break;
        case "countryside":
            this.options.a.add("Go flower picking.", 4);
            this.options.b.add("Tip a cow.", 4);
            this.options.c.add("Wander the countryside.", 20);
            this.options.d.add("Do some farm work.", 4);
            break;
        case "dark_alley":
            this.options.a.add("Look for assassins.", 6);
            this.options.b.add("Make a shady deal.", 6);
            this.options.c.add("Hide.", 4);
            this.options.d.add("Look through the trash.", 6);
            break;
        case "docks":
            this.options.c.add("Go fishing.", 8);
            this.options.d.add("Do some gambling.", 2);
            break;
        case "lord_bartholomew_manor":
            if (game.get_place().burnable === true) {
                if (game.character.person === null &&
                    game.character.sex === MALE) {
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Arthur.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Bartholomew.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Daniel.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Carlos.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're St. George.", 1);
                }
                if (game.persons.lord_bartholomew.alive === true &&
                    game.character.person !== "lord_bartholomew") {
                    this.options.a.add(
                        "Ask for an audience with Lord Bartholomew.", 4);
                }
                this.options.d.add("Sneak around.", 4);
            }
            break;
        case "lord_carlos_manor":
            if (game.get_place().burnable === true) {
                if (game.character.person === null) {
                    if (game.character.sex === MALE) {
                        this.options.a.add("Ask about assassins.", 4);
                    }
                    this.options.a.add("Hire an assassin.", 4);
                    this.options.b.add("BURN", 5);
                    if (game.character.sex === MALE) {
                        this.options.b.add("Tell the next person you " +
                            "meet that you're Lord Arthur.", 1);
                        this.options.b.add("Tell the next person you " +
                            "meet that you're Lord Bartholomew.", 1);
                        this.options.b.add("Tell the next person you " +
                            "meet that you're Lord Daniel.", 1);
                        this.options.b.add("Tell the next person you " +
                            "meet that you're Lord Carlos.", 1);
                        this.options.b.add("Tell the next person you " +
                            "meet that you're St. George.", 1);
                    }
                }
                if (game.character.person !== "eve" &&
                    game.persons.eve.alive === true) {
                    this.options.c.add("Look for Lord Carlos' daughter.", 4);
                }
                this.options.d.add("Sneak around.", 8);
            }
            break;
        case "market":
            if (game.get_place().burnable === true &&
                game.get_place().trashable === true) {
                if (game.character.person !== "war_merchant" &&
                    game.persons.war_merchant.alive === true) {
                    this.options.a.add("Look for a weapon.", 10);
                }
                if (game.persons.wizard.alive === true &&
                    game.character.person !== "wizard") {
                    this.options.b.add("Look for the wizard.", 1);
                }
                if (game.character.person === null) {
                    var item  = functions.random_choice(items.MARKET_ITEMS);
                    game.for_sell = item;
                    this.options.b.add("BUY_ITEM", 6);
                }
                this.options.d.add("Watch a play.", 2);
            }
            break;
        case "mermaid_rock":
            if (game.character.person !== "mermaid") {
                this.options.a.add("Look for mermaids.", 10);
            }
            this.options.c.add("Go fishing.", 20);
            this.options.d.add("Sun yourself on a rock.", 4);
            break;
        case "ocean":
            this.options.a.add("Look for mermaids.", 5);
            if (game.outcome !== "fail_to_find_mermaids_find_turtle") {
                this.options.a.add("Look for sea turtles.", 5);
            }
            this.options.b.add("Sink.", 10);
            this.options.c.add("Swim.", 20);
            this.options.d.add("Dive for pearls.", 5);
            this.options.d.add("Drown.", 1);
            break;
        case "pirate_ship":
            this.options.a.add("YELL_A_PIRATE_PHRASE", 6);
            this.options.b.add("Raise a sail.", 8);
            this.options.b.add("Scrub the deck.", 8);
            this.options.c.add("Walk the plank.", 2);
            if (game.character.items["sailor peg"] > 0) {
                this.options.c.add("Climb up the top sails.", 10);
            }
            if (game.outcome !== "climb_and_get_sap" &&
                game.outcome !== "merchant_ship_nest" &&
                game.outcome !== "watch_duty") {
                this.options.c.add("Climb into the crow's nest.", 8);
            }
            this.options.d.add("Drop anchor.", 7);
            break;
        case "prison":
            this.options.b.add("Bide your time.", 6);
            this.options.c.add("Pace around.", 20);
            if (game.persons.felicity.attracted > 0) {
                if (game.persons.felicity.name === "the fat lady") {
                    this.options.d.add(
                        "Flirt with the fat lady who feeds you.", 10);
                } else {
                    this.options.d.add("Flirt with Felicity.",10);
                }
            }
            break;
        case "smoking_volcano":
            if (game.character.person === null) {
                this.options.a.add("Look for dragons.", 6);
            }
            this.options.b.add("Choke on fumes.", 2);
            this.options.c.add("Climb to the top of the volcano.", 4);
            this.options.d.add("Go swimming in a pool of lava.", 2);
            break;
        case "streets":
            if (game.character.items.apple > 0) {
                this.options.a.add("Give your apple to an orphan.", 4);
            }
            this.options.a.add("Look for a cat.", 4);
            this.options.a.add("Look for a cat.", 4);
            if (game.character.sex === FEMALE) {
                this.options.b.add("Gawk at men.", 2);
            } else if (game.character.sex === MALE) {
                this.options.b.add("Gawk at women.", 2);
            }
            this.options.c.add("GO_TO", 2);
            if (game.character.person !== "st_george" &&
                game.persons.st_george.alive === true) {
                this.options.d.add("Look for St. George.", 2);
            }
            break;
        case "tavern":
            if (game.get_place().burnable === true) {
                this.options.a.add("Ask about assassins.", 4);
                this.options.b.add("Buy a drink.", 4);
                this.options.d.add("Do some gambling.", 4);
                if (game.persons.olga.alive === true &&
                    game.persons.olga.name === "Olga" &&
                    game.character.person !== "olga") {
                    this.options.b.add("Look for Olga.", 10);
                }
            }
            break;
        case "tower":
            if (game.get_place().burnable === true) {
                if (game.character.person === null &&
                    game.character.sex === MALE) {
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Arthur.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Bartholomew.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Daniel.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're Lord Carlos.", 1);
                    this.options.b.add("Tell the next person you meet " +
                            "that you're St. George.", 1);
                }
                if (game.persons.lord_daniel.alive === true &&
                    game.character.person !== "lord_daniel") {
                    this.options.a.add("Ask for an audience with Lord Daniel.", 4);
                }
                this.options.c.add(
                    "Complain about unfair imprisonment policies.", 4);
                this.options.d.add("Train with the guards.", 8);
            }
            break;
        case "void":
            this.options.c.add("Float through the void.", 5);
            this.options.d.add("Gather void dust.", 2);
            break;
        case "woods":
            if (game.get_place().burnable === true) {
                this.options.a.add("Go mushroom picking.", 4);
                if (game.character.items.ax > 0) {
                    this.options.c.add("Chop down a tree with your ax.", 10);
                }
                if (game.character.person !== "nymph_queen") {
                    this.options.d.add("Look for nymphs.", 4);
                }
            }
            if (game.character.person !== "witch") {
                this.options.b.add("Look for witches.", 4);
            }
            break;
        case "wizard_lab":
            if (game.get_place().burnable === true) {
                if (game.places.wizard_lab.trashable === true &&
                    game.outcome !== "wizard_stops_you_trashing") {
                    this.options.a.add("Trash the place.", 4);
                }
                this.options.b.add("Read a spellbook.", 4);
                this.options.c.add("Snoop around.", 6);
                this.options.d.add("Drink a random potion.", 4);
            }
            break;
    }
};

OptionsGenerator.prototype.set_options = function(game) {
    if (game.character.is_dead || game.marriage_victory()) {
        this.set_game_over_options();
    } else if (game.outcome === "eve_name") {
        this.options.a = "Anna.";
        this.options.b = "Beth.";
        this.options.c = "Cass.";
        this.options.d = "Dina.";
        this.options.e = "Eve.";
    } else if (game.outcome === "find_wizard_teleport") {
        this.options.a = functions.random_choice([
                "Ask him to teleport you to Lord Arthur's pirate ship.",
                "Ask him to teleport you to the Arctic.",
                ]);
        this.options.b = functions.random_choice([
                "Beg him to teleport you to Lord Bartholomew's manor.",
                "Beg him to teleport you to the woods.",
                ]);
        this.options.c = functions.random_choice([
                "Command him to teleport you to the countryside.",
                "Command him to teleport you to Lord Carlos' manor.",
                ]);
        this.options.d = functions.random_choice([
                "Demand that he teleport you to the smoking volcano.",
                "Demand that he teleport you to the tower.",
                ]);
        this.options.e = "";
    } else if (game.character.is_frog) {
        this.options.a = "Ribbit.";
        this.options.b = "Hop.";
        this.options.c = "Croak.";
        this.options.d = "Eat a fly.";
        this.options.e = "";
    } else if (game.character.is_monstrosity) {
        this.options.a = "Annihilate everything.";
        this.options.b = "Terrorize the kingdom.";
        this.options.c = "Go on a rampage.";
        this.options.d = "Destroy all human civilizations.";
        this.options.e = "";
    } else if (game.character.is_shrub) {
        this.options.a = "Continue being a shrub.";
        this.options.b = "Continue being a shrub.";
        this.options.c = "Continue being a shrub.";
        this.options.d = "Continue being a shrub.";
        this.options.e = "";
    } else if (game.marriage === true) {
        this.options.a = "MARRY";
        this.options.b = "Run like the Devil.";
        this.options.c = "";
        this.options.d = "";
        this.options.e = "";
    } else if (game.outcome === "felicity_loves_you") {
        this.options.a = "Say you love her too.";
        this.options.b = "Blow her off.";
        this.options.c = "";
        this.options.d = "";
        this.options.e = "";
    } else if (game.outcome === "warden_executes_you_for_homicide") {
        this.options.a = "Run around like a chicken with its head cut off.";
        this.options.b =
            "Watch yourself run around like a chicken with its head cut off.";
        this.options.c = "Run away with your head.";
        this.options.d = "Run away without your head.";
        this.options.e = "";
    } else if (game.outcome === "hire_assassin" ||
               game.outcome === "already_dead") {
        this.options.a = "Tell him to assassinate Lord Arthur.";
        this.options.b = "Tell him to assassinate Lord Bartholomew.";
        this.options.c = "Tell him to assassinate Lord Carlos.";
        this.options.d = "Tell him to assassinate Lord Daniel.";
        this.options.e = "";
    } else if (game.burned_everything_victory()) {
        var messages = [
            " Some people just like to watch the world " +
            "burn. You are one of them. You win.",
            " You are satisfied with how everything has been burned. You win.",
        ];
        game.message += messages[functions.random_int(messages.length)];
        this.set_game_over_options();
    } else if (game.lords_victory()) {
        var lords_messages = [
            " With the last of the four lords dead, you have destroyed the " +
            "establishment and brought about a Utopian anarchy... " +
            "more or less. You win!",
        ];
        game.message += lords_messages[
            functions.random_int(lords_messages.length)
        ];
        this.set_game_over_options();
    } else if (Math.floor(Math.random() * 250) === 0 &&
               game.places[
                   game.character.place
               ].burnable === true) {
        this.set_pyro_options();
    } else {
        this.get_character_options(game);
        this.get_default_options(game);
        this.get_item_options(game);
        this.get_outcome_options(game);
        this.get_person_options(game);
        this.get_place_options(game);
        this.options.a = this.options.a.get();
        this.options.b = this.options.b.get();
        this.options.c = this.options.c.get();
        this.options.d = this.options.d.get();
        if (Math.floor(Math.random() * 250) === 0 &&
            game.outcome !== "think_four_ideas" &&
            game.character.place !== "void") {
            this.options.e = "Enter the void.";
        } else if (game.character.place === "void" &&
                   game.outcome !== "think_four_ideas" &&
                   (Math.floor(Math.random() * 4) === 0 ||
                    game.outcome === "god_shows_you_the_way")) {
            this.options.e = "Exit the void.";
        } else {
            this.options.e = "";
        }
    }
    game.set_destination(this.options.c);
    game.options = this.options;
};

OptionsGenerator.prototype.set_pyro_options = function() {
    this.options.a = "Fill the place with fire.";
    this.options.b = "Ignite an inferno.";
    this.options.c = "Release your inner arsonist.";
    this.options.d = "Engulf everything in flames.";
    this.options.e = "";
};

OptionsGenerator.prototype.set_game_over_options = function() {
    this.options.a = "Play again.";
    this.options.b = "Don't play again.";
    this.options.c = ""; 
    this.options.d = "";
    this.options.e = "";
};

exports.OptionsGenerator = OptionsGenerator;
