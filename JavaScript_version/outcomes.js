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

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function random_int(n) {
    return Math.floor(Math.random() * n);
}

function burn(game_state) {
    game_state.places[game_state.character.place].burnable = false;
    game_state.places[game_state.character.place].name = "the smoldering remains of " + 
    game_state.places[game_state.character.place].name;
    game_state.character.person = null;
    game_state.message = "You find yourself in " +
    game_state.places[game_state.character.place].name + ".";
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

var he_she_they = {
    "female": "she",
    "male": "he",
    "group": "they"
}

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

function lose_all_items(game_state) {
    for (var item in game_state.character.items) {
        game_state.character.items[item] = 0;
    }
    game_state.message += " You now have no items.";
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
    if (game_state.character.items["four-leaf clover"] < 1) {
        game_state.character.is_dead = true;
    } else {
        game_state.message += " Or at least that's what you think " +
        "would have happened if you didn't have a lucky four-leaf clover.";
    }
}

var outcomes = {

    //a

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

    "caught": function(game_state) {
        game_state.message = 
            "You run like the Devil, but " + get_name(game_state) +
            " also " + conjugate(game_state, "run") + " like thd Devil and " +
            conjugate(game_state, "overtake") + " you.";
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

    "caught_by_olga": function(game_state) {
        game_state.message = 
            "The Devil is pretty fast, but Olga is faster and prettier. " +
            "She catches you and strangles you to death.";
        game_state.character.is_dead = true;
        return game_state;
    },

    //d

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
        game_state.message = 
            "Your prayers are answered.";
        burn(game_state);
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
            "God does nothing for you, but you do " +
            "find a bag of jewels someone left on the counter.";
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

    "guards_stop_you_singing":function(game_state) {
        game_state.message = "The local guards see you singing and conclude " +
        "that you must be a lunatic.";
        game_state.character.person = "guards";
        game_state.character.is_threatened = true;
        return game_state;
    },

    //h
    
    //i
    
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

    "kill_self": function(game_state) {
        var messages = [
            "You perform the ritual of seppuku.",
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

    //n

    "no_one_cares":function(game_state) {
        game_state.message = "You sing your favorite song. No one cares.";
        return game_state;
    },

    //o
    
    //p

    "pick_many_colored_mushroom":function(game_state) {
        game_state.message = "You pick a many colored mushroom.";
        get_item(game_state, "many colored mushroom");
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
