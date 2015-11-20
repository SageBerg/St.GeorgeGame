"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var actions   = require("./actions").actions;
var functions = require("./functions");
var items     = require("./items");
var outcomes  = require("./outcomes").outcomes;
var raffle    = require("./raffle");

// the order of BURNABLE_PLACES matters based on the story
var BURNABLE_PLACES = [
    "lord_bartholomew_manor",
    "woods",
    "lord_carlos_manor",
    "tower",
    "market",
    "wizard_lab",
    "church",
    "tavern",
];
var FEMALE    = "female";
var MALE      = "male";
var NONE = "none";

var HE_SHE_THEY = {
    FEMALE: "she",
    MALE: "he",
    "group": "they"
};

var Game = function(game_state) {
    this.action =      game_state.action; 
    this.character =   game_state.character;
    this.destination = game_state.destination;
    this.for_sell =    game_state.for_sell;
    this.marriage =    game_state.marriage;
    this.message =     game_state.message;
    this.options =     game_state.options;
    this.outcome =     game_state.outcome;
    this.persons =     game_state.persons;
    this.places =      game_state.places;
    this.score =       game_state.score;
};

Game.prototype.add_next_target_suggestion = function() {
    var burned_count = 0;
    var still_burnable = [];
    for (var i = 0; i < BURNABLE_PLACES.length; i++) {
        if (this.places[BURNABLE_PLACES[i]].burnable === false) {
            burned_count += 1;
        } else {
            still_burnable.push(BURNABLE_PLACES[i]);
        }
    }
    if (burned_count >= BURNABLE_PLACES.length / 2 &&
        burned_count < BURNABLE_PLACES.length) {
        var next_target = this.places[
            functions.random_choice(still_burnable)
        ].name;
        var burn_messages = [
            " God tells you to burn down " + next_target + " next.",
            " It irks you that you still haven't burned down " +
            next_target + ".",
            " That was so fun you feel like burning down " +
            next_target + " now.",
            " You think you should celebrate your success by burning down " +
            next_target + ".",
        ];
        this.message += functions.random_choice(burn_messages);
    }
};

Game.prototype.animal_drown = function() {
    if (this.character.items.cat === 1) {
        this.character.items.cat = 0;
        this.message += " Your cat drowns.";
    } else if (this.character.items.cat > 1) {
        this.character.items.cat = 0;
        this.message += " Your cats drown.";
    }
    if (this.character.items.donkey === 1) {
        this.character.items.donkey = 0;
        this.message += " Your donkey drowns.";
    } else if (this.character.items.donkey > 1) {
        this.character.items.donkey = 0;
        this.message += " Your donkeys drown.";
    }
};

Game.prototype.arrested = function() {
    this.lose_all_items();
    this.move_character("prison");
    this.character.person = "other_lunatics";
};

Game.prototype.are_or_is = function() {
    if (this.persons[this.character.person].type === "group") {
        return "are";
    }
    return "is";
};

Game.prototype.burn = function() {
    this.places[this.character.place].burnable = false;
    this.places[this.character.place].name =
        "the smoldering remains of " +
        this.places[this.character.place].name;
    this.character.person = null;
    this.message = "You find yourself in " +
    this.places[this.character.place].name + ".";
    this.add_next_target_suggestion();
    if (functions.random_int(3) === 0) {
        this.spread_fire();
    }
};

Game.prototype.burn_a_bunch_of_places = function() {
    var number_of_places_burned = functions.random_int(8);
    for (var i = 0; i < number_of_places_burned; i++) {
        if (this.places[BURNABLE_PLACES[i]].burnable === true) {
            this.places[BURNABLE_PLACES[i]].burnable = false;
            this.places[BURNABLE_PLACES[i]].name = "the smoldering remains " +
            "of " + this.places[BURNABLE_PLACES[i]].name;
        }
    }
};

Game.prototype.burned_everything_victory = function() {
    for (var place in this.places) {
        if (this.places[place].burnable) {
            return false;
        }
    }
    this.score = parseInt(this.score) + 100;
    return true;
};

