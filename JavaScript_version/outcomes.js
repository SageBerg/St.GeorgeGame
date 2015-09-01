"use strict";

var actions = require("./actions").actions;
var items   = require("./items");
var raffle  = require("./raffle");

exports.get_outcome = function get_outcome(game_state) {
    var possible_outcomes;
    if (game_state.character.is_threatened === true && 
        game_state.action !== "Attack" &&
        game_state.action !== "Leave in a puff." &&
        game_state.action !== "Run like the Devil." &&
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

function random_int(n) {
    return Math.floor(Math.random() * n);
}

function move_character(game_state, destination) {
    game_state.character.place = destination;
    game_state.character.is_threatened = false;
    game_state.character.person = null;
    game_state.message += " You find yourself in " + 
        game_state.places[destination].name + ".";
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

/*
var he_she_they = {
    "female": "she",
    "male": "he",
    "group": "they"
}
*/

function conjugate(game_state, word) {
    if (game_state.persons[game_state.character.person].type !== "group") {
        return word + "s"; 
    }
    return word
} 

function get_subject(game_state) {
    return he_she_they[game_state.persons[game_state.character.person].type];
}

function get_name(game_state) {
    return game_state.persons[game_state.character.person].name;
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

function add_move_message(game_state) {
    game_state.message += "You find yourself in " + 
        game_state.places[game_state.character.place].name + ".";
}

function clover(game_state) {
    if (game_state.character["four-leaf clover"] < 1) {
        game_state.character.is_dead = true;
    } else {
        game_state.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
}

var outcomes = {

    "apocalypse": function(game_state) {
        game_state.message =
            "You start annihilating everything, but the Four Horsemen of " +
            "the Apocalypse steal your thunder. You perish in the chaos.";
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

    "cannot_afford": function(game_state) {
        game_state.message = "You cannot afford this item." 
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

    "caught_by_olga": function(game_state) {
        game_state.message = 
            "The Devil is pretty fast, but Olga is faster and prettier. " +
            "She catches you and strangles you to death.";
        game_state.character.is_dead = true;
        return game_state;
    },

    "distasteful": function(game_state) {
        game_state.message = "You find the flavor of the ground distasteful.";
        return game_state;
    },

    "earn_small_fortune_in_coins": function(game_state) {
        game_state.message = 
            "A crowd gathers to hear your singing and " + 
            "tosses you a small fortune in coins.";
        get_money(game_state, "small_fortune");
        return game_state;
    },

    "escaped": function(game_state) {
        game_state.message = 
            "The Devil is very fast, so you manage to get away.";
        var links = game_state.places[game_state.character.place].links
        var destination = links[random_int(links.length)];
        move_character(game_state, destination);
        return game_state;
    },

    "escaped_unmarried": function(game_state) {
        game_state.message = 
            "The Devil is very fast, so you manage to get away unmarried.";
        if (game_state.character.person === "olga") {
            game_state.persons.olga.attracted = 0;
        }
        var links = game_state.places[game_state.character.place].links
        var destination = links[random_int(links.length)];
        move_character(game_state, destination);
        return game_state;
    },

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

    "get_attacked": function(game_state) {
        var attempted_action = 
            game_state.action[0].toLowerCase() +
            game_state.action.slice(1, game_state.action.length - 1);
        game_state.message = 
            "You try to " + attempted_action + ", but " + 
            get_name(game_state) + " " +
            conjugate(game_state, "kill") + " you."
        game_state.character.is_dead = true;
        return game_state;
    },

    "get_a_four-leaf_clover": function(game_state) {
        game_state.message = "You don't find any flowers, but you find a " + 
        "four-leaf clover instead.";
        get_item(game_state, "four-leaf clover");
        game_state.character.person = null;
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

    "kill": function(game_state) {
        game_state.message =
            "You kill " +
            game_state.persons[game_state.character.person].name + ".";
        game_state.persons[game_state.character.person].alive = false;
        game_state.character.is_threatened = false;
        game_state.character.person = null;
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

    "lose_fight": function(game_state) {
        game_state.message = 
            "You get killed by " + 
            game_state.persons[game_state.character.person].name + ".";
        game_state.character.is_dead = true;
        return game_state;
    },

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
                "of his pirate ship. By the time the ceremony is over the " +
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
            "During your invstigation, you strike up a conversation with " +                "a pretty lady.";
        } else {
            game_state.message = 
            "During your invstigation, you find yourself talking with Olga.";
        }
        game_state.character.person = "olga";
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
        var links = game_state.places[game_state.character.place].links;
        var destination = links[random_int(links.length)];
        move_character(game_state, destination);
        return game_state;
    },

    "no_one_cares":function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },

    "pick_many_colored_mushroom":function(game_state) {
        game_state.message = "You pick a many colored mushroom.";
        get_item(game_state, "many colored mushroom");
        return game_state;
    },

    "rebuffed_by_olga":function(game_state) {
        game_state.message = "Her eyes glaze over while you struggle make " +
            "yourself sound interesting.";
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

    "trip_over_a_cat":function(game_state) {
        game_state.message = "You trip over a cat and break your neck.";
        clover(game_state);
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

}
