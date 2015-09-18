"use strict";

var actions = require("./actions").actions;
var items   = require("./items");
var raffle  = require("./raffle");
var NONE = "none";

exports.apply_outcome = function apply_outcome(outcome, game_state) {
    return outcomes[outcome](game_state);
}

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes;
    if (game_state.character.is_threatened === true && 
        game_state.action !== "Attack" &&
        game_state.action !== "Enter the void." &&
        game_state.action !== "Leave in a puff." &&
        game_state.action !== "Panic!" &&
        game_state.action !== "Play dead." &&
        game_state.action !== "Run like the Devil." &&
        game_state.action !== "TELL_GUARDS" &&
        game_state.action !== "Waddle like God.") {
        possible_outcomes = actions["GET_ATTACKED"](game_state, {});
    } else {
        possible_outcomes = actions[game_state.action](game_state, {});
    }
    return raffle.get(possible_outcomes);
}

function a_or_an(next_letter) {
    if (next_letter === "a" ||
        next_letter === "e" ||
        next_letter === "i" ||
        next_letter === "o" ||
        next_letter === "u") {
        return "an";
    }
    return "a";
}

function add_move_message(game_state) {
    game_state.message += "You find yourself in " + 
        game_state.places[game_state.character.place].name + ".";
}

function arrested(game_state) {
    lose_all_items(game_state);
    move_character(game_state, "prison");
    game_state.character.person = "other_lunatics";
}

function burn(game_state) {
    game_state.places[game_state.character.place].burnable = false;
    game_state.places[game_state.character.place].name = 
        "the smoldering remains of " + 
        game_state.places[game_state.character.place].name;
    game_state.character.person = null;
    game_state.message = "You find yourself in " +
    game_state.places[game_state.character.place].name + ".";
}

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

