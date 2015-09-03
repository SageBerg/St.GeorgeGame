"use strict";

var actions = require("./actions").actions;
var items   = require("./items");
var raffle  = require("./raffle");

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes;
    if (game_state.character.is_threatened === true && 
        game_state.action !== "Attack" &&
        game_state.action !== "Enter the void." &&
        game_state.action !== "Leave in a puff." &&
        game_state.action !== "Run like the Devil." &&
        game_state.action !== "TELL_GUARDS" &&
        game_state.action !== "Waddle like God.") {
        possible_outcomes = actions["GET_ATTACKED"](game_state, {});
    } else {
        possible_outcomes = actions[game_state.action](game_state, {});
    }
    return raffle.get(possible_outcomes);
}

exports.apply_outcome = function apply_outcome(outcome, game_state) {
    return outcomes[outcome](game_state);
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

function clover(game_state) {
    if (game_state.character.items["four-leaf clover"] < 1) {
        game_state.character.is_dead = true;
    } else {
        game_state.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
}

function conjugate(game_state, word) {
    if (game_state.persons[game_state.character.person].type !== "group") {
        return word + "s"; 
    }
    return word
} 

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

function get_place(game_state) {
    return game_state.places[game_state.character.place];
}

function get_person(game_state) {
    return game_state.persons[game_state.character.person];
}

function get_subject(game_state) {
    return he_she_they[game_state.persons[game_state.character.person].type];
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

function lose_all_items(game_state) {
    for (var item in game_state.character.items) {
        game_state.character.items[item] = 0;
    }
    game_state.character.money = "none";
    game_state.message += " You now have no items.";
    game_state.message += " You now have no money.";
}

function random_choice(array) {
    return array[random_int(array.length)]; 
}

function random_int(n) {
    return Math.floor(Math.random() * n);
}

function get_random_adjacent_destination(game_state) {
    var links = game_state.places[game_state.character.place].links;
    return links[random_int(links.length)];
}

var he_she_they = {
    "female": "she",
    "male": "he",
    "group": "they"
}

var outcomes = {

    //a

    "an_excuse_lunatic": function(game_state) {
        game_state.message = "\"A " + game_state.character.excuse + 
            " lunatic,\" one of the guards says. They arrest you " +
            "and throw you in prison with the other lunatics.";
        move_character(game_state, "prison");
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "apocalypse": function(game_state) {
        game_state.message =
            "You start annihilating everything, but the Four Horsemen of " +
            "the Apocalypse steal your thunder. You perish in the chaos.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "assassin_prayer_answered": function(game_state) {
        game_state.message = 
            "Your prayers aren't answered, but the assassins' are.",
        game_state.character.is_dead = true;
        return game_state;
    },

    "assassinated": function(game_state) {
        game_state.message = "The first woman you talk to turns out to be an " +
        "assasin. She assassinates you.";
        game_state.character.is_dead = true;
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

    "assassins_notice_dance": function(game_state) {
        game_state.message = "The assassins immediately notice you dancing.";
        game_state.character.is_dead = true;
        return game_state;
    },

    //b

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

    "burn": function(game_state) {
        burn(game_state);
        return game_state;
    },

    //c

    "cannot_afford": function(game_state) {
        game_state.message = "You cannot afford this item." 
        return game_state;
    },

    "cannot_dance": function(game_state) {
        game_state.message = "You can't dance a jig, you're in the ocean." 
        return game_state;
    },

    "cannot_hear_assassin": function(game_state) {
        game_state.message = "Your singing is too laud for you to hear the " +
            "assassin sneaking up behind you." 
        clover(game_state);
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
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_and_die": function(game_state) {
        var messages = [
            "While you're dancing, you twist your ankle, fall to the " +
            "ground, try to catch yourself, but break your wrist, " +
            "hit your head on the ground and break your neck.",
            "You dance so vigorously you become exhausted and die.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        clover(game_state);
        return game_state;
    },

    "dance_and_drown": function(game_state) {
        var messages = [
            "You drown trying to dance a jig.",
        ] 
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
        ] 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "dance_and_slip": function(game_state) {
        var messages = [
            "You slip on a rock and fall to your death in the darkness.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        die(game_state);
        return game_state;
    },

    "dance_fails_to_cheer": function(game_state) {
        var messages = [
            "Dancing fails to cheer you up.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_for_coin": function(game_state) {
        var messages = [
            "The locals are entertained by your antics and toss " +
            "you some coins.",
            "A noble takes pitty on you and gives some money.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        get_money(game_state, "pittance");
        return game_state;
    },

    "dance_in_puddle": function(game_state) {
        var messages = [
            "You dance through a puddle and get your britches wet.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "dance_with_goblins": function(game_state) {
        var messages = [
            "Some goblins dance with you and then kill you.",
        ] 
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
        ] 
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
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "distasteful": function(game_state) {
        game_state.message = "You find the flavor of the ground distasteful.";
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

    //f
    
    "find_a_cat": function(game_state) {
        game_state.message = "You find a cat.";
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

    "find_st_george": function(game_state) {
        game_state.message = "You find St. George.";
        game_state.character.person = "st_george";
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

    "go_upstairs_and_die":function(game_state) {
        game_state.message = "Olga invites you to her room upstairs. " +
            "When you get there, lots of passionate stabbing ensues.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "go_upstairs_with_olga":function(game_state) {
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

    "god_commits_arson":function(game_state) {
        burn(game_state); //the order matters here since burn() 
                          //overwrites the message
        game_state.message = "Your prayers are answered. " + 
            game_state.message;
        return game_state;
    },

    "god_gives_you_a_wife":function(game_state) {
        game_state.message = 
            "Your prayers for a beautiful wife are answered, but she soon " +
            "leaves you.";
        return game_state;
    },

    "god_gives_you_jewels":function(game_state) {
        game_state.message = 
            "God does nothing for you, but you " +
            "find a bag of jewels someone left on the counter.";
        get_item(game_state, "bag of jewels");
        return game_state;
    },

    "god_shows_you_the_way":function(game_state) {
        game_state.message = 
            "God speaks to you and shows you the way.";
        return game_state;
    },

    "god_showers_you_with_gold":function(game_state) {
        game_state.message = "God rewards your devotion with a large fortune.";
        get_money(game_state, "large_fortune");
        return game_state;
    },

    "god_tells_you_to_marry":function(game_state) {
        game_state.message = 
            "God tells you to get married.";
        return game_state;
    },

    "god_tests_you":function(game_state) {
        game_state.message = 
            "God decides to test you.";
        lose_all_items(game_state);
        return game_state;
    },

    "ground_tastes_cold":function(game_state) {
        game_state.message = "The ground tastes really cold.";
        return game_state;
    },

    "guards_stop_you_dancing":function(game_state) {
        game_state.message = "The local guards see your jig and conclude " +
        "that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_killing":function(game_state) {
        game_state.message = "The local guards see your killing everybody " +
            "and conclude that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_licking":function(game_state) {
        game_state.message = "The local guards see you licking the ground " +
            "and conclude you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    "guards_stop_you_singing":function(game_state) {
        game_state.message = "The local guards see you singing and conclude " +
        "that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    //h
    
    //i
    
    "infection": function(game_state) {
        game_state.message = "You catch a nasty infection and spend weeks " +
            "fighting it.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "ignored": function(game_state) {
        game_state.message = "God ignores your prayers.";
        return game_state;
    },

    //j
    
    //k

    "kill": function(game_state) {
        game_state.message =
            "You kill " +
            game_state.persons[game_state.character.person].name + ".";
        game_state.persons[game_state.character.person].alive = false;
        game_state.character.is_threatened = false;
        game_state.character.person = null;
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
        game_state.message = messages[random_int(messages.length)];
        game_state.character.is_dead = true;
        return game_state;
    },

    "kill_self_in_fit_of_rage": function(game_state) {
        var messages = [
            "You start with yourself.",
            "You make no exceptions.",
        ];
        game_state.message = messages[random_int(messages.length)];
        game_state.character.is_dead = true;
        return game_state;
    },

    "killed_by_hero": function(game_state) {
        game_state.message =
            "You throw out your arm destroying the first three " + 
            "civilizations and an opportunistic hero slays you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "killed_by_olga": function(game_state) {
        game_state.message =
            "When you squeeze her butt, she stabs you in the heart with a " +
            "poisoned dagger.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "killed_in_future": function(game_state) {
        game_state.message =
            "You wreak havoc on a titanic scale, but you eventually fall " +
            "asleep. By the time you wake up, science has advanced so much " +
            "that the world government simply nukes you into oblivion.";
        game_state.character.is_dead = true;
        return game_state;
    },

    //l

    "left_in_a_puff": function(game_state) {
        game_state.message = "";
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
            "disappearing into the crowd",
            "A woman becomes annoyed with your leering and throws salt in " +
            "your eyes.",
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

    "lose_fight": function(game_state) {
        game_state.message = 
            "You get killed by " + 
            game_state.persons[game_state.character.person].name + ".";
        game_state.character.is_dead = true;
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
            ] 
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

    "mermaid_dislikes_your_song":function(game_state) {
        game_state.message = "The mermaid is annoyed by your song and " +
            "pushes you into the ocean.";
        move_character(game_state, "ocean");
        return game_state;
    },

    "mermaid_likes_your_dance":function(game_state) {
        game_state.message = "The mermaid laughs and claps her hands. " +
            "She is completely in awe of your legs.";
        get_person(game_state).attracted += 1;
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
        move_character(game_state, get_random_adjacent_destination(game_state));
        return game_state;
    },

    //n

    "no_one_cares":function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },

    "not_impressed":function(game_state) {
        game_state.message = capitalize(get_person(game_state).name) + 
            " is not impressed.";
        return game_state;
    },

    //o
    
    //p

    "pick_many_colored_mushroom":function(game_state) {
        game_state.message = "You pick a many colored mushroom.";
        get_item(game_state, "many colored mushroom");
        return game_state;
    },

    "pirates_ruin_song":function(game_state) {
        game_state.message = "You are joined in song by a gang of " +
            "drunken pirates. They spill rum on you and ruin your song.";
        game_state.character.person = "pirates";
        return game_state;
    },

    "priestess_takes_offense":function(game_state) {
        game_state.message = "A priestess finds your lyrics " +
        random_choice(["blasphemous", "cliché", "crude", "idiotic", "lude", 
                       "mildly offensive", "uncreative"]) +
        " and has you thrown out of the church.";
        move_character(game_state, "streets");
        return game_state;
    },

    //q
    
    //r

    "rebuffed_by_olga":function(game_state) {
        game_state.message = "Her eyes glaze over while you struggle make " +
            "yourself sound interesting.";
        return game_state;
    },

    //s

    "set_self_on_fire":function(game_state) {
        game_state.message = "You accidently set yourself on fire and " +
        "promptly burn to a crisp.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "sing_about_lords":function(game_state) {
        var messages = [
            "You sing a song about Lord Arthur, captain of the pirates.",
            "You sing a song about Lord Bartholomew, leader of the peasants.",
            "You sing a song about Lord Carlos, kingpin of the assassins.",
            "You sing a song about Lord Daniel, leader of the guards."
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "sing_at_lord_carlos_manor":function(game_state) {
        var messages = [
            "This is no place for merry-making. You are soon assassinated.",
            "Your singing alerts Lord Carlos' men to your presense. " +
            "You are soon assassinated.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        game_state.character.is_dead = true;
        return game_state;
    },

    "sing_to_greeks":function(game_state) {
        game_state.message = "As you sing, a ship sails by. The captain is " +
            "tied to the mast. He is not impressed.";
        return game_state;
    },

    "sing_to_mermaid":function(game_state) {
        game_state.message = "The mermaid enjoys your singing and sings " +
            "with you.";
        get_person(game_state).attracted += 1;
        return game_state;
    },

    "sing_to_olga":function(game_state) {
        var messages = [
            "Olga interupsts your song by kissing you.",
            "You sing a romantic ballad. Olga is impressed.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        game_state.persons.olga.attracted += 1;
        return game_state;
    },

    "st_george_joins_you_in_prayer":function(game_state) {
        game_state.message = "St. George joins you in prayer."
        game_state.character.person = "st_george";
        return game_state;
    },

    "start_tripping":function(game_state) {
        game_state.message = "You start feeling strange."
        game_state.character.is_tripping = true;
        game_state.character.items["many colored mushroom"] -= 1;
        return game_state;
    },

    "starve": function(game_state) {
        game_state.message =
            "You smash towns, flatten forests, level mountains, and " +
            "ultimately run out of food.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "swim_a_jig": function(game_state) {
        game_state.message = "You swim a jig.";
        return game_state;
    },

    //t

    "think_about_lord_arthur":function(game_state) {
        game_state.message = "You think it would be a bad idea to join " +
        "Lord Arthur's crew. He gives no choice.";
        move_character(game_state, "pirate_ship");
        return game_state;
    },

    "think_about_lord_bartholomew":function(game_state) {
        game_state.message = "You think about Lord Bartholomew.";
        return game_state;
    },

    "think_about_olga":function(game_state) {
        if (game_state.persons.olga.name === "the pretty lady") {
            game_state.message = "You think about a pretty lady you saw at " +
                "the tavern.";
        } else {
            game_state.message = "You think about Olga and feel lonely.";
        }
        return game_state;
    },

    "think_about_sex":function(game_state) {
        game_state.message = "Since you're a man, you think about sex.";
        return game_state;
    },

    "think_ax":function(game_state) {
        game_state.message = "While you're thinking, a guard hands you an ax " +
        "and tells you to chop some firewood for the cooks.";
        get_item(game_state, "ax");
        return game_state;
    },

    "think_bad_smell":function(game_state) {
        game_state.message = "You think the bad smell might be coming from " + 
        "you.";
        return game_state;
    },

    "think_bats":function(game_state) {
        game_state.message = "You think you hear bats, but you also think " + 
        "you might be crazy.";
        return game_state;
    },

    "think_cold":function(game_state) {
        game_state.message = "You can't think about much besides how cold " +
        "you are.";
        return game_state;
    },

    "think_darkness":function(game_state) {
        game_state.message = "You think about the darkness that is crushing " +
        "in on you from all sides.";
        return game_state;
    },

    "think_death":function(game_state) {
        game_state.message = "You think about death.";
        return game_state;
    },

    "think_elaborate_scheme":function(game_state) {
        game_state.message = "You concoct an elaborate scheme.";
        return game_state;
    },

    "think_fire":function(game_state) {
        game_state.message = "You think about fire.";
        return game_state;
    },

    "think_four_ideas":function(game_state) {
        game_state.message = "You come up with four brilliant ideas.";
        return game_state;
    },

    "think_get_lost":function(game_state) {
        game_state.message = "You get lost in your thoughts."; 
        return game_state;
    },

    "think_ice":function(game_state) {
        game_state.message = "You think about ice."; 
        return game_state;
    },

    "think_jump":function(game_state) {
        game_state.message = "You think you can survive the jump from the " +
        "top of the tower."; 
        game_state.character.is_dead = true;
        return game_state;
    },

    "think_meaning_of_life":function(game_state) {
        game_state.message = "You ponder the meaning of life and " +
        "feel smug for being so philosophical.";
        return game_state;
    },

    "think_ocean_is_big":function(game_state) {
        game_state.message = "You think the ocean is really big."; 
        return game_state;
    },

    "think_of_getting_stabbed":function(game_state) {
        game_state.message = "You think about how painful it would be to " +
        "get stabbed. You soon find out.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "think_peasant_women":function(game_state) {
        game_state.message = "You wonder if any peasant women would go for " +
        "a man like you.";
        return game_state;
    },

    "think_pirates_laugh":function(game_state) {
        game_state.message = "Some pirates laugh at you for thinking.";
        return game_state;
    },

    "think_reevaluate_life":function(game_state) {
        game_state.message = "You spend some time reevaluating your life " +
            "and conclude that you need to stay the course.";
        return game_state;
    },

    "think_suffocation":function(game_state) {
        game_state.message = "You think about suffocation.";
        return game_state;
    },

    "think_think_think":function(game_state) {
        game_state.message = "All you can think is \"Think. Think. Think.\""; 
        return game_state;
    },

    "think_you_shouldnt_be_here":function(game_state) {
        game_state.message = "You think you probably shouldn't be here."; 
        return game_state;
    },

    "trip_over_a_cat":function(game_state) {
        game_state.message = "You trip over a cat and break your neck.";
        clover(game_state);
        return game_state;
    },

    //u
    
    //v

    //w

    "wake_up":function(game_state) {
        var messages = [
            "You wake up well-rested some hours later.",
            "You have a nightmare about weasels.",
            "You have a wonderful dream that you are in bed with Lord " +
            "Carlos' daughter.",
            "You dream of fire.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

    "wake_up_assassinated":function(game_state) {
        game_state.message = "You are rudely awakened by an assassin's dagger.";
        clover(game_state);
        return game_state;
    },

    "wake_up_dead":function(game_state) {
        game_state.message = "You wake up dead."; 
        clover(game_state);
        return game_state;
    },

    "wake_up_drown":function(game_state) {
        game_state.message = "You drown in your sleep.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wake_up_in_dungeon":function(game_state) {
        game_state.message = "You wake up in Lord Carlos' dungeon " +
            "and eventually die there.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wake_up_in_prison":function(game_state) {
        game_state.message = "You are rousted by some guards who toss you in " +
            "prison with the other lunatics.";
        move_character(game_state, "prison");
        game_state.character.person = "other_lunatics";
        return game_state;
    },

    "wake_up_richer":function(game_state) {
        game_state.message = "You wake with a few coins on your cloak."; 
        get_money(game_state, "pittance");
        return game_state;
    },

    "wake_up_robbed":function(game_state) {
        game_state.message = "You wake up robbed of all your wordly " +
            "possessions."; 
        lose_all_items(game_state);
        return game_state;
    },

    "wake_up_somewhere_else":function(game_state) {
        game_state.message = "You wake up a few hours later."
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        return game_state;
    },

    "wake_up_weasel":function(game_state) {
        game_state.message = "You wake up just in time to see an assassin " +
            "slip a weasel through the bars of your cell. " +
            "The weasal kills you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wake_up_with_cat":function(game_state) {
        game_state.message = "You are pleasantly awakened by a cat rubbing " +
            "up against you."; 
        get_item(game_state, "cat");
        return game_state;
    },

    "wander_while_singing":function(game_state) {
        game_state.message = "You wander aimlessly as you work your way " +
            "through an epic ballad."; 
        move_character(game_state, 
                       get_random_adjacent_destination(game_state));
        return game_state;
    },

    "wizard_complains":function(game_state) {
        game_state.message = "The wizard complains that you are singing " +
            "off-key. He turns you into a toad and stomps on you.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "wowed_olga":function(game_state) {
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
        ] 
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

    "wowed_olga_upstairs":function(game_state) {
        var messages = [
            "You make passionate love together.",
            "You sleep together.",
            "Olga does lots of nice things to you.",
            "Olga whispers that she's been stalking you.",
            "You both stay up late talking by candlelight.",
            "Olga tells you her life story. Half of it seems made up.",
        ] 
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
    
    //z

    "zone_out":function(game_state) {
        var messages = [
            "You zone out while " + 
            get_name(game_state) + " " + conjugate(game_state, "talk") +
            " to you.",
            "You space out while " + 
            get_name(game_state) + " " + conjugate(game_state, "talk") +
            " about Lord Bartholomew.",
        ] 
        game_state.message = messages[random_int(messages.length)];
        return game_state;
    },

}
