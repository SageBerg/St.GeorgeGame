"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var actions   = require("./actions").actions;
var functions = require("./functions");
var items     = require("./items");
var raffle    = require("./raffle");

var NONE = "none";
var NUMBER_NAMES = {
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
    "10": "ten",
    "11": "eleven",
    "12": "twelve",
    "13": "thirteen",
};

exports.apply_outcome = function apply_outcome(outcome, game_state) {
    return outcomes[outcome](game_state);
};

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes;
    if (game_state.character.is_threatened === true &&
        game_state.action !== "A3." &&
        game_state.action !== "Apologize." &&
        game_state.action !== "ATTACK" &&
        game_state.action !== "Bribe the dog with a fish." &&
        game_state.action !== "Challenge Lord Carlos to a game of chess." &&
        game_state.action !== "E4." &&
        game_state.action !== "Enter the void." &&
        game_state.action !== "Grovel." &&
        game_state.action !== "Leave in a puff." &&
        game_state.action !== "Make it hard for Lord Carlos to kill you." &&
        game_state.action !== "Nf3." &&
        game_state.action !== "Panic!" &&
        game_state.action !== "Play dead." &&
        game_state.action !== "Repay your debts." &&
        game_state.action !== "Run like the Devil." &&
        game_state.action !== "SHOW_COIN" &&
        game_state.action !== "SUCK_UP" &&
        game_state.action !== "TELL_GUARDS" &&
        game_state.action !== "Tell her you're sorry." &&
        game_state.action !== "Throw your cat at the dog." &&
        game_state.action !== "Try to reason with the dog." &&
        game_state.action !== "Try to reason with the mob." &&
        game_state.action !== "Waddle like God.") {
        possible_outcomes = actions.GET_ATTACKED(game_state, {});
    } else {
        possible_outcomes = actions[game_state.action](game_state, {});
    }
    return raffle.get(possible_outcomes);
};