// kills character if he or she doesn't have a four-leaf clover
Game.prototype.clover = function() {
    if (this.character.items["four-leaf clover"] < 1) {
        this.character.is_dead = true;
    } else {
        this.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
};

// conjugates a verb to singular or plural
Game.prototype.conjugate = function(word) {
    if (this.persons[this.character.person].type !== "group") {
        return word + "s";
    }
    return word;
};

Game.prototype.decrement_money = function() {
    switch (this.character.money) {
        case "large_fortune":
            this.character.money = "small_fortune";
            this.message += " You now only have a small fortune.";
            break;
        case "small_fortune":
            this.character.money = "pittance";
            this.message += " You now only have a pittance.";
            break;
        case "pittance":
            this.character.money = NONE;
            this.message += " You now have no money.";
            break;
    }
};

Game.prototype.enact_outcome = function() {
    outcomes[this.outcome](this);
};

Game.prototype.die = function() {
    this.character.is_dead = true;
};

Game.prototype.equip_best_weapon = function() {
    var found_weapon_flag = false;
    var keys = Object.keys(items.weapons_map);
    for (var i = 0; i < keys.length; i++) {
        if (this.character.equipped_weapon === "" &&
            this.character.items[keys[i]] > 0) {
            this.character.equipped_weapon = keys[i];
            found_weapon_flag = true;
        } else if (this.character.items[keys[i]] > 0 &&
                   items.weapons_map[keys[i]].attack >=
                   items.weapons_map[
                       this.character.equipped_weapon
                   ].attack) {
            this.character.equipped_weapon = keys[i];
            found_weapon_flag = true;
        }
    }
    if (found_weapon_flag === false) {
        this.character.equipped_weapon = "";
    }
};

Game.prototype.get_character_options = function(options) {
    if (this.character.money === "large_fortune" &&
        this.character.strength > 5 &&
        Math.floor(Math.random() * 3) === 0) {
        raffle.add(options.c, "Quit while you're ahead.", 1);
    }
    if (this.places[this.character.place].locked === false &&
        this.character.is_threatened === false) {
        raffle.add(options.c, "GO_TO", 4);
    }
    if (this.character.is_threatened === true) {
        if (this.character.person !== "guards") {
            raffle.add(options.b, "Play dead.", 1);
            raffle.add(options.d, "Panic!", 1);
        }
        raffle.add(options.c, "Run like the Devil.", 90);
        raffle.add(options.c, "Waddle like God.", 10);
    }
    if ((this.character.money === "large_fortune" ||
        this.character.money === "small_fortune") &&
        this.places[this.character.place].town === true
        ) {
        raffle.add(options.d, "Flaunt your wealth.", 1);
    }
};

Game.prototype.get_default_options = function(options) {
    if (this.character.sex === FEMALE) {
        raffle.add(options.a, "Admire your own bosoms.", 1);
    }
    raffle.add(options.a, "Think.", 1);
    if (this.character.place !== "void") {
        raffle.add(options.a, "LICK_THE_GROUND", 1);
        raffle.add(options.c, "Leave in a puff.", 1);
    }
    raffle.add(options.b, "Pray to a higher power.", 1);
    raffle.add(options.c, "Go to sleep.", 1);
    raffle.add(options.d, "Sing a song.", 1);
    raffle.add(options.d, "Dance a jig.", 1);
};

Game.prototype.get_ground = function() {
    switch (this.character.place) {
        case "pirate_ship":
            return "deck";
        case "docks":
            return "docks";
    }
    if (this.get_place().outside === false) {
        //if a place has been burned down, you can't lick its floor
        if (this.get_place().burnable === false &&
            (this.character.place === "church" ||
             this.character.place === "lord_bartholomew_manor" ||
             this.character.place === "lord_carlos_manor" ||
             this.character.place === "tavern" ||
             this.character.place === "tower" ||
             this.character.place === "wizard_lab")) {
            return "ground";
        }
        return "floor";
    }
    return "ground";
};

Game.prototype.get_item = function(item) {
    if (this.character.items[item] === 0) {
        this.message += " You now have " + functions.a_or_an(item[0]) +
        " " + item + ".";
    } else {
        this.message += " You now have another " + item + ".";
    }
    this.character.items[item] += 1;
};

Game.prototype.get_item_options = function(options) {
    if (this.character.items.apple > 0) {
        raffle.add(options.c, "Chow down on your apple.", 2);
    }
    if (this.character.items["bag of jewels"] > 0) {
        raffle.add(options.a, "Admire your jewels.", 1);
    }
    if (this.character.items["ball of sap"] > 0) {
        raffle.add(options.c, "Chow down on your ball of sap.", 1);
    }
    if (this.character.items["ball of sap"] > 0 &&
        this.character.items["bouquet of flowers"] > 0 &&
        this.character.items["many-colored mushroom"] > 0 &&
        this.character.person === "witch") {
        raffle.add(options.b, "Ask the witch to brew you a potion.", 100);
    }
    if (this.character.items["black mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your black mushroom.", 1);
    }
    if (this.character.items.cake > 0) {
        raffle.add(options.d, "Have your cake and eat it too.", 1);
    }
    if (this.character.items["bouquet of flowers"] > 0 &&
        (this.character.person === "eve" ||
         this.character.person === "mermaid" ||
         this.character.person === "nymph_queen" ||
         this.character.person === "olga" ||
         this.character.place === "prison")) {
        raffle.add(options.b, "GIVE_FLOWERS", 100);
    }
    if (this.character.items.cat > 0) {
        raffle.add(options.d, "Swing your cat.", 1);
        if (this.character.items.cat > 1) {
            raffle.add(options.b, "Breed your cats.", 1);
        }
    }
    if (this.character.items.cat > 0 &&
        this.character.items.pearl > 0 &&
        this.character.person === "witch") {
        raffle.add(options.b, "Ask the witch to brew you a potion.", 100);
    }
    if (this.character.items.cat > 0 &&
        (this.character.person === "eve" ||
         this.character.person === "olga")) {
        raffle.add(options.a, "GIVE_HER_CAT", 5);
    }
    if (this.character.items["deep-cave newt"] > 1) {
        raffle.add(options.b, "Breed your deep-cave newts.", 1);
    }
    if (this.character.items["deep-cave newt"] > 0 &&
        this.character.items["white mushroom"] > 0 &&
        this.character.person === "witch") {
        raffle.add(options.b, "Ask the witch to brew you a potion.", 100);
    }
    if (this.character.items.donkey > 0) {
        raffle.add(options.c, "GO_TO", 6);
    }
    if (this.character.items.frog > 0 &&
        this.places[this.character.place].locked === false) {
        raffle.add(options.b, "Kiss your frog.", 2);
    }
    if (this.character.items["many-colored mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your many-colored mushroom.", 2);
    }
    if (this.character.items["potion of strength"] > 0) {
        raffle.add(options.d, "Slurp down your potion of strength.", 2);
    }
    if (this.character.items["potion of tail growth"] > 0) {
        raffle.add(options.d, "Slurp down your potion of tail growth.", 2);
    }
    if (this.character.items["potion of transformation"] > 0) {
        raffle.add(options.d, "Slurp down your potion of transformation.", 4);
    }
    if (this.character.items["potion of love"] > 0 &&
        (this.character.person === "eve" ||
         this.character.person === "mermaid" ||
         this.character.person === "olga" ||
         this.character.person === "nymph_queen" ||
         this.character.person === "priestess")) {
        raffle.add(options.b, "LOVE_POTION", 10000);
    }
    if (this.character.items["potion of love"] > 0 &&
        this.character.sex === FEMALE &&
        (this.character.person === "lord_arthur" ||
         this.character.person === "lord_bartholomew" ||
         this.character.person === "lord_carlos" ||
         this.character.person === "lord_daniel" ||
         this.character.person === "noblman" ||
         this.character.person === "st_george")) {
        raffle.add(options.b, "LOVE_POTION", 10000);
    }
    if (this.character.items["shiny foreign coin"] > 0 &&
        (this.character.person === "dragon_blue" ||
         this.character.person === "dragon_red" ||
         this.character.person === "lord_arthur" ||
         this.character.person === "lord_bartholomew" ||
         this.character.person === "lord_carlos" ||
         this.character.person === "lord_daniel")) {
        raffle.add(options.b, "SHOW_COIN", 100);
    }
    if (this.character.items["handful of void dust"] > 0 &&
        this.character.person === "wizard") {
        raffle.add(options.d, "Trade your void dust to the wizard.", 10000);
    }
    if (this.character.items["white mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your white mushroom.", 2);
    }
    if (this.character.items["yellow mushroom"] > 0) {
        raffle.add(options.c, "Chow down on your yellow mushroom.", 1);
    }
};

Game.prototype.get_money = function(money) {
    if (items.money_map[this.character.money].value <
        items.money_map[money].value) {
        this.character.money = money;
        this.message += " You now have " +
            items.money_map[money].name + ".";
    } else {
        this.message +=
        " You still have " +
        items.money_map[this.character.money].name + ".";
    }
};

Game.prototype.get_name = function() {
    return this.persons[this.character.person].name;
};

Game.prototype.get_outcome_options = function(options) {
    switch (this.outcome) {
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
            raffle.add(options.a, "Kill yourself in frustration.", 1);
            if (this.places[this.character.place].locked === false) {
                raffle.add(options.c, "Leave in a huff.", 4);
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
            if (this.character.sex === FEMALE) {
                raffle.add(options.a, "Pat yourself on the back.", 1);
            } else {
                raffle.add(options.a, "Thump yourself on the chest.", 1);
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
            raffle.add(options.c, "Celebrate your success.", 2);
            break;
        case "cat_burning":
            raffle.add(options.a, "Try to save the cat.", 100);
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
            if (this.persons.lord_carlos.alive === true &&
                this.places.lord_carlos_manor.burnable === true) {
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
        case "gawk_at_cake":
            raffle.add(options.c, "Take the cake.", 1);
            break;
        case "god_shows_you_the_way":
            if (this.get_place().locked === false) {
                raffle.add(options.c, "GO_TO", 10000);
            }
            break;
        case "god_tells_you_to_burn_stuff":
            if (this.get_place().burnable === true) {
                raffle.add(options.b, "BURN", 10000);
            }
            break;
        case "guards_stop_you_burning":
            this.character.excuse = "cold";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_dancing":
            this.character.excuse = "happy";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_killing":
            this.character.excuse = "mad";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_licking":
            this.character.excuse = "hungry";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_rich":
            this.character.excuse = "rich";
            raffle.add(options.d, "Tell the guards you're a lunatic.", 10000);
            break;
        case "guards_stop_you_singing":
            this.character.excuse = "talented";
            raffle.add(options.d, "TELL_GUARDS", 10000);
            break;
        case "guards_stop_you_swinging":
            this.character.excuse = "insane";
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
        case "newt_race":
            if (this.character.items["deep-cave newt"] > 0) {
                raffle.add(options.a, "Enter your deep-cave newt in the race.",
                    10000);
            }
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
            if (this.character.place !== "void") {
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
};

Game.prototype.get_person = function() {
    return this.persons[this.character.person];
};

Game.prototype.get_place = function() {
    return this.places[this.character.place];
};

Game.prototype.get_person_options = function(options) {
    if (this.character.person !== null) {
        raffle.add(options.a, "ATTACK", 20);
        raffle.add(options.b, "Boast of your bravery.", 1);
    }
    switch (this.character.person) {
        case "blind_bartender":
            raffle.add(options.c, "Chat with the blind bartender.", 14);
            break;
        case "dog":
            if (this.character.items.fish > 0) {
                raffle.add(options.b, "Bribe the dog with a fish.", 1000);
            }
            if (this.character.items.cat > 0) {
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
            if (this.character.sex === MALE) {
                if (this.character.money === "large_fortune" &&
                    this.character.money === "small_fortune") {
                    raffle.add(options.a, "Repay your debts.", 10);
                }
                raffle.add(options.b, "SUCK_UP", 5);
                raffle.add(options.b, "Grovel.", 10);
                raffle.add(options.c,
                    "Challenge Lord Carlos to a game of chess.", 15);
                raffle.add(options.d,
                    "Make it hard for Lord Carlos to kill you.", 15);
            } else {
                //raffle.add(options.d, "FLIRT_WITH", 100);
            }
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
            raffle.add(options.c, "Chat with St. George.", 2);
            break;
        case "war_merchant":
            var weapons = ["cutlass", "dagger", "hammer", "iron_hammer",
                           "jeweled_cutlass", "long_pitchfork", "pitchfork",
                           "poison_dagger", ];
            // you can't buy weapons you already have
            // available_weapons holds weapons you don't have
            var available_weapons = [];
            for (var i = 0; i < weapons.length; i++) {
                if (this.character.items[weapons[i]] === 0) {
                    available_weapons.push(weapons[i]);
                }
            }
            // if you have all of the weapons the merchant sells
            // then BUY_WEAPON will not be added to the raffle
            if (available_weapons.length === 0) {
                break;
            }
            var weapon = functions.random_choice(available_weapons);
            this.for_sell = weapon;
            raffle.add(options.d, "BUY_WEAPON", 10000);
            break;
        case "witch":
            raffle.add(options.b, "Ask the witch to brew you a potion.", 10);
            if (this.character.items.cat > 0) {
                raffle.add(options.c, "Give your cat to the witch.", 20);
            }
            break;
        case "wizard":
            raffle.add(options.b, "Ask the wizard for advice.", 10);
            raffle.add(options.d, "Pull on the wizard's beard to make sure " +
                "it's real.", 10);
            break;
    }
};

Game.prototype.get_place_options = function(options) {
    if (this.places[this.character.place].burnable &&
        this.outcome != "guards_stop_you_burning") {
        raffle.add(options.b, "BURN", 1);
    }
    switch (this.character.place) {
        case "arctic":
            raffle.add(options.a, "Go fishing.", 4);
            raffle.add(options.b, "Build an igloo.", 4);
            raffle.add(options.b, "Play in the snow.", 2);
            raffle.add(options.c, "Club a seal.", 8);
            raffle.add(options.d, "Freeze to death.", 2);
            break;
        case "cave":
            raffle.add(options.c, "Look for a way out.", 10);
            raffle.add(options.d, "Go deeper.", 10);
            break;
        case "church":
            if (this.get_place().burnable === true) {
                if (this.character.person === null) {
                    raffle.add(options.a, "Tell a priest he's fat.", 2);
                    raffle.add(options.a,
                        "Tell a priest God doesn't exist.", 2);
                    raffle.add(options.a,
                        "Tell a priest you're the chosen one.", 2);
                }
                if (items.money_map[this.character.money].value > 0) {
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
            if (this.get_place().burnable === true) {
                if (this.character.person === null &&
                    this.character.sex === MALE) {
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
                if (this.persons.lord_bartholomew.alive === true &&
                    this.character.person !== "lord_bartholomew") {
                    raffle.add(options.a,
                        "Ask for an audience with Lord Bartholomew.", 4);
                }
                raffle.add(options.d, "Sneak around.", 4);
            }
            break;
        case "lord_carlos_manor":
            if (this.get_place().burnable === true) {
                if (this.character.person === null) {
                    if (this.character.sex === MALE) {
                        raffle.add(options.a, "Ask about assassins.", 4);
                    }
                    raffle.add(options.a, "Hire an assassin.", 4);
                    raffle.add(options.b, "BURN", 5);
                    if (this.character.sex === MALE) {
                        raffle.add(options.b, "Tell the next person you " +
                            "meet that you're Lord Arthur.", 1);
                        raffle.add(options.b, "Tell the next person you " +
                            "meet that you're Lord Bartholomew.", 1);
                        raffle.add(options.b, "Tell the next person you " +
                            "meet that you're Lord Daniel.", 1);
                        raffle.add(options.b, "Tell the next person you " +
                            "meet that you're Lord Carlos.", 1);
                        raffle.add(options.b, "Tell the next person you " +
                            "meet that you're St. George.", 1);
                    }
                }
                if (this.character.person !== "eve" &&
                    this.persons.eve.alive === true) {
                    raffle.add(options.c, "Look for Lord Carlos' daughter.", 4);
                }
                raffle.add(options.d, "Sneak around.", 8);
            }
            break;
        case "market":
            if (this.get_place().burnable === true &&
                this.get_place().trashable === true) {
                if (this.character.person !== "war_merchant" &&
                    this.persons.war_merchant.alive === true) {
                    raffle.add(options.a, "Look for a weapon.", 10);
                }
                if (this.persons.wizard.alive === true &&
                    this.character.person !== "wizard") {
                    raffle.add(options.b, "Look for the wizard.", 1);
                }
                if (this.character.person === null) {
                    var item  = functions.random_choice(items.MARKET_ITEMS);
                    this.for_sell = item;
                    raffle.add(options.b, "BUY_ITEM", 6);
                }
                raffle.add(options.d, "Watch a play.", 2);
            }
            break;
        case "mermaid_rock":
            if (this.character.person !== "mermaid") {
                raffle.add(options.a, "Look for mermaids.", 10);
            }
            raffle.add(options.c, "Go fishing.", 20);
            raffle.add(options.d, "Sun yourself on a rock.", 4);
            break;
        case "ocean":
            raffle.add(options.a, "Look for mermaids.", 5);
            if (this.outcome !== "fail_to_find_mermaids_find_turtle") {
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
            if (this.character.items["sailor peg"] > 0) {
                raffle.add(options.c, "Climb up the top sails.", 10);
            }
            if (this.outcome !== "climb_and_get_sap" &&
                this.outcome !== "merchant_ship_nest" &&
                this.outcome !== "watch_duty") {
                raffle.add(options.c, "Climb into the crow's nest.", 8);
            }
            raffle.add(options.d, "Drop anchor.", 7);
            break;
        case "prison":
            raffle.add(options.b, "Bide your time.", 6);
            raffle.add(options.c, "Pace around.", 20);
            if (this.persons.felicity.attracted > 0) {
                if (this.persons.felicity.name === "the fat lady") {
                    raffle.add(options.d,
                        "Flirt with the fat lady who feeds you.", 10);
                } else {
                    raffle.add(options.d, "Flirt with Felicity.",10);
                }
            }
            break;
        case "smoking_volcano":
            if (this.character.person === null) {
                raffle.add(options.a, "Look for dragons.", 6);
            }
            raffle.add(options.b, "Choke on fumes.", 2);
            raffle.add(options.c, "Climb to the top of the volcano.", 4);
            raffle.add(options.d, "Go swimming in a pool of lava.", 2);
            break;
        case "streets":
            if (this.character.items.apple > 0) {
                raffle.add(options.a, "Give your apple to an orphan.", 4);
            }
            raffle.add(options.a, "Look for a cat.", 4);
            raffle.add(options.a, "Look for a cat.", 4);
            if (this.character.sex === FEMALE) {
                raffle.add(options.b, "Gawk at men.", 2);
            } else if (this.character.sex === MALE) {
                raffle.add(options.b, "Gawk at women.", 2);
            }
            raffle.add(options.c, "GO_TO", 2);
            if (this.character.person !== "st_george" &&
                this.persons.st_george.alive === true) {
                raffle.add(options.d, "Look for St. George.", 2);
            }
            break;
        case "tavern":
            if (this.get_place().burnable === true) {
                raffle.add(options.a, "Ask about assassins.", 4);
                raffle.add(options.b, "Buy a drink.", 4);
                raffle.add(options.d, "Do some gambling.", 4);
                if (this.persons.olga.alive === true &&
                    this.persons.olga.name === "Olga" &&
                    this.character.person !== "olga") {
                    raffle.add(options.b, "Look for Olga.", 10);
                }
            }
            break;
        case "tower":
            if (this.get_place().burnable === true) {
                if (this.character.person === null &&
                    this.character.sex === MALE) {
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
                if (this.persons.lord_daniel.alive === true &&
                    this.character.person !== "lord_daniel") {
                    raffle.add(options.a,
                        "Ask for an audience with Lord Daniel.", 4);
                }
                raffle.add(options.c,
                    "Complain about unfair imprisonment policies.", 4);
                raffle.add(options.d, "Train with the guards.", 8);
            }
            break;
        case "void":
            raffle.add(options.c, "Float through the void.", 5);
            raffle.add(options.d, "Gather void dust.", 2);
            break;
        case "woods":
            if (this.get_place().burnable === true) {
                raffle.add(options.a, "Go mushroom picking.", 4);
                if (this.character.items.ax > 0) {
                    raffle.add(options.c,
                        "Chop down a tree with your ax.", 10);
                }
                if (this.character.person !== "nymph_queen") {
                    raffle.add(options.d, "Look for nymphs.", 4);
                }
            }
            if (this.character.person !== "witch") {
                raffle.add(options.b, "Look for witches.", 4);
            }
            break;
        case "wizard_lab":
            if (this.get_place().burnable === true) {
                if (this.places.wizard_lab.trashable === true &&
                    this.outcome !== "wizard_stops_you_trashing") {
                    raffle.add(options.a, "Trash the place.", 4);
                }
                raffle.add(options.b, "Read a spellbook.", 4);
                raffle.add(options.c, "Snoop around.", 6);
                raffle.add(options.d, "Drink a random potion.", 4);
            }
            break;
    }
};

Game.prototype.get_random_adjacent_destination = function() {
    var links = this.places[this.character.place].links;
    var dest = links[functions.random_int(links.length)];
    return dest;
};

//so we can send the state of the game sending the game logic 
Game.prototype.get_state = function() {
    var game_state = {};
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            game_state[property] = this[property];
        }
    }
    return game_state;
};

Game.prototype.get_subject = function() {
    return HE_SHE_THEY[this.persons[this.character.person].type];
};

Game.prototype.get_weapon = function(weapon) {
    if (this.character.items[weapon] === 0) {
        this.message += " You now have " +
        functions.a_or_an(items.weapons_map[weapon].name[0]) + " " +
        items.weapons_map[weapon].name + ".";
    } else {
        this.message += " You now have another " +
        items.weapons_map[weapon].name + ".";
    }
    this.character.items[weapon] += 1;
    this.equip_best_weapon();
};

Game.prototype.get_wizard_teleport_message = function() {
    return functions.random_choice([
        "The wizard conks you on the head with his staff.",
        "The wizard douses you with a potion.",
        "The wizard grabs your arm and spins you around.",
        "The wizard makes you leave in a puff.",
        "The wizard starts reading some magic words from a scroll. " +
        "He keeps reading for a while so you get bored and try to " +
        "sneak away. You must have sneaked pretty well.",
    ]);
};

Game.prototype.grow_tail = function() {
    if (this.character.has_tail === false) {
        this.character.has_tail = true;
        this.message = "You grow a " +
            functions.random_choice(["alligator", "beaver", "donkey", "horse",
                                     "monkey", "pig", "rat"]) + " tail.";
    } else {
        this.message = "The potion has no effect.";
    }
};

Game.prototype.leave_donkey_behind = function() {
    if (this.character.items.donkey === 1) {
        this.character.items.donkey = 0;
        this.message += " You have no idea where your donkey went.";
    } else if (this.character.items.donkey > 1) {
        this.character.items.donkey = 0;
        this.message += " You have no idea where your donkeys went.";
    }
};

Game.prototype.lords_victory = function() {
    if (this.persons.lord_arthur.alive === false &&
        this.persons.lord_bartholomew.alive === false &&
        this.persons.lord_carlos.alive === false &&
        this.persons.lord_daniel.alive === false) {
        this.score = parseInt(this.score) + 100;
        return true;
    }
    return false;
};

Game.prototype.lose_all_items = function() {
    for (var item in this.character.items) {
        this.character.items[item] = 0;
    }
    this.equip_best_weapon();
    this.character.money = NONE;
    this.message += " You now have no items.";
    this.message += " You now have no money.";
};

Game.prototype.lose_item = function(item) {
    this.character.items[item] -= 1;
    this.character.items[item] === 0 ?
    this.message += " You no longer have " +
        functions.a_or_an(item[0]) + " " :
    this.message += " You have one less ";
    this.message += item + "." ;
};

Game.prototype.marriage_victory = function() {
    if (this.character.has_found_true_love) {
        this.score = parseInt(this.score) + 100;
        return true;
    }
    return false;
};

Game.prototype.move_character = function(destination) {
    this.character.place = destination;
    this.character.is_threatened = false;
    this.character.person = null;
    if (destination === "docks" ||
        destination === "mermaid_rock" ||
        destination === "pirate_ship") {
        this.message += " You find yourself on ";
    } else if (destination === "gates_of_hell" ||
               destination === "smoking_volcano") {
        this.message += " You find yourself at ";
    } else {
        this.message += " You find yourself in ";
    }
    this.message += this.places[destination].name + ".";
    if (destination === "gates_of_hell" &&
        this.persons.cerberus.alive === true) {
        this.character.person = "cerberus";
        this.message += " A giant three-headed dog is blocking " +
            "your way."; 
    }
};

Game.prototype.set_destination = function(option) {
    if (option === "GO_TO" || option === "Wander the countryside.") {
        this.destination =
            this.get_random_adjacent_destination();
    }
    switch (this.outcome) {
        case "directions_to_manor":
            this.destination = "lord_bartholomew_manor";
            break;
        case "directions_to_town":
            this.destination = "streets";
            break;
        case "directions_to_volcano":
            this.destination = "smoking_volcano";
            break;
        case "directions_to_woods":
            this.destination = "woods";
            break;
    }
};

Game.prototype.set_game_over_options = function(options) {
    options.a = "Play again.";
    options.b = "Don't play again.";
    options.c = "";
    options.d = "";
    options.e = "";
};

Game.prototype.set_pyro_options = function(options) {
    options.a = "Fill the place with fire.";
    options.b = "Ignite an inferno.";
    options.c = "Release your inner arsonist.";
    options.d = "Engulf everything in flames.";
    options.e = "";
};

Game.prototype.set_options= function() {
    var options = {"a": {}, "b": {}, "c": {}, "d": {} };
    if (this.character.is_dead || this.marriage_victory()) {
        this.set_game_over_options(options);
    } else if (this.outcome === "eve_name") {
        options.a = "Anna.";
        options.b = "Beth.";
        options.c = "Cass.";
        options.d = "Dina.";
        options.e = "Eve.";
    } else if (this.outcome === "find_wizard_teleport") {
        options.a = functions.random_choice([
                "Ask him to teleport you to Lord Arthur's pirate ship.",
                "Ask him to teleport you to the Arctic.",
                ]);
        options.b = functions.random_choice([
                "Beg him to teleport you to Lord Bartholomew's manor.",
                "Beg him to teleport you to the woods.",
                ]);
        options.c = functions.random_choice([
                "Command him to teleport you to the countryside.",
                "Command him to teleport you to Lord Carlos' manor.",
                ]);
        options.d = functions.random_choice([
                "Demand that he teleport you to the smoking volcano.",
                "Demand that he teleport you to the tower.",
                ]);
        options.e = "";
    } else if (this.character.is_frog) {
        options.a = "Ribbit.";
        options.b = "Hop.";
        options.c = "Croak.";
        options.d = "Eat a fly.";
        options.e = "";
    } else if (this.character.is_monstrosity) {
        options.a = "Annihilate everything.";
        options.b = "Terrorize the kingdom.";
        options.c = "Go on a rampage.";
        options.d = "Destroy all human civilizations.";
        options.e = "";
    } else if (this.character.is_shrub) {
        options.a = "Continue being a shrub.";
        options.b = "Continue being a shrub.";
        options.c = "Continue being a shrub.";
        options.d = "Continue being a shrub.";
        options.e = "";
    } else if (this.marriage === true) {
        options.a = "MARRY";
        options.b = "Run like the Devil.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else if (this.outcome === "felicity_loves_you") {
        options.a = "Say you love her too.";
        options.b = "Blow her off.";
        options.c = "";
        options.d = "";
        options.e = "";
    } else if (this.outcome === "hire_assassin" ||
               this.outcome === "already_dead") {
        options.a = "Tell him to assassinate Lord Arthur.";
        options.b = "Tell him to assassinate Lord Bartholomew.";
        options.c = "Tell him to assassinate Lord Carlos.";
        options.d = "Tell him to assassinate Lord Daniel.";
        options.e = "";
    } else if (this.burned_everything_victory()) {
        var messages = [
            " Some people just like to watch the world " +
            "burn. You are one of them. You win.",
            " You are satisfied with how everything has been burned. You win.",
        ];
        this.message += messages[functions.random_int(messages.length)];
        this.set_game_over_options(options);
    } else if (this.lords_victory()) {
        var lords_messages = [
            " With the last of the four lords dead, you have destroyed the " +
            "establishment and brought about a Utopian anarchy... " +
            "more or less. You win!",
        ];
        this.message += lords_messages[
            functions.random_int(lords_messages.length)
        ];
        this.set_game_over_options(options);
    } else if (Math.floor(Math.random() * 250) === 0 &&
               this.places[
                   this.character.place
               ].burnable === true) {
        this.set_pyro_options(options);
    } else {
        this.get_character_options(options);
        this.get_default_options(options);
        this.get_item_options(options);
        this.get_outcome_options(options);
        this.get_person_options(options);
        this.get_place_options(options);
        options.a = raffle.get(options.a);
        options.b = raffle.get(options.b);
        options.c = raffle.get(options.c);
        options.d = raffle.get(options.d);
        if (Math.floor(Math.random() * 250) === 0 &&
            this.outcome !== "think_four_ideas" &&
            this.character.place !== "void") {
            options.e = "Enter the void.";
        } else if (this.character.place === "void" &&
                   this.outcome !== "think_four_ideas" &&
                   (Math.floor(Math.random() * 4) === 0 ||
                    this.outcome === "god_shows_you_the_way")) {
            options.e = "Exit the void.";
        } else {
            options.e = "";
        }
    }
    this.set_destination(options.c);
    this.marriage = false;
    this.options = options;
};

Game.prototype.set_outcome = function() {
    var possible_outcomes;
    if (this.character.is_threatened === true &&
        this.action !== "A3." &&
        this.action !== "Apologize." &&
        this.action !== "ATTACK" &&
        this.action !== "Bribe the dog with a fish." &&
        this.action !== "Challenge Lord Carlos to a this of chess." &&
        this.action !== "E4." &&
        this.action !== "Enter the void." &&
        this.action !== "Grovel." &&
        this.action !== "Leave in a puff." &&
        this.action !== "Make it hard for Lord Carlos to kill you." &&
        this.action !== "Nf3." &&
        this.action !== "Panic!" &&
        this.action !== "Play dead." &&
        this.action !== "Repay your debts." &&
        this.action !== "Run like the Devil." &&
        this.action !== "SHOW_COIN" &&
        this.action !== "SUCK_UP" &&
        this.action !== "TELL_GUARDS" &&
        this.action !== "Tell her you're sorry." &&
        this.action !== "Throw your cat at the dog." &&
        this.action !== "Try to reason with the dog." &&
        this.action !== "Try to reason with the mob." &&
        this.action !== "Waddle like God.") {
        possible_outcomes = actions.GET_ATTACKED(this.get_state(), {});
    } else {
        possible_outcomes = actions[this.action](this.get_state(), {});
    }
    this.outcome = raffle.get(possible_outcomes);
};

Game.prototype.spread_fire = function() {
    var burnables = [];
    var links = this.get_place().links;
    for (var i = 0; i < links.length; i++) {
        if (this.places[links[i]].burnable === true) {
            burnables.push(links[i]);
        }
    }
    if (burnables.length === 0) {
        return; // nothing left to do if fire can't spread
    }
    var next_fire = functions.random_choice(burnables);
    if (this.places[next_fire].burnable === true) {
        this.message += functions.random_choice([
            " The blaze also takes out ",
            " The fire spreads to ",
            " The fire also destroys ",
            " The flames spread to ",
        ]) + this.places[next_fire].name + ".";
        this.places[next_fire].burnable = false;
        this.places[next_fire].name = "the smoldering remains of " +
            this.places[next_fire].name;
    }
};

Game.prototype.stop_tripping = function() {
    if (this.character.is_tripping &&
        Math.floor(Math.random() * 8) === 0) {
        this.character.is_tripping = false;
    }
};

Game.prototype.teleport = function() {
    var place_list = [];
    for (var place in this.places) {
        if (this.places[place] !==
            this.places[this.character.place] &&
            place !== "gates_of_hell" &&
            place !== "upstairs" &&
            place !== "void") {
            place_list.push(place);
        }
    }
    var roll = functions.random_int(place_list.length);
    var destination = place_list[roll];
    this.move_character(destination);
    this.leave_donkey_behind();
};

Game.prototype.trash = function() {
    this.places[this.character.place].trashable = false;
    this.places[this.character.place].name =
        "the trashed remains of " +
        this.places[this.character.place].name;
    this.character.person = null;
    this.message = "You find yourself in " +
    this.places[this.character.place].name + ".";
};

exports.Game = Game;