//kills character if he or she doesn't have a four-leaf clover
function clover(game_state) {
    if (game_state.character.items["four-leaf clover"] < 1) {
        game_state.character.is_dead = true;
    } else {
        game_state.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
}

//conjugates a verb to singular or plural
function conjugate(game_state, word) {
    if (game_state.persons[game_state.character.person].type !== "group") {
        return word + "s"; 
    }
    return word
} 

//kills character
function die(game_state) {
    game_state.character.is_dead = true;
}

function get_item(game_state, item) {
    if (game_state.character.items[item] === 0) {
        game_state.message += " You now have " + a_or_an(item[0]) + " " + 
        item + ".";
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

function get_person(game_state) {
    return game_state.persons[game_state.character.person];
}

function get_place(game_state) {
    return game_state.places[game_state.character.place];
}

function get_random_adjacent_destination(game_state) {
    var links = game_state.places[game_state.character.place].links;
    return links[random_int(links.length)];
}

function get_subject(game_state) {
    return he_she_they[game_state.persons[game_state.character.person].type];
}

function get_weapon(game_state, weapon) {
    if (game_state.character.items[weapon] === 0) {
        game_state.message += " You now have " + 
        a_or_an(items.weapons_map[weapon].name[0]) + " " +
        items.weapons_map[weapon].name + ".";
    } else {
        game_state.message += " You now have another " +
        items.weapons_map[weapon].name + ".";
    }
    game_state.character.items[weapon] += 1;
    if (game_state.character.strength <= items.weapons_map[weapon].attack) {
        game_state.character.strength = items.weapons_map[weapon].attack;
    }
}

function grow_tail(game_state) {
    if (game_state.character.has_tail === false) {
        game_state.character.has_tail = true;
        game_state.message = "You grow a " +
            random_choice(["alligator", "beaver", "donkey", "horse", "monkey", 
                           "pig", "rat"]) + " tail.";
    } else {
        game_state.message = "The potion has no effect.";
    }
}

function lose_all_items(game_state) {
    for (var item in game_state.character.items) {
        game_state.character.items[item] = 0;
    }
    game_state.character.money = NONE;
    game_state.message += " You now have no items.";
    game_state.message += " You now have no money.";
}

function lose_item(game_state, item) {
    game_state.character.items[item] -= 1;

    game_state.character.items[item] === 0
        ?
    game_state.message += " You no longer have " + a_or_an(item[0]) + 
        " " + item + "."
        :
    game_state.message += " You have one less " + item + ".";
}

function move_character(game_state, destination) {
    game_state.character.place = destination;
    game_state.character.is_threatened = false;
    game_state.character.person = null;
    if (destination === "mermaid_rock" || destination === "pirate_ship") {
        game_state.message += " You find yourself on " + 
            game_state.places[destination].name + ".";
    } else {
        game_state.message += " You find yourself in " + 
            game_state.places[destination].name + ".";
    }
}

function random_choice(array) {
    return array[random_int(array.length)]; 
}

function random_int(n) {
    return Math.floor(Math.random() * n);
}

function teleport(game_state) {
    var place_list = [];
    for (var place in game_state.places) {
        if (game_state.places[place] !== 
            game_state.places[game_state.character.place] &&
            place !== "void") {
            place_list.push(place);
        }
    }
    var roll = random_int(place_list.length);
    var destination = place_list[roll];
    move_character(game_state, destination);
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
}

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
            "You notice an inperfection in your largest diamond and can't " +
            "unsee it.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "admire_jewels_and_die": function(game_state) {
        var messages = [
            "You notice the reflection of a dagger in a jewel, just after " +
            "it's too late.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "alley_is_clear": function(game_state) {
        game_state.message = "The dark alley appears to be safe.";
        return game_state;
    },

    "an_excuse_lunatic": function(game_state) {
        game_state.message = "\"A " + game_state.character.excuse + 
            " lunatic,\" one of the guards says. They arrest you " +
            "and throw you in prison with the other lunatics.";
        move_character(game_state, "prison");
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "anna_death": function(game_state) {
        game_state.message = "Wrong answer. Lord Carlos' daughter " +
            "assassinates you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "apocalypse": function(game_state) {
        game_state.message =
            "You start annihilating everything, but the Four Horsemen of " +
            "the Apocalypse steal your thunder. You perish in the chaos.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "arrive_at_mermaid_rock": function(game_state) {
        game_state.message = "A mermaid guides you to a rocky island.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "assassin_prayer_answered": function(game_state) {
        game_state.message = 
            "Your prayers aren't answered, but the assassins' are.",
        clover(game_state);
        return game_state;
    },

    "assassinated": function(game_state) {
        game_state.message = "The first woman you talk to turns out to be " +
        "an assasin. She assassinates you.";
        die(game_state);
        return game_state;
    },

    "assassinated_in_church": function(game_state) {
        game_state.message = "It was a good time to make peace with God. " +
        "Lord Carlos steps out from behind a pillar and assassinates you.";
        die(game_state);
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = "lord_bartholomew";
        return game_state;
    },

    "audience_with_lord_daniel": function(game_state) {
        var messages = [
            "The guards mistake you for someone important and take you " +
            "to Lord Daniel.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "be_shrub_and_die": function(game_state) {
        var messages = [
            "A swarm of caterpillars eats all of your leaves.",
            "You perish in a forest fire.",
            "You catch a bad case of root rot.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
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
            "You make a lot of hash marks on the wall, though you're " +
            "not counting anything.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "bide_your_time_and_die": function(game_state) {
        var messages = [
            "You die of old age.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "bide_your_time_and_escape": function(game_state) {
        var messages = [
            "You eventually manage to dig a secret passage into a cave " +
            "network.",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "cave");
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
        game_state.message =  "One of the potions you smash blows up the lab.";
        if (game_state.character.items["fancy red cloak"] < 1) {
            die(game_state);
        } else {
            game_state.message += " However, your fancy red cloak protects " +
                "you from annihilation.";
            game_state.message += temp_message;
        }
        return game_state;
    },

    "bought_a_weapon": function(game_state) {
        game_state.message = "";
        if (game_state.character.items[game_state.for_sell] === 0) {
            game_state.message += " You now have " + 
            a_or_an(items.weapons_map[game_state.for_sell].name[0]) + " " +
            items.weapons_map[game_state.for_sell].name + ".";
        } else {
            game_state.message += " You now have another " +
            items.weapons_map[game_state.for_sell].name + ".";
        }
        game_state.character.items[game_state.for_sell] += 1;
        if (game_state.character.strength <= 
            items.weapons_map[game_state.for_sell].attack) {
            //TODO made white mushrooms and weapons stack in this way
            game_state.character.strength = 
            items.weapons_map[game_state.for_sell].attack;
        }
        return game_state;
    },

    "bought_an_item": function(game_state) {
        game_state.message = "";
        get_item(game_state, game_state.for_sell);
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
            "The drink is poisoned.",
            "An assassin walks up and starts hitting on you... very hard.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "buy_black_market_item": function(game_state) {
        var item = random_choice(["deep-cave newt", "potion of love", 
                                  "many colored mushroom", "white mushroom", 
                                  "black mushroom", "fancy red cloak", 
                                  "potion of strength",]);
        var messages;
        if (game_state.character.money === "small_fortune" ||
            game_state.character.money === "large_fortune") {
            messages = [
                "You you cut a deal with a " +
                random_choice(["black market peddler", "merchant witch",
                               "monger of rare items",]) + ".",
            ];
            game_state.message = messages[random_int(messages.length)];
            get_item(game_state, item);
        } else {
            messages = [
                "You cannot afford to make a shady deal.",
                "You're too poor to make a shady deal.",
            ];
            game_state.message = messages[random_int(messages.length)];
        }
        return game_state;
    },

    //c

    "cannot_afford": function(game_state) {
        game_state.message = "You cannot afford this item." 
        return game_state;
    },

    "cannot_build_igloo": function(game_state) {
        var messages = [
            "You can't figure out how to build an igloo.",
            "You build an igloo, but it collapses after a snowstorm.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "cannot_dance": function(game_state) {
        game_state.message = "You can't dance a jig, you're in the ocean." 
        return game_state;
    },

    "cannot_drop_anchor": function(game_state) {
        var messages = [
            "You can't find the anchor, but you find Lord Arthur's " +
            "weird cat. It has eight more tails than a normal cat.",
            "You're not strong enough to lift the anchor.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "cannot_find_cat": function(game_state) {
        var messages = [
            "You can't find any cats. Only dogs.",
            "You chase a cat to no avail.",
            "Your efforts to find a cat are fruitless.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "cannot_find_nymphs": function(game_state) {
        var messages = [
            "You can't find any nymphs, but you see some of Lord Carlos' " +
            "men burrying a body.",
            "You get distracted by a squirrel and forget what you were doing.",
            "You see a comely woman picking berries, but she's not a nymph.",
            "Your efforts to find nymphs are fruitless, but you find an " +
            "apple tree.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
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
        game_state.message = "Your singing is too laud for you to hear the " +
            "assassin sneaking up behind you." 
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "cass_answer": function(game_state) {
        game_state.message = "Lord Carlos' daughter wrinkles her nose in " +
            "disgust. \"Not even close.\" she says.";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "cat_burning": function(game_state) {
        var messages = [
            "You find a mob of peasant children about to perform a cat " +
            "burning.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "cat_smells_fish": function(game_state) {
        var messages = [
            "A cat smells your fish and approaches you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "cat");
        game_state.character.person = null;
        return game_state;
    },

    "catch_a_lot_of_fish": function(game_state) {
        var messages = [
            "You catch a lot of fish.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.items.fish += 3;
        game_state.character.person = null;
        return game_state;
    },

    "catch_big_fish": function(game_state) {
        var messages = [
            "You hook a big fish, but it pulls you into the water. " +
            "You are soon lost amid the waves and lose sight of land.",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "ocean");
        return game_state;
    },

    "catch_fish": function(game_state) {
        var messages = [
            "Your efforts prove successful.",
            "You feed yourself for a day.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "fish");
        game_state.character.person = null;
        return game_state;
    },

    "caught": function(game_state) {
        game_state.message = 
            "You run like the Devil, but " + get_name(game_state) +
            " also " + conjugate(game_state, "run") + " like thd Devil and " +
            conjugate(game_state, "overtake") + " you.";
        game_state.character.is_dead = true;
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
            " also " + conjugate(game_state, "run") + " like thd Devil and " +
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
        game_state.character.is_dead = true;
        return game_state;
    },

    "chase_cat_to_dark_alley": function(game_state) {
        var messages = [
            "You find a skinny cat. You chase it through the streets and " +
            "lose track of it.",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "dark_alley");
        return game_state;
    },

    "chop_down_tree": function(game_state) {
        var messages = [
            "A tree falls in the forest. You hear it.",
            "The tree crashes to the ground.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "chop_down_tree_and_die": function(game_state) {
        var messages = [
            "The tree falls on you.",
            "A nymph hexes you. Throwing yourself in a pond suddenly seems " +
            "like a good idea.",
        ];
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "climb_and_die": function(game_state) {
        var messages = [
            "A crow in the crow's nest caws in your face, startling " +
            "you. You fall off the mast and land on the deck.",
            "You fall asleep during your watch duty and the ship runs " +
            "into an iceburg. While the ship is sinking, the crew kills " +
            "you for incompetence.",
        ];
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "climb_and_get_sap": function(game_state) {
        var messages = [
            "Watch duty is so boring you amuse yourself by scraping sap " +
            "off the wood.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "ball of sap");
        return game_state;
    },

    "club_a_seal": function(game_state) {
        var messages = [
            "After a few days of waiting at a hole in the ice, you manage " +
            "to club a seal.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "seal carcass");
        return game_state;
    },

    "croak": function(game_state) {
        game_state.message = "You croak.";
        die(game_state);
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
            "You have a grand old time.",
            "You get sweaty.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_and_die": function(game_state) {
        var messages = [
            "While you're dancing, you twist your ankle, fall to the " +
            "ground, try to catch yourself, but break your wrist, " +
            "hit your head on the ground and break your neck.",
            "You dance so vigorously you become exhausted and die.",
            "You dance to death.",
        ];
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "dance_and_drown": function(game_state) {
        var messages = [
            "You drown trying to dance a jig.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "dance_and_slip": function(game_state) {
        var messages = [
            "You slip on a rock and fall to your death in the darkness.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "dance_fails_to_cheer": function(game_state) {
        var messages = [
            "Dancing fails to cheer you up.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_for_coin": function(game_state) {
        var messages = [
            "The locals are entertained by your antics and toss " +
            "you some coins.",
            "A noble takes pitty on you and gives some money.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_money(game_state, "pittance");
        return game_state;
    },

    "dance_in_puddle": function(game_state) {
        var messages = [
            "You dance through a puddle and get your britches wet.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_with_goblins": function(game_state) {
        var messages = [
            "Some goblins dance with you and then kill you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "dance_with_peasants": function(game_state) {
        var messages = [
            "Many peasants start dancing with you and begin singing " +
            random_choice(["an ode to", "about", "a song about",
                           "the praises of"]) +
            " Lord Bartholomew.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_with_woodland_creatures": function(game_state) {
        var messages = [
            "Some " +
            random_choice(["dryads", "faeries", "nymphs", "pixies", 
                           "spirits", "sprites", "tree ents"]) +
            " dance with you and then " +
            random_choice(["fade away", "disappear", "scatter"]) +
            ".",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "deal_with_assassin": function(game_state) {
        var messages = [
            "You find an assassin posing as a black market dealer.",
        ];
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "denied_audience_with_lord_bartholomew": function(game_state) {
        var messages = [
            "The line to meet Lord Bartholomew is very long, " +
            "so you lose patience and wander off.",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "countryside");
        return game_state;
    },

    "denied_audience_with_lord_daniel": function(game_state) {
        var messages = [
            "The guards laugh. \"" + random_choice([
                "He has no time for peasants.", 
                "Such audacity",]) +
            ",\" one of the guards says.",
            "The amount of paperwork required to get an audience with Lord " +
            "Daniel is " + random_choice([
                "insurmountable", "too tedious", "unreasonable",]) + ".",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "die_waiting_for_seal": function(game_state) {
        var messages = [
            "The local polar bears aren't happy with you on their turf. " +
            "You are soon mauled.",
            "After a few days of waiting at a hole in the ice, you freeze " +
            "do death.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "dina_death": function(game_state) {
        game_state.message = "Lord Carlos' daughter is appalled. \"Dina " +
            "is my mother,\" she says. You are soon assassinated.";
        die(game_state);
        return game_state;
    },

    "distasteful": function(game_state) {
        game_state.message = "You find the flavor of the ground distasteful.";
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
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "diving_saved_by_mermaid": function(game_state) {
        var messages = [
            "You become exhausted diving for pearls and are about to pass " +
            "out when a beautiful mermaid grabs ahold of you and takes you " +
            "to land.",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "do_not_see_assassins": function(game_state) {
        game_state.message = "You don't see one.";
        die(game_state);
        return game_state;
    },

    "drink_piss": function(game_state) {
        var messages = [
            "The potion tastes foul and you begin wondering if the wizard " +
            "pees in some of these bottles.",
            "You're pretty sure you just drank piss, but it could have " +
            "been beer.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "drop_anchor_and_die": function(game_state) {
        var messages = [
            "You drop anchor and cause the ship to swing into a reef. " +
            "Everyone perishes including you.",
            "You drop the anchor through the deck. The ship sinks and " +
            "everyone dies.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "drop_anchor_and_kill_whale": function(game_state) {
        var messages = [
            "You drop the anchor and accidently kill a passing whale. " +
            "Lord Arthur slaps you on the back and says, \"Whale done.\" " +
            "The crew hauls the whale aboard and sails back to land.",
        ];
        game_state.message = messages[random_int(messages.length)];
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

    "earn_small_fortune_in_coins": function(game_state) {
        game_state.message = 
            "A crowd gathers to hear your singing and " + 
            "tosses you a small fortune in coins.";
        get_money(game_state, "small_fortune");
        return game_state;
    },

    "eat_fish_in_igloo": function(game_state) {
        game_state.message = "You survive in your igloo until winter by " +
            "eating your fish. The winter ice sheet allows you to get back " +
            "to land.",
        game_state.character.items["fish"] -= 3;
        move_character(game_state, "woods");
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

    "enter_the_void": function(game_state) {
        game_state.message = "";
        move_character(game_state, "void");
        return game_state;
    },

    "escaped": function(game_state) {
        game_state.message = 
            "The Devil is pretty fast, so you manage to get away.";
        move_character(game_state, get_random_adjacent_destination(game_state));
        return game_state;
    },

    "escaped_like_god": function(game_state) {
        game_state.message = 
            "God is very slow, but " + get_name(game_state) + 
            " also " + conjugate(game_state, "waddle") + " like God, so " +
            "you manage to get away.";
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        return game_state;
    },

    "escaped_unmarried": function(game_state) {
        game_state.message = 
            "The Devil is pretty fast, so you manage to get away unmarried.";
        if (game_state.character.person === "olga") {
            game_state.persons.olga.attracted = 0;
        }
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        return game_state;
    },

    "eve_loses_you_in_woods": function(game_state) {
        var messages = [
            "She says she wants to make love to you in the woods, " +
            "but when you go out in the woods, you lose track of her. " +
            "She doesn't come back for you.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "woods");
        return game_state;
    },

    "eve_name": function(game_state) {
        var messages = [
            "She asks if you even remember her name. " +
            "You say, \"Of course I remember your name. It's...\"",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    //f
    
    "fail_at_new_career": function(game_state) {
        var messages = [
            "After a couple of months, you conclude that you don't have " +
            "what it takes to be a clown.",
            "After a couple of months, you conclude that you don't have " +
            "what it takes to be a priest.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "fail_to_find_mermaids": function(game_state) {
        var messages = [
            "After a days of searching, you're not sure mermaids exist.",
            "You aren't sure where to look.",
            "You find a sea turtle instead.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "fall_into_cave": function(game_state) {
        var messages = [
            "You trip on a stick and fall into a hole in the ground.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "cave");
        return game_state;
    },

    "farm_work": function(game_state) {
        var messages = [
            "You spend a season picking apples.",
            "You spend a season milking cows for a farmer woman. " +
            "She keeps trying to marry you to her attractive " +
            "daughter, but her daughter is having none of it.",
            "You spend a season harvesting wheat. You enjoy the change of " +
            "pace.",
            "During your duties, you get kicked by a mule. You somehow " +
            "don't die.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        get_money(game_state, "pittance");
        return game_state;
    },
  
    "farm_work_and_coin": function(game_state) {
        var messages = [
            "You spend a season slaughtering hogs. You find a shiny " +
            "foreign coin in one of the hogs.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "shiny foreign coin");
        get_money(game_state, "pittance");
        return game_state;
    },
  
    "farm_work_and_die": function(game_state) {
        var messages = [
            "You find farm work, but the assassins find you.",
            "You slip on a fallen apple and drown in an irrigation ditch.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },
  
    "farm_work_and_pitchfork": function(game_state) {
        var messages = [
            "You spend a season bailing hay.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        get_weapon(game_state, "pitchfork");
        get_money(game_state, "pittance");
        return game_state;
    },
  
    "feel_bad_about_donation": function(game_state) {
        var messages = [
            "You feel " + random_choice([
                "like the church will waste your donation",
                "like you wasted your money",
                "like you've been cheated",
                "unfulfilled",
                ]) + ".",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "feel_good_about_donation": function(game_state) {
        var messages = [
            "You feel " + random_choice([
                "fulfilled",
                "holier",
                "holy",
                "like a good person",
                "like your donation brought you closer to God",
                "like your sins will be pardoned",
                ]) + ".",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "felicity_loves_you": function(game_state) {
        var messages = [
            "Felicity whispers that she loves you.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "find_a_cat": function(game_state) {
        var messages = [
            "You find a fat cat. It's too slow to escape you.",
            "You find one.",
            "Your efforts to find a cat are fruitful.",
            "Today is your lucky day.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = "You find a mermaid instead. She leads you back to " +
            "her rock.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
        return game_state;
    },

    "find_nymphs": function(game_state) {
        var messages = [
            "You find some nymphs " + random_choice([
                "dancing slowly in a meadow",
                "singing among the trees",]) + ", but they disappear when " +
            "they see you.",
        ] 
        game_state.message = messages[random_int(messages.length)];
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
            random_choice(["absolving a rich man's sins",
                           "blessing a knight's sword",
                           "cleaning the feet of a beggar",
                           "deep in prayer", "eating a holy wafer",
                           "feeding a poor woman", "giving a sermon",
                           "helping deliver a baby"])
            + ".";
        move_character(game_state, "church");
        game_state.character.person = "st_george";
        return game_state;
    },

    "find_st_george_instead": function(game_state) {
        game_state.message = "You find St. George instead.";
        game_state.character.person = "st_george";
        return game_state;
    },

    "find_wooden_mermaid": function(game_state) {
        game_state.message = "You find a wooden mermaid figurehead on the " +
            "front of a ship. The crew hoists you abroad.";
        move_character(game_state, "pirate_ship");
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

    "fly_tastes_good": function(game_state) {
        game_state.message = "The fly tastes better than any human food " +
            "ever did.";
        return game_state;
    },

    "forced_to_marry_eve": function(game_state) {
        game_state.message = 
            "Your suave advances lead to several rounds of passionate " +
            "sex with Lord Carlos' daughter that night. Unfortunately, " +
            "you don't wake up at " +
            "dawn. You wake up in the middle of the night when two " +
            "hooded assassins kidnap you take you to a dungeon full " +
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
                game_state, get_random_adjacent_destination(game_state));
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
        ] 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "frog": function(game_state) {
        game_state.message = "You find the wizard. He turns you into a frog.";
        game_state.character.is_frog = true;
        return game_state;
    },

    //g

    "gambling_die": function(game_state) {
        game_state.message = "It was a gamble to stay here. " +
            "The assassins find you.";
        die(game_state);
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

    "get_attacked": function(game_state) {
        var attempted_action = 
            game_state.action[0].toLowerCase() +
            game_state.action.slice(1, game_state.action.length - 1);
        if (game_state.persons[game_state.character.person].prefered_attack ===
            "arrest") {
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
                conjugate(game_state, "kill") + " you."
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
        ] 
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "bouquet of flowers");
        game_state.character.person = null;
        return game_state;
    },

    "get_frog": function(game_state) {
        var messages = [
            "While you are snooping around, a frog hops onto you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "frog");
        return game_state;
    },

    "get_no_void_dust": function(game_state) {
        var messages = [
            "You reach for some void dust, but it's farther away than it " +
            "seems.",
            "The void dust slips between your fingers and disperses into " +
            "nothingness.",
        ] 
        game_state.message = messages[random_int(messages.length)];
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
            random_choice(["brashness", "incompetence", "recklessness"]) +
            " by " + 
            random_choice([
                "beating you with his cat. The cat is more traumatized " +
                "by the experience than you are.",
                "making you clean the the deck with your tongue. You're " +
                "pretty good at it.",
                "tying you to the front of the ship for a week. You find " +
                "the wooden mermaid figurehead very sexy.",
                "putting you on kitchen duty with the ship's cook, who " +
                "bores you with stories about his life.",
                "putting you in a barrel and letting his men roll you " +
                "around the deck for a couple of hours.",
            ]),
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "get_sap": function(game_state) {
        game_state.message = "You fall a tree and scrape the sap off your ax.";
        get_item(game_state, "ball of sap");
        return game_state;
    },

    "get_void_dust": function(game_state) {
        game_state.message = "";
        get_item(game_state, "handful of void dust");
        return game_state;
    },

    "go_to": function(game_state) {
        game_state.message = "";
        game_state.character.place = game_state.destination;
        game_state.destination = null;
        game_state.character.person = null;
        add_move_message(game_state);
        return game_state;
    },

    "go_upstairs_and_die": function(game_state) {
        game_state.message = "Olga invites you to her room upstairs. " +
            "When you get there, lots of passionate stabbing ensues.";
        game_state.character.is_dead = true;
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
        ] 
        game_state.character.place = "upstairs";
        game_state.message = messages[random_int(messages.length)];
        game_state.persons["olga"].attracted += 1;
        return game_state;
    },

    "god_commits_arson": function(game_state) {
        burn(game_state); // the order matters here since burn() 
                          // overwrites the message
        game_state.message = "Your prayers are answered. " + 
            game_state.message;
        return game_state;
    },

    "god_gives_you_a_wife": function(game_state) {
        game_state.message = 
            "Your prayers for a beautiful wife are answered, but she soon " +
            "leaves you.";
        return game_state;
    },

    "god_gives_you_jewels": function(game_state) {
        game_state.message = 
            "God does nothing for you, but you " +
            "find a bag of jewels someone left on the counter.";
        get_item(game_state, "bag of jewels");
        return game_state;
    },

    "god_shows_you_the_way": function(game_state) {
        game_state.message = 
            "God speaks to you and shows you the way.";
        return game_state;
    },

    "god_showers_you_with_gold": function(game_state) {
        game_state.message = "God rewards your devotion with a large fortune.";
        get_money(game_state, "large_fortune");
        return game_state;
    },

    "god_smites_you": function(game_state) {
        game_state.message = "God smites you for your " + 
            random_choice(["arrogance", "faithlessness", "foolishness",
                           "heresy", "rudeness", "tactlessness"]) + ".";
        clover(game_state);
        return game_state;
    },

    "god_tells_you_to_marry": function(game_state) {
        game_state.message = 
            "God tells you to get married.";
        return game_state;
    },

    "god_tests_you": function(game_state) {
        game_state.message = 
            "God decides to test you.";
        lose_all_items(game_state);
        return game_state;
    },

    "ground_tastes_cold": function(game_state) {
        game_state.message = "The ground tastes really cold.";
        return game_state;
    },

    "grow_tail": function(game_state) {
        grow_tail(game_state);
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
        game_state.message = "The local guards see your killing everybody " +
            "and conclude that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_licking": function(game_state) {
        game_state.message = "The local guards see you licking the ground " +
            "and conclude you must be a lunatic.";
        game_state.character.person = "guards";
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

    "guards_stop_you_trash": function(game_state) {
        game_state.message = "The local guards see you looking through the " +
            "trash and accuse you of being a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    //h
    
    "hammer_from_st_george": function(game_state) {
        game_state.message = "St. George sees that you are a righteous man " +
            "and gives you a weapon to do God's work.";
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
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "hide_and_die": function(game_state) {
        var messages = [
            "You try to hide in a sewer, but you get killed by a rat.",
            "You trip in the darkness and break your neck.",
        ];
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "hit_assassin_with_cat": function(game_state) {
        game_state.message = "You hit an assassin with your cat.";
        game_state.character.person = "assassin";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "hop": function(game_state) {
        game_state.message = "You hop.";
        return game_state;
    },

    "hop_a_lot": function(game_state) {
        game_state.message = "You hop a lot.";
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        return game_state;
    },

    "human": function(game_state) {
        game_state.message = "A woman picks you up and kisses you " +
            "hoping to get a prince, instead she gets you. She is not " +
            "impresseed.";
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
            random_choice(["impressed", "pleased"]) +
            " with your enthusiasm and gives you a cutlass.";
        get_weapon(game_state, "cutlass");
        return game_state;
    },

    "infection": function(game_state) {
        game_state.message = "You catch a nasty infection and spend weeks " +
            "fighting it.";
        die(game_state);
        return game_state;
    },

    "ignored": function(game_state) {
        game_state.message = "God ignores your prayers.";
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
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "kill": function(game_state) {
        game_state.message =
            "You kill " +
            game_state.persons[game_state.character.person].name + ".";
        game_state.persons[game_state.character.person].alive = false;
        game_state.character.is_threatened = false;
        game_state.character.person = null;
        return game_state;
    },

    "kill_lord_carlos": function(game_state) {
        game_state.message =
            "You are just about to dump a cauldron of hot soup on Lord " +
            "Carlos when he looks up and notices you. You then dump the " +
            "hot soup on him and he dies.",
        game_state.persons["lord_carlos"].alive = false;
        move_character(game_state, "lord_carlos_manor");
        return game_state;
    },

    "kill_nobody": function(game_state) {
        var messages = [
            "You don't see anybody in a fit of rage to kill.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "kill_self": function(game_state) {
        var messages = [
            "You perform the ritual of seppuku.",
        ];
        if (game_state.character.place !== "ocean") {
            messages.push("You set yourself on fire and promptly burn to a " +
                "crisp.");
        }
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "kill_self_in_fit_of_rage": function(game_state) {
        var messages = [
            "You start with yourself.",
            "You make no exceptions.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "killed_by_dragon": function(game_state) {
        game_state.message = "Everything was going fine until you tried to " +
            "get a dragon to do your biding.";
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

    "killed_by_olga": function(game_state) {
        game_state.message =
            "When you squeeze her butt, she stabs you in the heart with a " +
            "poisoned dagger.";
        die(game_state);
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
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "kiss_frog_cat": function(game_state) {
        var messages = [
            "Your frog turns into a cat. ",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "cat");
        lose_item(game_state, "frog");
        return game_state;
    },

    "kiss_frog_jewels": function(game_state) {
        var messages = [
            "Your frog turns into a prince. He rewards you for freeing him.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
            "The frog turns into a guard. He says, \"You must be a lunatic for " +
            "kissing a frog, but I'll let this one slide.\"",
        ];
        game_state.message = messages[random_int(messages.length)];
        lose_item(game_state, "frog");
        return game_state;
    },

    "kiss_frog_mushrooms": function(game_state) {
        var messages = [
            "Your frog turns into an old woman. She thanks you and gives " +
            "a bunch of mushrooms.",
        ];
        game_state.message = messages[random_int(messages.length)];
        lose_item(game_state, "frog");
        get_item(game_state, "black mushroom");
        get_item(game_state, "many colored mushroom");
        get_item(game_state, "white mushroom");
        get_item(game_state, "yellow mushroom");
        return game_state;
    },

    "kiss_frog_no_effect": function(game_state) {
        var messages = [
            "The frog seems to be into it.",
            "You feel stupid kissing a frog.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    //l

    "left_in_a_puff": function(game_state) {
        game_state.message = "";
        teleport(game_state);
        return game_state;
    },

    "leer_and_get_assassinated": function(game_state) {
        game_state.message = "You are too distracted by all the pretty " +
            "women to notice the assassins closing in on you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "leer_at_cat": function(game_state) {
        game_state.message = "You don't see any woman worth leering at, " +
            "but you do see a cat worth leering at.";
        get_item(game_state, "cat");
        return game_state;
    },

    "leer_at_women": function(game_state) {
        var messages = [
            "You fair woman notices you and hastens away.",
            "You stop leering when you realize it isn't a woman.",
            "An equally creepy woman stares back at you before " +
            "disappearing into the crowd.",
            "A woman becomes annoyed with your leering and throws salt in " +
            "your eyes.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "lick_ash": function(game_state) {
        var messages = [
            "You burn your tongue on an ember.",
            "You find the taste of ashes unpleasant.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "lick_blood": function(game_state) {
        game_state.message = "You lick the blood off the ground.";
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
        return game_state;
    },

    "lord_arthur_tells_sail": function(game_state) {
        var messages = [
            "Lord Arthur tells you to " +
            random_choice(["raise the sail faster", "scrub the deck"]) + ".",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "lord_arthur_tells_scrub": function(game_state) {
        var messages = [
            "Lord Arthur tells you to " +
            random_choice(["scrub harder", "raise a sail"]) + ".",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "lose_ax": function(game_state) {
        game_state.message = "You get your ax stuck in a tree and can't " +
        "get it back out.";
        lose_item(game_state, "ax");
        return game_state;
    },

    "lose_fight": function(game_state) {
        game_state.message = 
            "You get killed by " + 
            game_state.persons[game_state.character.person].name + ".";
        die(game_state);
        return game_state;
    },

    //m

    "married": function(game_state) {
        if (game_state.character.person === "olga") {
            var messages = [
                "Lord Bartholomew performs a wedding for you and Olga in the " +
                "countryside. 20,000 people attend your wedding, but you " +
                "suspect they just wanted to see Lord Bartholomew.",
                "The wizard performs a wedding for you and Olga in the market." +
                " He turns you both into sheep after the vows, but it's much " +
                "safer being sheep.",
                "Lord Arthur performs a wedding for you and Olga on the deck " +
                "of his pirate ship. By the time the ceremony is over, the " +
                "ship has sailed. You are now both members of the crew.",
                "A bleary-eyed priestess performs a wedding for you and Olga in " +
                "an alley behind the church. Olga asks the priestess if she " +
                "would like to come along for the honeymoon, but the priestess " +
                "declines.",
            ];
            game_state.message = messages[random_int(messages.length)];
            game_state.character.has_found_true_love = true;
            game_state.message += " You and Olga live happily ever after.";
        }
        return game_state;
    },

    "meet_blind_bartender": function(game_state) {
        game_state.message = 
            "The blind bartender grumbles as he passes you a drink.";
        game_state.character.person = "blind_bartender";
        return game_state;
    },

    "meet_eve": function(game_state) {
        game_state.message = "You manage to sneak into Lord Carlos' " +
            "daughter's bedroom. She is " + 
            random_choice(["brushing her hair", 
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
                    "He is " + random_choice(
                    ["writing a letter.", "reading a book.",
                     "looking straight at you.", "eating a heart.",
                     "training a weasel.", "pacing around."]),
        game_state.character.person = "lord_carlos";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "meet_mermaid": function(game_state) {
        var messages = [
            "You almost step on one",
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
        game_state.message = messages[random_int(messages.length)] + " " +
            second_messages[random_int(second_messages.length)];
        game_state.character.person = "mermaid";
        return game_state;
    },

    "meet_nymph_queen": function(game_state) {
        game_state.message = "You find the nymph queen " +
            random_choice(["doing tai chi in a meadow", "feeding a stag",
                           "levitating above a pond",
                           "tanning in a ray of sunshine",
                           "teaching a gobling to read",
                           "watering flowers in a meadow",
                          ]) + ". Her beauty is " +
            random_choice(["dazzling", "exhilarating", "intoxicating",
                           "only rivaled by her attractiveness",
                           "overwhelming"]) + ".";
        game_state.character.person = "nymph_queen";
        return game_state;
    },

    "meet_olga": function(game_state) {
        if (game_state.persons.olga.name === "the pretty lady") {
            game_state.message = 
            "During your invstigation, you strike up a conversation with " +                
            "a pretty lady.";
        } else {
            game_state.message = 
            "During your invstigation, you find yourself talking with Olga.";
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

    "meet_witch": function(game_state) {
        game_state.message = "You find a witch deep in the woods.";
        game_state.character.person = "witch";
        return game_state;
    },

    "merchant_ship_nest": function(game_state) {
        game_state.message = "You spot a merchant ship. A naval battle " +
            "ensues.";
        return game_state;
    },

    "merchant_ship_sail": function(game_state) {
        game_state.message = "While you're raising a sail, you see a " +
            "merchant ship. Lord Arthur orders you to help raid it."
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

    "mermaid_likes_your_dance": function(game_state) {
        game_state.message = "The mermaid laughs and claps her hands. " +
            "She is completely in awe of your legs.";
        get_person(game_state).attracted += 1;
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
            "takes a sip and falls madly in love the blind bartender."
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

    "monstrosity": function(game_state) {
        game_state.message = 
            "You lick some spilled potion off the floor and start " +
            "growing at a monstrous rate. By the time you stop growing, " +
            "you have become a towering monstrosity.";
        game_state.character.is_monstrosity = true;
        return game_state;
    },

    "moved": function(game_state) {
        game_state.message = "";
        move_character(game_state, 
            get_random_adjacent_destination(game_state));
        return game_state;
    },

    "mushroom_kills_you": function(game_state) {
        var messages = [
            "The mushroom tastes bittersweet.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "mushroom_makes_you_bigger": function(game_state) {
        var messages = [
            "You grow larger.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        game_state.character.strength += 1;
        lose_item(game_state, "white mushroom");
        return game_state;
    },

    "mushroom_makes_you_smaller": function(game_state) {
        var messages = [
            "You shrink to the size of a peanut. A weasel soons comes " +
            "and eats you.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "mushroom_tastes_bad": function(game_state) {
        var messages = [
            "You find the mushroom distasteful.",
        ];
        game_state.message = messages[random_int(messages.length)];
        lose_item(game_state, "yellow mushroom");
        return game_state;
    },

    //n

    "no_fish": function(game_state) {
        var messages = [
            "You don't catch any fish.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "no_flowers": function(game_state) {
        game_state.message = "You can't find any flowers. Only grass.";
        return game_state;
    },

    "no_flowers_frog": function(game_state) {
        var messages = [
            "You don't find any flowers, but you find a frog.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "frog");
        return game_state;
    },

    "no_mushroom_frog": function(game_state) {
        var messages = [
            "You don't find a single mushroom, but you find a single frog.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "frog");
        return game_state;
    },

    "no_one_cares": function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },

    "no_one_wants_to_talk": function(game_state) {
        var messages = [
            "You ask around, but nobody has heard anything about " +
            "assassins.",
            "Nobody wants to talk to you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "no_progress_swimming": function(game_state) {
        var messages = [
            "You keep your head up.",
            "You make very little progress.",
            "You manage to stay afloat.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        if (game_state.character.items.cat === 1) {
            game_state.message += " Your cat drowns.";
        } else if (game_state.character.items.cat > 1) {
            game_state.message += " Your cats drown.";
        }
        game_state.character.items.cat = 0;
        return game_state;
    },

    "no_sea_turtle": function(game_state) {
        var messages = [
            "You can't find a sea turtle. Everywhere looks the same.",
            "You find a shark instead. It minds its own business.",
            "Your efforts to find a sea turtle are fruitless.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "no_true_pirate_says_that": function(game_state) {
        var messages = [
            "Lord Arthur tells you that no true pirate says that.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "not_impressed": function(game_state) {
        game_state.message = capitalize(get_person(game_state).name) + 
            " is not impressed.";
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
    
    "overhear_stuff": function(game_state) {
        var messages = [
            "you overhear some peasants excitedly talking about Lord " +
            "Bartholomew.",
            "you overhear a woman say a wizard turned her husband into a " +
            "frog.",
        ];
        game_state.message = "While you're drinking, " + 
            messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "pace_and_die": function(game_state) {
        var messages = [
            "Your pacing drives the prison guards crazy. They kick you to " +
            "death to restore their sanity.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "pace_and_get_frog": function(game_state) {
        var messages = [
            "While you're pacing, you notice a frog hopping through you " +
            "cell.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "frog");
        return game_state;
    },

    "pace_and_get_mushroom": function(game_state) {
        var messages = [
            "While you're pacing, you notice a yellow mushroom growing " +
            "in the filth of your cell."
        ]; 
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "yellow mushroom");
        return game_state;
    },

    "panic_and_die": function(game_state) {
        var messages = [
            "Panicking doesn't save you.",
            "Panicking doesn't help.",
        ]; 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "panic_and_escape": function(game_state) {
        game_state.message = "You don't remember what you did, but you " +
            "somehow escaped.";
        teleport(game_state);
        return game_state;
    },

    "pick_black_mushroom": function(game_state) {
        game_state.message = "You pick a black mushroom.";
        game_state.character.person = null;
        get_item(game_state, "black mushroom");
        return game_state;
    },

    "pick_many_colored_mushroom": function(game_state) {
        game_state.message = "You pick a many colored mushroom.";
        game_state.character.person = null;
        get_item(game_state, "many colored mushroom");
        return game_state;
    },

    "pick_white_mushroom": function(game_state) {
        game_state.message = "You pick a white mushroom.";
        game_state.character.person = null;
        get_item(game_state, "white mushroom");
        return game_state;
    },

    "pick_yellow_mushroom": function(game_state) {
        game_state.message = "You pick a yellow mushroom.";
        game_state.character.person = null;
        get_item(game_state, "yellow mushroom");
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
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "play_dead_works": function(game_state) {
        var messages = [
            capitalize(get_name(game_state)) + " " + 
            conjugate(game_state, "decide") + " you are too pathetic to " +
            "kill.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "priest_agrees": function(game_state) {
        var messages = [
            "The priest thinks for a moment and realizes you're right. " +
            "\"What a fool I've been,\" he says. \"I'll go and " +
            random_choice(["become a peasant", "get a wife",]) + ".\"",
            "You get in a " +
            random_choice(["heated", "horrible", "protracted", "spirited"]) +
            " argument with the preist, but you eventually both agree that " +
            "there are at least 17 gods and that " +
            random_choice(["Lord Bartholomew", "St. George",]) + 
            " is a good man.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "priest_disagrees": function(game_state) {
        var messages = [
            "The priest says he has is doubts.",
            "The priest says he would know it when he sees it.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "priest_fat": function(game_state) {
        var messages = [
            "The priest runs off crying.",
            "\"Food is my only indulgence,\" he says proudly.",
            "He says, \"Only God can judge me.\"",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "priest_takes_pity": function(game_state) {
        var messages = [
            "The priest finds your argument so pitiful that he gives you " + 
            "a pittance and sends you on your way.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_money(game_state, "pittance");
        move_character(game_state, "streets");
        return game_state;
    },

    "priestess_takes_offense": function(game_state) {
        game_state.message = "A priestess finds your lyrics " +
        random_choice(["blasphemous", "cliché", "crude", "idiotic", "lewd", 
                       "mildly offensive", "uncreative"]) +
        " and has you thrown out of the church.";
        move_character(game_state, "streets");
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "potion_mermaid": function(game_state) {
        var messages = [
            "The mermaid falls madly in love with you. You run into the " +
            "mermaid problem, but she " + 
            random_choice(["has a mouth", "has breasts", 
                           "is fun to be around"]) +
            " so you still live happily ever after.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    "potion_nymph_queen": function(game_state) {
        var messages = [
            "The nymph queen falls madly in love with you. All of the " +
            "woodland creatures attend your wedding.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.has_found_true_love = true;
        return game_state;
    },

    //q
    
    //r

    "raise_sail_and_get_to_land": function(game_state) {
        var destination = random_choice(["arctic", "docks", "mermaid_rock", 
                                         "woods",]);
        var messages = [
            "Your nautical efforts help the ship sail to " +
            game_state.places[destination].name + ".",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, destination);
        return game_state;
    },

    "random_death": function(game_state) {
        var messages = [
            "The potion tastes bittersweet.",
            "The potion has no effect, but when the wizard comes in to the " +
            "lab, you feel compelled to flirt with him stroke his " +
            "beard. He is revolted and incinerates you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "random_strength": function(game_state) {
        var messages = [
            "The potion gives you washboard abs.",
            "Your muscles swell with strength.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.strength += 3;
        return game_state;
    },

    "read_and_die": function(game_state) {
        var messages = [
            "You open a cursed book.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "four-leaf clover");
        return game_state;
    },

    "read_spell_book": function(game_state) {
        var messages = [
            "You learn that it takes sap, flowers, and a many-colored " +
            "mushroom to brew a love potion.",
            "You learn that it takes a cat and a pearl " +
            "to brew a potion of tail growth.",
            "You learn that it takes a white mushroom and a deep-cave " +
            "newt to brew a potion of strength.",
            "You find the book arcane and boring.",
            "You learn a spell to set things on fire, unfortunatley it " +
            "requires a focused mind.",
            "The wizard's handwriting is terrible.",
            "The first book you open appears to be the wizard's diary. " +
            "It's mostly math proofs.",
            "The first book you open appears to be the wizard's diary. " +
            "He appears to be obsessed with void dust, but doesn't know " +
            "how to get any.",
            "The first book you open appears to be the wizard's diary. " +
            "It's full of accounts about how he's too chicken to ask out " +
            "a woman he often sees in the market.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "rebuffed_by_fat_lady": function(game_state) {
        var messages = [
            "She ignores your hoots.",
            "She ignores your whistling.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "rebuffed_by_felicity": function(game_state) {
        var messages = [
            "Felicity asks if she looks fat in her new dress. " +
            "You say, \"Yes.\" She doesn't speak to you for several days.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "fancy red cloak");
        return game_state;
    },

    "rescued_by_lord_arthur": function(game_state) {
        game_state.message = "You are picked up by Lord Arthur's pirate " +
            "ship.";
        move_character(game_state, "pirate_ship");
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
        return game_state;
    },

    //s

    "saved_by_inuits": function(game_state) {
        game_state.message = "Some Inuits save you from the cold and take " +
            "you back to land in a kayak. They also give you a fish.";
        get_item(game_state, "fish");
        move_character(game_state, "countryside");
        return game_state;
    },

    "saved_by_mermaid": function(game_state) {
        game_state.message = "You sink into the depths and black out. " +
            "A mermaid is playing with your hair.";
        move_character(game_state, "mermaid_rock");
        game_state.character.person = "mermaid";
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
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "ocean");
        return game_state;
    },

    "scrub_the_deck": function(game_state) {
        var messages = [
            "You get sore scrubbing all day.", 
            "You scrub the deck until it sparkles, then you scrub it some " +
            "more.",
            "While you're scrubbing, the pirates sing a " +
            random_choice(["bawdy", "dirty", "indecent", "lewd", 
                           "Rabelaisian", "raunchy", "ribald", "risqué", 
                           "salacious", "smutty", "vulgar"]) +
            " pirate song.", 
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "see_ship": function(game_state) {
        var messages = [
            "You see a ship in the distance. You are unable to reach it.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "see_wizard_with_penguins": function(game_state) {
        var messages = [
            "While you are waiting to freeze to death, you notice " +
            "the wizard dropping off a boatload of penguins.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "set_self_on_fire": function(game_state) {
        game_state.message = "You accidently set yourself on fire and " +
        "promptly burn to a crisp.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "sing_about_lords": function(game_state) {
        var messages = [
            "You sing a song about Lord Arthur, captain of the pirates.",
            "You sing a song about Lord Bartholomew, leader of the peasants.",
            "You sing a song about Lord Carlos, kingpin of the assassins.",
            "You sing a song about Lord Daniel, leader of the guards."
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "sing_at_lord_carlos_manor": function(game_state) {
        var messages = [
            "This is no place for merry-making. You are soon assassinated.",
            "Your singing alerts Lord Carlos' men to your presense. " +
            "You are soon assassinated.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.is_dead = true;
        return game_state;
    },

    "sing_in_deep_voice": function(game_state) {
        var messages = [
            "You sing in an uncharacteristically deep voice.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        get_person(game_state).attracted += 1;
        return game_state;
    },

    "sing_to_olga": function(game_state) {
        var messages = [
            "Olga interupsts your song by kissing you.",
            "You sing a romantic ballad. Olga is impressed.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.persons.olga.attracted += 1;
        return game_state;
    },

    "slip_and_die": function(game_state) {
        var messages = [
            "You slip on a slippery slope and fall to your death.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "sneak_and_die": function(game_state) {
        var messages = [
            "One of the assassin guards sees you tiptoeing around in " +
            "broad daylight. He assassinates you.",
            "Your smell gives you away. You are soon assassinated.",
            "You get the hiccups. You are soon assassinated.",
            "You are sneaking through the stables when a man too fat to " +
            "avoid bumps into you. You are soon assassinated.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "sneak_and_die_bartholomew": function(game_state) {
        var messages = [
            "An old man notices you skulking around and starts yelling " +
            "about an assassin. You look behind you, but the old " +
            "man stabs you in the front.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "sneak_bartholomew": function(game_state) {
        var messages = [
            "While prowling in the shadows of a hallway, you stub your " +
            "pinkie toe.",
            "While lurking in a shrub, you catch sight of the fair Lady " +
            "Beatrice.",
            "While hiding behind a door, you overhear Lord Bartholomew " +
            "and his men plotting insurrection.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "sneak_pitchfork": function(game_state) {
        var messages = [
            "While creeping around in the stables, you find a long " +
            "pitchfork.",
        ];
        get_weapon(game_state, "long_pitchfork");
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "snoop_around_and_die": function(game_state) {
        var messages = [
            "You accidentally knock over a bottle of roiling black vapor.",
        ];
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "st_george_gives_you_money": function(game_state) {
        var money = random_choice(["pittance", "small_fortune", 
                                   "large_fortune"]);
        game_state.message = "St. George gives you " + 
            items.money_map[money].name + ".";
        get_money(game_state, money);
        return game_state;
    },

    "st_george_joins_you_in_prayer": function(game_state) {
        game_state.message = "St. George joins you in prayer."
        game_state.character.person = "st_george";
        return game_state;
    },

    "st_george_kills_you": function(game_state) {
        var messages = [
            "St. George becomes irritated with your begging and crushes you " +
            "with his iron hammer.",
            "St. George smites you with his saintly wrath for being " + 
            "ungreatful.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = "You start feeling strange."
        game_state.character.is_tripping = true;
        if (game_state.action === "Chow down on your many colored mushroom.") {
            game_state.character.items["many colored mushroom"] -= 1;
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

    "steal_cutlass": function(game_state) {
        game_state.message = "Your plan goes swimmingly.";
        move_character(game_state, "ocean");
        get_weapon(game_state, "jeweled_cutlass");
        return game_state;
    },

    "stepped_on": function(game_state) {
        game_state.message = "While you look for flies, someone steps on " +
            "you.";
        die(game_state);
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
        game_state.message = messages[random_int(messages.length)];
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

    //t

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

    "think_about_sex": function(game_state) {
        game_state.message = "Since you're a man, you think about sex.";
        return game_state;
    },

    "think_ax": function(game_state) {
        game_state.message = "While you're thinking, a guard hands you an ax " +
        "and tells you to chop some firewood for the cooks.";
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

    "think_get_lost": function(game_state) {
        game_state.message = "You get lost in your thoughts."; 
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

    "think_reevaluate_life": function(game_state) {
        game_state.message = "You spend some time reevaluating your life " +
            "and conclude that you need to stay the course.";
        return game_state;
    },

    "think_suffocation": function(game_state) {
        game_state.message = "You think about suffocation.";
        return game_state;
    },

    "think_think_think": function(game_state) {
        game_state.message = "All you can think is \"Think. Think. Think.\""; 
        return game_state;
    },

    "think_you_shouldnt_be_here": function(game_state) {
        game_state.message = "You think you probably shouldn't be here."; 
        return game_state;
    },

    "thrown_off_ship": function(game_state) {
        game_state.message = "Lord Arthur cringes and has you thrown off " +
            "the ship.";
        move_character(game_state, "ocean");
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

    "trip_over_a_cat": function(game_state) {
        game_state.message = "You trip over a cat and break your neck.";
        clover(game_state);
        return game_state;
    },

    "train_and_die": function(game_state) {
        var messages = [
            "You accidently put your helmet on backwards and trip over a " +
            "balcony railing.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "train_and_win": function(game_state) {
        var messages = [
            "You beat the captain of the guards at wooden swordplay. " +
            "\"Not bad for a " + random_choice(["lunatic", "peasant", 
                                                "simpleton"]) +
            ",\" he says.",
            "You run like the Devil and outrun the other guards during " +
            "running practice.", 
            "You hit the bulls eye during archery practice.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.message += " Training has made you stronger.";
        game_state.character.person = "guards";
        game_state.character.strength += 1;
        return game_state;
    },

    "train_stronger": function(game_state) {
        var messages = [
            "You are badly beaten at wooden swordplay, but you grow " +
            "stronger.",
            "You miss many marks practicing archery, but failure leads " +
            "to success. You grow stronger.",
            "The guards leave you in the dust during running practice, but " +
            "you grow stronger.",
        ];
        game_state.message = messages[random_int(messages.length)];
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

    "trash_ax": function(game_state) {
        var messages = [
            "You find an old ax.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "ax");
        return game_state;
    },

    "trash_cat": function(game_state) {
        var messages = [
            "You find a somewhat agreeable cat.",
        ];
        game_state.message = messages[random_int(messages.length)];
        get_item(game_state, "cat");
        return game_state;
    },

    "trash_die": function(game_state) {
        var messages = [
            "You attempt to look through the trash, but an assassin takes " + 
            "it out.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "trash_nothing": function(game_state) {
        var messages = [
            "You don't find anything useful in the trash.",
            "You find a bad smell.",
            "You find a mirror in the trash. You see nothing of value.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "trash_the_place": function(game_state) {
        trash(game_state);
        if (random_int(3) === 0) {
            game_state.message += " You find a red cloak in the wreckage.";
            get_item(game_state, "fancy red cloak");
        }
        return game_state;
    },

    "trash_the_place_and_die": function(game_state) {
        var messages = [
            "When you snap a fancy staff in half, you inadvertently set " + 
            "a dark spirit free.",
        ];
        if (game_state.persons.wizard.alive === true) {
            messages.push("while you're wrecking stuff, the wizard runs " +
                "into the lab and incinerates you.");
        }
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    //u
    
    //v

    //w

    "wait_here": function(game_state) {
        var messages = [
            "You ask a servant about assassins. She asks you to wait where " +
            "you are.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "waiting_for_seal": function(game_state) {
        var messages = [
            "You manage to club a seal, but it swims away.",
            "While waiting for a seal, you get very cold.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "wake_up": function(game_state) {
        var messages = [
            "You wake up well-rested some hours later.",
            "You have a nightmare about weasels.",
            "You have a wonderful dream that you are in bed with Lord " +
            "Carlos' daughter.",
            "You dream of fire.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "wake_up_assassinated": function(game_state) {
        game_state.message = "You are rudely awakened by an assassin's dagger.";
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
        game_state.message = "You are rousted by some guards who toss you in " +
            "prison with the other lunatics.";
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
        game_state.message = "You wake up robbed of all your wordly " +
            "possessions."; 
        game_state.character.person = null;
        lose_all_items(game_state);
        return game_state;
    },

    "wake_up_somewhere_else": function(game_state) {
        game_state.message = "You wake up a few hours later."
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        game_state.character.person = null;
        return game_state;
    },

    "wake_up_weasel": function(game_state) {
        game_state.message = "You wake up just in time to see an assassin " +
            "slip a weasel through the bars of your cell. " +
            "The weasal kills you.";
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
            "All of the peasants you meet talk about Lord Bartholomew like " +
            "he's God's gift to the world.",
            "Not all those who wander are lost, but you are.",
            "You find a fork in the road and take it.",
            "You find a mob of peasants burning Lord Daniel in effigy.",
            "You see a beautiful peasant woman, unfortunately she also has " +
            "a beautiful husband.",
            "A traveling fortune teller says you will meet a fiery end.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "wander_while_singing": function(game_state) {
        game_state.message = "You wander aimlessly as you work your way " +
            "through an epic ballad."; 
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        return game_state;
    },

    "watch_duty": function(game_state) {
        var messages = [
            "you don't see anything interesting.",
            "you see a \"birdle,\" a bird standing on a turtle.",
            "you see sea in every direction.",
            "you see some storm clouds.",
        ];
        game_state.message = "During your watch duty, " +
            messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "wealthy_people_sneer": function(game_state) {
        game_state.message = "Some truly wealthy people see you and sneer.";
        return game_state;
    },

    "witch_burning": function(game_state) {
        var messages = [
            "You find a mob of peasants about to perform a witch burning.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = null;
        return game_state;
    },

    "wizard_compensates_you": function(game_state) {
        var messages = [
            "The wizard compensates you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.items["yellow mushroom"] -= 1;
        get_item(game_state, random_choice(["potion of love", 
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
            "The wizard choaks on the mushroom and dies.",
        ];
        game_state.message = messages[random_int(messages.length)];
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
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "wizard_leaves_without_you": function(game_state) {
        var messages = [
            "The wizard ignores you and sails away before you can " +
            "get to his boat.",
            "The wizard leaves without you.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "wizard_sends_you_to_arctic": function(game_state) {
        var messages = [
            "The wizard catches you snooping around and conks you on the " +
            "head with his staff.",
        ];
        game_state.message = messages[random_int(messages.length)];
        move_character(game_state, "arctic");
        return game_state;
    },

    "wizard_stops_you_trashing": function(game_state) {
        var messages = [
            "The wizard comes in while you're trashing the place and starts " +
            "yelling obscenities.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.is_threatened = true;
        game_state.character.person = "wizard";
        return game_state;
    },

    "wizard_unjust": function(game_state) {
        var messages = [
            "Having no further use for you, the wizard turns you into a " +
            "frog.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.is_frog = true;
        game_state.character.items["yellow mushroom"] -= 1;
        return game_state;
    },

    "wizard_wants_mushroom": function(game_state) {
        var messages = [
            "You find the wizard. He says he can smell that you have a " + 
            "yellow mushroom and asks if he can have it.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.person = "wizard";
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
        game_state.message = messages[random_int(messages.length)];
        game_state.persons.eve.attracted += 1;
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
        game_state.message = messages[random_int(messages.length)];
        game_state.persons.felicity.attracted += 1;
        if (game_state.persons["felicity"].attracted > 2 && 
            game_state.persons["felicity"].name === "the fat lady") {
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
        game_state.message = messages[random_int(messages.length)];
        game_state.persons.felicity.attracted += 1;
        return game_state;
    },

    "wowed_olga": function(game_state) {
        var messages = [
            "You play a game of darts together. " +
            "She is delighted when she beats you.",
            "You find out that you both like " +
            "cats. She says her cat loves being petted.",
            "You amuse her with realistic impreesions of bird " +
            "songs. She says she likes a man who's good with his tongue.",
            "She is impressed with your juggling and says she likes a man " +
            "with skilled hands.", 
            "You say the flower in her hair goes well with " +
            "her eyes. She says you can smell her flower if you like.",
            "She sits on your lap when you buy her a drink.",
            "You both laugh about how bad the ale is. The bartender " +
            "is not pleased.",
            "You have a meal together.",
            "She plays with your hair while you talk of your exploits."
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.persons["olga"].attracted += 1;
        if (game_state.persons["olga"].attracted > 2 && 
            game_state.persons["olga"].name === "the pretty lady") {
            game_state.persons.olga.name = "Olga";
            game_state.message += " She tells you her name is Olga. " +
            "You also tell her your name.";
        }
        return game_state;
    },

    "wowed_olga_upstairs": function(game_state) {
        var messages = [
            "You make passionate love together.",
            "You sleep together.",
            "Olga does lots of nice things to you.",
            "Olga whispers that she's been stalking you.",
            "You both stay up late talking by candlelight.",
            "Olga tells you her life story. Half of it seems made up.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.persons["olga"].attracted += 1;
        if (game_state.persons["olga"].attracted > 5) {
            game_state.message = "Olga grabs your hand. \"Life's too short, " +
            "let's get married!\"";
            game_state.marriage = true;
        }
        return game_state;
    },

    //x
    
    //y
    
    "you_get_away_with_it": function(game_state) {
        var messages = [
            "Since Lord Arthur is dead, you get away with it.",
        ];
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "you_get_mobbed": function(game_state) {
        var messages = [
            "The local peasants mob you. They take your money and your life.",
        ];
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
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
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

}