function add_next_target_suggestion(game_state) {
    var burnable_places = [
        "church",
        "lord_bartholomew_manor",
        "lord_carlos_manor",
        "market",
        "tavern",
        "tower",
        "wizard_lab",
        "woods",
    ];
    var burned_count = 0;
    var still_burnable = [];
    for (var i = 0; i < burnable_places.length; i++) {
        if (game_state.places[burnable_places[i]].burnable === false) {
            burned_count += 1;
        } else {
            still_burnable.push(burnable_places[i]);
        }
    }
    if (burned_count >= burnable_places.length / 2 &&
        burned_count < burnable_places.length) {
        var next_target = game_state.places[
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
        game_state.message += functions.random_choice(burn_messages);
    }
}

function arrested(game_state) {
    lose_all_items(game_state);
    move_character(game_state, "prison");
    game_state.character.person = "other_lunatics";
}

function are_or_is(game_state) {
    if (game_state.persons[game_state.character.person].type === "group") {
        return "are";
    }
    return "is";
}

function burn(game_state) {
    game_state.places[game_state.character.place].burnable = false;
    game_state.places[game_state.character.place].name =
        "the smoldering remains of " +
        game_state.places[game_state.character.place].name;
    game_state.character.person = null;
    game_state.message = "You find yourself in " +
    game_state.places[game_state.character.place].name + ".";
    add_next_target_suggestion(game_state);
    if (functions.random_int(3) === 0) {
        spread_fire(game_state);
    }
}

function burn_a_bunch_of_places(game_state) {
    var number_of_places_burned = functions.random_int(8);
    // the order of burnable matters based on the story
    var burnable = [
        "lord_bartholomew_manor",
        "woods",
        "lord_carlos_manor",
        "tower",
        "market",
        "wizard_lab",
        "church",
        "tavern",
    ];
    for (var i = 0; i < number_of_places_burned; i++) {
        if (game_state.places[burnable[i]].burnable === true) {
            game_state.places[burnable[i]].burnable = false;
            game_state.places[burnable[i]].name = "the smoldering remains " +
            "of " + game_state.places[burnable[i]].name;
        }
    }
}

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

// kills character if he or she doesn't have a four-leaf clover
function clover(game_state) {
    if (game_state.character.items["four-leaf clover"] < 1) {
        game_state.character.is_dead = true;
    } else {
        game_state.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
}

// conjugates a verb to singular or plural
function conjugate(game_state, word) {
    if (game_state.persons[game_state.character.person].type !== "group") {
        return word + "s";
    }
    return word;
}

function decrement_money(game_state) {
    switch (game_state.character.money) {
        case "large_fortune":
            game_state.character.money = "small_fortune";
            game_state.message += " You now only have a small fortune.";
            break;
        case "small_fortune":
            game_state.character.money = "pittance";
            game_state.message += " You now only have a pittance.";
            break;
        case "pittance":
            game_state.character.money = NONE;
            game_state.message += " You now have no money.";
            break;
        default:
            console.log("decrement_money called when character had no money");
    }
}

function die(game_state) {
    game_state.character.is_dead = true;
}

function equip_best_weapon(game_state) {
    var found_weapon_flag = false;
    var keys = Object.keys(items.weapons_map);
    for (var i = 0; i < keys.length; i++) {
        if (game_state.character.equipped_weapon === "" &&
            game_state.character.items[keys[i]] > 0) {
            game_state.character.equipped_weapon = keys[i];
            found_weapon_flag = true;
        } else if (game_state.character.items[keys[i]] > 0 &&
                   items.weapons_map[keys[i]].attack >=
                   items.weapons_map[
                       game_state.character.equipped_weapon
                   ].attack) {
            game_state.character.equipped_weapon = keys[i];
            found_weapon_flag = true;
        }
    }
    if (found_weapon_flag === false) {
        game_state.character.equipped_weapon = "";
    }
}

function get_ground(game_state) {
    switch (game_state.character.place) {
        case "pirate_ship":
            return "deck";
        case "docks":
            return "docks";
    }
    if (functions.get_place(game_state).outside === false) {
        if (functions.get_place(game_state).burnable === false &&
            (game_state.character.place === "church" ||
             game_state.character.place === "lord_bartholomew_manor" ||
             game_state.character.place === "lord_carlos_manor" ||
             game_state.character.place === "tavern" ||
             game_state.character.place === "tower" ||
             game_state.character.place === "wizard_lab")) {
            return "ground";
        }
        return "floor";
    }
    return "ground";
}

function get_item(game_state, item) {
    if (game_state.character.items[item] === 0) {
        game_state.message += " You now have " + functions.a_or_an(item[0]) +
        " " + item + ".";
    } else {
        game_state.message += " You now have another " + item + ".";
    }
    game_state.character.items[item] += 1;
}

function get_money(game_state, money) {
    if (items.money_map[game_state.character.money].value <
        items.money_map[money].value) {
        game_state.character.money = money;
        game_state.message += " You now have " +
            items.money_map[money].name + ".";
    } else {
        game_state.message +=
        " You still have " +
        items.money_map[game_state.character.money].name + ".";
    }
}

function get_name(game_state) {
    return game_state.persons[game_state.character.person].name;
}

function get_subject(game_state) {
    return he_she_they[game_state.persons[game_state.character.person].type];
}

function get_weapon(game_state, weapon) {
    if (game_state.character.items[weapon] === 0) {
        game_state.message += " You now have " +
        functions.a_or_an(items.weapons_map[weapon].name[0]) + " " +
        items.weapons_map[weapon].name + ".";
    } else {
        game_state.message += " You now have another " +
        items.weapons_map[weapon].name + ".";
    }
    game_state.character.items[weapon] += 1;
    equip_best_weapon(game_state);
}

function grow_tail(game_state) {
    if (game_state.character.has_tail === false) {
        game_state.character.has_tail = true;
        game_state.message = "You grow a " +
            functions.random_choice(["alligator", "beaver", "donkey", "horse",
                                     "monkey", "pig", "rat"]) + " tail.";
    } else {
        game_state.message = "The potion has no effect.";
    }
}

function leave_donkey_behind(game_state) {
    if (game_state.character.items.donkey === 1) {
        game_state.character.items.donkey = 0;
        game_state.message += " You have no idea where your donkey went.";
    } else if (game_state.character.items.donkey > 1) {
        game_state.character.items.donkey = 0;
        game_state.message += " You have no idea where your donkeys went.";
    }
}

function lose_all_items(game_state) {
    for (var item in game_state.character.items) {
        game_state.character.items[item] = 0;
    }
    equip_best_weapon(game_state);
    game_state.character.money = NONE;
    game_state.message += " You now have no items.";
    game_state.message += " You now have no money.";
}

function lose_item(game_state, item) {
    game_state.character.items[item] -= 1;

    game_state.character.items[item] === 0 ?
    game_state.message += " You no longer have " +
        functions.a_or_an(item[0]) + " " :
    game_state.message += " You have one less ";

    game_state.message += item + "." ;
}

function move_character(game_state, destination) {
    game_state.character.place = destination;
    game_state.character.is_threatened = false;
    game_state.character.person = null;
    if (destination === "docks" ||
        destination === "mermaid_rock" ||
        destination === "pirate_ship") {
        game_state.message += " You find yourself on ";
    } else if (destination === "smoking_volcano") {
        game_state.message += " You find yourself at ";
    } else {
        game_state.message += " You find yourself in ";
    }
    game_state.message += game_state.places[destination].name + ".";
}

function spread_fire(game_state) {
    var burnables = [];
    var links = functions.get_place(game_state).links;
    for (var i = 0; i < links.length; i++) {
        if (game_state.places[links[i]].burnable === true) {
            burnables.push(links[i]);
        }
    }
    if (burnables.length === 0) {
        return; // nothing left to do if fire can't spread
    }
    var next_fire = functions.random_choice(burnables);
    if (game_state.places[next_fire].burnable === true) {
        game_state.message += functions.random_choice([
            " The blaze also takes out ",
            " The fire spreads to ",
            " The fire also destroys ",
            " The flames spread to ",
        ]) + game_state.places[next_fire].name + ".";
        game_state.places[next_fire].burnable = false;
        game_state.places[next_fire].name = "the smoldering remains of " +
            game_state.places[next_fire].name;
    }
}

function teleport(game_state) {
    var place_list = [];
    for (var place in game_state.places) {
        if (game_state.places[place] !==
            game_state.places[game_state.character.place] &&
            place !== "upstairs" &&
            place !== "void") {
            place_list.push(place);
        }
    }
    var roll = functions.random_int(place_list.length);
    var destination = place_list[roll];
    move_character(game_state, destination);
    leave_donkey_behind(game_state);
}

function trash(game_state) {
    game_state.places[game_state.character.place].trashable = false;
    game_state.places[game_state.character.place].name =
        "the trashed remains of " +
        game_state.places[game_state.character.place].name;
    game_state.character.person = null;
    game_state.message = "You find yourself in " +
    game_state.places[game_state.character.place].name + ".";
}

var he_she_they = {
    "female": "she",
    "male": "he",
    "group": "they"
};

var outcomes = {

    //a

    "a_rich_lunatic": function(game_state) {
        game_state.message = "\"A " + game_state.character.excuse +
            " lunatic,\" one of the guards says as they walk away.";
        game_state.character.person = null;
        return game_state;
    },

    "admire_jewels": function(game_state) {
        var messages = [
            "You conclude that your jewels outclass everything else you own.",
            "You notice an imperfection in your largest diamond and can't " +
            "unsee it.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "admire_jewels_and_die": function(game_state) {
        var messages = [
            "You notice the reflection of a dagger in a jewel, just after " +
            "it's too late.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "admire_your_bosoms": function(game_state) {
        var messages = [
            "You feel attractive.",
            "You feel beautiful.",
            "You feel like a goddess.",
            "You notice that one of them is slightly bigger than the other.",
            "You wonder if they have milk in them.",
            "Your bosoms look very good.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "alley_is_clear": function(game_state) {
        var messages = [
            "If there are any assassins here, they're hidden very well.",
            "The dark alley appears to be free of assassins.",
            "The dark alley appears to be safe.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "already_dead": function(game_state) {
        var messages = [
            "The assassin says he's already dead.",
            "The assassin says he can't kill him because he's already dead.",
            "The assassin says your request can't be completed because " +
            "he's already dead.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "an_excuse_lunatic": function(game_state) {
        game_state.message = "\"A " + game_state.character.excuse +
            " lunatic,\" one of the guards says. They arrest you " +
            "and throw you in prison with the other lunatics.";
        arrested(game_state);
        return game_state;
    },

    "anna_death": function(game_state) {
        game_state.message = "Wrong answer. Lord Carlos' daughter " +
            "assassinates you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "annoy_blind_bartender": function(game_state) {
        var messages = [
            "\"All drunks claim to be brave,\" the blind bartender says.",
            "The blind bartender says he doubts you killed a dragon.",
            "The blind bartender starts pretending to also be deaf.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "annoy_eve": function(game_state) {
        var messages = [
            "Lord Carlos' daughter points out several inconsistencies in " +
            "your story.",
            "By the time you're done boasting, you realize Lord Carlos' " +
            "daughter wasn't listening.",
            "Lord Carlos' daughter says if you were really brave you " +
            "wouldn't be hiding here in her bedroom.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "annoy_olga": function(game_state) {
        var messages = [
            "Her eyes glaze over as you struggle to remember times you " +
            "were brave.",
            "She sees through your lies.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "annoy_simple_peasant": function(game_state) {
        var messages = [
            "Even the simple peasant thinks you're full of it.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "annoy_st_george": function(game_state) {
        var messages = [
            "St. George warns you of the dangers of " +
            functions.random_choice(["arrogance", "hubris", "pride",
                           "self-importance",]) +
            ".",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "annoy_st_george_and_die": function(game_state) {
        var messages = [
            "You tell St. George about the time you burnt a house down. " +
            "He slays you for your wicked ways.",
            "St. George becomes irate when you claim to have slain a " +
            "dragon. He obliterates you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "annoy_wizard": function(game_state) {
        var messages = [
            "Part way through your story, the wizard makes you more " +
            "interesting by turning you into a frog.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_frog = true;
        return game_state;
    },

    "apocalypse": function(game_state) {
        game_state.message =
            "You start annihilating everything, but the Four Horsemen of " +
            "the Apocalypse steal your thunder. You perish in the chaos.";
        die(game_state);
        return game_state;
    },

    "apologize": function(game_state) {
        var messages = [
            "\"Oh, you're not sorry yet,\" she says as she steps toward you.",
            "A bystander notices the assassin threatening you. "+
            "\"The man said he was sorry, isn't that enough?\" " +
            "he says. \"No,\" the assassin replies.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "apologize_and_die": function(game_state) {
        game_state.message = "\"I'm afraid 'sorry' won't cut it.\" Her " +
            "knife does.",
        die(game_state);
        return game_state;
    },

    "arm_wrestle_and_impressment": function(game_state) {
        game_state.message = "You manage to hold out long enough for Lord " +
            "Arthur to bark orders at his men to press-gang hands for the " +
            "voyage.";
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "arm_wrestle_pirates": function(game_state) {
        game_state.message = "You lose what little dignity you had left.";
        return game_state;
    },

    "arm_wrestle_pirates_ocean": function(game_state) {
        game_state.message = "Even the lady pirates can easily beat you. " +
            "They toss you in the ocean when they're done humiliating you.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "arrive_at_mermaid_rock": function(game_state) {
        game_state.message = "A mermaid guides you to a rocky island.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "ask_eve": function(game_state) {
        game_state.message = "You find Lord Carlos' daughter in her bedroom " +
            "and ask her about assassins. She says they've all been looking " +
            "for you since they found out about you and her.";
        game_state.character.person = "eve";
        return game_state;
    },

    "assassin_prayer_answered": function(game_state) {
        game_state.message =
            "Your prayers aren't answered, but the assassins' are.",
        clover(game_state);
        return game_state;
    },

    "assassinate_lord_arthur": function(game_state) {
        game_state.message = "The assassin says your wish will be granted. " +
            "When you meet him in the tavern a few weeks later, he leaves " +
            "you with Lord Arthur's prized possession as proof.";
        game_state.persons.lord_arthur.alive = false;
        get_weapon(game_state, "jeweled_cutlass");
        move_character(game_state, "tavern");
        return game_state;
    },

    "assassinate_lord_bartholomew": function(game_state) {
        game_state.message = "The assassin says your wish will be granted." +
            " When you meet him in the tavern a few weeks later, he " +
            "leaves you with Lord Bartholomew's prized possession as proof.";
        game_state.persons.lord_bartholomew.alive = false;
        get_weapon(game_state, "long_pitchfork");
        move_character(game_state, "tavern");
        return game_state;
    },

    "assassinate_lord_daniel": function(game_state) {
        game_state.message = "The assassin says your wish will be granted." +
            " When you meet him in a dark alley a few weeks later, he " +
            "leaves you with Lord Daniel's prized possession as proof.";
        game_state.persons.lord_daniel.alive = false;
        get_weapon(game_state, "iron_hammer");
        move_character(game_state, "dark_alley");
        return game_state;
    },

    "assassinated": function(game_state) {
        game_state.message = "The first woman you talk to turns out to be " +
        "an assassin. She assassinates you.";
        die(game_state);
        return game_state;
    },

    "assassinated_in_church": function(game_state) {
        game_state.message = "It was a good time to make peace with God. " +
        "Lord Carlos steps out from behind a pillar and assassinates you.";
        die(game_state);
        return game_state;
    },

    "assassinated_in_church_not": function(game_state) {
        game_state.message = "You see Lord Carlos sitting in one of the " +
            "pews, but he doesn't recognize you since you're a woman now.";
        game_state.character.person = "lord_carlos";
        return game_state;
    },

    "assassins_approach": function(game_state) {
        game_state.message =
            "Some men in dark cloaks notice you singing " +
            "and start edging toward you.";
        game_state.character.person = "assassins";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "assassins_catch_you_fishing": function(game_state) {
        game_state.message = "You don't catch any fish, but the assassins " +
            "catch you.";
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "assassins_notice_dance": function(game_state) {
        game_state.message = "The assassins immediately notice you dancing.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "assassins_sit_down": function(game_state) {
        game_state.message =
            "Some men in dark cloaks sit down next to you, but don't seem " +
            "to notice you.";
        game_state.character.person = "assassins";
        return game_state;
    },

    "attract_lady_frog": function(game_state) {
        game_state.message = "Your croaking attracts a lady frog, but " +
            "you're not sure what to do with her.";
        return game_state;
    },

    "audience_with_lord_bartholomew": function(game_state) {
        var messages = [
            "The first person you meet is Lord Bartholomew.",
            "You are granted one.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "lord_bartholomew";
        return game_state;
    },

    "audience_with_lord_daniel": function(game_state) {
        var messages = [
            "The guards mistake you for someone important and take you " +
            "to Lord Daniel.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "lord_daniel";
        return game_state;
    },

    //b

    "be_shrub": function(game_state) {
        var messages = [
            "You continue being a shrub.",
            "A deer eats your buds in the spring and ruins your growth for " +
            "the year.",
            "Heavy rains erode the soil around your roots.",
            "A hedgehog makes its home amid your roots.",
            "A hot summer leaves you parched.",
            "Some of your branches break in a snowstorm.",
            "A nearby tree falls over. You now have more sunlight and grow " +
            "stronger.",
            "Steady rains and a mild winter help you grow stronger.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "be_shrub_and_die": function(game_state) {
        var messages = [
            "A swarm of caterpillars eats all of your leaves.",
            "You perish in a forest fire.",
            "You catch a bad case of root rot.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "beat_up_by_guards": function(game_state) {
        var messages = [
            "When you try to take the warden's keys, the guards notice and " +
            "beat the " + functions.random_choice(["crap", "snot", "tar"]) +
            " out of you.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "beat_up_by_kids": function(game_state) {
        var messages = [
            "You charge into the midst of the children. The cat escapes in " +
            "the ensuing chaos, but you do not. The children beat you " +
            "mercilessly and leave you for dead.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "beth_death": function(game_state) {
        game_state.message = "Lord Carlos' daughter shakes her head. \"" +
            "What a shame, I was beginning to like you,\" she says before " +
            "assassinating you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "bide_your_time": function(game_state) {
        var messages = [
            "As the days drag on, you go insane.",
            "The days turn to weeks and the weeks turn to months.",
            "You make a lot of tally marks on the wall, but you're " +
            "not counting anything.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "bide_your_time_and_die": function(game_state) {
        var messages = [
            "You die of old age.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "bide_your_time_and_escape": function(game_state) {
        var messages = [
            "You eventually manage to dig a secret passage into a cave " +
            "network.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "cave");
        return game_state;
    },

    "black_out_and_become_pirate": function(game_state) {
        game_state.message = "You drink until you black out. " +
            "Lord Arthur wakes you by yelling that you need to get on " +
            "with your duties.",
        move_character(game_state, "pirate_ship");
        game_state.character.person = "lord_arthur";
        return game_state;
    },

    "black_out_and_die": function(game_state) {
        game_state.message = "You drink until you black out.";
        die(game_state);
        return game_state;
    },

    "black_out_and_move": function(game_state) {
        game_state.message = "You drink until you black out. You wake up " +
            "horribly hung over.";
        teleport(game_state);
        return game_state;
    },

    "black_out_and_win": function(game_state) {
        game_state.message =
            "You drink until you black out. " +
            "You wake up in bed next to a peasant woman. " +
            "Once the hangover wears off, you " +
            "both live happily ever after.";
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "blessed": function(game_state) {
        game_state.message = "A priestess blesses you.";
        game_state.character.person = "priestess";
        return game_state;
    },

    "blow_up_the_lab": function(game_state) {
        burn(game_state);
        var temp_message = " " + game_state.message;
        game_state.message =  "One of the potions you smash blows up the " +
            "laboratory.";
        if (game_state.character.items["fancy red cloak"] < 1) {
            die(game_state);
        } else {
            game_state.message += " However, your fancy red cloak protects " +
                "you from annihilation.";
            game_state.message += temp_message;
        }
        return game_state;
    },

    "boast_and_get_money": function(game_state) {
        game_state.message = "St. George is impressed with your noble " +
            "deeds and rewards you.",
        get_money(game_state, "large_fortune");
        return game_state;
    },

    "bosoms_drunk": function(game_state) {
        var messages = [
            "The drunk man joins you in admiring you bosoms.",
            "When you look back at the drunk man, you realize you weren't " +
            "the only one admiring your bosoms.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "bosoms_olga": function(game_state) {
        var olga = game_state.persons.olga.name;
        var messages = [
            capitalize(olga) + " busies herself by admiring hers own.",
            "\"It's hard not to look,\" " + olga + " says.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "bosoms_st_george": function(game_state) {
        var messages = [
            "St. George notices you admiring your own bosoms and says you " +
            "should not become too enamored of yourself.",
            "St. George notices you admiring your own bosoms and warns you " +
            "not to be arrogant.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "bosoms_witch": function(game_state) {
        var messages = [
            "\"Believe it or not, I was once young and beautiful too,\" the " +
            "witch says. \"Enjoy it while it lasts kid. The only good " +
            "thing about being old is the magical powers.\"",
            "\"Oh get over yourself!\" the witch snaps.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "bosoms_wizard": function(game_state) {
        var messages = [
            "The wizard notices what you're doing and blushes bright red.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "breed_cats": function(game_state) {
        var kittens = 2 + functions.random_int(11);
        game_state.character.items.cat += kittens;
        game_state.message = "You now have " +
            NUMBER_NAMES[kittens.toString()] + " more cats.";
        return game_state;
    },

    "breed_cats_fail": function(game_state) {
        var messages = [
            "Mashing them together doesn't work.",
            "You can't figure out how to make them breed.",
            "You perform a wedding for you cats, but they don't breed.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "breed_newts": function(game_state) {
        var baby_newts = 2 + functions.random_int(11);
        game_state.character.items["deep-cave newt"] += baby_newts;
        game_state.message = "You now have " +
            NUMBER_NAMES[baby_newts.toString()] + " more deep-cave newts.";
        return game_state;
    },

    "breed_newts_fail": function(game_state) {
        var messages = [
            "You're not sure your newts have different genders.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "bronzed": function(game_state) {
        game_state.message = "You get bronzed.";
        return game_state;
    },

    "burn": function(game_state) {
        burn(game_state);
        return game_state;
    },

    "buy_a_drink_and_die": function(game_state) {
        var messages = [
            "An assassin walks up and starts hitting on you... very hard.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "buy_a_drink_and_meet_olga": function(game_state) {
        var messages = [
            "While you're drinking, you strike up a conversation with a " +
            "pretty lady.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "olga";
        return game_state;
    },

    "buy_a_weapon": function(game_state) {
        game_state.message = "";
        get_weapon(game_state, game_state.for_sell);
        decrement_money(game_state);
        return game_state;
    },

    "buy_an_item": function(game_state) {
        game_state.message = "";
        get_item(game_state, game_state.for_sell);
        decrement_money(game_state);
        return game_state;
    },

    "buy_black_market_item": function(game_state) {
        var item = functions.random_choice(["deep-cave newt",
                                            "potion of love",
                                            "many-colored mushroom",
                                            "white mushroom",
                                            "black mushroom",
                                            "fancy red cloak",
                                            "potion of strength",
                                            "potion of transformation",]);
        var messages;
        if (game_state.character.money === "small_fortune" ||
            game_state.character.money === "large_fortune") {
            messages = [
                "You you cut a deal with a " +
                functions.random_choice(["black market peddler",
                                         "merchant witch",
                                         "monger of rare items",]) + ".",
            ];
            game_state.message = functions.random_choice(messages);
            get_item(game_state, item);
            decrement_money(game_state);
        } else {
            messages = [
                "You cannot afford to make a shady deal.",
                "You're too poor to make a shady deal.",
            ];
            game_state.message = functions.random_choice(messages);
        }
        return game_state;
    },

    //c

    "cannot_afford": function(game_state) {
        game_state.message = "You cannot afford " +
            functions.a_or_an(game_state.for_sell[0]) + " " +
            game_state.for_sell + ".";
        return game_state;
    },

    "cannot_afford_weapon": function(game_state) {
        game_state.message = "You cannot afford " +
            functions.a_or_an(game_state.for_sell[0]) + " " +
            items.weapons_map[game_state.for_sell].name + ".";
        return game_state;
    },

    "cannot_build_igloo": function(game_state) {
        var messages = [
            "You can't figure out how to build an igloo.",
            "You build an igloo, but it collapses after a snowstorm.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "cannot_dance": function(game_state) {
        game_state.message = "You can't dance a jig, you're in the ocean.";
        return game_state;
    },

    "cannot_drop_anchor": function(game_state) {
        var messages = [
            "You can't find the anchor, but you find Lord Arthur's " +
            "weird cat. It has eight more tails than a normal cat.",
            "You're not strong enough to lift the anchor.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "cannot_find_cat": function(game_state) {
        var messages = [
            "You can't find any cats. Only dogs.",
            "You chase a cat to no avail.",
            "Your efforts to find a cat are fruitless.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "cannot_find_dragon": function(game_state) {
        var messages = [
            "You can't find any dragons. Only rocks.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "cannot_find_lava": function(game_state) {
        var messages = [
            "You can't find a pool of lava to swim in.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "cannot_find_nymphs": function(game_state) {
        var messages = [
            "You can't find any nymphs, but you see some of Lord Carlos' " +
            "men burying a body.",
            "You get distracted by a squirrel and forget what you were " +
            "doing.",
            "You see a comely woman picking berries, but she's not a nymph.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "cannot_find_nymphs_find_apple": function(game_state) {
        var messages = [
            "Your efforts to find nymphs are fruitless, but you find an " +
            "apple tree.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_item(game_state, "apple");
        return game_state;
    },

    "cannot_find_witch": function(game_state) {
        if (game_state.places.woods.burnable === true) {
            game_state.message = "You can't find any witches. Only trees.";
        } else {
            game_state.message = "You can't find any witches. Only burnt " +
                "trees.";
        }
        game_state.character.person = null;
        return game_state;
    },

    "cannot_hear_assassin": function(game_state) {
        game_state.message = "Your singing is too loud for you to hear the " +
            "assassin sneaking up behind you.";
        clover(game_state);
        return game_state;
    },

    "cannot_tip_cow": function(game_state) {
        var messages = [
            "Some peasants see you trying to tip a cow and laugh at you.",
            "You are disappointed to find out that cows can easily get " +
            "back up.",
            "You can't find any cows. Only sheep.",
            "You're not strong enough to push the cow over.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "carefully_steal_keys": function(game_state) {
        game_state.message = "You manage to swipe the keys off the warden " +
            "during his inspection. You soon make your escape.";
        move_character(game_state, "dark_alley");
        return game_state;
    },

    "cass_answer": function(game_state) {
        game_state.message = "Lord Carlos' daughter is appalled. \"Cass " +
            "is my mother,\" she says. You are soon assassinated.";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "cat_burning": function(game_state) {
        var messages = [
            "You find a mob of peasant children about to perform a cat " +
            "burning.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "cat_escapes": function(game_state) {
        var messages = [
            "Your cat escapes.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "cat");
        return game_state;
    },

    "cat_smells_fish": function(game_state) {
        var messages = [
            "A cat smells your fish and approaches you.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "cat");
        game_state.character.person = null;
        return game_state;
    },

    "catch_a_lot_of_fish": function(game_state) {
        var messages = [
            "You catch a lot of fish.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.items.fish += 3;
        game_state.character.person = null;
        return game_state;
    },

    "catch_big_fish": function(game_state) {
        var messages = [
            "You hook a big fish, but it pulls you into the water. " +
            "You are soon lost amid the waves and lose sight of land.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "ocean");
        return game_state;
    },

    "catch_fish": function(game_state) {
        var messages = [
            "Your efforts prove successful.",
            "Your efforts are fruitful.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "fish");
        game_state.character.person = null;
        return game_state;
    },

    "caught_and_die": function(game_state) {
        game_state.message =
            "You run like the Devil, but " + get_name(game_state) +
            " also " + conjugate(game_state, "run") + " like the Devil and " +
            conjugate(game_state, "overtake") + " you.";
        die(game_state);
        return game_state;
    },

    "caught_by_tail_and_die": function(game_state) {
        game_state.message =
            "You run like the Devil, but " + get_name(game_state) +
            " also " + conjugate(game_state, "run") + " like the Devil and " +
            conjugate(game_state, "overtake") + " you and " +
            conjugate(game_state, "manage") + " to stop you by grabbing " +
            "your tail.";
        die(game_state);
        return game_state;
    },

    "caught_like_god": function(game_state) {
        game_state.message =
            "God is very slow, so you don't manage to get away.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "caught_and_arrested": function(game_state) {
        game_state.message =
            "You run like the Devil, but " + get_name(game_state) +
            " also " + conjugate(game_state, "run") + " like the Devil and " +
            conjugate(game_state, "overtake") + " you. " +
            capitalize(get_subject(game_state)) + " " +
            conjugate(game_state, "arrest") +
            " you and throw you in prison with the other lunatics.";
        move_character(game_state, "prison");
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "caught_and_arrested_like_god": function(game_state) {
        game_state.message =
            "God is very slow, so you don't manage to get away. " +
            capitalize(get_subject(game_state)) + " " +
            conjugate(game_state, "arrest") +
            " you and throw you in prison with the other lunatics.";
        move_character(game_state, "prison");
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "caught_by_olga": function(game_state) {
        game_state.message =
            "The Devil is pretty fast, but Olga is faster and prettier. " +
            "She catches you and strangles you to death.";
        die(game_state);
        return game_state;
    },

    "celebrate": function(game_state) {
        var messages = [
            "You dance a jig.",
            "You sing a song.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "celebrate_at_brothel": function(game_state) {
        var messages = [
            "You celebrate at a brothel, but you feel sad that the women " +
            "there are just pretending to like you.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "streets");
        return game_state;
    },

    "celebrate_at_market": function(game_state) {
        var messages = [
            "You celebrate by watching a play in the market.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "market");
        return game_state;
    },

    "celebrate_uncreatively": function(game_state) {
        var messages = [
            "You can't come up with a better way of celebrating than " +
            "twiddling your thumbs.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chance_to_escape": function(game_state) {
        var messages = [
            "You spit in his eyes.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chase_cat_to_dark_alley": function(game_state) {
        var messages = [
            "You find a skinny cat. You chase it through the streets and " +
            "lose track of it.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "dark_alley");
        return game_state;
    },

    // some jokes, CREDITS: reddit's r/jokes
    "chat_with_blind_bartender": function(game_state) {
        var messages = [
            "The blind bartender leans in close and says, \"Two lawyers " +
            "walk into a tavern. They take some sandwiches out of their " +
            "bags. The barmaid tells them they can't eat their " +
            "own food in the tavern. The lawyers shrug and exchange " +
            "sandwiches.\"",
            "The blind bartender leans in close and says, \"If I had a " +
            "gold coin every time a woman found me unattractive, women " +
            "would eventually find me attractive.\"",
            "The blind bartender pours you another drink and says, \"Food " +
            "is like dark humor. Not everyone gets it.\"",
            "The blind bartender says, \"A friend of mine drowned, so at " +
            "his funeral I made him a wreath in the shape of a lifeboat. " +
            "It's what he would have wanted.\"",
            "The blind bartender passes you another drink and says, \"It's " +
            "a dangerous world out there. I started carrying a knife after " +
            "a mugging attempt a few years ago. Since then, my mugging " +
            "attempts have been more successful.\"",
            "The blind bartender leans in close and says, \"I told my " +
            "friends that I have a beautiful wife. They told me she must " +
            "be imaginary, but the joke's on them. They're imaginary too.\"",
            "You somehow end up in a fiery argument with him.",
            "You tell the blind bartender that the whole world's out to " +
            "get you. He says that's probably true.",
            "The blind bartender says that everyone's talking about " +
            "Lord Bartholomew these days.",
            "You tell the blind bartender about all the mistakes you've " +
            "made recently. He says asking you about yourself was the " +
            "only mistake he's made recently.",
            "The blind bartender says it's best to run from the guards if " +
            "they accuse you of lunacy.",
            "The blind bartender says that women are too smart to sleep " +
            "with most men, but that's why God invented alcohol.",
            "The blind bartender says that life really just comes down to " +
            "luck, and that's why it's important to have a four-leaf " +
            "clover.",
            "The blind bartender says assassins like to frequent the tavern.",
            "The blind bartender tells you a story about how he was " +
            "blinded by the nymph queen.",
            "You tell the blind bartender about your travels in the Orient. " +
            "He's quite interested in your stories about the samurai.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chat_with_blind_bartender_and_die": function(game_state) {
        var messages = [
            "An assassin overhears you talking about Lord Carlos' " +
            "daughter and assassinates you.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "chat_with_dragon_blue": function(game_state) {
        var messages = [
            "The blue dragon poses several riddles for you, but you can't " +
            "solve any of them.",
            "The blue dragon says she senses some magic about you.",
            "The blue dragon wishes you luck on your quest to find a wife.",
            "You and the blue dragon agree that Lord Bartholomew is the " +
            "best hope for the realm.",
            "You and the blue dragon talk about the Orient.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chat_with_dragon_red": function(game_state) {
        var messages = [
            "You find that you both have a mutual interest in burning things.",
            "You tell the dragon that assassins are trying to kill you. The " +
            "dragon says he knows exactly how you feel.",
            "The red dragon boasts about his treasure horde for hours and " +
            "you barely manage to get a word in edgewise.",
            "The red dragon says you're wasting your time trying to find a " +
            "wife and that you should be trying to collect a horde of " +
            "treasure to sleep on.",
            "The red dragon says technology is moving too quickly for him " +
            "to keep up. \"Back in my day, we had catapults and traveling " +
            "story-tellers. Now there are far too many cannons and books.\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chat_with_lord_bartholomew": function(game_state) {
        var messages = [
            "Lord Bartholomew is genuinely interested in your life story.",
            "Lord Bartholomew says family is the only thing worth living " +
            "for.",
            "Lord Bartholomew says Lord Arthur is a rascal who will be " +
            "dealt with when the time comes.",
            "Lord Bartholomew says Lord Carlos is a thug who will be " +
            "dealt with when the time comes. You couldn't agree more.",
            "Lord Bartholomew says Lord Daniel is a tyrant who will be " +
            "dealt with when the time comes.",
            "Lord Bartholomew says that a cause is the only thing worth " +
            "dying for.",
            "Lord Bartholomew says the only man of any value in the town is " +
            "St. George.",
            "Lord Bartholomew says the wizard is a dangerous man who will " +
            "be dealt with when the time comes.",
            "Lord Bartholomew stresses the value of hard work and the " +
            "importance of the peasant class.",
            "Lord Bartholomew talks about the injustices in the world " +
            "and how action is needed to set them right.",
            "Lord Bartholomew takes you on a walk and shows you the " +
            "sights around the countryside. You don't get much of a chance " +
            "to talk to him because too many peasants are clamoring to get " +
            "his autograph.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chat_with_st_george": function(game_state) {
        var messages = [
            "St. George warns against attacking people.",
            "St. George warns against bragging.",
            "St. George warns against gawking at women.",
            "St. George warns against living your life just to get a " +
            "large fortune.",
            "St. George warns against resenting the success of others.",
            "St. George warns against sleeping during the day.",
            "St. George warns against stuffing your face with grub.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chess_cutlass": function(game_state) {
        var messages = [
            "The pirates slash the chessboard in half with a cutlass and " +
            "leave.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_weapon(game_state, "cutlass");
        return game_state;
    },

    "chess_impressment": function(game_state) {
        var messages = [
            "You beat all the pirates easily. Lord Arthur says your " +
            "wits could be invaluable on the high seas. They soon are.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "chess_lose_to_pirates": function(game_state) {
        var messages = [
            "Their opening move is smashing a bottle of rum over your " +
            "head. You aren't thinking too straight during the game and " +
            "quickly lose.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "choke_and_saved_by_blue_dragon": function(game_state) {
        var messages = [
            "You collapse and lay dying on the side of the volcano, but a " +
            "blue dragon flies by and takes you to her lair.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "dragon_blue";
        return game_state;
    },

    "choke_on_fumes": function(game_state) {
        var messages = [
            "You cough a lot.",
            "You wheeze.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "choke_on_fumes_and_die": function(game_state) {
        var messages = [
            "You caught up a lung.",
            "You die of air pollution.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "chop_down_tree": function(game_state) {
        var messages = [
            "A tree falls in the forest. You hear it.",
            "The tree crashes to the ground.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "chop_down_tree_and_die": function(game_state) {
        var messages = [
            "The tree falls on you.",
            "A nymph hexes you. Throwing yourself in a pond suddenly seems " +
            "like a good idea.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "climb_and_die": function(game_state) {
        var messages = [
            "A crow in the crow's nest caws in your face, startling " +
            "you. You fall off the mast and land on the deck.",
            "You fall asleep during your watch duty and the ship runs " +
            "into an iceberg. While the ship is sinking, the crew kills " +
            "you for incompetence.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "climb_and_get_sap": function(game_state) {
        var messages = [
            "Watch duty is so boring you amuse yourself by scraping sap " +
            "off the wood.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "ball of sap");
        return game_state;
    },

    "club_a_seal": function(game_state) {
        var messages = [
            "After a few days of waiting at a hole in the ice, you manage " +
            "to club a seal.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "seal carcass");
        return game_state;
    },

    "complaining_is_useless": function(game_state) {
        var messages = [
            "A cook assures you that Lord Bartholomew will set things " +
            "right.",
        ];
        if (game_state.persons.lord_daniel.alive === true) {
            messages.push(
            "A bureaucrat says she'll let Lord Daniel know of your " +
            "concerns.");
        }
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "croak": function(game_state) {
        game_state.message = "You croak.";
        die(game_state);
        return game_state;
    },

    "croak_not": function(game_state) {
        var messages = [
            "Lady frogs don't croak.",
            "Since you're a lady frog, you don't croak.",
            "You can't croak, only male frogs do that.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "crowd_hates_your_voice": function(game_state) {
        game_state.message = "The locals hate your voice and soon mob you.";
        clover(game_state);
        return game_state;
    },

    //d

    "dance_a_jig": function(game_state) {
        var messages = [
            "You enjoy yourself immensely.",
            "You get sweaty.",
            "You have a grand old time.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "dance_and_die": function(game_state) {
        var messages = [
            "While you're dancing, you twist your ankle, fall to the " +
            "ground, try to catch yourself, but break your wrist, " +
            "hit your head on the " + get_ground(game_state) +
            " and break your neck.",
            "You dance so vigorously you become exhausted and die.",
            "You dance to death.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "dance_and_drown": function(game_state) {
        var messages = [
            "You drown trying to dance a jig.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "dance_and_freeze": function(game_state) {
        var messages = [
            "You get sweaty. The sweat freezes to you and you freeze to " +
            "death.",
            "You fall through the ice while dancing. You quickly freeze to " +
            "death.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "dance_and_slip": function(game_state) {
        var messages = [
            "You slip on a rock and fall to your death in the darkness.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "dance_fails_to_cheer": function(game_state) {
        var messages = [
            "Dancing fails to cheer you up.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "dance_for_coin": function(game_state) {
        var messages = [
            "The locals are entertained by your antics and toss " +
            "you some coins.",
            "A noble takes pity on you and gives some money.",
        ];
        game_state.message = functions.random_choice(messages);
        get_money(game_state, "pittance");
        game_state.character.person = null;
        return game_state;
    },

    "dance_in_puddle": function(game_state) {
        var messages = [];
        if (game_state.character.sex === "female") {
            messages.push(
                "You dance through a puddle and get your skirt wet."
            );
        } else {
            messages.push(
                "You dance through a puddle and get your britches wet."
            );
        }
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "dance_with_goblins": function(game_state) {
        var messages = [
            "Some goblins dance with you and then kill you.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "dance_with_peasants": function(game_state) {
        var messages = [
            "Many peasants start dancing with you and begin singing " +
            functions.random_choice(["an ode to", "about", "a song about",
                           "the praises of"]) +
            " Lord Bartholomew.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "dance_with_woodland_creatures": function(game_state) {
        var messages = [
            "Some " +
            functions.random_choice(["dryads", "faeries", "nymphs", "pixies",
                           "spirits", "sprites", "tree ents"]) +
            " dance with you and then " +
            functions.random_choice(["fade away", "disappear", "scatter"]) +
            ".",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "deal_with_assassin": function(game_state) {
        var messages = [
            "You find an assassin posing as a black market dealer.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "denied_audience_with_lord_bartholomew": function(game_state) {
        var messages = [
            "The line to meet Lord Bartholomew is very long, " +
            "so you lose patience and wander off.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "countryside");
        return game_state;
    },

    "denied_audience_with_lord_daniel": function(game_state) {
        var messages = [
            "The guards laugh. \"" + functions.random_choice([
                "He has no time for peasants",
                "Such audacity",]) +
            ",\" one of the guards says.",
            "The amount of paperwork required to get an audience with Lord " +
            "Daniel is " + functions.random_choice([
                "insurmountable", "too tedious", "unreasonable",]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "die_anyway": function(game_state) {
        var messages = [
            "He kills you as you try to get into an suit of armor.",
            "Lord Carlos is better at killing than you are at not being " +
            "killed.",
            "Lord Carlos is no slouch, he kills you anyway.",
            "Screaming gibberish in his face only stuns him for so long.",
            "You hide behind a painting Lord Carlos that is loathe to " +
            "destroy. He loathes you more.",
            "You prevent Lord Carlos from killing you, but he calls in " +
            "one of his assassins and has her do it.",
            "You tell Lord Carlos that you're his son, he doesn't care.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "die_waiting_for_seal": function(game_state) {
        var messages = [
            "The local polar bears aren't happy with you on their turf. " +
            "You are soon mauled.",
            "After a few days of waiting at a hole in the ice, you freeze " +
            "to death.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "dina_death": function(game_state) {
        game_state.message = "Lord Carlos' daughter wrinkles her nose in " +
            "disgust. \"Not even close.\" she says.";
        die(game_state);
        return game_state;
    },

    "directions_peasant_lass": function(game_state) {
        var messages = [
            "She says there's good mushroom picking in the woods and " +
            "wanders off.",
            "She babbles incoherently while eating a many-colored " +
            "mushroom and wanders off.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "directions_simple_peasant": function(game_state) {
        var messages = [
            "He says the town is yonder.",
            "He tells you the only direction worth going is to Lord " +
            "Bartholomew's house.",
            "He tells you there are four directions, north, south, " +
            "east, and west.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "directions_to_manor": function(game_state) {
        var messages = [
            "She tells you how to get to Lord Bartholomew's manor and goes " +
            "on her way.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "directions_to_town": function(game_state) {
        var messages = [
            "She tells you how to get back to town and goes on her way.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "directions_to_volcano": function(game_state) {
        var messages = [
            "He tells you how to get to the smoking volcano.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "directions_to_woods": function(game_state) {
        var messages = [
            "She tells you how to get to the woods and goes on her way.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "disguise_and_arrested": function(game_state) {
        game_state.message = "The guards tell you that you must be a " +
            "lunatic to say you're Lord Bartholomew. They arrest you and " +
            "throw you in prison with the other lunatics.";
        arrested(game_state);
        return game_state;
    },

    "disguise_daniel_die": function(game_state) {
        game_state.message = "You tell a group of servants that you're Lord " +
            "Daniel. Unfortunately, they believe you.";
        die(game_state);
        return game_state;
    },

    "disguise_and_die": function(game_state) {
        game_state.message = "You tell an assassin that you're Lord " +
            "Carlos. He isn't fooled for a second.";
        die(game_state);
        return game_state;
    },

    "disguise_guards_laugh": function(game_state) {
        game_state.message = "The guards laugh at you. \"You don't look " +
            "anything like him,\" one of the guards says.";
        return game_state;
    },

    "disguise_meet_lord_bartholomew": function(game_state) {
        game_state.message = "You are quickly granted an audience with Lord " +
            "Bartholomew, he's annoyed that you tricked him, but he " +
            "forgives you.";
        game_state.character.person = "lord_bartholomew";
        return game_state;
    },

    "disguise_meet_lord_carlos": function(game_state) {
        game_state.message = "You are soon taken to Lord Carlos. He is " +
            "livid when he discovers you're an impostor.";
        game_state.character.is_threatened = true;
        game_state.character.person = "lord_carlos";
        return game_state;
    },

    "disguise_meet_lord_daniel": function(game_state) {
        game_state.message = "The guards take you to Lord Daniel. He is not " +
            "pleased to discover that you're a fraud.";
        game_state.character.person = "lord_daniel";
        return game_state;
    },

    "distasteful": function(game_state) {
        var messages = [
            "It tastes like something that shouldn't be licked.",
            "It tastes terrible.",
            "It tastes worse than you anticipated.",
            "You get an ant on your tongue.",
            "You find the flavor of the " + get_ground(game_state) +
            " distasteful.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "dive_and_die": function(game_state) {
        var messages = [
            "You die on a fool's errand.",
            "You find a beautiful pearl in an oyster. It's so beautiful in " +
            "fact, that you drown while staring at it.",
            "You run out of air and black out right before you get back to " +
            "the surface.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "diving_saved_by_mermaid": function(game_state) {
        var messages = [
            "You become exhausted diving for pearls and are about to pass " +
            "out when a beautiful mermaid grabs a hold of you and takes " +
            "you to land.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "do_not_see_assassins": function(game_state) {
        game_state.message = "You don't see one.";
        die(game_state);
        return game_state;
    },

    "dog_catches_you": function(game_state) {
        game_state.message = "Not even the Devil can outrun a dog.";
        die(game_state);
        return game_state;
    },

    "dog_kills_you": function(game_state) {
        game_state.message = "There's no reasoning with dogs.";
        die(game_state);
        return game_state;
    },

    "dog_lets_you_off_the_hook": function(game_state) {
        var messages = [
            "After a while, the dog gets tired of your arguments and " +
            "slinks away.",
            "The dog listens to reason and leaves you alone.",
            "The dog decides not to kill you and settles for being petted " +
            " instead. It wanders off after it gets all the petting it " +
            "wanted.",
            "You manage to convince the dog that this is all just a " +
            "misunderstanding.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_threatened = false;
        game_state.character.person = null;
        return game_state;
    },

    "dog_takes_fish": function(game_state) {
        var messages = [
            "The dog takes the fish and scampers off with it.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_threatened = false;
        game_state.character.person = null;
        lose_item(game_state, "fish");
        return game_state;
    },

    "dragon_and_die": function(game_state) {
        var messages = [
            "You find a red dragon. He is not happy to be disturbed.",
            "While you're looking for dragons, you get taken out by an " +
            "avalanche."
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "dragon_burns_stuff": function(game_state) {
        var messages = [
            "You and the red dragon get in a heated argument about " +
            functions.random_choice(["how maps should be oriented",
                                     "whether cats or dogs make better pets",
                                     "what weighs more, a pound of bricks " +
                                     "or a pound of feathers"]) +
            ". At a certain point, the dragon gets so angry that he tries " +
            "to eat you, but you hide in tunnel he can't get into. When " +
            "you finally come out of the tunnel, you see that the dragon " +
            "is not guarding his treasure, but is flying around the " +
            "countryside torching everything.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_money(game_state, "large_fortune");
        get_item(game_state, "bag of jewels");
        burn_a_bunch_of_places(game_state);
        return game_state;
    },

    "dragon_coin_die": function(game_state) {
        var messages = [
            "The red dragon takes the coin from you and eats you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "dragon_coin_trade": function(game_state) {
        var messages = [
            "The blue dragon says that this coin is very valuable and " +
            "that she will make you a fair trade for it.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "dragon_teleports_you": function(game_state) {
        var messages = [
            "The blue dragon tires of your nonsense stories casts a spell " +
            "on you."
        ];
        game_state.message = functions.random_choice(messages);
        teleport(game_state);
        return game_state;
    },

    "drink_piss": function(game_state) {
        var messages = [
            "The potion tastes foul and you begin wondering if the wizard " +
            "pees in some of these bottles.",
            "You're pretty sure you just drank piss, but it could have " +
            "been beer.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "drop_anchor_and_die": function(game_state) {
        var messages = [
            "You drop anchor and cause the ship to swing into a reef. " +
            "Everyone perishes including you.",
            "You drop the anchor through the deck. The ship sinks and " +
            "everyone dies.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "drop_anchor_and_kill_whale": function(game_state) {
        var messages = [
            "You drop the anchor and accidentally kill a passing whale. " +
            "Lord Arthur slaps you on the back and says, \"Whale done.\" " +
            "The crew hauls the whale aboard and sails back to land.",
        ];
        game_state.message = functions.random_choice(messages);
        get_money(game_state, "small_fortune");
        move_character(game_state, "docks");
        return game_state;
    },

    "drop_anchor_and_save_ship": function(game_state) {
        game_state.message = "You drop anchor and prevent the ship from " +
            "running into a reef. Lord Arthur rewards you for saving the " +
            "ship.";
        get_item(game_state, "bag of jewels");
        return game_state;
    },

    "drown": function(game_state) {
        game_state.message = "You drown.";
        die(game_state);
        return game_state;
    },

    //e

    "e4_lose_bartholomew": function(game_state) {
        var messages = [
            "Lord Bartholomew gets you drunk on fine wines and beats you " +
            "easily.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "e4_lose_carlos": function(game_state) {
        var messages = [
            "You lose the game. Lord Carlos celebrates his victory by " +
            "assassinating you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "e4_win_bartholomew": function(game_state) {
        var messages = [
            "Lord bartholomew doesn't pay much attention during the game, " +
            "because peasants keep coming in and getting his advice about " +
            "things. You win the game, but you're not sure he noticed.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "e4_win_carlos": function(game_state) {
        var messages = [
            "You manage to trick Lord Carlos into an early checkmate. " +
            "\"This is what I get for playing black,\" he says. He rushes " +
            "at you with a poisoned dagger.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "earn_small_fortune_in_coins": function(game_state) {
        game_state.message =
            "A crowd gathers to hear your singing and " +
            "tosses you a small fortune in coins.";
        get_money(game_state, "small_fortune");
        return game_state;
    },

    "eat_apple": function(game_state) {
        game_state.message = functions.random_choice([
            "You eat the apple, core and all.",
            "You made a solid decision. The apple tastes great.",
            "You're pretty sure there was a worm in the apple you just ate.",
        ]);
        lose_item(game_state, "apple");
        return game_state;
    },

    "eat_apple_and_die": function(game_state) {
        game_state.message = functions.random_choice([
            "You choke on the apple and die.",
        ]);
        clover(game_state);
        if (game_state.character.is_dead === false) {
            lose_item(game_state, "apple");
        }
        return game_state;
    },

    "eat_apple_strength": function(game_state) {
        game_state.message = functions.random_choice([
            "The apple is so healthy it makes you grow stronger.",
            "You feel " +
            functions.random_choice(["invigorated", "rejuvenated",
                                     "revitalized",]) +".",
        ]);
        lose_item(game_state, "apple");
        game_state.character.strength += 1;
        return game_state;
    },

    "eat_fish_in_igloo": function(game_state) {
        game_state.message = "You survive in your igloo until winter by " +
            "eating your fish. The winter ice sheet allows you to get back " +
            "to land.",
        game_state.character.items.fish -= 3;
        move_character(game_state, "woods");
        return game_state;
    },

    "eat_sap": function(game_state) {
        var messages = [
            "It tastes less like maple syrup than you hoped it would.",
            "It tastes much less like candy than you hoped it would.",
            "It tastes much worse than it smelled.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "ball of sap");
        return game_state;
    },

    "eat_seal_in_igloo": function(game_state) {
        game_state.message = "You survive in your igloo until winter by " +
            "eating your seal carcass. The winter ice sheet allows you to " +
            "get back to land.",
        game_state.character.items["seal carcass"] -= 1;
        move_character(game_state, "woods");
        return game_state;
    },

    "eaten_by_bird": function(game_state) {
        game_state.message = "A bird swoops down and eats you.";
        die(game_state);
        return game_state;
    },

    "eaten_by_roc": function(game_state) {
        game_state.message = "While you're sunbathing, a roc swoops down " +
            "and snatches you up in its talons. It carries you 2000 miles " +
            "and feeds you to its hatchlings.",
        clover(game_state);
        return game_state;
    },

    "eaten_by_weasel": function(game_state) {
        game_state.message = "A loose weasel hears you ribbit and eats you.";
        clover(game_state);
        return game_state;
    },

    "enrage_lord_carlos": function(game_state) {
        game_state.message = "Lord carlos is " +
            functions.random_choice(["enraged", "infuriated",]) +
            " by your " +
            functions.random_choice(["impudence", "insolence",]) +
            ".";
        return game_state;
    },

    "enrage_lord_carlos_and_die": function(game_state) {
        game_state.message = "Lord carlos is not pleased. He kills you " +
            "before you can do anything else to annoy him.";
        die(game_state);
        return game_state;
    },

    "enter_the_void": function(game_state) {
        game_state.message = "";
        move_character(game_state, "void");
        return game_state;
    },

    "enter_newt_and_lose": function(game_state) {
        var messages = [
            "Your deep-cave newt wanders around in circles, loses the " +
            "race, and humiliates you both.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "enter_newt_and_provoke_mob": function(game_state) {
        game_state.message = "You deep-cave newt easily wins the race " +
            "and the peasants claim deep-cave newts are not fair. You " +
            "soon have an angry mob on your hands.";
        game_state.character.person = "mob";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "enter_newt_and_win_donkey": function(game_state) {
        var messages = [
            "Your deep-cave newt turns out to be as fast as it is slimy. " +
            "It wins the race. " +
            "You win a donkey and your newt gets to eat some leeches.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "donkey");
        return game_state;
    },

    "enter_newt_and_win_money": function(game_state) {
        var messages = [
            "Your deep-cave newt steals the show and wins the race. " +
            "You get to take home the jackpot and your newt gets to eat " +
            "some worms.",
        ];
        game_state.message = functions.random_choice(messages);
        get_money(game_state, functions.random_choice(["large_fortune",
                                                       "pittance",
                                                       "small_fortune"]));
        return game_state;
    },

    "enter_newt_and_win_pitchfork": function(game_state) {
        var messages = [
            "Your deep-cave newt dominates the competition and wins you " +
            "a weapon.",
        ];
        game_state.message = functions.random_choice(messages);
        get_weapon(game_state, functions.random_choice(["long_pitchfork",
                                                        "pitchfork"]));
        return game_state;
    },

    "escape_to_cave": function(game_state) {
        game_state.message = "You run into the woods and hide deep in a " +
            "cave... Perhaps a little too deep.";
        move_character(game_state, "cave");
        return game_state;
    },

    "escape_to_arctic": function(game_state) {
        game_state.message = "You flee the country.";
        move_character(game_state, "arctic");
        return game_state;
    },

    "escape": function(game_state) {
        game_state.message =
            "The Devil is pretty fast, so you manage to get away.";
        move_character(game_state,
            functions.get_random_adjacent_destination(game_state));
        leave_donkey_behind(game_state);
        return game_state;
    },

    "escape_like_god": function(game_state) {
        game_state.message =
            "God is very slow, but " + get_name(game_state) +
            " also " + conjugate(game_state, "waddle") + " like God, so " +
            "you manage to get away.";
        move_character(game_state,
                       functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "escape_unmarried": function(game_state) {
        switch (game_state.character.person) {
            case "felicity":
                game_state.message = "The Devil is pretty fast and not " +
                    "very fat, so you manage to get away unmarried.";
                game_state.persons.felicity.attracted = 0;
                // you can't find her again if her attracted is less than 1
                break;
            case "olga":
                game_state.message = "The Devil is pretty fast, so you " +
                    "manage to get away unmarried.";
                game_state.persons.olga.attracted = 0;
                break;
        }
        move_character(game_state,
                       functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "eve_loses_you_in_woods": function(game_state) {
        var messages = [
            "She says she wants to make love to you in the woods, " +
            "but when you go out in the woods, you lose track of her. " +
            "She doesn't come back for you.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "woods");
        return game_state;
    },

    "eve_name": function(game_state) {
        var messages = [
            "She asks if you even remember her name. " +
            "You say, \"Of course I remember your name. It's...\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    //f

    "fail_at_new_career": function(game_state) {
        var gender_noun;
        game_state.character.sex === "female" ?
            gender_noun = "priestess" :
            gender_noun = "priest";
        var messages = [
            "After a couple of months, you conclude that you don't have " +
            "what it takes to be a clown.",
            "After a couple of months, you conclude that you don't have " +
            "what it takes to be a " + gender_noun + ".",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "fail_to_die": function(game_state) {
        var messages = [
            "You eat some old apple seeds from your pocket, but you don't " +
            "die.",
            "You pray to God to strike you down so you can end your life " +
            "on a high note, but he appears to have no such plan for you.",
            "You try to kill yourself by holding your breath, but you " +
            "just pass out and wake up feeling exhausted later.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "fail_to_find_mermaids": function(game_state) {
        var messages = [
            "After a days of searching, you're not sure mermaids exist.",
            "You aren't sure where to look.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "fail_to_find_mermaids_find_turtle": function(game_state) {
        var messages = [
            "You find a sea turtle instead.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "fail_to_save_cat": function(game_state) {
        var messages = [
            "While you're running to save the cat, you trip on some gravel " +
            "and knock yourself out. When you wake up, all you find is the " +
            "smoldering remains of the cat.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "fail_to_steal_keys": function(game_state) {
        var messages = [
            "You almost get the keys off the warden.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "fall_into_cave": function(game_state) {
        var messages = [
            "You trip on a stick and fall into a hole in the ground.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "cave");
        return game_state;
    },

    "farm_work": function(game_state) {
        var messages = [
            "You earn a pittance harvesting wheat. You enjoy the change " +
            "pace.",
            "During your duties, you get kicked by a mule. You somehow " +
            "don't die. You are paid for your efforts but not your injuries.",
        ];
        if (game_state.character.sex === "male") {
            messages.push(
                "You spend a season milking cows for a farmer woman. " +
                "She keeps trying to marry you to her attractive " +
                "daughter, but her daughter is having none of it."
            );
        }
        game_state.message = functions.random_choice(messages);
        get_money(game_state, "pittance");
        return game_state;
    },

    "farm_work_and_apple": function(game_state) {
        var messages = [
            "You earn a pittance picking apples. You also save one for " +
            "the road.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "apple");
        get_money(game_state, "pittance");
        return game_state;
    },

    "farm_work_and_coin": function(game_state) {
        var messages = [
            "You earn a pittance slaughtering hogs. You also find a shiny " +
            "foreign coin in one of the hogs.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "shiny foreign coin");
        get_money(game_state, "pittance");
        return game_state;
    },

    "farm_work_and_die": function(game_state) {
        var messages = [
            "You find farm work, but the assassins find you.",
            "You slip on a fallen apple and drown in an irrigation ditch.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "farm_work_and_donkey": function(game_state) {
        var messages = [
            "You spend a season picking grapes at a small vineyard. " +
            "The old lady who owns the vineyard says she has no money, so " +
            "she gives you a donkey for your efforts.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_item(game_state, "donkey");
        return game_state;
    },

    "farm_work_and_pitchfork": function(game_state) {
        var messages = [
            "You earn a pittance bailing hay.",
        ];
        game_state.message = functions.random_choice(messages);
        get_weapon(game_state, "pitchfork");
        get_money(game_state, "pittance");
        return game_state;
    },

    "feel_accomplished": function(game_state) {
        var messages = [
            "You feel " +
            functions.random_choice(["extremely", "quite", "really",
                                     "very",]) + " " +
            functions.random_choice(["accomplished",
                                     "pleased with yourself",
                                     "proud of yourself",
                                     "self-satisfied",
                                    ]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "feel_bad_about_donation": function(game_state) {
        var messages = [
            "You feel " + functions.random_choice([
                "like the church will waste your donation",
                "like you wasted your money",
                "like you've been cheated",
                "unfulfilled",
                ]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        decrement_money(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "feel_good_about_donation": function(game_state) {
        var messages = [
            "You feel " + functions.random_choice([
                "fulfilled",
                "holier",
                "holy",
                "like a good person",
                "like your donation brought you closer to God",
                "like your sins will be pardoned",
                ]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        decrement_money(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "feel_manly": function(game_state) {
        var messages = [
            "You feel " +
            functions.random_choice(["extremely", "quite", "really",
                                     "very",]) + " " +
            functions.random_choice(["heroic", "macho", "manly"]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "felicity_gone": function(game_state) {
        var messages = [
            "Felicity looks embarrassed and disappointed. She leaves.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.felicity.attracted = 0;
        // you can't find her in the game if her attracted is less than 1
        return game_state;
    },

    "felicity_lets_you_out": function(game_state) {
        var messages = [
            "Felicity is overjoyed and secretly lets you out of prison " +
            "that night. \"Let's get married!\" she says.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "streets");
        game_state.character.person = "felicity";
        game_state.marriage = true;
        return game_state;
    },

    "felicity_loves_you": function(game_state) {
        var messages = [
            "Felicity whispers that she loves you.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "ferocious_cat": function(game_state) {
        var messages = [
            "You find a ferocious cat. It kills you.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        clover(game_state);
        return game_state;
    },

    "find_a_cat": function(game_state) {
        var messages = [
            "You find a fat cat. It's too slow to escape you.",
            "You find one.",
            "Your efforts to find a cat are fruitful.",
            "Today is your lucky day.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "cat");
        game_state.character.person = null;
        return game_state;
    },

    "find_a_war_merchant": function(game_state) {
        game_state.message =
            "You find yourself talking to a wealthy war merchant.";
        game_state.character.person = "war_merchant";
        return game_state;
    },

    "find_a_way_out": function(game_state) {
        game_state.message = "You find a way out of the cave.";
        move_character(game_state, "woods");
        return game_state;
    },

    "find_assassin_instead": function(game_state) {
        game_state.message = "You notice a woman in a dark cloak stalking " +
            "you.";
        game_state.character.person = "assassin";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "find_dagger": function(game_state) {
        game_state.message = "While you're licking the " +
            get_ground(game_state) + ", you notice an old dagger.";
        get_weapon(game_state, "dagger");
        return game_state;
    },

    "find_deep_cave_newt": function(game_state) {
        game_state.message = "You don't find a way out, but you find a " +
            "deep-cave newt.";
        get_item(game_state, "deep-cave newt");
        return game_state;
    },

    "find_lost_treasure": function(game_state) {
        game_state.message = "You don't find any mermaids, but you find a " +
            "small fortune in lost treasure.";
        get_money(game_state, "small_fortune");
        return game_state;
    },

    "find_mermaid_rock": function(game_state) {
        game_state.message = "You find a mermaid. She leads you back to " +
            "her rock.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "find_olga": function(game_state) {
        if (game_state.persons.olga.attracted < 1) {
            game_state.message = "You find Olga laughing with her friends. " +
                "\"Oh hey there,\" she calls to you. \"I was just telling " +
                "my friends how you ran away when I asked you to marry me.\"";
        } else {
            game_state.message = "You find Olga drinking some ale. " +
                "\"Hey there, Good Looking,\" she says.";
        }
        game_state.character.person = "olga";
        return game_state;
    },

    "find_pearl_in_jewels": function(game_state) {
        game_state.message = "You find a pearl in your bag of jewels.";
        get_item(game_state, "pearl");
        return game_state;
    },

    "find_mermaid_instead": function(game_state) {
        game_state.message = "You find a mermaid instead. She leads you " +
            "back to her rock.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "find_nymphs": function(game_state) {
        var messages = [
            "You find some nymphs " + functions.random_choice([
                "dancing slowly in a meadow",
                "singing among the trees",]) + ", but they disappear when " +
            "they see you.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "find_sea_turtle": function(game_state) {
        game_state.message = "You find a sea turtle and follow it to shore.";
        move_character(game_state, "countryside");
        return game_state;
    },

    "find_sea_turtle_and_drown": function(game_state) {
        game_state.message = "You find one. You also drown because you're " +
            "in the ocean.";
        clover(game_state);
        return game_state;
    },

    "find_shiny_coin": function(game_state) {
        game_state.message = "You don't find any mermaids, but you find a " +
            "find shiny amid the rocks.";
        get_item(game_state, "shiny foreign coin");
        return game_state;
    },

    "find_st_george": function(game_state) {
        game_state.message = "You find St. George.";
        game_state.character.person = "st_george";
        return game_state;
    },

    "find_st_george_in_church": function(game_state) {
        game_state.message = "You find St. George " +
            functions.random_choice(["absolving a rich man's sins",
                           "blessing a knight's sword",
                           "cleaning the feet of a beggar",
                           "deep in prayer", "eating a holy wafer",
                           "feeding a poor woman", "giving a sermon",
                           "helping deliver a baby"]) + ".";
        move_character(game_state, "church");
        game_state.character.person = "st_george";
        return game_state;
    },

    "find_st_george_instead": function(game_state) {
        game_state.message = "You find St. George instead.";
        game_state.character.person = "st_george";
        return game_state;
    },

    "find_wizard": function(game_state) {
        var messages = [
            "You find the wizard buying a map of the Arctic from a merchant.",
            "You find the wizard strutting around the market naked.",
            "You find the wizard trying to stomp on a frantic frog.",
            "You find the wizard. He is telling a woman about a " +
            "mesmerizing pearl.",
            "You find the wizard. He is flirting awkwardly with a woman.",
            "You see the wizard emptying a flask into a well.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "wizard";
        return game_state;
    },

    "find_wizard_get_frog": function(game_state) {
        var messages = [
            "You find the wizard. He gives you a frog."
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "wizard";
        get_item(game_state, "frog");
        return game_state;
    },

    "find_wizard_teleport": function(game_state) {
        var messages = [
            "You find the wizard. He offers to teleport you anywhere you'd " +
            "like to go.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "wizard";
        return game_state;
    },

    "find_wooden_mermaid": function(game_state) {
        game_state.message = "You find a wooden mermaid figurehead on the " +
            "front of a ship. The crew hoists you abroad.";
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "fire_cannon_and_die": function(game_state) {
        game_state.message = "You manage to shoot the merchant ship's mast " +
            "down. It falls on you.";
        die(game_state);
        return game_state;
    },

    "fire_cannon_and_get_flogged": function(game_state) {
        game_state.message = "You sink the merchant ship, treasure and all." +
            " Lord Arthur is not pleased. Nor are you after he teaches " +
            "you a lesson by giving you 101 lashes across the back.";
        return game_state;
    },

    "fire_cannon_and_get_rewarded": function(game_state) {
        game_state.message = "You fumble around with the cannon and never " +
            "figure out how it works, but Lord Arthur is convinced you " +
            "contributed to his victory and rewards you.",
        get_item(game_state, "bag of jewels");
        return game_state;
    },

    "fish_pirates_laugh": function(game_state) {
        game_state.message = "Some pirates notice you fishing. One of them " +
            "says, \"You'll never get a large fortune like that.\" The " +
            "pirates laugh.";
        game_state.character.person = "pirates";
        return game_state;
    },

    "fish_up_ax": function(game_state) {
        game_state.message = "You fish up a rusty ax.";
        game_state.character.person = null;
        get_item(game_state, "ax");
        return game_state;
    },

    "fish_up_pitchfork": function(game_state) {
        game_state.message = "You fish up a fancy pitchfork.";
        game_state.character.person = null;
        get_weapon(game_state, "pitchfork");
        return game_state;
    },

    "flirt_and_shrub": function(game_state) {
        game_state.message = "The nymph queen is " +
            functions.random_choice(["unimpressed by", "uninterested in",]) +
            " your advances and turns you into a shrub.";
        game_state.character.is_shrub = true;
        game_state.character.person = null;
        return game_state;
    },

    "flirt_with_mermaid_and_die": function(game_state) {
        var messages = [
            "The mermaid accidentally knocks you over with her tail.",
            "A jealous merman sees you flirting with the mermaid and " +
            "stabs you with his fancy pitchfork.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "fly_tastes_good": function(game_state) {
        game_state.message = "The fly tastes better than any human food " +
            "ever did.";
        return game_state;
    },

    "forced_to_marry_eve": function(game_state) {
        game_state.message =
            "Lord Carlos' daughter lets you sleep next to her in bed that " +
            "night. Unfortunately, you don't wake up at " +
            "dawn. You wake up in the middle of the night when two " +
            "hooded assassins kidnap you and take you to a dungeon full " +
            "of torture devices. They are about to put you in an " +
            "iron maiden when they take off their hoods and reveal " +
            "that they are Lord Carlos' daughter and a priest. The " +
            "priest officiates your wedding. You and Lord Carlos' " +
            "daughter live happily ever after.";
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "forget_what_you_were_doing": function(game_state) {
        game_state.message = "You forget what you were trying to do.";
        move_character(
                game_state,
                functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "freeze": function(game_state) {
        var messages = [
            "It's easy.",
            "You do.",
            "You freeze to death.",
            "You get mauled by a polar bear before you get a chance to " +
            "freeze to death.",
            "You get sleepy.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "freeze_in_sleep": function(game_state) {
        var messages = [
            "You freeze to death in your sleep.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "frog": function(game_state) {
        game_state.message = "You find the wizard. He turns you into a frog.";
        game_state.character.is_frog = true;
        return game_state;
    },

    "frog_advice": function(game_state) {
        game_state.message = "The wizard advises you to hop around. " +
            "He helps you follow his advice by turning you into a frog.";
        game_state.character.is_frog = true;
        return game_state;
    },

    "frog_and_die": function(game_state) {
        game_state.message = "You find the wizard. He turns you into a frog " +
            "and steps on you.";
        clover(game_state);
        return game_state;
    },

    //g

    "gambling_die": function(game_state) {
        game_state.message =  "The assassins see you gambling and " +
            "assassinate you.";
        die(game_state);
        return game_state;
    },

    "gambling_die_not": function(game_state) {
        game_state.message =  "The assassins see you gambling, but " +
            "don't recognize you since you're a woman now.";
        return game_state;
    },

    "gambling_lady": function(game_state) {
        game_state.message = "You get cleaned out by a pretty lady.";
        game_state.character.person = "olga";
        lose_all_items(game_state);
        return game_state;
    },

    "gambling_lose": function(game_state) {
        game_state.character.person = null;
        if (game_state.character.place === "docks") {
            game_state.message = "You dice with some pirates. " +
                "They easily beat you.";
            game_state.character.person = "pirates";
        } else {
            game_state.message = "You lose many games of poker.";
        }
        lose_all_items(game_state);
        return game_state;
    },

    "gambling_win": function(game_state) {
        game_state.character.person = null;
        if (game_state.character.place === "docks" &&
            game_state.persons.lord_arthur.alive === true) {
            game_state.message = "You dice with Lord Arthur. " +
                "He whips you soundly, however you also beat him at " +
                "gambling.";
            game_state.character.person = "lord_arthur";
        } else {
            game_state.message = "You win many games of dice.";
        }
        get_money(game_state, "small_fortune");
        return game_state;
    },

    "gawk_and_get_assassinated": function(game_state) {
        game_state.message = "You are too distracted by all the pretty " +
            "women to notice the assassins closing in on you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "gawk_and_get_money": function(game_state) {
        game_state.message = "A woman mistakes you for a beggar and takes " +
            "pity on you.";
        get_money(game_state, "pittance");
        return game_state;
    },

    "gawk_at_cat": function(game_state) {
        game_state.message = "You don't see any woman worth gawking at, " +
            "but you do see a cat worth gawking at.";
        get_item(game_state, "cat");
        return game_state;
    },

    "gawk_at_men": function(game_state) {
        var messages = [
            "A strapping young lad notices you watching him, but he's too " +
            "shy to approach you and hastens away.",
            "A man makes eye contact with you and glances back at you " +
            "as he passes by. His wife is not pleased.",
            "A creepy old man winks at you as he walks by.",
            "You stop gawking when you realize the man is simple.",
            "The men also gawk at you since you're a woman.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "gawk_at_men_and_meet_drunk": function(game_state) {
        var messages = [
            "A drunk man notices you gawking at him and says, \"What you " +
            "looking at?\"",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "drunk";
        return game_state;
    },

    "gawk_at_men_and_meet_nobleman": function(game_state) {
        var messages = [
            "A nobleman looks you up and down and says he'd sleep with " +
            "you if he wasn't so busy.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "nobleman";
        return game_state;
    },

    "gawk_at_women": function(game_state) {
        var messages = [
            "A fair woman notices you and hastens away.",
            "A woman becomes annoyed with your gawking and throws salt in " +
            "your eyes.",
            "An equally creepy woman stares back at you before " +
            "disappearing into the crowd.",
            "You stop gawking when you realize it isn't a woman.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "get_asylum_and_get_arrested": function(game_state) {

        game_state.message = "Lord Bartholomew grants you asylum, but his " +
            "manor is soon stormed by Lord Daniel's men. You are arrested " +
            "for treason.";
        if (game_state.places.lord_bartholomew_manor.burnable === true) {
            game_state.places.lord_bartholomew_manor.burnable = false;
            game_state.places.lord_bartholomew_manor.name = "the smoldering " +
                "remains of Lord Bartholomew's manor";
        }
        arrested(game_state);
        return game_state;
    },

    "get_asylum_and_win": function(game_state) {
        game_state.message = "Lord Bartholomew grants you asylum and gives " +
            "you work shoveling coal into ovens. After a few years, you " +
            "fall in love with a cook who also works in the kitchens. " +
            "You eventually win her heart and live happily ever after.";
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "get_attacked": function(game_state) {
        var attempted_action;
        switch (game_state.action) {
            case "BURN":
                attempted_action = "start a fire";
                break;
            case "GO_TO":
                attempted_action = "leave";
                break;
            default:
                attempted_action = game_state.action[0].toLowerCase() +
                    game_state.action.slice(1, game_state.action.length - 1);
        }

        if (game_state.persons[
                game_state.character.person
            ].preferred_attack === "arrest") {
            game_state.message =
                "You try to " + attempted_action + ", but " +
                get_name(game_state) + " " +
                conjugate(game_state, "throw") + " you in prison with the " +
                "other lunatics.";
            move_character(game_state, "prison");
            game_state.character.person = "other_lunatics";
        } else {
            game_state.message =
                "You try to " + attempted_action + ", but " +
                get_name(game_state) + " " +
                conjugate(game_state, "kill") + " you.";
            game_state.character.is_dead = true;
        }
        return game_state;
    },

    "get_a_four-leaf_clover": function(game_state) {
        game_state.message = "You don't find any flowers, but you find a " +
        "four-leaf clover instead.";
        get_item(game_state, "four-leaf clover");
        game_state.character.person = null;
        return game_state;
    },

    "get_a_bouquet": function(game_state) {
        var messages = [
            "You find many pretty flowers.",
            "A peasant girl picks flowers with you. She tells you she " +
            "wants to be like Lord Bartholomew when she grows up.",
            "You spend all day looking for flowers, but it was worth it.",
            "You get stung by a bee, but you still find many pretty flowers.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "bouquet of flowers");
        game_state.character.person = null;
        return game_state;
    },

    "get_frog": function(game_state) {
        var messages = [
            "While you are snooping around, a frog hops onto you.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "frog");
        return game_state;
    },

    "get_no_void_dust": function(game_state) {
        var messages = [
            "You reach for some void dust, but it's farther away than it " +
            "seems.",
            "The void dust slips between your fingers and disperses into " +
            "nothingness.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "get_pearl": function(game_state) {
        game_state.message = "You soon find a pearl in an oyster.";
        get_item(game_state, "pearl");
        return game_state;
    },

    "get_poison_dagger": function(game_state) {
        game_state.message = "You find a poisoned dagger in a glass case.";
        get_weapon(game_state, "poison_dagger");
        return game_state;
    },

    "get_punished": function(game_state) {
        var messages = [
            "Lord Arthur punishes you for your " +
            functions.random_choice(["brashness", "incompetence",
                                     "recklessness"]) +
            " by " +
            functions.random_choice([
                "beating you with his cat. The cat is more traumatized " +
                "by the experience than you are.",
                "making you clean the deck with your tongue. You're " +
                "pretty good at it.",
                "tying you to the front of the ship for a week. You find " +
                "the wooden mermaid figurehead very sexy, but the " +
                "experience is mostly just terrible.",
                "putting you on kitchen duty with the ship's cook, who " +
                "bores you with stories about his life.",
                "putting you in a barrel and letting his men roll you " +
                "around the deck for a couple of hours.",
            ]),
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "get_sap": function(game_state) {
        game_state.message = "You fall a tree and scrape the sap off your ax.";
        get_item(game_state, "ball of sap");
        return game_state;
    },

    "get_sword_of_great_evil": function(game_state) {
        game_state.message = "The wizard eagerly trades you his most " +
            "valuable item.";
        lose_item(game_state, "handful of void dust");
        get_weapon(game_state, "sword_of_great_evil");
        return game_state;
    },

    "get_void_dust": function(game_state) {
        game_state.message = "";
        get_item(game_state, "handful of void dust");
        return game_state;
    },

    "give_apple_to_orphan": function(game_state) {
        var messages = [
            "The orphan thanks you and runs off with the apple.",
            "The orphan thanks you and splits the apple with seven other " +
            "orphans.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "apple");
        return game_state;
    },

    "give_apple_to_orphan_rebuffed": function(game_state) {
        var messages = [
            "\"I don't need your charity!\" the orphan yells. He " +
            "spits on your shoes and runs away.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "give_apple_to_self": function(game_state) {
        var messages = [
            "Since you're an orphan, you give the apple to yourself.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "give_cat_eve": function(game_state) {
        var messages = [
            "Lord Carlos' daughter kills the cat.",
        ];
        game_state.message = functions.random_choice(messages);
        functions.get_person(game_state).attracted += 1;
        lose_item(game_state, "cat");
        return game_state;
    },

    "give_cat_olga": function(game_state) {
        var messages = [
            "She thinks the cat is adorable.",
        ];
        game_state.message = functions.random_choice(messages);
        functions.get_person(game_state).attracted += 1;
        lose_item(game_state, "cat");
        return game_state;
    },

    "give_flowers_eve": function(game_state) {
        var messages = [
            "She tosses the flowers out the window.",
            "She rips the bouquet to shreds.",
        ];
        game_state.message = functions.random_choice(messages);
        functions.get_person(game_state).attracted += 1;
        lose_item(game_state, "bouquet of flowers");
        return game_state;
    },

    "give_flowers_felicity": function(game_state) {
        var messages = [
            "She blushes as red as the roses you give her.",
            "\"Oh, you're so sweet. I can't believe Lord " +
            "Daniel had you locked up,\" she says.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.felicity.attracted += 1;
        lose_item(game_state, "bouquet of flowers");
        return game_state;
    },

    "give_flowers_mermaid": function(game_state) {
        var messages = [
            "She eats them.",
            "She isn't sure what the flowers are for, but she is happy " +
            "with your gift.",
        ];
        game_state.message = functions.random_choice(messages);
        functions.get_person(game_state).attracted += 1;
        lose_item(game_state, "bouquet of flowers");
        return game_state;
    },

    "give_flowers_nymph_queen": function(game_state) {
        var messages = [
            "The nymph queen smiles at you and throws the flowers in the " +
            "air. The flowers float around and slowly circle above the " +
            "nymph queen.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "bouquet of flowers");
        return game_state;
    },

    "give_flowers_olga": function(game_state) {
        var messages = [
            "She gives you a kiss in return.",
            "She is delighted with your gift and puts one of the flowers " +
            "in her hair.",
            "She says she loves the flowers.",
        ];
        game_state.message = functions.random_choice(messages);
        functions.get_person(game_state).attracted += 1;
        lose_item(game_state, "bouquet of flowers");
        return game_state;
    },

    "go_to": function(game_state) {
        game_state.message = "";
        move_character(game_state, game_state.destination);
        return game_state;
    },

    "go_upstairs_and_die": function(game_state) {
        game_state.message = "Olga invites you to her room upstairs. " +
            "When you get there, lots of passionate stabbing ensues.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "go_upstairs_and_die_not": function(game_state) {
        game_state.message = "Olga invites you to her room upstairs. " +
            "When you get there, you realize she's one of Lord Carlos' " +
            "assassins, but, since you're a woman now, you don't think she " +
            "recognizes you.";
        return game_state;
    },

    "go_upstairs_with_olga": function(game_state) {
        var messages = [
            "After dancing with Olga for a couple of hours, she takes " +
            "you upstairs to see the view from her window.",
            "You and Olga stay up late trading jokes. When the innkeeper " +
            "says they're closing down for the night, Olga takes you " +
            "upstairs to her room where she has some fine paintings she's " +
            "borrowing from Lord Carlos.",
            "Once you're both quite drunk, Olga takes you upstairs to " +
            "her room."
        ];
        game_state.character.place = "upstairs";
        game_state.message = functions.random_choice(messages);
        game_state.persons.olga.attracted += 1;
        return game_state;
    },

    "god_commits_arson": function(game_state) {
        burn(game_state); // the order matters here since burn()
                          // overwrites the message
        game_state.message = "Your prayers are answered. " +
            game_state.message;
        return game_state;
    },

    "god_gives_you_a_spouse": function(game_state) {
        if (game_state.character.sex === "female") {
            game_state.message = "Your prayers for a beautiful husband are " +
                "answered, but he soon leaves you.";
        } else {
            game_state.message = "Your prayers for a beautiful wife are " +
                "answered, but she soon leaves you.";
        }
        return game_state;
    },

    "god_gives_you_holy_strength": function(game_state) {
        game_state.message = "God gives you holy strength.";
        game_state.character.strength += 2;
        return game_state;
    },

    "god_gives_you_jewels": function(game_state) {
        game_state.message =
            "God does nothing for you, but you " +
            "find a bag of jewels someone left on the counter.";
        get_item(game_state, "bag of jewels");
        return game_state;
    },

    "god_resurrects_cat": function(game_state) {
        game_state.message = "God hears your distress and brings the cat " +
            "back to life.";
        get_item(game_state, "cat");
        return game_state;
    },

    "god_shows_you_the_way": function(game_state) {
        game_state.message = "God speaks to you and shows you the way.";
        switch (game_state.character.place) {
            case "ocean":
                move_character(game_state, "docks");
                break;
            case "woods":
                move_character(game_state, "woods");
                break;
        }
        return game_state;
    },

    "god_showers_you_with_gold": function(game_state) {
        game_state.message = "God rewards your devotion with a large " +
            "fortune.";
        get_money(game_state, "large_fortune");
        return game_state;
    },

    "god_smites_you": function(game_state) {
        game_state.message = "God smites you for your " +
            functions.random_choice(["arrogance", "faithlessness",
                                     "foolishness", "heresy", "rudeness",
                                     "tactlessness"]) + ".";
        clover(game_state);
        return game_state;
    },

    "god_tells_you_stuff": function(game_state) {
        var messages = [
            "God tells you he is the Alpha and the Omega, but it's all " +
            "Greek to you.",
            "God tells you to get married.",
            "God tells you to kill Lord Carlos.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "god_tells_you_to_burn_stuff": function(game_state) {
        var messages = [
            "God tells you to burn stuff.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "god_tests_you": function(game_state) {
        game_state.message = "God decides to test you.";
        lose_all_items(game_state);
        return game_state;
    },

    "ground_tastes_cold": function(game_state) {
        game_state.message = "The ground tastes really cold.";
        return game_state;
    },

    "grovel_and_die": function(game_state) {
        var messages = [
            "Lord Carlos is having none of it.",
            "Lord Carlos isn't interested in your tired excuses.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "grovel_and_go_to_woods": function(game_state) {
        var messages = [
            "He asks a servant to get you out of his sight. You are " +
            "unceremoniously thrown out of the manor.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "woods");
        return game_state;
    },

    "grow_stronger_potion": function(game_state) {
        game_state.message = "You grow stronger.";
        game_state.character.strength += 2;
        lose_item(game_state, "potion of strength");
        return game_state;
    },

    "grow_tail": function(game_state) {
        grow_tail(game_state);
        return game_state;
    },

    "grow_tail_potion": function(game_state) {
        grow_tail(game_state);
        lose_item(game_state, "potion of tail growth");
        return game_state;
    },

    "guards_argue_with_you": function(game_state) {
        var messages = [
            "The guards argue with you about the finer points of the " +
            "justice system.",
            "The guards say, \"It's fair if Lord Daniel says it's fair.\"",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "guards";
        return game_state;
    },

    "guards_kill_you_for_homicide": function(game_state) {
        game_state.message = "The prison guards walk by and see all the " +
            "dead bodies in your cell. \"Let's put this last one out of " +
            "his misery,\" one of them says. They soon do.";
        die(game_state);
        return game_state;
    },

    "guards_stop_you_burning": function(game_state) {
        game_state.message = "The guards see you trying to start a fire " +
            "and conclude you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_complaining": function(game_state) {
        game_state.message = "The guards arrest you for " +
            functions.random_choice(["annoying them", "bringing down the mood",
                           "complaining", "dissenting",]) + ".";
        arrested(game_state);
        return game_state;
    },

    "guards_stop_you_dancing": function(game_state) {
        game_state.message = "The local guards see your jig and conclude " +
        "that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_killing": function(game_state) {
        game_state.message = "The local guards see you killing everybody " +
            "and conclude that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_licking": function(game_state) {
        game_state.message = "The local guards see you licking the " +
            get_ground(game_state) + " and conclude you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_naked": function(game_state) {
        game_state.message = "The guards catch you with your pants " +
            "down and conclude you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_rich": function(game_state) {
        game_state.message = "The local guards see you flaunting your " +
            "wealth and conclude that you must be rich.";
        game_state.character.person = "guards";
        return game_state;
    },

    "guards_stop_you_singing": function(game_state) {
        game_state.message = "The local guards see you singing and conclude " +
        "that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_swinging_cat": function(game_state) {
        game_state.message = "The local guards see you swinging your cat " +
            "and conclude that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_trash": function(game_state) {
        game_state.message = "The local guards see you looking through the " +
            "trash and accuse you of being a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_take_away_bodies": function(game_state) {
        game_state.message = "The prison guards remove the dead bodies " +
            "from you cell.";
        game_state.persons.other_lunatics.alive = true;
        return game_state;
    },

    "guards_watch_you_swinging_cat": function(game_state) {
        game_state.message = "The local guards gawk at you while you're " +
            "swinging your cat around.";
        game_state.character.person = "gaurds";
        return game_state;
    },

    //h

    "hammer_from_st_george": function(game_state) {
        var gender_noun;
        if (game_state.character.sex === "female") {
            gender_noun = "woman";
        } else {
            gender_noun = "man";
        }
        game_state.message = "St. George sees that you are a righteous " +
            gender_noun + " and gives you a weapon to do God's work.";
        get_weapon(game_state, "iron_hammer");
        game_state.character.person = "st_george";
        return game_state;
    },

    "hide": function(game_state) {
        var messages = [
            "You hide from the assassins, but not from your own " +
            "dark thoughts.",
            "You hide for a couple of days, long enough " +
            "that you think the whole assassin thing has probably " +
            "blown over.",
            "You hide yourself very well, but you feel lonely.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "hide_and_die": function(game_state) {
        var messages = [
            "You trip in the darkness and break your neck.",
            "You hide in a sewer, but you get killed by a rat.",
        ];
        if (game_state.character.sex === "male") {
            messages.push(
                "You don't hide well enough. The assassins find you anyway."
            )
        }
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "hide_and_find_coins": function(game_state) {
        var messages = [
            "While you're hiding in the alley, you notice some coins on " +
            "the ground.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_money(game_state, "pittance");
        return game_state;
    },

    "hide_and_fight_rat": function(game_state) {
        var messages = [
            "You fight an epic battle against one of the rats on the " +
            "lower decks.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "hide_and_miss_out": function(game_state) {
        var messages = [
            "You miss all of the action.",
            "You don't get any of the treasure.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "hide_beneath_deck_and_die": function(game_state) {
        var messages = [
            "Lord Arthur has you killed for your cowardice.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "hide_in_void": function(game_state) {
        var messages = [
            "You hide so well, you leave the universe.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "void");
        return game_state;
    },

    "hire_assassin": function(game_state) {
        var messages = [
            "\"Whom should I kill?\" the assassin asks.",
            "\"Who needs killing?\" the assassin asks.",
            "You hire a fat assassin. He says he can kill anyone you name, " +
            "but you have your doubts.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "assassins";
        decrement_money(game_state);
        return game_state;
    },

    "hire_assassin_and_die": function(game_state) {
        var messages = [
            "The assassin recognizes you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "hit_assassin_with_cat": function(game_state) {
        game_state.message = "You hit an assassin with your cat.";
        game_state.character.person = "assassin";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "hit_assassin_with_cat_not": function(game_state) {
        game_state.message = "You hit an assassin with your cat. ";
        var messages = [
            "She gives you a dirty look and goes about her business.",
            "She tells you to be more careful where you swing your cat " +
            "and goes about her business.",
        ];
        game_state.message += functions.random_choice(messages);
        return game_state;
    },

    "hold_your_own": function(game_state) {
        game_state.message = "You manage to hold your own during the " +
            "battle. You are given your share of the loot.";
        get_money(game_state, "pittance");
        return game_state;
    },

    "hop": function(game_state) {
        game_state.message = "You hop.";
        game_state.character.person = null;
        return game_state;
    },

    "hop_a_lot": function(game_state) {
        game_state.message = "You hop a lot.";
        move_character(game_state,
                       functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "human": function(game_state) {
        game_state.message = "A woman picks you up and kisses you " +
            "hoping to get a prince, instead she gets you. She is not " +
            "impressed.";
        game_state.character.is_frog = false;
        return game_state;
    },

    "human_with_fly_in_mouth": function(game_state) {
        game_state.message = "The spell wears off as you catch a fly. " +
            "You turn into a human and spit the fly out of your mouth.";
        game_state.character.is_frog = false;
        return game_state;
    },

    //i

    "impress_lord_arthur": function(game_state) {
        game_state.message = "Lord Arthur is " +
            functions.random_choice(["impressed", "pleased"]) +
            " with your enthusiasm and gives you a cutlass.";
        get_weapon(game_state, "cutlass");
        return game_state;
    },

    "impress_lord_arthur_brave": function(game_state) {
        game_state.message = "Lord Arthur says, \"Your bravery would be " +
            "useful on the high seas.\" It soon is.";
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "impress_olga": function(game_state) {
        var messages = [
            capitalize(game_state.persons.olga.name) + " is enthralled by " +
            "your story.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "impress_simple_peasant": function(game_state) {
        var messages = [
            "The peasant agrees that you are a great man.",
            "You impress the simple peasant.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "infection": function(game_state) {
        game_state.message = "You catch a nasty infection and spend weeks " +
            "fighting it.";
        die(game_state);
        return game_state;
    },

    "ignored": function(game_state) {
        var messages = [
            "God ignores your prayers.",
            "God slights you by ignoring you.",
            "God tests your faith by ignoring your prayers.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    //j

    //k

    "keep_swimming": function(game_state) {
        var messages = [
            "You swim past several islands but keep looking for a better " +
            "one.",
            "You become so tired you start hallucinating that assassins " +
            "are swimming after you.",
            "As you swim, you start resenting the fact that God hasn't " +
            "saved you yet.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "kill": function(game_state) {
        var weapon = "bare hands";
        if (game_state.character.equipped_weapon !== "") {
            weapon = items.weapons_map[
                game_state.character.equipped_weapon
            ].name;
        }
        game_state.message =
            "You kill " +
            game_state.persons[game_state.character.person].name + " with " +
            "your " + weapon + ".";
        game_state.persons[game_state.character.person].alive = false;
        game_state.character.is_threatened = false;
        if (game_state.character.person === "wizard") {
            get_item(game_state, "fancy red cloak");
        }
        game_state.character.person = null;
        return game_state;
    },

    "kill_lord_carlos": function(game_state) {
        game_state.message =
            "You are just about to dump a cauldron of hot soup on Lord " +
            "Carlos when he looks up and notices you. You then dump the " +
            "hot soup on him and he dies.",
        game_state.persons.lord_carlos.alive = false;
        move_character(game_state, "lord_carlos_manor");
        return game_state;
    },

    "kill_merchants": function(game_state) {
        game_state.message = "You manage to kill several innocent " +
            "merchants.";
        if (game_state.persons.lord_arthur.alive === true) {
            game_state.message += " Lord Arthur is pleased and gives you a " +
                "large share the loot.";
            get_money(game_state, "small_fortune");
        }
        return game_state;
    },

    "kill_nobody": function(game_state) {
        var messages = [
            "You don't see anybody in a fit of rage to kill.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "kill_self": function(game_state) {
        var messages = [
            "You perform the ritual of seppuku.",
        ];
        if (game_state.character.place !== "ocean") {
            messages.push("You set yourself on fire and promptly burn to a " +
                "crisp.");
        } else {
            messages.push("You drown trying to set yourself on fire.");
        }
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "kill_self_in_fit_of_rage": function(game_state) {
        var messages = [
            "You start with yourself.",
            "You make no exceptions.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "kill_self_in_ocean": function(game_state) {
        var messages = [
            "You walk into the ocean and are suddenly inspired to write a " +
            "novel. You drown.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "killed_at_weapon_store": function(game_state) {
        game_state.message = "You now have a dagger. In your back. " +
            "You turn around to see an assassin looking satisfied with " +
            "herself.";
        clover(game_state);
        return game_state;
    },

    "killed_by_bee": function(game_state) {
        game_state.message = "You get stung by a killer bee. The bee isn't " +
            "a killer by breed but by disposition.";
        clover(game_state);
        return game_state;
    },

    "killed_by_dragon": function(game_state) {
        game_state.message = "Everything was going fine until you tried to " +
            "get a dragon to do your bidding.";
        die(game_state);
        return game_state;
    },

    "killed_by_dragon_red": function(game_state) {
        game_state.message = "The dragon is in no mood to chat.";
        die(game_state);
        return game_state;
    },

    "killed_by_eve": function(game_state) {
        game_state.message = "Lord Carlos' daughter laughs at your jokes " +
            "and serves you some wine. The wine is actually just a bunch " +
            "poison.";
        die(game_state);
        return game_state;
    },

    "killed_by_hero": function(game_state) {
        game_state.message =
            "You throw out your arm destroying the first three " +
            "civilizations and an opportunistic hero slays you.";
        die(game_state);
        return game_state;
    },

    "killed_by_lord_arthur": function(game_state) {
        game_state.message = "Lord Arthur has you killed for raising the " +
            "wrong sail.";
        clover(game_state);
        return game_state;
    },

    "killed_by_lord_carlos": function(game_state) {
        game_state.message = "Lord Carlos jumps down from some rafters and " +
            "assassinates you.";
        die(game_state);
        return game_state;
    },

    "killed_by_mob": function(game_state) {
        game_state.message = "You try to save the witch, but the peasants " +
            "kill you for meddling.";
        die(game_state);
        return game_state;
    },

    "killed_by_olga": function(game_state) {
        game_state.message =
            "When you squeeze her butt, she stabs you in the heart with a " +
            "poisoned dagger.";
        die(game_state);
        return game_state;
    },

    "killed_by_olga_noe": function(game_state) {
        game_state.message = "When you squeeze her butt, she looks back and " +
            "winks at you.";
        return game_state;
    },

    "killed_in_future": function(game_state) {
        game_state.message =
            "You wreak havoc on a titanic scale, but you eventually fall " +
            "asleep. By the time you wake up, science has advanced so much " +
            "that the world government simply nukes you into oblivion.";
        die(game_state);
        return game_state;
    },

    "kiss_frog_and_die": function(game_state) {
        var messages = [
            "Your frog turns into a prince. He is disgusted to be kissing " +
            "man and has you put to death.",
            "Your frog turns into an assassin. He assassinates you.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "kiss_frog_and_die_not": function(game_state) {
        var messages = [
            "When you kiss your frog, it turns into a prince. He keeps " +
            "kissing you for a while, but then tells you not to get your " +
            "hopes up because he would never fall for a peasant woman like " +
            "you.",
            "Your frog turns into an assassin. He thanks you for saving " +
            "him and asks if you've meet a man named Joseph who likes to " +
            "sing and burn things. You tell him you've never met anyone " +
            "that interesting. The assassin goes on his way.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "frog");
        return game_state;
    },

    "kiss_frog_cat": function(game_state) {
        var messages = [
            "Your frog turns into a cat. ",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "cat");
        lose_item(game_state, "frog");
        return game_state;
    },

    "kiss_frog_jewels": function(game_state) {
        var messages = [
            "Your frog turns into a prince. He rewards you for freeing him.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "bag of jewels");
        lose_item(game_state, "frog");
        return game_state;
    },

    "kiss_frog_lose_frog": function(game_state) {
        var messages = [
            "The frog turns into a peasant woman. \"Oh blessed be Lord " +
            "Bartholomew!\" she exclaims.",
            "The frog turns into an ugly fat man. He starts shaking you " +
            "violently. \"I liked being a frog!\" he yells before storming " +
            "off.",
            "The frog turns into a guard. He says, \"You must be a lunatic " +
            "for kissing a frog, but I'll let this one slide.\"",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "frog");
        return game_state;
    },

    "kiss_frog_mushrooms": function(game_state) {
        var messages = [
            "Your frog turns into an old woman. She thanks you and gives " +
            "you a bunch of mushrooms.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "frog");
        get_item(game_state, "black mushroom");
        get_item(game_state, "many-colored mushroom");
        get_item(game_state, "white mushroom");
        get_item(game_state, "yellow mushroom");
        return game_state;
    },

    "kiss_frog_no_effect": function(game_state) {
        var messages = [
            "The frog seems to be into it.",
            "You feel stupid kissing a frog.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    //l

    "laugh_about_warden": function(game_state) {
        var messages = [
            "One of the prison guards pokes you with an eleven-foot pole. " +
            "\"No laughing,\" he says.",
            "You feel good for a second, then you remember you're " +
            "in prison.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lava_and_die": function(game_state) {
        var messages = [
            "You meet a fiery end.",
            "The lava is far less comfortable than you imagined.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "lava_swim": function(game_state) {
        var messages = [
            "The lava is hard to swim in, but it's nice and warm.",
            "You have a nice swim in a pool of lava.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "leave_in_a_puff": function(game_state) {
        game_state.message = "";
        teleport(game_state);
        return game_state;
    },

    "lesbian_flirt_with_eve": function(game_state) {
        game_state.message = "Lord Carlos' daughter calls in an assassin " +
            "and orders him to escort you out of the manor.";
        move_character(game_state, "woods");
        return game_state;
    },

    "lesbian_flirt_with_felicity": function(game_state) {
        game_state.message = functions.random_choice([
            "She is not pleased by your lesbian advances. She leaves in a " +
            "huff.",
            "She seems really embarrassed and leaves in a huff.",
        ]);
        game_state.persons.felicity.attracted = 0;
        return game_state;
    },

    "lick_ash": function(game_state) {
        var messages = [
            "You burn your tongue on an ember.",
            "You find the taste of ashes unpleasant.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lick_blood": function(game_state) {
        game_state.message = "You lick the blood off the " +
            get_ground(game_state) + ".";
        return game_state;
    },

    "lick_the_ocean": function(game_state) {
        game_state.message = "You drown swimming towards the ocean floor " +
            "with your tongue extended.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "lick_the_salt": function(game_state) {
        game_state.message = "The ground tastes really salty.";
        return game_state;
    },

    "look_for_mermaids_and_die": function(game_state) {
        game_state.message = "You slip on a rock.";
        die(game_state);
        return game_state;
    },

    "look_for_mermaids_and_drown": function(game_state) {
        game_state.message = "You get taken out by a storm during your " +
            "search.";
        die(game_state);
        return game_state;
    },

    "look_for_nymphs_and_die": function(game_state) {
        game_state.message = "You see some nymphs bathing in a waterfall, " +
            "but they hex you for gawking. You climb a ridge and throw " +
            "yourself to your death.",
        clover(game_state);
        game_state.character.person = null;
        return game_state;
    },

    "loot_and_die": function(game_state) {
        game_state.message = "You are killed by a merchant defending her " +
            "shop.";
        die(game_state);
        return game_state;
    },

    "loot_arrested": function(game_state) {
        game_state.message = "You are arrested for attempting to steal a " +
            functions.random_choice(["cart", "chicken", "goat", "grape",]) +
            ". You are thrown in prison with the other lunatics.";
        arrested(game_state);
        return game_state;
    },

    "loot_item": function(game_state) {
        var item = functions.random_choice(items.MARKET_ITEMS);
        game_state.message = "You get away with " +
            functions.a_or_an(item[0]) + " " + item + ".";
        get_item(game_state, item);
        move_character(game_state, "streets");
        return game_state;
    },

    "loot_items": function(game_state) {
        var item_one = functions.random_choice(["fancy red cloak", "fish",
                                                "many-colored mushroom" ]);
        var item_two = functions.random_choice(["bouquet of flowers", "frog",
                                                "white mushroom"]);
        game_state.message = "You grab some stuff and flee the market.";
        get_item(game_state, item_one);
        get_item(game_state, item_two);
        move_character(game_state,
            functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "loot_weapon": function(game_state) {
        var weapon = functions.random_choice(["dagger", "pitchfork",
                                              "cutlass", "hammer",
                                              "iron_hammer",
                                              "jeweled_cutlass"]);
        game_state.message = "You swipe " +
            functions.a_or_an(weapon[0]) + " " + weapon + ".";
        get_weapon(game_state, weapon);
        return game_state;
    },

    "lord_arthur_helps": function(game_state) {
        var messages = [
            "Lord Arthur says he knows of a town where you can find " +
            "a new wooden leg.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lord_arthur_tells_sail": function(game_state) {
        var messages = [
            "Lord Arthur tells you to " +
            functions.random_choice(["raise the sail faster",
                                     "scrub the deck"]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lord_arthur_tells_scrub": function(game_state) {
        var messages = [
            "Lord Arthur tells you to " +
            functions.random_choice(["scrub harder", "raise a sail"]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lord_bartholomew_chess": function(game_state) {
        var messages = [
            "Lord Bartholomew says " +
            functions.random_choice(["he likes chess and wouldn't mind " +
                           "playing with you",
                           "his children recently taught him to play",
                           "there's always time for a little fun in life",]) +
            ". He takes you to his chess parlor and sets up a board.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lord_carlos_chess": function(game_state) {
        var messages = [
            "Lord Carlos says " +
            functions.random_choice(["he doesn't play games",
                           "he has no time to waste on fools",
                           "he would rather kill you",]) +
            ", but when you " +
            functions.random_choice(["insinuate", "imply", "suggest"]) +
            " that he's afraid he'd lose, he has his servants set up a " +
            "chessboard.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lord_daniel_lectures_you": function(game_state) {
        var messages = [
            "Lord Daniel explains to you that your lack of mental " +
            "capacity would never allow you to understand his complex " +
            "policies.",
            "Lord Daniel gives you a lengthy lecture about how life isn't " +
            "fair.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lord_daniel_throws_you_out": function(game_state) {
        var messages = [
            "Lord Daniel has his guards carry out of the tower and dump " +
            "in a pile of manure.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "streets");
        return game_state;
    },

    "lose_ax": function(game_state) {
        game_state.message = "You get your ax stuck in a tree and can't " +
        "get it back out.";
        lose_item(game_state, "ax");
        return game_state;
    },

    "lose_coin_arthur": function(game_state) {
        var messages = [
            "Lord arthur takes the coin and tells you to forget you " +
            "ever had it.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        return game_state;
    },

    "lose_coin_bartholomew": function(game_state) {
        var gender_noun;
        if (game_state.character.sex === "female") {
            gender_noun = "girl";
        } else {
            gender_noun = "son";
        }
        var messages = [
            "\"Damn, " + gender_noun +". Where'd you find this?\" Lord " +
            "Bartholomew asks. " +
            "He doesn't wait for your answer. Instead he takes your coin, " +
            "gives you a small fortune, and sends you on your way.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        get_money(game_state, "small_fortune");
        move_character(game_state, "countryside");
        return game_state;
    },

    "lose_coin_carlos": function(game_state) {
        var messages = [
            "\"How did you get that?\" Lord Carlos wonders aloud. He " +
            "doesn't wait for a reply. He assassinates you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "lose_coin_daniel": function(game_state) {
        var messages = [
            "Lord Daniel has his guards seize you and take your coin. " +
            "They then defenestrate you. Fortunately, you land in a pile " +
            "hay.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        move_character(game_state, "streets");
        return game_state;
    },

    "lose_fight": function(game_state) {
        var foe = game_state.persons[game_state.character.person].name;
        var messages = [
            "You are slain by " + foe + ".",
            "You are overpowered by " + foe + ".",
            "You get killed by " + foe + ".",
            "You get defeated by " + foe + ".",
            "You misjudged the strength of " + foe + ".",
            "Your attack goes much worse for you than it does for " + foe + ".",
            "Your attack is lethal.",
            "Your attack is fatal.",
            "Your attack results in your death.",
            "Your martial efforts are fruitless.",
        ];
        if (functions.get_person(game_state).type !== "group") {
            messages = messages.concat([
                capitalize(foe) + " is too quick for you.",
                "You punch " + foe + " in the face, but " + foe +
                " escalates the situation by killing you.",
            ]);
        }
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "lose_leg": function(game_state) {
        game_state.message = "You lose a leg in the battle, but Lord " +
            "Arthur gives you a replacement.";
        game_state.character.has_lost_leg = true;
        get_item(game_state, "sailor peg");
        return game_state;
    },

    "lose_peg": function(game_state) {
        game_state.message = "While you're climbing up the top sails, your " +
            "sailor peg falls into the ocean.";
        lose_item(game_state, "sailor peg");
        return game_state;
    },

    "lunatics_jeer": function(game_state) {
        var messages = [
            "You try to flirt with the fat lady, but the other lunatics " +
            "make kissing noises and laugh at you.",
            "You try to flirt with the fat lady, but the other lunatics " +
            "also start hitting on her.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lunatics_laugh_at_you": function(game_state) {
        var messages = [
            "The other lunatics laugh at you for biding your time.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "lunatics_trip_you": function(game_state) {
        var messages = [
            "While you're pacing around, one of the other lunatics trips " +
            "you and yells, \"STOP PACING!\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    //m

    "make_it_rain": function(game_state) {
        var messages = [
            "You celebrate by wandering around town throwing all of your " +
            "money in the air.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.money = NONE;
        move_character(game_state, "streets");
        return game_state;
    },

    "make_out_with_dryad": function(game_state) {
        var messages = [
            "You find a " +
            functions.random_choice(["flirtatious", "lustful",
                                     "seductive"]) +
            " dryad. She " +
            functions.random_choice(["fools around", "makes out"]) +
            " with you for a while and then turns into a tree. " +
            "It takes hours to get all the twigs out of your " +
            "hair and scrape the sap off your clothes.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_item(game_state, "ball of sap");
        return game_state;
    },

    "married": function(game_state) {
        if (game_state.character.person === "olga") {
            var messages = [
                "A bleary-eyed priestess performs a wedding for you and " +
                "Olga in an alley behind the church. Olga asks the " +
                "priestess if she would like to come along for the " +
                "honeymoon, but the priestess declines.",
            ];
            if (game_state.persons.lord_arthur.alive === true) {
                messages.push(
                "Lord Arthur performs a wedding for you and Olga on the " +
                "deck of his pirate ship. By the time the ceremony is over, " +
                "the ship has sailed. You are now both members of the crew."
                );
            }
            if (game_state.persons.lord_bartholomew.alive === true) {
                messages.push(
                "Lord Bartholomew performs a wedding for you and Olga in " +
                "the countryside. 20,000 people attend your wedding, but " +
                "you suspect they just wanted to see Lord Bartholomew."
                );
            }
            if (game_state.persons.wizard.alive === true) {
                messages.push(
                "The wizard performs a wedding for you and Olga in the " +
                "market. He turns you both into sheep after the vows, but " +
                "it's much safer being sheep."
                );
            }
            game_state.message = functions.random_choice(messages);
            game_state.character.has_found_true_love = true;
            game_state.message += " You and Olga live happily ever after.";
        }

        if (game_state.character.person === "felicity") {
            var felicity_messages = [];
            if (game_state.persons.st_george.alive === true) {
                felicity_messages.push("St. George secretly performs your " +
                    "wedding.");
            } else {
                felicity_messages.push("A priestess secretly performs your " +
                    "wedding.");
            }
            game_state.message = functions.random_choice(felicity_messages);
            game_state.character.has_found_true_love = true;
            game_state.message += " You and Felicity live happily ever after.";
        }
        return game_state;
    },

    "meet_blind_bartender": function(game_state) {
        game_state.message =
            "The blind bartender grumbles as he passes you a drink.";
        game_state.character.person = "blind_bartender";
        return game_state;
    },

    "meet_dragon_blue": function(game_state) {
        game_state.message = "You come across a blue dragon. She invites " +
            "you to her lair for tea.";
        game_state.character.person = "dragon_blue";
        return game_state;
    },

    "meet_dragon_red": function(game_state) {
        game_state.message = "You walk into a red dragon's den. " +
            "The dragon eyes you suspiciously.";
        game_state.character.person = "dragon_red";
        return game_state;
    },

    "meet_eve": function(game_state) {
        game_state.message = "You manage to sneak into Lord Carlos' " +
            "daughter's bedroom. She is " +
            functions.random_choice(["brushing her hair",
                           "painting a picture of you getting assassinated",
                           "petting her cat", "polishing a pearl",
                           "putting on jewelry", "reading on her bed",
                           "sharpening a dagger",
                           "squinting at herself in the mirror",
            ]) + ".";
        game_state.character.person = "eve";
        return game_state;
    },

    "meet_lord_carlos": function(game_state) {
        game_state.message = "You manage to sneak into Lord Carlos' study. " +
                    "He is " + functions.random_choice(
                    ["writing a letter.", "reading a book.",
                     "looking straight at you.", "eating a heart.",
                     "training a weasel.", "pacing around."]),
        game_state.character.person = "lord_carlos";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "meet_mermaid": function(game_state) {
        var messages = [
            "You almost step on one.",
            "You find one putting seashells in her hair.",
            "There are mermaids everywhere, there's one next to you.",
            "After hours of climbing around on the rocks you find one.",
        ];
        var second_messages = [
            "She gives you some nasty tasting seaweed.",
            "She sings a song about Lord Arthur.",
            "She spits water in your face and laughs.",
            "She trips you with her fish tail.",
            "She's beautiful, but smells terrible.",
        ];
        game_state.message = functions.random_choice(messages) + " " +
            second_messages[functions.random_int(second_messages.length)];
        game_state.character.person = "mermaid";
        return game_state;
    },

    "meet_nymph_queen": function(game_state) {
        game_state.message = "You find the nymph queen " +
            functions.random_choice(["doing tai chi in a meadow",
                           "feeding a stag",
                           "levitating above a pond",
                           "tanning in a ray of sunshine",
                           "teaching a goblin to read",
                           "watering flowers in a meadow",
                          ]) + ". Her beauty is " +
            functions.random_choice(["dazzling", "exhilarating",
                                     "intoxicating",
                                     "only rivaled by her attractiveness",
                                     "overwhelming"]) + ".";
        game_state.character.person = "nymph_queen";
        return game_state;
    },

    "meet_olga": function(game_state) {
        if (game_state.persons.olga.name === "the pretty lady") {
            game_state.message =
            "During your investigation, you strike up a conversation with " +
            "a pretty lady.";
        } else {
            game_state.message =
            "During your investigation, you find yourself talking with Olga.";
        }
        game_state.character.person = "olga";
        return game_state;
    },

    "meet_peasant_lass": function(game_state) {
        game_state.message = "You find a peasant lass.";
        game_state.character.person = "peasant_lass";
        return game_state;
    },

    "meet_simple_peasant": function(game_state) {
        game_state.message = "You find a simple peasant man.";
        game_state.character.person = "simple_peasant";
        return game_state;
    },

    "meet_stray_dog": function(game_state) {
        game_state.message = "Unfortunately, you come across a stray dog. " +
            "It growls at you threateningly.";
        game_state.character.is_threatened = true;
        game_state.character.person = "dog";
        return game_state;
    },

    "meet_stray_donkey": function(game_state) {
        game_state.message = "While wandering the countryside, you find a " +
            "stray donkey... At least you think it's stray.";
        get_item(game_state, "donkey");
        return game_state;
    },

    "meet_witch": function(game_state) {
        game_state.message = "You find a witch deep in the woods.";
        game_state.character.person = "witch";
        return game_state;
    },

    "men_gawk_at_you": function(game_state) {
        var messages = [
            "The men also gawk at you since you have a tail.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "merchant_ship_nest": function(game_state) {
        game_state.message = "You spot a merchant ship. A naval battle " +
            "ensues.";
        return game_state;
    },

    "merchant_ship_sail": function(game_state) {
        game_state.message = "While you're raising a sail, you see a " +
            "merchant ship. Lord Arthur orders you to help raid it.";
        return game_state;
    },

    "merchant_ship_scrub": function(game_state) {
        game_state.message = "While you're scrubbing the deck, you hear " +
            "Lord Arthur calling all hands to raid an approaching " +
            "merchant ship.";
        return game_state;
    },

    "mermaid_dislikes_your_song": function(game_state) {
        game_state.message = "The mermaid is annoyed by your song and " +
            "pushes you into the ocean.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "mermaid_gives_you_fish": function(game_state) {
        game_state.message = "The mermaid doesn't know where land is, but " +
            "she gives you a fish to console you.";
        get_item(game_state, "fish");
        return game_state;
    },

    "mermaid_likes_your_dance": function(game_state) {
        game_state.message = "The mermaid laughs and claps her hands. " +
            "She is completely in awe of your legs.";
        functions.get_person(game_state).attracted += 1;
        return game_state;
    },

    "mermaid_refuses": function(game_state) {
        game_state.message = "\"You're on land, silly!\" she says.";
        return game_state;
    },

    "mermaid_strands_you": function(game_state) {
        game_state.message = "The mermaid takes you out to sea, but gets " +
            "bored and leaves you there.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "mermaid_takes_you_back_to_land": function(game_state) {
        game_state.message = "She does.";
        var destination = functions.random_choice(["countryside", "docks", "woods"]);
        move_character(game_state, destination);
        return game_state;
    },

    "miss_eve": function(game_state) {
        game_state.message = "She dodges your love potion and throws a " +
            "dagger at you. You don't dodge.";
        die(game_state);
        return game_state;
    },

    "miss_nymph_queen": function(game_state) {
        game_state.message = "Your lack of organization hinders your " +
            "efforts as you fumble around in your bag looking for your " +
            "love potion. Meanwhile, the nymph queen turns you into a shrub.";
        lose_all_items(game_state);
        game_state.character.is_shrub = true;
        return game_state;
    },

    "miss_olga": function(game_state) {
        game_state.message = "You buy her a drink and manage to slip your " +
            "love potion into it, but she isn't looking at you when she " +
            "takes a sip and falls madly in love the blind bartender.";
        game_state.persons.olga.attracted = 1;
        lose_item(game_state, "potion of love");
        game_state.character.person = null;
        return game_state;
    },

    "miss_priestess": function(game_state) {
        game_state.message = "You douse the priestess with your love " +
            "potion, but she doesn't fall in love with you. She tells you " +
            "she's already in love with God and turns you over to the " +
            "guards. You are thrown in prison with the other lunatics.";
        arrested(game_state);
        return game_state;
    },

    "mob_kills_you": function(game_state) {
        var messages = [
            "The mob doesn't stop to listen.",
            "The mob won't listen to reason.",
            "There's no reasoning with the mob.",
            "You get in a heated argument with the mob, which only makes it " +
            "angrier.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "mob_lets_you_off_the_hook": function(game_state) {
        var messages = [
            "You manage to convince the mob that this was all just a " +
            "misunderstanding.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_threatened = false;
        game_state.character.person = null;
        return game_state;
    },

    "monstrosity": function(game_state) {
        game_state.message =
            "You lick some spilled potion off the floor and start " +
            "growing at a monstrous rate. By the time you stop growing, " +
            "you have become a towering monstrosity.";
        game_state.character.is_monstrosity = true;
        return game_state;
    },

    "monstrosity_potion": function(game_state) {
        game_state.message =
            "You slurp down an odd tasting potion and start " +
            "growing at a monstrous rate. By the time you stop growing, " +
            "you have become a towering monstrosity.";
        game_state.character.is_monstrosity = true;
        return game_state;
    },

    "more_lunatics": function(game_state) {
        game_state.message = "The guards put fresh batch of lunatics in " +
            "your cell.";
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "mushroom_kills_you": function(game_state) {
        var messages = [
            "The mushroom tastes bittersweet.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "mushroom_makes_you_bigger": function(game_state) {
        var messages = [
            "You grow larger.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.strength += 1;
        lose_item(game_state, "white mushroom");
        return game_state;
    },

    "mushroom_makes_you_smaller": function(game_state) {
        var messages = [
            "You shrink to the size of a peanut. A weasel soon comes " +
            "and eats you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "mushroom_tastes_bad": function(game_state) {
        var messages = [
            "You find the mushroom distasteful.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "yellow mushroom");
        return game_state;
    },

    //n

    "newt_race": function(game_state) {
        var messages = [
            "You come across a crowd of peasants racing newts.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "nf3_lose_bartholomew": function(game_state) {
        var messages = [
            "It quickly becomes obvious that Lord Bartholomew has played " +
            "the game more than six times. You are soon defeated.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "nf3_lose_carlos": function(game_state) {
        var messages = [
            "Lord Carlos soon has you backed into a corner. Checkmate.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "nf3_win_bartholomew": function(game_state) {
        var messages = [
            "Lord Bartholomew talks about politics during the whole game, " +
            "but at least you manage to beat him.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "nf3_win_carlos": function(game_state) {
        var messages = [
            "You eventually checkmate Lord Carlos. He tosses the chessboard " +
            "on the floor and pulls out a dagger.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "no_cutlass": function(game_state) {
        var messages = [
            "You find it difficult to swashbuckle without a cutlass. You " +
            "are soon cut down.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "no_fish": function(game_state) {
        var messages = [
            "You don't catch any fish.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "no_flowers": function(game_state) {
        game_state.message = "You can't find any flowers. Only grass.";
        game_state.character.person = null;
        return game_state;
    },

    "no_flowers_frog": function(game_state) {
        var messages = [
            "You don't find any flowers, but you find a frog.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "frog");
        game_state.character.person = null;
        return game_state;
    },

    "no_mushroom_frog": function(game_state) {
        var messages = [
            "You don't find a single mushroom, but you find a single frog.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        get_item(game_state, "frog");
        return game_state;
    },

    "no_one_believes_you": function(game_state) {
        var messages = [
            "No one believes you.",
            "You can't convince anyone, not even yourself.",
            "You tell a servant, but she doesn't believe you.",
            "You tell a servant, but your cringeworthy acting isn't " +
            "fooling anyone.",
            "You tell a small child, but she says you're stupid and runs " +
            "away yelling, \"na-na na na-na.\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "no_one_cares": function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },

    "no_one_cares_about_your_leg": function(game_state) {
        game_state.message = "No one cares.";
        return game_state;
    },

    "no_one_wants_to_talk": function(game_state) {
        var messages = [
            "You ask around, but nobody has heard anything about " +
            "assassins.",
            "Nobody wants to talk to you.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "no_progress_swimming": function(game_state) {
        var messages = [
            "You keep your head up.",
            "You make very little progress.",
            "You manage to stay afloat.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "no_sea_turtle": function(game_state) {
        var messages = [
            "You can't find a sea turtle. Everywhere looks the same.",
            "You find a shark instead. It minds its own business.",
            "Your efforts to find a sea turtle are fruitless.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "no_true_pirate_says_that": function(game_state) {
        var messages = [
            "Lord Arthur tells you that no true pirate says that.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "lord_arthur";
        return game_state;
    },

    "no_way_out": function(game_state) {
        var messages = [
            "You fumble around in the darkness.",
            "You think you're going around in circles.",
            "You can't see anything, so you only manage to bump your head " +
            "on a rock.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "not_impressed": function(game_state) {
        var messages = [
            capitalize(functions.get_person(game_state).name) + " " +
            are_or_is(game_state) + " not impressed.",
            "You're the only one who's impressed.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "notice_pattern": function(game_state) {
        game_state.message =
            "You notice the warden carries the keys when he " +
            "inspects the cells. He inspects the cells with " +
            "an entourage of guards most weekends, but he " +
            "does it alone on holidays.";
        return game_state;
    },

    //o

    "offend_assassin": function(game_state) {
        var messages = [
            "The assassin is offended by your request. He assassinates you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "overhear_stuff": function(game_state) {
        var messages = [
            "you overhear some peasants excitedly talking about Lord " +
            "Bartholomew.",
            "you overhear a woman say a wizard turned her husband into a " +
            "frog.",
        ];
        game_state.message = "While you're drinking, " +
            functions.random_choice(messages);
        return game_state;
    },

    //p

    "pace": function(game_state) {
        var messages = [
            "You get a feel for the geography of your cell.",
            "You get dizzy from going around in circles.",
            "You get nowhere.",
            "You walk dozens of miles back and forth.",
            "Your pacing makes you skinnier.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "pace_and_die": function(game_state) {
        var messages = [
            "Your pacing drives the prison guards crazy. They kick you to " +
            "death to restore their sanity.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "pace_and_get_frog": function(game_state) {
        var messages = [
            "While you're pacing, you notice a frog hopping through you " +
            "cell.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "frog");
        return game_state;
    },

    "pace_and_get_mushroom": function(game_state) {
        var messages = [
            "While you're pacing, you notice a yellow mushroom growing " +
            "in the filth of your cell."
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "yellow mushroom");
        return game_state;
    },

    "panic_and_die": function(game_state) {
        var messages = [
            "Panicking doesn't save you.",
            "Panicking doesn't help.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "panic_and_escape": function(game_state) {
        game_state.message = "You don't remember what you did, but you " +
            "somehow managed to escape.";
        teleport(game_state);
        return game_state;
    },

    "peasant_woman_impressed": function(game_state) {
        game_state.message = "A peasant woman sees you thump your chest " +
            "and is impressed. Unfortunately, her husband is not. He " +
            "ushers her away.";
        return game_state;
    },

    "peasants_laugh_at_tail": function(game_state) {
        game_state.message = "During your travels, some peasants laugh at " +
            "your outlandish tail.";
        return game_state;
    },

    "peasants_laugh_at_you": function(game_state) {
        game_state.message = "Some peasants laugh at you for acting like a " +
            "gorilla.";
        return game_state;
    },

    "penguins": function(game_state) {
        game_state.message = "While you're playing in the snow, you notice " +
            "some penguins.";
        return game_state;
    },

    "penguins_dont_care": function(game_state) {
        game_state.message = "The penguins don't care.";
        return game_state;
    },

    "pick_mushroom": function(game_state) {
        var mushroom = functions.random_choice(["black mushroom",
                                                "many-colored mushroom",
                                                "white mushroom",
                                                "yellow mushroom",]);
        game_state.message = "You pick a " + mushroom + ".";
        game_state.character.person = null;
        get_item(game_state, mushroom);
        return game_state;
    },

    "pirates_ruin_song": function(game_state) {
        game_state.message = "You are joined in song by a gang of " +
            "drunken pirates. They spill rum on you and ruin your song.";
        game_state.character.person = "pirates";
        return game_state;
    },

    "play_dead_and_die": function(game_state) {
        var messages = [
            "Just to be sure, " + get_name(game_state) + " " +
            conjugate(game_state, "kill") + " you.",
            "You go the extra mile to make it realistic.",
            "You soon are.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "play_dead_works": function(game_state) {
        var messages = [
            capitalize(get_name(game_state)) + " " +
            conjugate(game_state, "decide") + " you are too pathetic to " +
            "kill.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "play_in_the_snow": function(game_state) {
        var messages = [
            "You make a snow woman.",
            "You make a snow angel.",
            "You make some yellow snow.",
            "You slide on your belly like a penguin.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "potion_eve": function(game_state) {
        var messages = [
            "Lord Carlos' daughter falls madly in love with you. " +
            "You flee to another country and get married. She is fun " +
            "to be around since she's magically enchanted to always be " +
            "nice to you. However, she is still horrible to everyone " +
            "else, so your life is always filled with adventure and " +
            "danger.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "potion_mermaid": function(game_state) {
        var messages = [
            "The mermaid falls madly in love with you. You run into the " +
            "mermaid problem, but she " +
            functions.random_choice(["has a mouth", "has breasts",
                           "is fun to be around"]) +
            " so you still live happily ever after.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "potion_nymph_queen": function(game_state) {
        var messages = [
            "The nymph queen falls madly in love with you. All of the " +
            "woodland creatures attend your wedding.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "potion_olga": function(game_state) {
        var messages = [
            "You buy her a drink and manage to slip the love potion into " +
            "it. However, when you propose a toast to St. George and you " +
            "both take a drink, you fall madly in love with her. She " +
            "laughs and tells you she switched the drinks. You then get " +
            "married, have a dozen kids, and she makes you do all the " +
            "chores. It's still a good life though. You both live happily " +
            "ever after.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "potion_priestess": function(game_state) {
        var messages = [
            "The priestess falls madly in love with you. Since she's " +
            "ordained to conduct weddings, she conducts your own wedding. " +
            "She is then excommunicated from the church for taking a " +
            "husband. The priestess responds by starting her own church, " +
            "which eventually leads to dozens of religious wars, however " +
            "you still both live happily ever after.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "priest_agrees": function(game_state) {
        var messages = [
            "The priest thinks for a moment and realizes you're right. " +
            "\"What a fool I've been,\" he says. \"I'll go and " +
            functions.random_choice(["become a peasant", "get a wife",]) + ".\"",
            "You get in a " +
            functions.random_choice(["heated", "horrible", "protracted",
                                     "spirited"]) +
            " argument with the priest, but you eventually both agree that " +
            "there are at least " +
            Math.ceil(2 + Math.random() * 19)  +
            " gods and that " +
            functions.random_choice(["Lord Bartholomew", "St. George",]) +
            " is a good man.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "priest_disagrees": function(game_state) {
        var messages = [
            "The priest says he has is doubts.",
            "The priest says he would know it when he sees it.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "priest_fat": function(game_state) {
        var messages = [
            "The priest runs off crying.",
            "\"Food is my only indulgence,\" he says proudly.",
            "He says, \"Only God can judge me.\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "priest_sexist_chosen_one": function(game_state) {
        var messages = [
            "The priest says the chosen one will most certainly be a man.",
            "The priest tells you God would never have a woman to be " +
            "the chosen one.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "priest_sexist_fat": function(game_state) {
        var messages = [
            "The priest says it's unbecoming for a woman in insult a man.",
            "The priest tells you it's not a woman's place to critisize " +
            "men.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "priest_takes_pity": function(game_state) {
        var messages = [
            "The priest finds your argument so pitiful that he gives you " +
            "a pittance and sends you on your way.",
        ];
        game_state.message = functions.random_choice(messages);
        get_money(game_state, "pittance");
        move_character(game_state, "streets");
        return game_state;
    },

    "priestess_takes_offense": function(game_state) {
        game_state.message = "A priestess finds your lyrics " +
        functions.random_choice(["blasphemous", "cliché", "crude",
                                 "idiotic", "lewd",
                                 "mildly offensive", "uncreative"]) +
        " and has you thrown out of the church.";
        move_character(game_state, "streets");
        return game_state;
    },

    "provoke_the_mob": function(game_state) {
        var messages = [
            "You try to distract the peasants by throwing stones at them " +
            "and insulting their mothers, but they burn the witch anyway. " +
            "Once they're done, they start charging at you with their " +
            "torches and pitchforks.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_threatened = true;
        game_state.character.person = "mob";
        return game_state;
    },

    "pull_beard_and_die": function(game_state) {
        var messages = [
            "It's real.",
            "\"Never do that again,\" the wizard says. He turns you into " +
            "a frog and stomps on you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state, "streets");
        return game_state;
    },

    "pull_beard_and_frog": function(game_state) {
        var messages = [
            "The wizard's beard is real, but he is so offended he turns " +
            "you into a frog.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_frog = true;
        return game_state;
    },

    "pull_beard_and_teleport": function(game_state) {
        var messages = [
            "The wizard lets out a yelp when you pull is beard. He " +
            "retaliates by conking you on the head with his staff.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "ocean");
        return game_state;
    },

    //q

    //r

    "raise_sail_and_get_to_land": function(game_state) {
        var destination = functions.random_choice(["arctic", "docks",
                                                   "mermaid_rock",
                                                   "woods",]);
        var messages = [
            "Your nautical efforts help the ship sail to " +
            game_state.places[destination].name + ".",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, destination);
        return game_state;
    },

    "random_death": function(game_state) {
        var messages = [
            "The potion tastes bittersweet.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "random_killed_by_wizard": function(game_state) {
        var messages = [
            "The potion has no effect, but when the wizard comes in to the " +
            "laboratory, you feel compelled to flirt with him stroke his " +
            "beard. He is revolted and incinerates you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "random_move": function(game_state) {
        game_state.message = "";
        move_character(game_state,
            functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "random_strength": function(game_state) {
        var messages = [
            "The potion gives you washboard abs.",
            "Your muscles swell with strength.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.strength += 3;
        return game_state;
    },

    "random_out_of_lab": function(game_state) {
        game_state.message = "The potion has no effect, but when the wizard " +
            "comes in to the laboratory, you feel compelled to flirt with him " +
            "stroke his beard. He casts a spell on you to make you see him " +
            "for the horrible old man that he is and shoos you out of his " +
            "laboratory.";
        move_character(game_state, "market");
        return game_state;
    },

    "read_and_die": function(game_state) {
        var messages = [
            "You open a cursed book.",
            "You read some arcane words aloud and accidentally cast a spell " +
            "that fills the room with flying swords.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "read_clover": function(game_state) {
        var messages = [
            "It's all Greek to you, but you find a " +
            "dried four-leaf clover between the pages.",
            "After reading a sentence or two, you realize you're out of " +
            "your depth, but you find a dried four-leaf clover between the " +
            "pages.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "four-leaf clover");
        return game_state;
    },

    "read_spell_book": function(game_state) {
        var messages = [
            "The first book you open appears to be the wizard's diary. " +
            "He appears to be obsessed with void dust, but doesn't know " +
            "how to get any.",

            "The first book you open appears to be the wizard's diary. " +
            "It's full of accounts about how he's too chicken to ask out " +
            "a woman he often sees in the market.",

            "The first book you open appears to be the wizard's diary. " +
            "It's mostly math proofs.",

            "The wizard's handwriting is terrible.",

            "You find the book arcane and boring.",

            "You learn a spell to set things on fire, unfortunately it " +
            "requires a focused mind.",

            "You learn that it takes a cat and a pearl " +
            "to brew a potion of tail growth.",

            "You learn that it takes a white mushroom and a deep-cave " +
            "newt to brew a potion of strength.",

            "You learn that it takes sap, flowers, and a many-colored " +
            "mushroom to brew a love potion.",

            "You learn that it takes sap, a black mushroom, and an apple " +
            "to brew a potion of transformation.",

            "You read about a magical red cloak that protects the wearer " +
            "from fire.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "rebuffed_by_fat_lady": function(game_state) {
        var messages = [
            "She ignores your hoots.",
            "She ignores your whistling.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "rebuffed_by_felicity": function(game_state) {
        var messages = [
            "Felicity asks if she looks fat in her new dress. " +
            "You say, \"Yes.\" She doesn't speak to you for several days.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "rebuffed_by_olga": function(game_state) {
        game_state.message = "Her eyes glaze over while you struggle make " +
            "yourself sound interesting.";
        return game_state;
    },

    "red_cloak": function(game_state) {
        var messages = [
            "While snooping around, you find a red cloak with fire " +
            "embroidery.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "fancy red cloak");
        return game_state;
    },

    "repay_and_die": function(game_state) {
        var messages = [
            "Lord Carlos informs you that your death is the only form of " +
            "repayment he will accept. Your debts are soon settled.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "repay_and_live": function(game_state) {
        var messages = [
            "He takes your money but says, \"No amount of money can make " +
            "up for what you've done.\"",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.money = "none";
        return game_state;
    },

    "rescued_by_lord_arthur": function(game_state) {
        game_state.message = "You are picked up by Lord Arthur's pirate " +
            "ship.";
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "rescued_by_lord_arthur_as_woman": function(game_state) {
        game_state.message = "You are picked up by Lord Arthur's pirate " +
            "ship. Since it's bad luck to have a woman on board a pirate " +
            "ship, he takes you back to land.";
        move_character(game_state, "docks");
        return game_state;
    },

    "ribbit": function(game_state) {
        game_state.message = "You ribbit.";
        return game_state;
    },

    "right_name": function(game_state) {
        game_state.message = "Lord Carlos' daughter smirks.";
        return game_state;
    },

    "riot": function(game_state) {
        game_state.message = "The play is put on by some Lord Daniel's " +
            "guards, the acting is terrible and the play portrays Lord " +
            "Bartholomew in a negative light. The audience starts a riot.";
        game_state.character.person = "guards";
        return game_state;
    },

    //s

    "save_cat": function(game_state) {
        game_state.message = "You manage to save the cat and run like the " +
            "Devil.";
        get_item(game_state, "cat");
        return game_state;
    },

    "save_witch": function(game_state) {
        game_state.message = "You manage to save the witch and escape into " +
            "the woods with her. The witch rewards you for saving her.";
        var item = functions.random_choice(["apple",
                                            "deep-cave newt",
                                            "four-leaf clover",
                                            "potion of love",]);
        get_item(game_state, item);
        move_character(game_state, "woods");
        game_state.character.person = "witch";
        return game_state;
    },

    "saved_by_inuits": function(game_state) {
        game_state.message = "Some Inuits save you from the cold and take " +
            "you back to land in a kayak. They also give you a fish.";
        get_item(game_state, "fish");
        move_character(game_state, "countryside");
        return game_state;
    },

    "saved_by_lord_bartholomew": function(game_state) {
        game_state.message =  "You manage to snatch the keys off the " +
            "warden, but he notices and has you thrown in a deep dark " +
            "dungeon. However, you end up in a cell with some of Lord " +
            "Bartholomew's men. They are soon rescued and so are you.";
        move_character(game_state, "lord_bartholomew_manor");
        return game_state;
    },

    "saved_by_mermaid": function(game_state) {
        game_state.message = "You sink into the depths and black out. " +
            "A mermaid is playing with your hair.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "saved_by_st_george": function(game_state) {
        game_state.message = "You throw yourself off a rooftop, but St. " +
            "George catches you and gives you a large fortune.",
        move_character(game_state, "streets");
        game_state.character.person = "st_george";
        get_money(game_state, "large_fortune");
        return game_state;
    },

    "saved_by_tail": function(game_state) {
        game_state.message = "While you're singing, you feel your tail hit " +
            "something behind you. You turn around just in time to see " +
            "an assassin.";
        game_state.character.is_threatened = true;
        game_state.character.person = "assassin";
        return game_state;
    },

    "saved_by_witch": function(game_state) {
        game_state.message = "A witch notices you and turns you back into " +
            "a human. You have failed to continue being a shrub.";
        game_state.character.is_shrub = false;
        game_state.character.person = "witch";
        return game_state;
    },

    "scrub_get_thrown_off_ship": function(game_state) {
        var messages = [
            "You dislocate your shoulder scrubbing and Lord Arthur has no " +
            "further use for you. He has you thrown off the ship.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "ocean");
        return game_state;
    },

    "scrub_the_deck": function(game_state) {
        var messages = [
            "You get sore scrubbing all day.",
            "You scrub the deck until it sparkles, then you scrub it some " +
            "more.",
            "While you're scrubbing, the pirates sing a " +
            functions.random_choice(["bawdy", "dirty", "indecent", "lewd",
                           "Rabelaisian", "raunchy", "ribald", "risqué",
                           "salacious", "smutty", "vulgar"]) +
            " pirate song.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "see_ship": function(game_state) {
        var messages = [
            "You see a ship in the distance. You are unable to reach it.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "see_wizard_with_penguins": function(game_state) {
        var messages = [
            "While you are waiting to freeze to death, you notice " +
            "the wizard dropping off a boatload of penguins.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "set_self_on_fire": function(game_state) {
        game_state.message = "You accidentally set yourself on fire and " +
        "promptly burn to a crisp.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "sing_about_stuff": function(game_state) {
        var messages = [
            "You sing a song about cats.",
            "You sing a song about dragons.",
            "You sing a song about God.",
            "You sing a song about Lord Arthur, captain of the pirates.",
            "You sing a song about Lord Bartholomew, leader of the peasants.",
            "You sing a song about Lord Carlos, kingpin of the assassins.",
            "You sing a song about Lord Daniel, leader of the guards.",
            "You sing a song about setting stuff on fire.",
            "You sing a song about St. George.",
            "You sing a song about your loneliness.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "sing_at_lord_carlos_manor": function(game_state) {
        var messages = [
            "This is no place for merry-making. You are soon assassinated.",
            "Your singing alerts Lord Carlos' men to your presence. " +
            "You are soon assassinated.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_dead = true;
        return game_state;
    },

    "sing_to_greeks": function(game_state) {
        game_state.message = "As you sing, a ship sails by. The captain is " +
            "tied to the mast. He is not impressed.";
        return game_state;
    },

    "sing_to_mermaid": function(game_state) {
        game_state.message = "The mermaid enjoys your singing and sings " +
            "with you.";
        functions.get_person(game_state).attracted += 1;
        return game_state;
    },

    "sing_to_olga": function(game_state) {
        var messages = [
            "Olga interrupts your song by kissing you.",
            "You sing a romantic ballad. Olga is impressed.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.olga.attracted += 1;
        return game_state;
    },

    "slip_and_die": function(game_state) {
        var messages = [
            "You fall into a deep ravine.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "sneak_and_die": function(game_state) {
        var messages = [
            "One of the assassins sees you tiptoeing around in " +
            "broad daylight. He assassinates you.",
            "Your smell gives you away. You are soon assassinated.",
            "You get the hiccups. You are soon assassinated.",
            "You are sneaking through the stables when a man too fat to " +
            "avoid bumps into you. You are soon assassinated.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "sneak_and_die_bartholomew": function(game_state) {
        var messages = [
            "An old man notices you skulking around and starts yelling " +
            "about an assassin. You look behind you, but the old " +
            "man stabs you in the front.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "sneak_and_die_not": function(game_state) {
        var messages = [
            "One of the assassin sees you tiptoeing around. " +
            "Since he doesn't recognize you as a woman, he escorts you " +
            "out of the manor rather than assassinating you.",
            "You get the hiccups. You are soon discovered and escorted to " +
            "the woods.",
            "You are sneaking through the stables when a man too fat to " +
            "avoid bumps into you. You are soon escorted off the premises.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "woods");
        return game_state;
    },

    "sneak_bartholomew": function(game_state) {
        var messages = [
            "While prowling in the shadows of a hallway, you stub your " +
            "pinkie toe.",
            "While lurking in a shrub, you catch sight of the fair Lady " +
            "Beatrice.",
        ];
        if (game_state.persons.lord_bartholomew.alive === true) {
            messages.push(
                "While hiding behind a door, you overhear Lord Bartholomew " +
                "and his men plotting insurrection."
            );
        }
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "sneak_eve_and_die": function(game_state) {
        var messages = [
            "You can't find Lord Carlos' daughter before Lord Carlos' " +
            "assassins find you.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        clover(game_state);
        return game_state;
    },

    "sneak_pitchfork": function(game_state) {
        var messages = [
            "While creeping around in the stables, you find a long " +
            "pitchfork.",
        ];
        get_weapon(game_state, "long_pitchfork");
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "snoop_around_and_die": function(game_state) {
        var messages = [
            "You accidentally knock over a bottle of roiling black vapor.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "someone_stops_you_burning": function(game_state) {
        var messages = [
            capitalize(functions.get_person(game_state).name) + " " +
            conjugate(game_state, "notice") +
            " you trying to burn " +
            functions.get_place(game_state).name +
            " to the ground and " +
            conjugate(game_state, "kill") + " you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "st_george_gives_you_apple": function(game_state) {
        game_state.character.has_begged_st_george = true;
        game_state.message = "St. George says he just gave away the last of " +
            "his money, but he gives you an apple in consolation.";
        get_item(game_state, "apple");
        return game_state;
    },

    "st_george_gives_you_money": function(game_state) {
        var money = functions.random_choice(["pittance", "small_fortune",
                                   "large_fortune"]);
        game_state.character.has_begged_st_george = true;
        game_state.message = "St. George gives you " +
            items.money_map[money].name + ".";
        get_money(game_state, money);
        return game_state;
    },

    "st_george_joins_you_in_prayer": function(game_state) {
        game_state.message = "St. George joins you in prayer.";
        game_state.character.person = "st_george";
        return game_state;
    },

    "st_george_kills_you": function(game_state) {
        var messages = [
            "St. George becomes annoyed with your lack of self-sufficiency " +
            "and smites you with his iron hammer.",
            "St. George becomes irritated with your begging and crushes " +
            "you with his iron hammer.",
            "St. George smites you with his saintly wrath for being " +
            "ungrateful.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "st_george_warns_you": function(game_state) {
        game_state.message = "St. George sees you flaunting your wealth " +
            "and warns you about the dangers of flamboyance.";
        game_state.character.person = "st_george";
        return game_state;
    },

    "start_tripping": function(game_state) {
        game_state.message = "You start feeling strange.";
        game_state.character.is_tripping = true;
        if (game_state.action ===
            "Chow down on your many-colored mushroom.") {
            game_state.character.items["many-colored mushroom"] -= 1;
        }
        return game_state;
    },

    "starve": function(game_state) {
        game_state.message =
            "You smash towns, flatten forests, level mountains, and " +
            "ultimately run out of food.";
        die(game_state);
        return game_state;
    },

    "starve_in_igloo": function(game_state) {
        game_state.message = "Your igloo protects you from the elements, " +
            "but not from your hunger.",
        die(game_state);
        return game_state;
    },

    "steal_and_die": function(game_state) {
        game_state.message = "The dragon is having none of it.";
        die(game_state);
        return game_state;
    },

    "steal_dragon_treasure": function(game_state) {
        var item = functions.random_choice([
            "bag of jewels", "fancy red cloak", "jeweled cutlass", "pearl",
            "pittance", "potion of love", "potion of transformation",
        ]);
        game_state.message = "You grab a " + item + " and make an epic " +
            "escape down the mountain.";
        if (item === "pittance") {
            get_money(game_state, item);
        } else if (item === "jeweled cutlass") {
            get_weapon(game_state, "jeweled_cutlass");
        } else {
            get_item(game_state, item);
        }
        move_character(game_state, "countryside");
        return game_state;
    },

    "steal_cutlass": function(game_state) {
        game_state.message = "Your plan goes swimmingly.";
        move_character(game_state, "ocean");
        get_weapon(game_state, "jeweled_cutlass");
        return game_state;
    },

    "steal_keys_and_die": function(game_state) {
        game_state.message = "When you try to take the warden's keys, the " +
            "guards notice and beat the life out of you.";
        die(game_state);
        return game_state;
    },

    "steal_keys_and_escape": function(game_state) {
        game_state.message = "It's surprisingly easy to steal the keys.";
        move_character(game_state, "streets");
        return game_state;
    },

    "stepped_on": function(game_state) {
        game_state.message = "While you look for flies, someone steps on " +
            "you.";
        die(game_state);
        return game_state;
    },

    "stupid_move_and_lose": function(game_state) {
        game_state.message = "You never recover from that first move. You " +
            "lose the game.";
        return game_state;
    },

    "stupid_move_and_die": function(game_state) {
        game_state.message = "After seeing you make this move, Lord Carlos " +
            "is no longer concerned that you might beat him. He " +
            "assassinates you.";
        die(game_state);
        return game_state;
    },

    "stupid_move_and_win": function(game_state) {
        game_state.message = "You somehow manage to recover from your first " +
            "move and win the game. Lord Carlos is not pleased.";
        return game_state;
    },

    "suck_up_to_lord_arthur_cutlass": function(game_state) {
        game_state.message = "Lord Arthur rewards you for your subservience.";
        get_weapon(game_state, "cutlass");
        return game_state;
    },

    "suck_up_to_lord_arthur_ocean": function(game_state) {
        game_state.message = "Lord Arthur sends you on a special mission to " +
            "to find sea turtles.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "suck_up_to_lord_bartholomew": function(game_state) {
        game_state.message = "Lord Bartholomew tells you that you need to " +
            "take more pride in yourself.";
        return game_state;
    },

    "suck_up_to_lord_bartholomew_countryside": function(game_state) {
        game_state.message = "Lord Bartholomew wishes you well and sends " +
            "you on your way.";
        move_character(game_state, "countryside");
        return game_state;
    },

    "suck_up_to_lord_bartholomew_pitchfork": function(game_state) {
        game_state.message = "Lord Bartholomew takes a liking to you " +
            "and gives you a weapon to defend yourself against Lord " +
            "Daniel's men.";
        get_weapon(game_state, "long_pitchfork");
        return game_state;
    },

    "suck_up_to_lord_carlos_and_die": function(game_state) {
        game_state.message = "Lord Carlos is not flattered.";
        die(game_state);
        return game_state;
    },

    "suck_up_to_lord_carlos_woods": function(game_state) {
        game_state.message = "Lord Carlos is disgusted by your subservience " +
            "and has his men throw you out a window.";
        move_character(game_state, "woods");
        return game_state;
    },

    "suck_up_to_lord_daniel": function(game_state) {
        game_state.message = "Lord Daniel is annoyed that you're wasting " +
            "his time.";
        return game_state;
    },

    "suck_up_to_lord_daniel_hammer": function(game_state) {
        game_state.message = "Lord Daniel takes a liking to you and gives " +
            "you a job as a guard. He tells you to arrest any lunatics you " +
            "find, but his definition of \"lunatic\" is a little unclear.";
        get_weapon(game_state, "hammer");
        move_character(game_state, "streets");
        return game_state;
    },

    "suck_up_to_lord_daniel_streets": function(game_state) {
        game_state.message = "Lord Daniel sees through your brown-nosing " +
            "and sends you away.";
        move_character(game_state, "streets");
        return game_state;
    },

    "sunbathe_with_mermaid": function(game_state) {
        game_state.message = "When you open your eyes, you see a mermaid " +
            "sunbathing next to you.";
        game_state.character.person = "mermaid";
        return game_state;
    },

    "sunburnt": function(game_state) {
        game_state.message = "You get sunburnt.";
        return game_state;
    },

    "swashbuckle_and_die": function(game_state) {
        game_state.message = "A cabin boy stabs you in the back during " +
            "the fight.",
        die(game_state);
        return game_state;
    },

    "swim_a_jig": function(game_state) {
        game_state.message = "You swim a jig.";
        return game_state;
    },

    "swim_and_die": function(game_state) {
        var messages = [
            "You die of dehydration.",
            "You become exhausted and sink into the depths.",
            "You're in way over your head.",
            "You get eaten by a swarm of sharks.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "swim_to_arctic": function(game_state) {
        game_state.message = "You notice the water getting colder and soon " +
            "find ice.";
        move_character(game_state, "arctic");
        return game_state;
    },

    "swim_to_the_end": function(game_state) {
        game_state.message = "You swim to the edge of the world and fall off.";
        die(game_state);
        return game_state;
    },

    "swim_to_woods": function(game_state) {
        game_state.message = "At long last, you see land and swim to shore.";
        move_character(game_state, "woods");
        return game_state;
    },

    "swing_into_captain": function(game_state) {
        game_state.message = "You crash into the captain of the merchant " +
            "ship and knock him into the ocean. Lord Arthur rewards you " +
            "for your bravery after the battle.";
        get_item(game_state, "fish");
        return game_state;
    },

    "swing_into_ocean": function(game_state) {
        game_state.message = "You fall into the ocean and no one bothers " +
            "to save you after the battle.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "swing_on_rope_and_die": function(game_state) {
        game_state.message = "You swing across to the other ship only to " +
            "impale yourself on a merchant's sword.";
        die(game_state);
        return game_state;
    },

    //t

    "tail_eve": function(game_state) {
        game_state.message = "Lord Carlos' daughter says your tail is gaudy.";
        return game_state;
    },

    "tail_helps_you_swim": function(game_state) {
        game_state.message = "Your tail helps you swim back to land.";
        move_character(game_state, "countryside");
        return game_state;
    },

    "tail_mermaid": function(game_state) {
        game_state.message = "The mermaid says she likes your tail.";
        game_state.persons.mermaid.attracted += 1;
        return game_state;
    },

    "tail_olga": function(game_state) {
        game_state.message = "She says your tail is freaky and she likes " +
            "a lot.";
        game_state.persons.olga.attracted += 1;
        return game_state;
    },

    "tavern_song": function(game_state) {
        var messages = [
            "The sweet sound of your voice livens up the room.",
            "You get everyone in the tavern to sing along with you.",
            "Your voice gets lost in the noise of the room.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "tavern_song_and_meet_drunk": function(game_state) {
        var messages = [
            "A drunk man tells you you're singing the lyrics wrong.",
            "A drunk man sings along with you and ruins your song.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "drunk";
        return game_state;
    },

    "tavern_song_and_meet_olga": function(game_state) {
        var messages = [
            "A pretty lady tells you that you have a beautiful voice.",
            "You singing attracts the attention of a pretty lady.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "olga";
        return game_state;
    },

    "think": function(game_state) {
        var messages = [
            "You spend some time reevaluating your life " +
            "and conclude that you need to stay the course.",
            "You think God is probably listening to your thoughts.",
            "You think up some lyrics for a song.",
            "You think you might be the chosen one.",
            "Your contemplations lead to dark places.",
            "Your thinking ensures your existence.",
        ];
        if (game_state.character.sex === "male") {
            messages.push("Since you're a man, you think about sex.");
            messages.push("You think you would make a good husband.");
        } else {
            messages.push("You think you would make a good wife.");
        }
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "think_about_lord_arthur": function(game_state) {
        game_state.message = "You think it would be a bad idea to join " +
            "Lord Arthur's crew. He gives no choice.";
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "think_about_lord_bartholomew": function(game_state) {
        game_state.message = "You think about Lord Bartholomew.";
        return game_state;
    },

    "think_about_olga": function(game_state) {
        if (game_state.persons.olga.name === "the pretty lady") {
            game_state.message = "You think about a pretty lady you saw at " +
                "the tavern.";
        } else {
            game_state.message = "You think about Olga and feel lonely.";
        }
        return game_state;
    },

    "think_ax": function(game_state) {
        game_state.message = "While you're thinking, a guard hands you an " +
            "ax and tells you to chop some firewood for the cooks.";
        get_item(game_state, "ax");
        return game_state;
    },

    "think_bad_smell": function(game_state) {
        game_state.message = "You think the bad smell might be coming from " +
            "you.";
        return game_state;
    },

    "think_bats": function(game_state) {
        game_state.message = "You think you hear bats, but you also think " +
            "you might be crazy.";
        return game_state;
    },

    "think_cold": function(game_state) {
        game_state.message = "You can't think about much besides how cold " +
            "you are.";
        return game_state;
    },

    "think_darkness": function(game_state) {
        game_state.message = "You think about the darkness that is crushing " +
            "in on you from all sides.";
        return game_state;
    },

    "think_discouraged": function(game_state) {
        var messages = [
            "After thinking for a while, you feel like the examined life " +
            "isn't worth living either.",
            "All you can think is \"Think. Think. Think.\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "think_death": function(game_state) {
        game_state.message = "You think about death.";
        return game_state;
    },

    "think_elaborate_scheme": function(game_state) {
        game_state.message = "You concoct an elaborate scheme.";
        return game_state;
    },

    "think_fire": function(game_state) {
        game_state.message = "You think about fire.";
        return game_state;
    },

    "think_four_ideas": function(game_state) {
        game_state.message = "You come up with four brilliant ideas.";
        return game_state;
    },

    "think_guard_men": function(game_state) {
        game_state.message = "You wonder if any guards would go for a " +
            "woman like you.";
        return game_state;
    },

    "think_ice": function(game_state) {
        game_state.message = "You think about ice.";
        return game_state;
    },

    "think_jump": function(game_state) {
        game_state.message = "You think you can survive the jump from the " +
            "top of the tower.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "think_meaning_of_life": function(game_state) {
        game_state.message = "You ponder the meaning of life and " +
            "feel smug for being so philosophical.";
        return game_state;
    },

    "think_ocean_is_big": function(game_state) {
        game_state.message = "You think the ocean is really big.";
        return game_state;
    },

    "think_of_getting_stabbed": function(game_state) {
        game_state.message = "You think about how painful it would be to " +
            "get stabbed. You soon find out.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "think_peasant_women": function(game_state) {
        game_state.message = "You wonder if any peasant women would go for " +
            "a man like you.";
        return game_state;
    },

    "think_pirates_laugh": function(game_state) {
        game_state.message = "Some pirates laugh at you for thinking.";
        return game_state;
    },

    "think_should_not_lick_ground": function(game_state) {
        game_state.message = "You think you probably shouldn't have licked " +
            "the " + get_ground(game_state) + ".";
        return game_state;
    },

    "think_suffocation": function(game_state) {
        game_state.message = "You think about suffocation.";
        return game_state;
    },

    "think_void": function(game_state) {
        var messages = [
            "You think about nothingness.",
            "You wonder what kind of god created God.",
            "You think about a person thinking about a person thinking " +
            "about a person thinking about a person thinking about...",
            "You wonder if there is such a thing as free will or if you're " +
            "just an observer in a pre-scripted universe.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "think_you_shouldnt_be_here": function(game_state) {
        game_state.message = "You think you probably shouldn't be here.";
        return game_state;
    },

    "throw_cat_and_keep_cat": function(game_state) {
        game_state.message = "Your cat goes ballistic and the dog runs " +
            "away in terror.";
        game_state.character.is_threatened = false;
        game_state.character.person = null;
        return game_state;
    },

    "thrown_off_ship": function(game_state) {
        game_state.message = "Lord Arthur cringes and has you thrown off " +
            "the ship.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "thump_self_and_die": function(game_state) {
        game_state.message = "You thump yourself a bit too hard.";
        die(game_state);
        return game_state;
    },

    "tip_cow_and_die": function(game_state) {
        game_state.message = "You pull a cow on top of yourself and it " +
            "crushes you.",
        game_state.character.person = null;
        clover(game_state);
        return game_state;
    },

    "tip_cow_and_lynch_mob": function(game_state) {
        game_state.message = "Some peasants mistake you for a cow thief and " +
            "form a lynch mob.",
        game_state.character.person = "mob";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "too_poor_to_hire_assassin": function(game_state) {
        var messages = [
            "It turns out assassins are a bit out of your price range.",
            "The market value of assassins is higher than you anticipated.",
            "You're too poor to hire an assassin.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "trade_coin_for_sword_of_great_good": function(game_state) {
        var messages = [
            "The blue dragon says she hopes you use the blade well.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        get_weapon(game_state, "sword_of_great_good");
        return game_state;
    },

    "trade_coin_for_potion_of_love": function(game_state) {
        var messages = [
            "The dragon is happy to make the trade with you, but she warns " +
            "you that a potion of love has many unethical uses.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        get_item(game_state, "potion of love");
        return game_state;
    },

    "trade_coin_for_large_fortune": function(game_state) {
        var messages = [
            "The blue dragon gives you a chest of gold and " +
            "flies you down mountain so you don't have to make the long " +
            "hike with so much weight on your back.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        get_money(game_state, "large_fortune");
        return game_state;
    },

    "trade_coin_for_lord_carlos": function(game_state) {
        var messages = [
            "The blue dragon flies you to the woods and burns Lord Carlos' " +
            "manor to a crisp. She thanks you for the trade and flies away.",
        ];
        game_state.persons.lord_carlos.alive = false;
        game_state.places.lord_carlos_manor.burnable = false;
        game_state.places.lord_carlos_manor.name =
            "the smoldering remains of Lord Carlos' manor";
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "shiny foreign coin");
        move_character(game_state, "woods");
        return game_state;
    },

    "train_and_die": function(game_state) {
        var messages = [
            "You accidentally put your helmet on backwards and trip over a " +
            "balcony railing.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "train_and_win": function(game_state) {
        var messages = [
            "You beat the captain of the guards at wooden swordplay. " +
            "\"Not bad for a " + functions.random_choice(["lunatic", "peasant",
                                                "simpleton"]) +
            ",\" he says.",
            "You run like the Devil and outrun the other guards during " +
            "running practice.",
            "You hit the bulls eye during archery practice.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.message += " Training has made you stronger.";
        game_state.character.person = "guards";
        game_state.character.strength += 1;
        return game_state;
    },

    "train_stronger": function(game_state) {
        var messages = [
            "You are badly beaten at wooden swordplay, but you grow " +
            "stronger.",
            "You miss many marks practicing archery, but failure is the " +
            "road to success. You grow stronger.",
            "The guards leave you in the dust during running practice, but " +
            "you grow stronger.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "guards";
        game_state.character.strength += 1;
        return game_state;
    },

    "train_thrown_out": function(game_state) {
        game_state.message = "The guards throw you out for not filling out " +
        "the proper paperwork.";
        move_character(game_state, "streets");
        return game_state;
    },

    "transform": function(game_state) {
        var messages = [];
        if (game_state.character.sex === "female") {
            messages.push("You transform back into a man.");
            messages.push("You turn back into a man.");
            messages.push("You're back to being a man.");
            game_state.character.sex = "male";
        } else {
            messages.push("You are now a woman.");
            messages.push("You transform into a woman.");
            messages.push("You turn into a lady version of yourself.");
            game_state.character.sex = "female";
        }
        //St. George will not recognize you once you change sexes
        game_state.character.has_begged_st_george = false;
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "potion of transformation");
        return game_state;
    },

    "trash_ax": function(game_state) {
        var messages = [
            "You find an old ax.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "ax");
        return game_state;
    },

    "trash_cat": function(game_state) {
        var messages = [
            "You find a somewhat agreeable cat.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "cat");
        return game_state;
    },

    "trash_die": function(game_state) {
        var messages = [
            "You attempt to look through the trash, but an assassin takes " +
            "it out.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "trash_nothing": function(game_state) {
        var messages = [
            "You don't find anything useful in the trash.",
            "You find a bad smell.",
            "You find a mirror in the trash. You see nothing of value.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "trash_the_place": function(game_state) {
        trash(game_state);
        if (functions.random_int(3) === 0) {
            game_state.message += " You find a red cloak in the wreckage.";
            get_item(game_state, "fancy red cloak");
        }
        return game_state;
    },

    "trash_the_market_and_die": function(game_state) {
        var messages = [
            "You get trampled by a spooked horse.",
            "While you're trashing the place, a bunch of rioting peasants " +
            "overturn a cart on top of you.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "trash_the_place_and_die": function(game_state) {
        var messages = [
            "When you snap a fancy staff in half, you inadvertently set " +
            "a dark spirit free.",
        ];
        if (game_state.persons.wizard.alive === true &&
            game_state.character.items["fancy red cloak"] < 1) {
            messages.push("While you're wrecking stuff, the wizard runs " +
                "into the laboratory and incinerates you.");
        }
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "trip_over_a_cat": function(game_state) {
        game_state.message = "You trip over a cat and break your neck.";
        game_state.character.person = null;
        clover(game_state);
        return game_state;
    },

    "turn_board_around": function(game_state) {
        var messages = [
            "Lord Bartholomew beats you anyway.",
            "Lord Bartholomew laughs and says, \"Well, it looks like you " +
            "got me.\"",
            "Lord Bartholomew laughs and says, \"I'll have to try that one " +
            "on my kids.\"",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "turn_to_woman": function(game_state) {
        var messages = [
            "The wizard says you are a " +
            functions.random_choice(["tedious", "tiresome",]) +
            " man. He solves the problem by turning you into a woman.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.sex = "female";
        return game_state;
    },

    //u

    //v

    "void_dance": function(game_state) {
        var messages = [
            "Dancing by yourself in the void makes you feel lonely.",
            "It's hard to dance with nothing to stand on.",
            "You dance across the stars.",
            "You flail around in the void.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "void_float": function(game_state) {
        var messages = [
            "You're not sure you're getting anywhere.",
            "You bump into the edge of the universe.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "void_float_dust": function(game_state) {
        var messages = [
            "As you float through the void, your gravity attracts rings of " +
            "void dust.",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, "handful of void dust");
        return game_state;
    },

    "void_killed_by_anomaly": function(game_state) {
        var messages = [
            "You get cought in a void storm.",
            "You get pulled into an anomaly.",
        ];
        game_state.message = functions.random_choice(messages);
        clover(game_state);
        return game_state;
    },

    "void_prayer": function(game_state) {
        var messages = [
            "You pray into the void.",
            "You wonder if you're too far way from God for him to hear you.",
            "Your prayer echoes through the void.",
            "Your prayers for void dust go unanswered.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "void_song": function(game_state) {
        var messages = [
            "You sing about how lost you are.",
            "Your song echoes across the universe.",
            "Your song scatters some void dust.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "void_sleep": function(game_state) {
        var messages = [
            "You dream of void dust.",
            "You have dreamless sleep.",
            "When you wake up, you have no idea how long you slept.",
            "The secrets of the universe are revealed to you in your " +
            "dreams. Unfortunately, you forget them when you wake up.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "void_strength": function(game_state) {
        var messages = [
            "The energy of the void gives you superhuman strength.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.strength += 3;
        return game_state;
    },

    "volcano_die": function(game_state) {
        var messages = [
            "A red dragon flies out of the volcano and roasts you with a " +
            "jet of flame.",
            "While you're climbing, you get incinerated by a cloud of hot " +
            "ash.",
            "You fall into a fissure.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "volcano_exercise": function(game_state) {
        var messages = [
            "You can't find your way up the volcano, but the exercise " +
            "helps you grow stronger.",
            "You find some unscalable cliffs near the top of the volcano, " +
            "but the exercise helps you grow stronger.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.strength += 1;
        return game_state;
    },

    "volcano_nothing": function(game_state) {
        var messages = [
            "You can't find your way to the top of the volcano.",
            "You make it to the top of the volcano, but your view is " +
            "blocked out by smoke, so you get bored and start climbing " +
            "back down.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    //w

    "wait_and_die": function(game_state) {
        var messages = [
            "You wait until the assassins come and take you out.",
            "You wait long enough to get surrounded by Lord Carlos' " +
            "assassins.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "wait_and_meet_eve": function(game_state) {
        var messages = [
            "You quickly get bored of waiting and wander into the Lord " +
            "Carlos' daughter's bedroom, where you find her sharpening a " +
            "dagger. She looks up and says, \"You again?\"",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "eve";
        return game_state;
    },

    "wait_and_meet_lord_carlos": function(game_state) {
        var messages = [
            "A few minutes later you see Lord Carlos striding toward you. " +
            "\"You have a lot of " +
            functions.random_choice(["audacity", "balls", "chutzpah", "gall",
                           "nerve",]) +
            " to come back here,\" he says.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_threatened = true;
        game_state.character.person = "lord_carlos";
        return game_state;
    },

    "wait_here_please": function(game_state) {
        var messages = [
            "You ask a servant about assassins. She asks you to wait where " +
            "you are.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "waiting_for_seal": function(game_state) {
        var messages = [
            "You manage to club a seal, but it swims away.",
            "While waiting for a seal, you get very cold.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wake_in_world": function(game_state) {
        game_state.message = "You wake up back on Earth.";
        teleport(game_state);
        return game_state;
    },

    "wake_up": function(game_state) {
        var messages = [
            "You dream of fire.",
            "You have a nightmare about Lord Carlos.",
            "You have a nightmare about weasels.",
            "You have a wonderful dream that you are in bed with Lord " +
            "Carlos' daughter.",
            "You wake up after a long sleep and are unsure what day of the " +
            "week it is.",
            "You wake up well-rested some hours later.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "wake_up_assassinated": function(game_state) {
        game_state.message =
            "You are rudely awakened by an assassin's dagger.";
        game_state.character.person = null;
        clover(game_state);
        return game_state;
    },

    "wake_up_dead": function(game_state) {
        game_state.message = "You wake up dead.";
        game_state.character.person = null;
        clover(game_state);
        return game_state;
    },

    "wake_up_drown": function(game_state) {
        game_state.message = "You drown in your sleep.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wake_up_in_dungeon": function(game_state) {
        game_state.message = "You wake up in Lord Carlos' dungeon " +
            "and eventually die there.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wake_up_in_prison": function(game_state) {
        game_state.message = "You are rousted by some guards who toss you " +
            "in prison with the other lunatics.";
        move_character(game_state, "prison");
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "wake_up_richer": function(game_state) {
        game_state.message = "You wake with a few coins on your cloak.";
        game_state.character.person = null;
        get_money(game_state, "pittance");
        return game_state;
    },

    "wake_up_robbed": function(game_state) {
        game_state.message = "You wake up robbed of all your worldly " +
            "possessions.";
        game_state.character.person = null;
        lose_all_items(game_state);
        return game_state;
    },

    "wake_up_somewhere_else": function(game_state) {
        game_state.message = "You wake up a few hours later.";
        move_character(game_state,
                       functions.get_random_adjacent_destination(game_state));
        game_state.character.person = null;
        return game_state;
    },

    "wake_up_weasel": function(game_state) {
        game_state.message = "You wake up just in time to see an assassin " +
            "slip a weasel through the bars of your cell. " +
            "The weasel kills you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wake_up_with_cat": function(game_state) {
        game_state.message = "You are pleasantly awakened by a cat rubbing " +
            "up against you.";
        game_state.character.person = null;
        get_item(game_state, "cat");
        return game_state;
    },

    "walk_across_board": function(game_state) {
        game_state.message = "You walk across one of the boards on the deck.";
        return game_state;
    },

    "walk_into_ocean": function(game_state) {
        game_state.message = ".";
        move_character(game_state, "ocean");
        return game_state;
    },

    "wander_the_countryside": function(game_state) {
        var messages = [
            "A black cat crosses your path and disappears into the fields.",
            "A rainstorm sweeps over the land and leaves you soaking wet.",
            "A traveling fortune teller says you will meet a fiery end.",
            "All of the peasants you meet talk about Lord Bartholomew like " +
            "he's God's gift to the world.",
            "Not all those who wander are lost, but you are.",
            "You find a fork in the road and take it.",
            "You find a mob of peasants burning Lord Daniel in effigy.",
            "While you're wandering the countryside, some sheep look at you " +
            "funny.",
        ];
        if (game_state.character.sex === "female") {
            messages.push("You see a beautiful peasant man, unfortunately " +
                "he also has a beautiful wife."
            );
        } else {
            messages.push("You see a beautiful peasant woman, unfortunately " +
                "she also has a beautiful husband."
            );
        }
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "wander_while_singing": function(game_state) {
        game_state.message = "You wander aimlessly as you work your way " +
            "through an epic ballad.";
        move_character(game_state,
                       functions.get_random_adjacent_destination(game_state));
        return game_state;
    },

    "war_merchant_annoyed": function(game_state) {
        var messages = [
            "Since you can't afford this weapon, the war merchant says he " +
            "can't afford to waste his time with you. He has you forcibly " +
            "removed from his presence.",

            "The war merchant says he has no time for peasants who can't " +
            "afford his wares. He has some men carry you out of the market.",

            "When the war merchant finds out you can't afford this " +
            "weapon, he becomes annoyed and has some thugs throw you " +
            "out of the market.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "streets");
        return game_state;
    },

    "watch_duty": function(game_state) {
        var messages = [
            "you don't see anything interesting.",
            "you see a \"birdle,\" a bird standing on a turtle.",
            "you see ocean in every direction.",
            "you see some storm clouds.",
        ];
        game_state.message = "During your watch duty, " +
            functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "watch_play": function(game_state) {
        var messages = [
            "The play satirizes Lord Daniel's lunacy policy. The actors " +
            "are arrested at the end of the play.",
            "The play portrays Lord Bartholomew in a glorious light. The " +
            "audience is very pleased and claps for so long that it becomes " +
            "awkward.",
            "The wedding at the end of the play makes you feel lonely.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "wealthy_people_sneer": function(game_state) {
        game_state.message = "Some truly wealthy people see you and sneer.";
        return game_state;
    },

    "what_a_shame": function(game_state) {
        game_state.message = "\"What a shame,\" an assassins says as he " +
            "steps into the room. He shoots you with a crossbow and leaves " +
            "you to die in Felicity's arms.";
        die(game_state);
        return game_state;
    },

    "witch_burning": function(game_state) {
        var messages = [
            "You find a mob of peasants about to perform a witch burning.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = null;
        return game_state;
    },

    "witch_cat_refuse": function(game_state) {
        var messages = [
            "The witch says she already has too many cats.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "witch_cat_nothing": function(game_state) {
        var messages = [
            "The witch takes your cat and says it will give her an " +
            "opportunity to find more ways to skin cats.",
            "The witch takes your cat and says it will taste great in a pie.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "cat");
        return game_state;
    },

    "witch_cat_trade": function(game_state) {
        var ingredient = functions.random_choice(["ball of sap",
                                                  "deep-cave newt",
                                                  "pearl",]);
        var messages = [
            "The witch gives you a " + ingredient + " in exchange.",
            "The witch smiles a terrible smile and gives you a " +
            ingredient + ".",
            "The witch thanks you and gives you a " + ingredient + ".",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "cat");
        get_item(game_state, ingredient);
        return game_state;
    },

    "witch_makes_potion_love": function(game_state) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "ball of sap");
        lose_item(game_state, "bouquet of flowers");
        lose_item(game_state, "many-colored mushroom");
        get_item(game_state, "potion of love");
        return game_state;
    },

    "witch_makes_potion_strength": function(game_state) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "deep-cave newt");
        lose_item(game_state, "white mushroom");
        get_item(game_state, "potion of strength");
        return game_state;
    },

    "witch_makes_potion_tail_growth": function(game_state) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "cat");
        lose_item(game_state, "pearl");
        get_item(game_state, "potion of tail growth");
        return game_state;
    },

    "witch_makes_potion_transformation": function(game_state) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game_state.message = functions.random_choice(messages);
        lose_item(game_state, "apple");
        lose_item(game_state, "ball of sap");
        lose_item(game_state, "black mushroom");
        get_item(game_state, "potion of transformation");
        return game_state;
    },

    "witch_says_no": function(game_state) {
        var messages = [
            "The witch says she doesn't owe you any favors.",
            "The witch says she's feeling lazy.",
            "The witch says she's more the hexing kind of witch and not " +
            "the brewing kind of witch.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wizard_compensates_you": function(game_state) {
        var messages = [
            "The wizard compensates you.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.items["yellow mushroom"] -= 1;
        get_item(game_state, functions.random_choice(["potion of love",
                                            "potion of tail growth",
                                            "four-leaf clover"]));
        return game_state;
    },

    "wizard_complains": function(game_state) {
        game_state.message = "The wizard complains that you are singing " +
            "off-key. He turns you into a frog and stomps on you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wizard_dies": function(game_state) {
        var messages = [
            "The wizard chokes on the mushroom and dies.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.items["yellow mushroom"] -= 1;
        game_state.character.person = null;
        game_state.persons.wizard.alive = false;
        return game_state;
    },

    "wizard_eats_mushroom": function(game_state) {
        var messages = [
            "The wizard chews the mushroom with this mouth open.",
            "The wizard swallows the mushroom whole.",
            "The wizard eats the mushroom and belches.",
            "The wizard chows down on the mushroom, then complains he has " +
            "a stomach ache.",
        ];
        game_state.character.items["yellow mushroom"] -= 1;
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wizard_gives_you_advice": function(game_state) {
        var messages = [
            "The wizard advises you to collect potion ingredients.",
            "The wizard advises you to find a dragon and take it's treasure.",
            "The wizard advises you to follow your passion.",
            "The wizard advises you to kill all of the lords and bring " +
            "about a Utopian anarchy.",
            "The wizard advises you to stay away from him.",
            "The wizard says he's proved that P = NP, so you'd better " +
            "be careful.",
            "The wizard says St. George is a chump who will give you money.",
            "The wizard says you should go find him some void dust.",
            "The wizard says you should learn Esperanto.",
        ];
        if (game_state.character.sex === "female") {
            messages.push("The wizard advises you to find a husband before " +
                "you get old and wrinkly like him.");
        }  else {
            messages.push("The wizard advises you to find a woman before " +
                "you get old and weird like him.");
        }
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wizard_gives_you_item": function(game_state) {
        var wizard_item = functions.random_choice(["ball of sap", "cat",
                                                   "frog",
                                                   "potion of tail growth",
                                                   "potion of transformation",
                                                  ]);
        var messages = [
            "The wizard gives you a " + wizard_item + " and tells you " +
            functions.random_choice(["to make use of it",
                                     "find a use for it",
                                     "have fun with it"]) + ".",
        ];
        game_state.message = functions.random_choice(messages);
        get_item(game_state, wizard_item);
        return game_state;
    },

    "wizard_gives_you_sword": function(game_state) {
        var messages = [
            "The wizard gives you an evil looking sword and advises you " +
            "to cause as much mayhem as you can.",
        ];
        game_state.message = functions.random_choice(messages);
        get_weapon(game_state, "sword_of_great_evil");
        return game_state;
    },

    "wizard_gorilla": function(game_state) {
        var messages = [
            "The wizard says, \"If you like behaving like a gorilla so " +
            "much, why not be a gorilla?\" He tries to turn you into a " +
            "gorilla, but his spell only makes you " +
            functions.random_choice(["feel", "smell", "walk",]) +
            " like a gorilla.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wizard_leaves_without_you": function(game_state) {
        var messages = [
            "The wizard ignores you and sails away before you can " +
            "get to his boat.",
            "The wizard leaves without you.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wizard_sends_you_to_arctic": function(game_state) {
        var messages = [
            "The wizard catches you snooping around and conks you on the " +
            "head with his staff.",
        ];
        game_state.message = functions.random_choice(messages);
        move_character(game_state, "arctic");
        return game_state;
    },

    "wizard_stops_you_trashing": function(game_state) {
        var messages = [
            "The wizard comes in while you're trashing the place and " +
            "starts yelling obscenities.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_threatened = true;
        game_state.character.person = "wizard";
        return game_state;
    },

    "wizard_teleport_arctic": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "arctic");
        return game_state;
    },

    "wizard_teleport_countryside": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "countryside");
        return game_state;
    },

    "wizard_teleport_lord_bartholomew_manor": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "lord_bartholomew_manor");
        return game_state;
    },

    "wizard_teleport_lord_carlos_manor": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "lord_carlos_manor");
        return game_state;
    },

    "wizard_teleport_pirate_ship": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "wizard_teleport_smoking_volcano": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "smoking_volcano");
        return game_state;
    },

    "wizard_teleport_tower": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "tower");
        return game_state;
    },

    "wizard_teleport_woods": function(game_state) {
        game_state.message = get_wizard_teleport_message();
        move_character(game_state, "woods");
        return game_state;
    },

    "wizard_unjust": function(game_state) {
        var messages = [
            "Having no further use for you, the wizard turns you into a " +
            "frog.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.is_frog = true;
        game_state.character.items["yellow mushroom"] -= 1;
        return game_state;
    },

    "wizard_wants_mushroom": function(game_state) {
        var messages = [
            "You find the wizard. He says he can smell that you have a " +
            "yellow mushroom and asks if he can have it.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.character.person = "wizard";
        return game_state;
    },

    "women_gawk_at_you": function(game_state) {
        var messages = [
            "The women also gawk at you since you have a tail.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "wowed_eve": function(game_state) {
        var messages = [
            "She asks you to prove your devotion to her by cleaning her " +
            "room. She seems pleased with your work.",
            "She ignores your innuendos, but lets you come to the river " +
            "with her so she can drown a bag of kittens.",
            "She lets you live with her for a few months under the " +
            "condition that she gets to treat you poorly.",
            "She tells you to hide in a chest, because she thinks her " +
            "father is coming. She locks you in the chest and doesn't " +
            "let you out for a week.",
            "When you try to get close to her, she trips you and laughs.",
            "You look at her bookshelf and compliment her on her choice " +
            "of books. She casts doubt on your ability to read.",
            "You say she has pretty lips. She says your lips are only " +
            "pretty when they're shut.",
            "You tell her she looks pretty in her dress. \"Of course I " +
            "do,\" she snaps. \"Tell me something I don't already know.\".",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.eve.attracted += 1;
        return game_state;
    },

    "wowed_mermaid": function(game_state) {
        var messages = [
            "The mermaid enjoys hearing about all of the different animals " +
            "you've seen on land.",
            "The mermaid giggles at your compliments.",
            "The mermaid likes hearing about your adventures on land.",
            "The mermaid takes a liking to you and takes you swimming.",
            "You and the mermaid eat some seaweed together, it's terrible.",
            "You are in the middle of a reciting a romantic ballad when a " +
            "seagull poops on you. The mermaid can't stop laughing.",
            "You end up talking with her for a while. You ask her if there " +
            "are any mermen. \"None worth dating,\" she says.",
            "You make her a crown out of coral. She is delighted with your " +
            "gift.",
            "You say you like her tail. She says she likes your butt.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.mermaid.attracted += 1;
        return game_state;
    },

    "wowed_fat_lady": function(game_state) {
        var messages = [
            "She ignores you when you say, \"Hello,\" but " +
            "you catch her glancing at you throughout the day.",
            "She ignores you, but gives you more food the next day.",
            "She ignores you, but wears a low-cut blouse the next day.",
            "She smiles, but doesn't reply to the love " +
            "poem you recite to her.",
            "When you say she's beautiful, she blushes and hurries away " +
            "without feeding you.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.felicity.attracted += 1;
        if (game_state.persons.felicity.attracted > 2 &&
            game_state.persons.felicity.name === "the fat lady") {
            game_state.persons.felicity.name = "Felicity";
            game_state.message = "You strike up a conversation and learn " +
                "that her name is Felicity.";
        }
        return game_state;
    },

    "wowed_felicity": function(game_state) {
        var messages = [
            "Felicity blows you kisses.",
            "Felicity laughs at all your jests, even the bad ones.",
            "Felicity leans in close and kisses your cheek.",
            "Felicity says she thinks about you a lot.",
            "Felicity talks with you for hours. She only " +
            "stops when the warden barks at her to get " +
            "back to work.",
            "Felicity tells you she asked the warden to " +
            "let you out, but he has a strict \"No lunatics " +
            "on the streets\" policy.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.felicity.attracted += 1;
        return game_state;
    },

    "wowed_olga": function(game_state) {
        var gender_noun;
        var gender_possessive;
        if (game_state.character.sex === "female") {
            gender_noun = "woman";
            gender_possessive = "her";
        } else {
            gender_noun = "man";
            gender_possessive = "his";
        }
        var messages = [
            "She is impressed with your juggling and says she likes a " +
            gender_noun + " with skilled hands.",
            "She plays with your hair while you talk of your exploits.",
            "She sits on your lap when you buy her a drink.",
            "You amuse her with realistic impressions of bird " +
            "songs. She says she likes a " + gender_noun + " who's good " +
            "with " + gender_possessive + " tongue.",
            "You both laugh about how bad the ale is. The bartender " +
            "is not pleased.",
            "You find out that you both like " +
            "cats. She says her cat loves being petted.",
            "You have a nice meal together.",
            "You play a game of darts together. " +
            "She is delighted when she beats you.",
            "You say the flower in her hair goes well with " +
            "her eyes. She says you can smell her flower if you like.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.olga.attracted += 1;
        if (game_state.persons.olga.attracted > 2 &&
            game_state.persons.olga.name === "the pretty lady") {
            game_state.persons.olga.name = "Olga";
            if (game_state.character.sex === "female") {
                game_state.message += " She tells you her name is Olga. " +
                "You tell her your name is Josephine.";
            } else {
                game_state.message += " She tells you her name is Olga. " +
                "You also tell her your name.";
            }
        }
        return game_state;
    },

    "wowed_olga_upstairs": function(game_state) {
        var messages = [
            "Olga puts your hair in fancy braids.",
            "Olga whispers that she's been stalking you.",
            "Olga tells you her life story. Half of it seems made up. " +
            "The other half is definitely made up.",
            "You and Olga share a long kiss together.",
            "You both stay up late talking by candlelight.",
            "You teach Olga the steps to a dance you invented.",
            "You tell Olga your life story. She say's she doesn't believe " +
            "you, but you're good at telling stories.",
        ];
        game_state.message = functions.random_choice(messages);
        game_state.persons.olga.attracted += 1;
        if (game_state.persons.olga.attracted > 5) {
            game_state.message = "Olga grabs your hand. \"Life's too short, " +
            "let's get married!\"";
            game_state.marriage = true;
        }
        return game_state;
    },

    //x

    //y

    "yelling_doesnt_help": function(game_state) {
        var messages = [
            "Your shout echoes around the countryside.",
            "A flock of startled birds flys away.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "you_get_away_with_it": function(game_state) {
        var messages = [
            "Since Lord Arthur is dead, you get away with it.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    "you_get_mobbed": function(game_state) {
        var messages = [
            "The local peasants mob you. They take your money and your life.",
        ];
        game_state.message = functions.random_choice(messages);
        die(game_state);
        return game_state;
    },

    "your_sword_stops_you": function(game_state) {
        var messages = [
            "You can't get your sword of great good out of its sheath.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

    //z

    "zone_out": function(game_state) {
        var messages = [
            "You zone out while " +
            get_name(game_state) + " " + conjugate(game_state, "talk") +
            " to you.",
            "You space out while " +
            get_name(game_state) + " " + conjugate(game_state, "talk") +
            " about Lord Bartholomew.",
        ];
        game_state.message = functions.random_choice(messages);
        return game_state;
    },

};

exports.outcomes = outcomes;

function get_wizard_teleport_message() {
    return functions.random_choice([
        "The wizard conks you on the head with his staff.",
        "The wizard douses you with a potion.",
        "The wizard grabs your arm and spins you around.",
        "The wizard makes you leave in a puff.",
        "The wizard starts reading some magic words from a scroll. " +
        "He keeps reading for a while so you get bored and try to " +
        "sneak away. You must have sneaked pretty well.",
    ]);
}
