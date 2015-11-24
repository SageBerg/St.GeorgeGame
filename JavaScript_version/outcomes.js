"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

var actions   = require("./actions").actions;
var functions = require("./functions");
var items     = require("./items");

var FEMALE    = "female";
var MALE      = "male";
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

var outcomes = {

    //a

    "a_rich_lunatic": function(game) {
        game.message = "\"A " + game.character.excuse +
            " lunatic,\" one of the guards says as they walk away.";
        game.character.person = null;
        return game;
    },

    "admire_jewels": function(game) {
        var messages = [
            "You conclude that your jewels outclass everything else you own.",
            "You notice an imperfection in your largest diamond and can't " +
            "unsee it.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "admire_jewels_and_die": function(game) {
        var messages = [
            "You notice the reflection of a dagger in a jewel, just after " +
            "it's too late.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "admire_your_bosoms": function(game) {
        var messages = [
            "You feel attractive.",
            "You feel beautiful.",
            "You feel like a goddess.",
            "You notice that one of them is slightly bigger than the other.",
            "You wonder if they have milk in them.",
            "Your bosoms look very good.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "alley_is_clear": function(game) {
        var messages = [
            "If there are any assassins here, they're hidden very well.",
            "The dark alley appears to be free of assassins.",
            "The dark alley appears to be safe.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "already_dead": function(game) {
        var messages = [
            "The assassin says he's already dead.",
            "The assassin says he can't kill him because he's already dead.",
            "The assassin says your request can't be completed because " +
            "he's already dead.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "an_excuse_lunatic": function(game) {
        game.message = "\"A " + game.character.excuse +
            " lunatic,\" one of the guards says. They arrest you " +
            "and throw you in prison with the other lunatics.";
        game.arrested();
        return game;
    },

    "anna_death": function(game) {
        game.message = "Wrong answer. Lord Carlos' daughter " +
            "assassinates you.";
        game.character.is_dead = true;
        return game;
    },

    "annoy_blind_bartender": function(game) {
        var messages = [
            "\"All drunks claim to be brave,\" the blind bartender says.",
            "The blind bartender says he doubts you killed a dragon.",
            "The blind bartender starts pretending to also be deaf.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "annoy_eve": function(game) {
        var messages = [
            "Lord Carlos' daughter points out several inconsistencies in " +
            "your story.",
            "By the time you're done boasting, you realize Lord Carlos' " +
            "daughter wasn't listening.",
            "Lord Carlos' daughter says if you were really brave you " +
            "wouldn't be hiding here in her bedroom.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "annoy_olga": function(game) {
        var messages = [
            "Her eyes glaze over as you struggle to remember times you " +
            "were brave.",
            "She sees through your lies.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "annoy_simple_peasant": function(game) {
        var messages = [
            "Even the simple peasant thinks you're full of it.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "annoy_st_george": function(game) {
        var messages = [
            "St. George warns you of the dangers of " +
            functions.random_choice(["arrogance", "hubris", "pride",
                           "self-importance",]) +
            ".",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "annoy_st_george_and_die": function(game) {
        var messages = [
            "You tell St. George about the time you burnt a house down. " +
            "He slays you for your wicked ways.",
            "St. George becomes irate when you claim to have slain a " +
            "dragon. He obliterates you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "annoy_wizard": function(game) {
        var messages = [
            "Part way through your story, the wizard makes you more " +
            "interesting by turning you into a frog.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_frog = true;
        return game;
    },

    "another_pot_of_gold": function(game) {
        var messages = [
            "You find another pot of gold at the other end of the rainbow.",
        ];
        game.message = functions.random_choice(messages);
        game.get_money("large_fortune");
        return game;
    },

    "apocalypse": function(game) {
        game.message =
            "You start annihilating everything, but the Four Horsemen of " +
            "the Apocalypse steal your thunder. You perish in the chaos.";
        game.die();
        return game;
    },

    "apologize": function(game) {
        var messages = [
            "\"Oh, you're not sorry yet,\" she says as she steps toward you.",
            "A bystander notices the assassin threatening you. "+
            "\"The man said he was sorry, isn't that enough?\" " +
            "he says. \"No,\" the assassin replies.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "apologize_and_die": function(game) {
        game.message = "\"I'm afraid 'sorry' won't cut it.\" Her " +
            "knife does.",
        game.die();
        return game;
    },

    "arm_wrestle_and_impressment": function(game) {
        game.message = "You manage to hold out long enough for Lord " +
            "Arthur to bark orders at his men to press-gang hands for the " +
            "voyage.";
        game.move_character("pirate_ship");
        return game;
    },

    "arm_wrestle_and_impressment_not": function(game) {
        game.message = "You manage to hold out long enough for Lord " +
            "Arthur to bark orders at his men to press-gang hands for the " +
            "voyage. The pirate you were arm wrestling seems glad to " +
            "have an excuse to call the match a tie and not lose to a woman.";
        game.character.person = null;
        return game;
    },

    "arm_wrestle_pirates": function(game) {
        game.message = "You lose what little dignity you had left.";
        return game;
    },

    "arm_wrestle_pirates_ocean": function(game) {
        game.message = "Even the lady pirates can easily beat you. " +
            "They toss you in the ocean when they're done humiliating you.";
        game.move_character("ocean");
        return game;
    },

    "arrive_at_mermaid_rock": function(game) {
        game.message = "A mermaid guides you to a rocky island.";
        game.move_character("mermaid_rock");
        game.character.person = "mermaid";
        return game;
    },

    "ask_eve": function(game) {
        game.message = "You find Lord Carlos' daughter in her bedroom " +
            "and ask her about assassins. She says they've all been looking " +
            "for you since they found out about you and her.";
        game.character.person = "eve";
        return game;
    },

    "assassin_prayer_answered": function(game) {
        game.message =
            "Your prayers aren't answered, but the assassins' are.",
        game.clover();
        return game;
    },

    "assassinate_lord_arthur": function(game) {
        game.message = "The assassin says your wish will be granted. " +
            "When you meet him in the tavern a few weeks later, he leaves " +
            "you with Lord Arthur's prized possession as proof.";
        game.persons.lord_arthur.alive = false;
        game.get_weapon("jeweled_cutlass");
        game.move_character("tavern");
        return game;
    },

    "assassinate_lord_bartholomew": function(game) {
        game.message = "The assassin says your wish will be granted." +
            " When you meet him in the tavern a few weeks later, he " +
            "leaves you with Lord Bartholomew's prized possession as proof.";
        game.persons.lord_bartholomew.alive = false;
        game.get_weapon("long_pitchfork");
        game.move_character("tavern");
        return game;
    },

    "assassinate_lord_daniel": function(game) {
        game.message = "The assassin says your wish will be granted." +
            " When you meet him in a dark alley a few weeks later, he " +
            "leaves you with Lord Daniel's prized possession as proof.";
        game.persons.lord_daniel.alive = false;
        game.get_weapon("iron_hammer");
        game.move_character("dark_alley");
        return game;
    },

    "assassinated": function(game) {
        game.message = "The first woman you talk to turns out to be " +
        "an assassin. She assassinates you.";
        game.die();
        return game;
    },

    "assassinated_in_church": function(game) {
        game.message = "It was a good time to make peace with God. " +
        "Lord Carlos steps out from behind a pillar and assassinates you.";
        game.die();
        return game;
    },

    "assassinated_in_church_not": function(game) {
        game.message = "You see Lord Carlos sitting in one of the " +
            "pews, but he doesn't recognize you since you're a woman now.";
        game.character.person = "lord_carlos";
        return game;
    },

    "assassins_approach": function(game) {
        game.message =
            "Some men in dark cloaks notice you singing " +
            "and start edging toward you.";
        game.character.person = "assassins";
        game.character.is_threatened = true;
        return game;
    },

    "assassins_catch_you_fishing": function(game) {
        game.message = "You don't catch any fish, but the assassins " +
            "catch you.";
        game.clover();
        game.character.person = null;
        return game;
    },

    "assassins_notice_dance": function(game) {
        game.message = "The assassins immediately notice you dancing.";
        game.character.is_dead = true;
        return game;
    },

    "assassins_sit_down": function(game) {
        game.message =
            "Some men in dark cloaks sit down next to you, but don't seem " +
            "to notice you.";
        game.character.person = "assassins";
        return game;
    },

    "attract_lady_frog": function(game) {
        game.message = "Your croaking attracts a lady frog, but " +
            "you're not sure what to do with her.";
        return game;
    },

    "audience_with_lord_bartholomew": function(game) {
        var messages = [
            "The first person you meet is Lord Bartholomew.",
            "You are granted one.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "lord_bartholomew";
        return game;
    },

    "audience_with_lord_daniel": function(game) {
        var messages = [
            "The guards mistake you for someone important and take you " +
            "to Lord Daniel.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "lord_daniel";
        return game;
    },

    //b

    "be_shrub": function(game) {
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
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "be_shrub_and_die": function(game) {
        var messages = [
            "A swarm of caterpillars eats all of your leaves.",
            "You perish in a forest fire.",
            "You catch a bad case of root rot.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "beat_up_by_guards": function(game) {
        var messages = [
            "When you try to take the warden's keys, the guards notice and " +
            "beat the " + functions.random_choice(["crap", "snot", "tar"]) +
            " out of you.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "beat_up_by_kids": function(game) {
        var messages = [
            "You charge into the midst of the children. The cat escapes in " +
            "the ensuing chaos, but you do not. The children beat you " +
            "mercilessly and leave you for dead.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "beth_death": function(game) {
        game.message = "Lord Carlos' daughter shakes her head. \"" +
            "What a shame, I was beginning to like you,\" she says before " +
            "assassinating you.";
        game.character.is_dead = true;
        return game;
    },

    "bide_your_time": function(game) {
        var messages = [
            "As the days drag on, you go insane.",
            "The days turn to weeks and the weeks turn to months.",
            "You make a lot of tally marks on the wall, but you're " +
            "not counting anything.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "bide_your_time_and_die": function(game) {
        var messages = [
            "You die of old age.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "bide_your_time_and_escape": function(game) {
        var messages = [
            "You eventually manage to dig a secret passage into a cave " +
            "network.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("cave");
        return game;
    },

    "black_out_and_become_pirate": function(game) {
        game.message = "You drink until you black out. " +
            "Lord Arthur wakes you by yelling that you need to get on " +
            "with your duties.",
        game.move_character("pirate_ship");
        game.character.person = "lord_arthur";
        return game;
    },

    "black_out_and_die": function(game) {
        game.message = "You drink until you black out.";
        game.die();
        return game;
    },

    "black_out_and_move": function(game) {
        game.message = "You drink until you black out. You wake up " +
            "horribly hung over.";
        game.teleport();
        return game;
    },

    "black_out_and_win": function(game) {
        game.message =
            "You drink until you black out. " +
            "You wake up in bed next to a peasant woman. " +
            "Once the hangover wears off, you " +
            "both live happily ever after.";
        game.character.has_found_true_love = true;
        return game;
    },

    "blessed": function(game) {
        game.message = "A priestess blesses you.";
        game.character.person = "priestess";
        return game;
    },

    "blow_up_the_lab": function(game) {
        game.burn();
        var temp_message = " " + game.message;
        game.message =  "One of the potions you smash blows up the " +
            "laboratory.";
        if (game.character.items["fancy red cloak"] < 1) {
            game.die();
        } else {
            game.message += " However, your fancy red cloak protects " +
                "you from annihilation.";
            game.message += temp_message;
        }
        return game;
    },

    "boast_and_get_money": function(game) {
        game.message = "St. George is impressed with your noble " +
            "deeds and rewards you.",
        game.get_money("large_fortune");
        return game;
    },

    "bosoms_drunk": function(game) {
        var messages = [
            "The drunk man joins you in admiring you bosoms.",
            "When you look back at the drunk man, you realize you weren't " +
            "the only one admiring your bosoms.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "bosoms_olga": function(game) {
        var olga = game.persons.olga.name;
        var messages = [
            functions.capitalize(olga) + " busies herself by admiring hers own.",
            "\"It's hard not to look,\" " + olga + " says.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "bosoms_st_george": function(game) {
        var messages = [
            "St. George notices you admiring your own bosoms and says you " +
            "should not become too enamored of yourself.",
            "St. George notices you admiring your own bosoms and warns you " +
            "not to be arrogant.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "bosoms_witch": function(game) {
        var messages = [
            "\"Believe it or not, I was once young and beautiful too,\" the " +
            "witch says. \"Enjoy it while it lasts kid. The only good " +
            "thing about being old is the magical powers.\"",
            "\"Oh get over yourself!\" the witch snaps.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "bosoms_wizard": function(game) {
        var messages = [
            "The wizard notices what you're doing and blushes bright red.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "breed_cats": function(game) {
        var kittens = 2 + functions.random_int(11);
        game.character.items.cat += kittens;
        game.message = "You now have " +
            NUMBER_NAMES[kittens.toString()] + " more cats.";
        return game;
    },

    "breed_cats_fail": function(game) {
        var messages = [
            "Mashing them together doesn't work.",
            "You can't figure out how to make them breed.",
            "You perform a wedding for you cats, but they don't breed.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "breed_cats_lose_cats": function(game) {
        var messages = [
            "You try to get your cats to breed, but they are having none of " +
            "it. Your cats run away.",
        ];
        game.message = functions.random_choice(messages);
        game.character.items.cats -= 2;
        return game;
    },

    "breed_newts": function(game) {
        var baby_newts = 2 + functions.random_int(11);
        game.character.items["deep-cave newt"] += baby_newts;
        game.message = "You now have " +
            NUMBER_NAMES[baby_newts.toString()] + " more deep-cave newts.";
        return game;
    },

    "breed_newts_fail": function(game) {
        var messages = [
            "You're not sure your newts have different genders.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "bronzed": function(game) {
        game.message = "You get bronzed.";
        return game;
    },

    "burn": function(game) {
        game.burn();
        return game;
    },

    "buy_a_drink_and_die": function(game) {
        var messages = [
            "An assassin walks up and starts hitting on you... very hard.",
            "You get roaring drunk, start a tavern brawl, and perish in " +
            "the chaos.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "buy_a_drink_and_meet_olga": function(game) {
        var messages = [
            "While you're drinking, you strike up a conversation with a " +
            "pretty lady.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "olga";
        return game;
    },

    "buy_a_weapon": function(game) {
        game.message = "";
        game.get_weapon(game.for_sell);
        game.decrement_money();
        return game;
    },

    "buy_an_item": function(game) {
        game.message = "";
        game.get_item(game.for_sell);
        game.decrement_money();
        return game;
    },

    "buy_black_market_item": function(game) {
        var item = functions.random_choice(["deep-cave newt",
                                            "potion of love",
                                            "many-colored mushroom",
                                            "white mushroom",
                                            "black mushroom",
                                            "fancy red cloak",
                                            "potion of strength",
                                            "potion of transformation",]);
        var messages;
        if (game.character.money === "small_fortune" ||
            game.character.money === "large_fortune") {
            messages = [
                "You you cut a deal with a " +
                functions.random_choice(["black market peddler",
                                         "merchant witch",
                                         "monger of rare items",]) + ".",
            ];
            game.message = functions.random_choice(messages);
            game.get_item(item);
            game.decrement_money();
        } else {
            messages = [
                "You cannot afford to make a shady deal.",
                "You're too poor to make a shady deal.",
            ];
            game.message = functions.random_choice(messages);
        }
        return game;
    },

    //c

    "cannot_afford": function(game) {
        game.message = "You cannot afford " +
            functions.a_or_an(game.for_sell[0]) + " " +
            game.for_sell + ".";
        return game;
    },

    "cannot_afford_weapon": function(game) {
        game.message = "You cannot afford " +
            functions.a_or_an(game.for_sell[0]) + " " +
            items.weapons_map[game.for_sell].name + ".";
        return game;
    },

    "cannot_build_igloo": function(game) {
        var messages = [
            "You can't figure out how to build an igloo.",
            "You build an igloo, but it collapses after a snowstorm.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "cannot_dance": function(game) {
        game.message = "You can't dance a jig, you're in the ocean.";
        return game;
    },

    "cannot_drop_anchor": function(game) {
        var messages = [
            "You can't find the anchor, but you find Lord Arthur's " +
            "weird cat. It has eight more tails than a normal cat.",
            "You're not strong enough to lift the anchor.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "cannot_find_cat": function(game) {
        var messages = [
            "You can't find any cats. Only dogs.",
            "You chase a cat to no avail.",
            "Your efforts to find a cat are fruitless.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "cannot_find_dragon": function(game) {
        var messages = [
            "You can't find any dragons. Only rocks.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "cannot_find_lava": function(game) {
        var messages = [
            "You can't find a pool of lava to swim in.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "cannot_find_nymphs": function(game) {
        var messages = [
            "You can't find any nymphs, but you see some of Lord Carlos' " +
            "men burying a body.",
            "You get distracted by a squirrel and forget what you were " +
            "doing.",
            "You see a comely woman picking berries, but she's not a nymph.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "cannot_find_nymphs_find_apple": function(game) {
        var messages = [
            "Your efforts to find nymphs are fruitless, but you find an " +
            "apple tree.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_item("apple");
        return game;
    },

    "cannot_find_witch": function(game) {
        if (game.places.woods.burnable === true) {
            game.message = "You can't find any witches. Only trees.";
        } else {
            game.message = "You can't find any witches. Only burnt " +
                "trees.";
        }
        game.character.person = null;
        return game;
    },

    "cannot_hear_assassin": function(game) {
        game.message = "Your singing is too loud for you to hear the " +
            "assassin sneaking up behind you.";
        game.clover();
        return game;
    },

    "cannot_tip_cow": function(game) {
        var messages = [
            "Some peasants see you trying to tip a cow and laugh at you.",
            "You are disappointed to find out that cows can easily get " +
            "back up.",
            "You can't find any cows. Only sheep.",
            "You're not strong enough to push the cow over.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "carefully_steal_keys": function(game) {
        game.message = "You manage to swipe the keys off the warden " +
            "during his inspection. You soon make your escape.";
        game.move_character("dark_alley");
        return game;
    },

    "cass_answer": function(game) {
        game.message = "Lord Carlos' daughter is appalled. \"Cass " +
            "is my mother,\" she says. You are soon assassinated.";
        game.character.is_threatened = true;
        return game;
    },

    "cat_burning": function(game) {
        var messages = [
            "You find a mob of peasant children about to perform a cat " +
            "burning.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "cat_escapes": function(game) {
        var messages = [
            "Your cat escapes.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("cat");
        return game;
    },

    "cat_smells_fish": function(game) {
        var messages = [
            "A cat smells your fish and approaches you.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("cat");
        game.character.person = null;
        return game;
    },

    "catch_a_lot_of_fish": function(game) {
        var messages = [
            "You catch a lot of fish.",
        ];
        game.message = functions.random_choice(messages);
        game.character.items.fish += 3;
        game.character.person = null;
        return game;
    },

    "catch_big_fish": function(game) {
        var messages = [
            "You hook a big fish, but it pulls you into the water. " +
            "You are soon lost amid the waves and lose sight of land.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("ocean");
        return game;
    },

    "catch_fish": function(game) {
        var messages = [
            "Your efforts prove successful.",
            "Your efforts are fruitful.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("fish");
        game.character.person = null;
        return game;
    },

    "caught_and_die": function(game) {
        game.message =
            "You run like the Devil, but " + game.get_name() +
            " also " + game.conjugate("run") + " like the Devil and " +
            game.conjugate("overtake") + " you.";
        game.die();
        return game;
    },

    "caught_by_tail_and_die": function(game) {
        game.message =
            "You run like the Devil, but " + game.get_name() +
            " also " + game.conjugate("run") + " like the Devil and " +
            game.conjugate("overtake") + " you and " +
            game.conjugate("manage") + " to stop you by grabbing " +
            "your tail.";
        game.die();
        return game;
    },

    "caught_like_god": function(game) {
        game.message =
            "God is very slow, so you don't manage to get away.";
        game.character.is_dead = true;
        return game;
    },

    "caught_and_arrested": function(game) {
        game.message =
            "You run like the Devil, but " + game.get_name() +
            " also " + game.conjugate("run") + " like the Devil and " +
            game.conjugate("overtake") + " you. " +
            functions.capitalize(game.get_subject()) + " " +
            game.conjugate("arrest") +
            " you and throw you in prison with the other lunatics.";
        game.move_character("prison");
        game.character.person = "other_lunatics";
        return game;
    },

    "caught_and_arrested_like_god": function(game) {
        game.message =
            "God is very slow, so you don't manage to get away. " +
            functions.capitalize(game.get_subject()) + " " +
            game.conjugate("arrest") +
            " you and throw you in prison with the other lunatics.";
        game.move_character("prison");
        game.character.person = "other_lunatics";
        return game;
    },

    "caught_by_olga": function(game) {
        game.message =
            "The Devil is pretty fast, but Olga is faster and prettier. " +
            "She catches you and strangles you to death.";
        game.die();
        return game;
    },

    "celebrate": function(game) {
        var messages = [
            "You dance a jig.",
            "You sing a song.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "celebrate_at_brothel": function(game) {
        var messages = [
            "You celebrate at a brothel, but you feel sad that the women " +
            "there are just pretending to like you.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("streets");
        return game;
    },

    "celebrate_at_market": function(game) {
        var messages = [
            "You celebrate by watching a play in the market.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("market");
        return game;
    },

    "celebrate_uncreatively": function(game) {
        var messages = [
            "You can't come up with a better way of celebrating than " +
            "twiddling your thumbs.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "chance_to_escape": function(game) {
        var messages = [
            "You spit in his eyes.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "chase_cat_to_dark_alley": function(game) {
        var messages = [
            "You find a skinny cat. You chase it through the streets and " +
            "lose track of it.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("dark_alley");
        return game;
    },

    // some jokes, CREDITS: reddit's r/jokes
    "chat_with_blind_bartender": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "chat_with_blind_bartender_and_die": function(game) {
        var messages = [
            "An assassin overhears you talking about Lord Carlos' " +
            "daughter and assassinates you.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "chat_with_dragon_blue": function(game) {
        var messages = [
            "The blue dragon poses several riddles for you, but you can't " +
            "solve any of them.",
            "The blue dragon says she senses some magic about you.",
            "The blue dragon wishes you luck on your quest to find a wife.",
            "You and the blue dragon agree that Lord Bartholomew is the " +
            "best hope for the realm.",
            "You and the blue dragon talk about the Orient.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "chat_with_dragon_red": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "chat_with_lord_bartholomew": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "chat_with_st_george": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "chess_cutlass": function(game) {
        var messages = [
            "The pirates slash the chessboard in half with a cutlass and " +
            "leave.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_weapon("cutlass");
        return game;
    },

    "chess_impressment": function(game) {
        var messages = [
            "You beat all the pirates easily. Lord Arthur says your " +
            "wits could be invaluable on the high seas. They soon are.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("pirate_ship");
        return game;
    },

    "chess_impressment_not": function(game) {
        var messages = [
            "You beat all the pirates easily. Lord Arthur laughs at " +
            "his men for losing to a woman.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "lord_arthur";
        return game;
    },

    "chess_lose_to_pirates": function(game) {
        var messages = [
            "Their opening move is smashing a bottle of rum over your " +
            "head. You aren't thinking too straight during the game and " +
            "quickly lose.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "choke_and_saved_by_blue_dragon": function(game) {
        var messages = [
            "You collapse and lay dying on the side of the volcano, but a " +
            "blue dragon flies by and takes you to her lair.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "dragon_blue";
        return game;
    },

    "choke_on_fumes": function(game) {
        var messages = [
            "You cough a lot.",
            "You wheeze.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "choke_on_fumes_and_die": function(game) {
        var messages = [
            "You caught up a lung.",
            "You die of air pollution.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "chop_down_tree": function(game) {
        var messages = [
            "A tree falls in the forest. You hear it.",
            "The tree crashes to the ground.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "chop_down_tree_and_die": function(game) {
        var messages = [
            "The tree falls on you.",
            "A nymph hexes you. Throwing yourself in a pond suddenly seems " +
            "like a good idea.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "climb_and_die": function(game) {
        var messages = [
            "A crow in the crow's nest caws in your face, startling " +
            "you. You fall off the mast and land on the deck.",
            "You fall asleep during your watch duty and the ship runs " +
            "into an iceberg. While the ship is sinking, the crew kills " +
            "you for incompetence.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "climb_and_get_sap": function(game) {
        var messages = [
            "Watch duty is so boring you amuse yourself by scraping sap " +
            "off the wood.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("ball of sap");
        return game;
    },

    "club_a_seal": function(game) {
        var messages = [
            "After a few days of waiting at a hole in the ice, you manage " +
            "to club a seal.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("seal carcass");
        return game;
    },

    "complaining_is_useless": function(game) {
        var messages = [
            "A cook assures you that Lord Bartholomew will set things " +
            "right.",
        ];
        if (game.persons.lord_daniel.alive === true) {
            messages.push(
            "A bureaucrat says she'll let Lord Daniel know of your " +
            "concerns.");
        }
        game.message = functions.random_choice(messages);
        return game;
    },

    "croak": function(game) {
        game.message = "You croak.";
        game.die();
        return game;
    },

    "croak_not": function(game) {
        var messages = [
            "Lady frogs don't croak.",
            "Since you're a lady frog, you don't croak.",
            "You can't croak, only male frogs do that.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "crowd_hates_your_voice": function(game) {
        game.message = "The locals hate your voice and soon mob you.";
        game.clover();
        return game;
    },

    //d

    "dance_a_jig": function(game) {
        var messages = [
            "You enjoy yourself immensely.",
            "You get sweaty.",
            "You have a grand old time.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "dance_and_die": function(game) {
        var messages = [
            "While you're dancing, you twist your ankle, fall to the " +
            "ground, try to catch yourself, but break your wrist, " +
            "hit your head on the " + game.get_ground() +
            " and break your neck.",
            "You dance so vigorously you become exhausted and die.",
            "You dance to death.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "dance_and_drown": function(game) {
        var messages = [
            "You drown trying to dance a jig.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "dance_and_freeze": function(game) {
        var messages = [
            "You get sweaty. The sweat freezes to you and you freeze to " +
            "death.",
            "You fall through the ice while dancing. You quickly freeze to " +
            "death.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "dance_and_slip": function(game) {
        var messages = [
            "You slip on a rock and fall to your death in the darkness.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "dance_fails_to_cheer": function(game) {
        var messages = [
            "Dancing fails to cheer you up.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "dance_for_coin": function(game) {
        var messages = [
            "The locals are entertained by your antics and toss " +
            "you some coins.",
            "A noble takes pity on you and gives some money.",
        ];
        game.message = functions.random_choice(messages);
        game.get_money("pittance");
        game.character.person = null;
        return game;
    },

    "dance_in_puddle": function(game) {
        var messages = [];
        if (game.character.sex === FEMALE) {
            messages.push(
                "You dance through a puddle and get your skirt wet."
            );
        } else {
            messages.push(
                "You dance through a puddle and get your britches wet."
            );
        }
        game.message = functions.random_choice(messages);
        return game;
    },

    "dance_with_goblins": function(game) {
        var messages = [
            "Some goblins dance with you and then kill you.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "dance_with_peasants": function(game) {
        var messages = [
            "Many peasants start dancing with you and begin singing " +
            functions.random_choice(["an ode to", "about", "a song about",
                           "the praises of"]) +
            " Lord Bartholomew.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "dance_with_woodland_creatures": function(game) {
        var messages = [
            "Some " +
            functions.random_choice(["dryads", "faeries", "nymphs", "pixies",
                           "spirits", "sprites", "tree ents"]) +
            " dance with you and then " +
            functions.random_choice(["fade away", "disappear", "scatter"]) +
            ".",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "deal_with_assassin": function(game) {
        var messages = [
            "You find an assassin posing as a black market dealer.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "denied_audience_with_lord_bartholomew": function(game) {
        var messages = [
            "The line to meet Lord Bartholomew is very long, " +
            "so you lose patience and wander off.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("countryside");
        return game;
    },

    "denied_audience_with_lord_daniel": function(game) {
        var messages = [
            "The guards laugh. \"" + functions.random_choice([
                "He has no time for peasants",
                "Such audacity",]) +
            ",\" one of the guards says.",
            "The amount of paperwork required to get an audience with Lord " +
            "Daniel is " + functions.random_choice([
                "insurmountable", "too tedious", "unreasonable",]) + ".",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "die_anyway": function(game) {
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
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "die_waiting_for_seal": function(game) {
        var messages = [
            "The local polar bears aren't happy with you on their turf. " +
            "You are soon mauled.",
            "After a few days of waiting at a hole in the ice, you freeze " +
            "to death.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "dina_death": function(game) {
        game.message = "Lord Carlos' daughter wrinkles her nose in " +
            "disgust. \"Not even close.\" she says.";
        game.die();
        return game;
    },

    "directions_peasant_lass": function(game) {
        var messages = [
            "She says there's good mushroom picking in the woods and " +
            "wanders off.",
            "She babbles incoherently while eating a many-colored " +
            "mushroom and wanders off.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "directions_simple_peasant": function(game) {
        var messages = [
            "He says the town is yonder.",
            "He tells you the only direction worth going is to Lord " +
            "Bartholomew's house.",
            "He tells you there are four directions, north, south, " +
            "east, and west.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "directions_to_manor": function(game) {
        var messages = [
            "She tells you how to get to Lord Bartholomew's manor and goes " +
            "on her way.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "directions_to_town": function(game) {
        var messages = [
            "She tells you how to get back to town and goes on her way.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "directions_to_volcano": function(game) {
        var messages = [
            "He tells you how to get to the smoking volcano.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "directions_to_woods": function(game) {
        var messages = [
            "She tells you how to get to the woods and goes on her way.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "disguise_and_arrested": function(game) {
        game.message = "The guards tell you that you must be a " +
            "lunatic to say you're Lord Bartholomew. They arrest you and " +
            "throw you in prison with the other lunatics.";
        game.arrested();
        return game;
    },

    "disguise_daniel_die": function(game) {
        game.message = "You tell a group of servants that you're Lord " +
            "Daniel. Unfortunately, they believe you.";
        game.die();
        return game;
    },

    "disguise_and_die": function(game) {
        game.message = "You tell an assassin that you're Lord " +
            "Carlos. He isn't fooled for a second.";
        game.die();
        return game;
    },

    "disguise_guards_laugh": function(game) {
        game.message = "The guards laugh at you. \"You don't look " +
            "anything like him,\" one of the guards says.";
        return game;
    },

    "disguise_meet_lord_bartholomew": function(game) {
        game.message = "You are quickly granted an audience with Lord " +
            "Bartholomew, he's annoyed that you tricked him, but he " +
            "forgives you.";
        game.character.person = "lord_bartholomew";
        return game;
    },

    "disguise_meet_lord_carlos": function(game) {
        game.message = "You are soon taken to Lord Carlos. He is " +
            "livid when he discovers you're an impostor.";
        game.character.is_threatened = true;
        game.character.person = "lord_carlos";
        return game;
    },

    "disguise_meet_lord_daniel": function(game) {
        game.message = "The guards take you to Lord Daniel. He is not " +
            "pleased to discover that you're a fraud.";
        game.character.person = "lord_daniel";
        return game;
    },

    "distasteful": function(game) {
        var messages = [
            "It tastes like something that shouldn't be licked.",
            "It tastes terrible.",
            "It tastes worse than you anticipated.",
            "You get an ant on your tongue.",
            "You find the flavor of the " + game.get_ground() +
            " distasteful.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "dive_and_die": function(game) {
        var messages = [
            "You die on a fool's errand.",
            "You find a beautiful pearl in an oyster. It's so beautiful in " +
            "fact, that you drown while staring at it.",
            "You run out of air and black out right before you get back to " +
            "the surface.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "diving_saved_by_mermaid": function(game) {
        var messages = [
            "You become exhausted diving for pearls and are about to pass " +
            "out when a beautiful mermaid grabs a hold of you and takes " +
            "you to land.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("mermaid_rock");
        game.character.person = "mermaid";
        return game;
    },

    "do_not_see_assassins": function(game) {
        game.message = "You don't see one.";
        game.die();
        return game;
    },

    "dog_catches_you": function(game) {
        game.message = "Not even the Devil can outrun a dog.";
        game.die();
        return game;
    },

    "dog_kills_you": function(game) {
        game.message = "There's no reasoning with dogs.";
        game.die();
        return game;
    },

    "dog_lets_you_off_the_hook": function(game) {
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
        game.message = functions.random_choice(messages);
        game.character.is_threatened = false;
        game.character.person = null;
        return game;
    },

    "dog_takes_fish": function(game) {
        var messages = [
            "The dog takes the fish and scampers off with it.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_threatened = false;
        game.character.person = null;
        game.lose_item("fish");
        return game;
    },

    "dragon_and_die": function(game) {
        var messages = [
            "You find a red dragon. He is not happy to be disturbed.",
            "While you're looking for dragons, you get taken out by an " +
            "avalanche."
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "dragon_burns_stuff": function(game) {
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
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_money("large_fortune");
        game.get_item("bag of jewels");
        game.burn_a_bunch_of_places();
        return game;
    },

    "dragon_coin_die": function(game) {
        var messages = [
            "The red dragon takes the coin from you and eats you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "dragon_coin_trade": function(game) {
        var messages = [
            "The blue dragon says that this coin is very valuable and " +
            "that she will make you a fair trade for it.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "dragon_teleports_you": function(game) {
        var messages = [
            "The blue dragon tires of your nonsense stories casts a spell " +
            "on you."
        ];
        game.message = functions.random_choice(messages);
        game.teleport();
        return game;
    },

    "drink_piss": function(game) {
        var messages = [
            "The potion tastes foul and you begin wondering if the wizard " +
            "pees in some of these bottles.",
            "You're pretty sure you just drank piss, but it could have " +
            "been beer.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "drop_anchor_and_die": function(game) {
        var messages = [
            "You drop anchor and cause the ship to swing into a reef. " +
            "Everyone perishes including you.",
            "You drop the anchor through the deck. The ship sinks and " +
            "everyone dies.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "drop_anchor_and_kill_whale": function(game) {
        var messages = [
            "You drop the anchor and accidentally kill a passing whale. " +
            "Lord Arthur slaps you on the back and says, \"Whale done.\" " +
            "The crew hauls the whale aboard and sails back to land.",
        ];
        game.message = functions.random_choice(messages);
        game.get_money("small_fortune");
        game.move_character("docks");
        return game;
    },

    "drop_anchor_and_save_ship": function(game) {
        game.message = "You drop anchor and prevent the ship from " +
            "running into a reef. Lord Arthur rewards you for saving the " +
            "ship.";
        game.get_item("bag of jewels");
        return game;
    },

    "drown": function(game) {
        game.message = "You drown.";
        game.die();
        return game;
    },

    //e

    "e4_lose_bartholomew": function(game) {
        var messages = [
            "Lord Bartholomew gets you drunk on fine wines and beats you " +
            "easily.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "e4_lose_carlos": function(game) {
        var messages = [
            "You lose the game. Lord Carlos celebrates his victory by " +
            "assassinating you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "e4_win_bartholomew": function(game) {
        var messages = [
            "Lord bartholomew doesn't pay much attention during the game, " +
            "because peasants keep coming in and getting his advice about " +
            "things. You win the game, but you're not sure he noticed.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "e4_win_carlos": function(game) {
        var messages = [
            "You manage to trick Lord Carlos into an early checkmate. " +
            "\"This is what I get for playing black,\" he says. He rushes " +
            "at you with a poisoned dagger.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "earn_small_fortune_in_coins": function(game) {
        game.message =
            "A crowd gathers to hear your singing and " +
            "tosses you a small fortune in coins.";
        game.get_money("small_fortune");
        return game;
    },

    "eat_apple": function(game) {
        game.message = functions.random_choice([
            "You eat the apple, core and all.",
            "You made a solid decision. The apple tastes great.",
            "You're pretty sure there was a worm in the apple you just ate.",
        ]);
        game.lose_item("apple");
        return game;
    },

    "eat_apple_and_die": function(game) {
        game.message = functions.random_choice([
            "You choke on the apple and die.",
        ]);
        game.clover();
        if (game.character.is_dead === false) {
            game.lose_item("apple");
        }
        return game;
    },

    "eat_apple_strength": function(game) {
        game.message = functions.random_choice([
            "The apple is so healthy it makes you grow stronger.",
            "You feel " +
            functions.random_choice(["invigorated", "rejuvenated",
                                     "revitalized",]) +".",
        ]);
        game.lose_item("apple");
        game.character.strength += 1;
        return game;
    },

    "eat_cake": function(game) {
        var messages = [
            "You feel less riotous.",
            "You now have a stomach ache.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("cake");
        return game;
    },

    "eat_fish_in_igloo": function(game) {
        game.message = "You survive in your igloo until winter by " +
            "eating your fish. The winter ice sheet allows you to get back " +
            "to land.",
        game.character.items.fish -= 3;
        game.move_character("woods");
        return game;
    },

    "eat_sap": function(game) {
        var messages = [
            "It tastes less like maple syrup than you hoped it would.",
            "It tastes much less like candy than you hoped it would.",
            "It tastes much worse than it smelled.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("ball of sap");
        return game;
    },

    "eat_seal_in_igloo": function(game) {
        game.message = "You survive in your igloo until winter by " +
            "eating your seal carcass. The winter ice sheet allows you to " +
            "get back to land.",
        game.character.items["seal carcass"] -= 1;
        game.move_character("woods");
        return game;
    },

    "eaten_by_bird": function(game) {
        game.message = "A bird swoops down and eats you.";
        game.die();
        return game;
    },

    "eaten_by_roc": function(game) {
        game.message = "While you're sunbathing, a roc swoops down " +
            "and snatches you up in its talons. It carries you 2000 miles " +
            "and feeds you to its hatchlings.",
        game.clover();
        return game;
    },

    "eaten_by_weasel": function(game) {
        game.message = "A loose weasel hears you ribbit and eats you.";
        game.clover();
        return game;
    },

    "enrage_lord_carlos": function(game) {
        game.message = "Lord carlos is " +
            functions.random_choice(["enraged", "infuriated",]) +
            " by your " +
            functions.random_choice(["impudence", "insolence",]) +
            ".";
        return game;
    },

    "enrage_lord_carlos_and_die": function(game) {
        game.message = "Lord carlos is not pleased. He kills you " +
            "before you can do anything else to annoy him.";
        game.die();
        return game;
    },

    "enter_the_void": function(game) {
        game.message = "";
        game.move_character("void");
        return game;
    },

    "enter_newt_and_lose": function(game) {
        var messages = [
            "Your deep-cave newt wanders around in circles, loses the " +
            "race, and humiliates you both.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "enter_newt_and_provoke_mob": function(game) {
        game.message = "You deep-cave newt easily wins the race " +
            "and the peasants claim deep-cave newts are not fair. You " +
            "soon have an angry mob on your hands.";
        game.character.person = "mob";
        game.character.is_threatened = true;
        return game;
    },

    "enter_newt_and_win_donkey": function(game) {
        var messages = [
            "Your deep-cave newt turns out to be as fast as it is slimy. " +
            "It wins the race. " +
            "You win a donkey and your newt gets to eat some leeches.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("donkey");
        return game;
    },

    "enter_newt_and_win_money": function(game) {
        var messages = [
            "Your deep-cave newt steals the show and wins the race. " +
            "You get to take home the jackpot and your newt gets to eat " +
            "some worms.",
        ];
        game.message = functions.random_choice(messages);
        game.get_money(functions.random_choice(["large_fortune",
                                                       "pittance",
                                                       "small_fortune"]));
        return game;
    },

    "enter_newt_and_win_pitchfork": function(game) {
        var messages = [
            "Your deep-cave newt dominates the competition and wins you " +
            "a weapon.",
        ];
        game.message = functions.random_choice(messages);
        game.get_weapon(functions.random_choice(["long_pitchfork",
                                                        "pitchfork"]));
        return game;
    },

    "escape_to_cave": function(game) {
        game.message = "You run into the woods and hide deep in a " +
            "cave... Perhaps a little too deep.";
        game.move_character("cave");
        return game;
    },

    "escape_to_arctic": function(game) {
        game.message = "You flee the country.";
        game.move_character("arctic");
        return game;
    },

    "escape": function(game) {
        game.message =
            "The Devil is pretty fast, so you manage to get away.";
        game.move_character(game.get_random_adjacent_destination());
        game.leave_donkey_behind();
        return game;
    },

    "escape_like_god": function(game) {
        game.message =
            "God is very slow, but " + game.get_name() +
            " also " + game.conjugate("waddle") + " like God, so " +
            "you manage to get away.";
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "escape_unmarried": function(game) {
        switch (game.character.person) {
            case "felicity":
                game.message = "The Devil is pretty fast and not " +
                    "very fat, so you manage to get away unmarried.";
                game.persons.felicity.attracted = 0;
                // you can't find her again if her attracted is less than 1
                break;
            case "olga":
                game.message = "The Devil is pretty fast, so you " +
                    "manage to get away unmarried.";
                game.persons.olga.attracted = 0;
                break;
        }
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "eve_loses_you_in_woods": function(game) {
        var messages = [
            "She says she wants to make love to you in the woods, " +
            "but when you go out in the woods, you lose track of her. " +
            "She doesn't come back for you.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("woods");
        return game;
    },

    "eve_name": function(game) {
        var messages = [
            "She asks if you even remember her name. " +
            "You say, \"Of course I remember your name. It's...\"",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    //f

    "fail_at_new_career": function(game) {
        var gender_noun;
        game.character.sex === FEMALE ?
            gender_noun = "priestess" :
            gender_noun = "priest";
        var messages = [
            "After a couple of months, you conclude that you don't have " +
            "what it takes to be a clown.",
            "After a couple of months, you conclude that you don't have " +
            "what it takes to be a " + gender_noun + ".",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "fail_to_die": function(game) {
        var messages = [
            "You eat some old apple seeds from your pocket, but you don't " +
            "die.",
            "You pray to God to strike you down so you can end your life " +
            "on a high note, but he appears to have no such plan for you.",
            "You try to kill yourself by holding your breath, but you " +
            "just pass out and wake up feeling exhausted later.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "fail_to_find_mermaids": function(game) {
        var messages = [
            "After a days of searching, you're not sure mermaids exist.",
            "You aren't sure where to look.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "fail_to_find_mermaids_find_turtle": function(game) {
        var messages = [
            "You find a sea turtle instead.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "fail_to_save_cat": function(game) {
        var messages = [
            "While you're running to save the cat, you trip on some gravel " +
            "and knock yourself out. When you wake up, all you find is the " +
            "smoldering remains of the cat.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "fail_to_steal_keys": function(game) {
        var messages = [
            "You almost get the keys off the warden.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "fall_into_cave": function(game) {
        var messages = [
            "You trip on a stick and fall into a hole in the ground.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("cave");
        return game;
    },

    "farm_work": function(game) {
        var messages = [
            "You earn a pittance harvesting wheat. You enjoy the change " +
            "pace.",
            "During your duties, you get kicked by a mule. You somehow " +
            "don't die. You are paid for your efforts but not your injuries.",
        ];
        if (game.character.sex === MALE) {
            messages.push(
                "You spend a season milking cows for a farmer woman. " +
                "She keeps trying to marry you to her attractive " +
                "daughter, but her daughter is having none of it."
            );
        }
        game.message = functions.random_choice(messages);
        game.get_money("pittance");
        return game;
    },

    "farm_work_and_apple": function(game) {
        var messages = [
            "You earn a pittance picking apples. You also save one for " +
            "the road.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("apple");
        game.get_money("pittance");
        return game;
    },

    "farm_work_and_coin": function(game) {
        var messages = [
            "You earn a pittance slaughtering hogs. You also find a shiny " +
            "foreign coin in one of the hogs.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("shiny foreign coin");
        game.get_money("pittance");
        return game;
    },

    "farm_work_and_die": function(game) {
        var messages = [
            "You find farm work, but the assassins find you.",
            "You slip on a fallen apple and drown in an irrigation ditch.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "farm_work_and_donkey": function(game) {
        var messages = [
            "You spend a season picking grapes at a small vineyard. " +
            "The old lady who owns the vineyard says she has no money, so " +
            "she gives you a donkey for your efforts.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_item("donkey");
        return game;
    },

    "farm_work_and_pitchfork": function(game) {
        var messages = [
            "You earn a pittance bailing hay.",
        ];
        game.message = functions.random_choice(messages);
        game.get_weapon("pitchfork");
        game.get_money("pittance");
        return game;
    },

    "feel_accomplished": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "feel_bad_about_donation": function(game) {
        var messages = [
            "You feel " + functions.random_choice([
                "like the church will waste your donation",
                "like you wasted your money",
                "like you've been cheated",
                "unfulfilled",
                ]) + ".",
        ];
        game.message = functions.random_choice(messages);
        game.decrement_money();
        game.character.person = null;
        return game;
    },

    "feel_good_about_donation": function(game) {
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
        game.message = functions.random_choice(messages);
        game.decrement_money();
        game.character.person = null;
        return game;
    },

    "feel_manly": function(game) {
        var messages = [
            "You feel " +
            functions.random_choice(["extremely", "quite", "really",
                                     "very",]) + " " +
            functions.random_choice(["heroic", "macho", "manly"]) + ".",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "felicity_gone": function(game) {
        var messages = [
            "Felicity looks embarrassed and disappointed. She leaves.",
        ];
        game.message = functions.random_choice(messages);
        game.persons.felicity.attracted = 0;
        // you can't find her in the game if her attracted is less than 1
        return game;
    },

    "felicity_lets_you_out": function(game) {
        var messages = [
            "Felicity is overjoyed and secretly lets you out of prison " +
            "that night. \"Let's get married!\" she says.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("streets");
        game.character.person = "felicity";
        game.marriage = true;
        return game;
    },

    "felicity_loves_you": function(game) {
        var messages = [
            "Felicity whispers that she loves you.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "ferocious_cat": function(game) {
        var messages = [
            "You find a ferocious cat. It kills you.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.clover();
        return game;
    },

    "find_a_cat": function(game) {
        var messages = [
            "You find a fat cat. It's too slow to escape you.",
            "You find one.",
            "Your efforts to find a cat are fruitful.",
            "Today is your lucky day.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("cat");
        game.character.person = null;
        return game;
    },

    "find_a_war_merchant": function(game) {
        game.message =
            "You find yourself talking to a wealthy war merchant.";
        game.character.person = "war_merchant";
        return game;
    },

    "find_a_way_out": function(game) {
        game.message = "You find a way out of the cave.";
        game.move_character("woods");
        return game;
    },

    "find_assassin_instead": function(game) {
        game.message = "You notice a woman in a dark cloak stalking " +
            "you.";
        game.character.person = "assassin";
        game.character.is_threatened = true;
        return game;
    },

    "find_dagger": function(game) {
        game.message = "While you're licking the " +
            game.get_ground() + ", you notice an old dagger.";
        game.get_weapon("dagger");
        return game;
    },

    "find_deep_cave_newt": function(game) {
        game.message = "You don't find a way out, but you find a " +
            "deep-cave newt.";
        game.get_item("deep-cave newt");
        return game;
    },

    "find_lost_treasure": function(game) {
        game.message = "You don't find any mermaids, but you find a " +
            "small fortune in lost treasure.";
        game.get_money("small_fortune");
        return game;
    },

    "find_mermaid_rock": function(game) {
        game.message = "You find a mermaid. She leads you back to " +
            "her rock.";
        game.move_character("mermaid_rock");
        game.character.person = "mermaid";
        return game;
    },

    "find_olga": function(game) {
        if (game.persons.olga.attracted < 1) {
            game.message = "You find Olga laughing with her friends. " +
                "\"Oh hey there,\" she calls to you. \"I was just telling " +
                "my friends how you ran away when I asked you to marry me.\"";
        } else {
            game.message = "You find Olga drinking some ale. " +
                "\"Hey there, Good Looking,\" she says.";
        }
        game.character.person = "olga";
        return game;
    },

    "find_pearl_in_jewels": function(game) {
        game.message = "You find a pearl in your bag of jewels.";
        game.get_item("pearl");
        return game;
    },

    "find_mermaid_instead": function(game) {
        game.message = "You find a mermaid instead. She leads you " +
            "back to her rock.";
        game.move_character("mermaid_rock");
        game.character.person = "mermaid";
        return game;
    },

    "find_nymphs": function(game) {
        var messages = [
            "You find some nymphs " + functions.random_choice([
                "dancing slowly in a meadow",
                "singing among the trees",]) + ", but they disappear when " +
            "they see you.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "find_sea_turtle": function(game) {
        game.message = "You find a sea turtle and follow it to shore.";
        game.move_character("countryside");
        return game;
    },

    "find_sea_turtle_and_drown": function(game) {
        game.message = "You find one. You also drown because you're " +
            "in the ocean.";
        game.clover();
        return game;
    },

    "find_shiny_coin": function(game) {
        game.message = "You don't find any mermaids, but you find a " +
            "find shiny amid the rocks.";
        game.get_item("shiny foreign coin");
        return game;
    },

    "find_st_george": function(game) {
        game.message = "You find St. George.";
        game.character.person = "st_george";
        return game;
    },

    "find_st_george_in_church": function(game) {
        game.message = "You find St. George " +
            functions.random_choice(["absolving a rich man's sins",
                           "blessing a knight's sword",
                           "cleaning the feet of a beggar",
                           "deep in prayer", "eating a holy wafer",
                           "feeding a poor woman", "giving a sermon",
                           "helping deliver a baby"]) + ".";
        game.move_character("church");
        game.character.person = "st_george";
        return game;
    },

    "find_st_george_instead": function(game) {
        game.message = "You find St. George instead.";
        game.character.person = "st_george";
        return game;
    },

    "find_wizard": function(game) {
        var messages = [
            "You find the wizard buying a map of the Arctic from a merchant.",
            "You find the wizard strutting around the market naked.",
            "You find the wizard trying to stomp on a frantic frog.",
            "You find the wizard. He is telling a woman about a " +
            "mesmerizing pearl.",
            "You find the wizard. He is flirting awkwardly with a woman.",
            "You see the wizard emptying a flask into a well.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "wizard";
        return game;
    },

    "find_wizard_get_frog": function(game) {
        var messages = [
            "You find the wizard. He gives you a frog."
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "wizard";
        game.get_item("frog");
        return game;
    },

    "find_wizard_teleport": function(game) {
        var messages = [
            "You find the wizard. He offers to teleport you anywhere you'd " +
            "like to go.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "wizard";
        return game;
    },

    "find_wooden_mermaid": function(game) {
        game.message = "You find a wooden mermaid figurehead on the " +
            "front of a ship. The crew hoists you abroad.";
        game.move_character("pirate_ship");
        return game;
    },

    "find_wooden_mermaid_as_woman": function(game) {
        game.message = "You find a wooden mermaid figurehead on the " +
            "front of a ship. The crew hoists you abroad and soon takes " +
            "you back to land.";
        game.move_character("docks");
        return game;
    },

    "fire_cannon_and_die": function(game) {
        game.message = "You manage to shoot the merchant ship's mast " +
            "down. It falls on you.";
        game.die();
        return game;
    },

    "fire_cannon_and_get_flogged": function(game) {
        game.message = "You sink the merchant ship, treasure and all." +
            " Lord Arthur is not pleased. Nor are you after he teaches " +
            "you a lesson by giving you 101 lashes across the back.";
        return game;
    },

    "fire_cannon_and_get_rewarded": function(game) {
        game.message = "You fumble around with the cannon and never " +
            "figure out how it works, but Lord Arthur is convinced you " +
            "contributed to his victory and rewards you.",
        game.get_item("bag of jewels");
        return game;
    },

    "fish_pirates_laugh": function(game) {
        game.message = "Some pirates notice you fishing. One of them " +
            "says, \"You'll never get a large fortune like that.\" The " +
            "pirates laugh.";
        game.character.person = "pirates";
        return game;
    },

    "fish_up_ax": function(game) {
        game.message = "You fish up a rusty ax.";
        game.character.person = null;
        game.get_item("ax");
        return game;
    },

    "fish_up_pitchfork": function(game) {
        game.message = "You fish up a fancy pitchfork.";
        game.character.person = null;
        game.get_weapon("pitchfork");
        return game;
    },

    "flirt_and_shrub": function(game) {
        game.message = "The nymph queen is " +
            functions.random_choice(["unimpressed by", "uninterested in",]) +
            " your advances and turns you into a shrub.";
        game.character.is_shrub = true;
        game.character.person = null;
        return game;
    },

    "flirt_with_mermaid_and_die": function(game) {
        var messages = [
            "The mermaid accidentally knocks you over with her tail.",
            "A jealous merman sees you flirting with the mermaid and " +
            "stabs you with his fancy pitchfork.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "fly_tastes_good": function(game) {
        game.message = "The fly tastes better than any human food " +
            "ever did.";
        return game;
    },

    "forced_to_marry_eve": function(game) {
        game.message =
            "Lord Carlos' daughter lets you sleep next to her in bed that " +
            "night. Unfortunately, you don't wake up at " +
            "dawn. You wake up in the middle of the night when two " +
            "hooded assassins kidnap you and take you to a dungeon full " +
            "of torture devices. They are about to put you in an " +
            "iron maiden when they take off their hoods and reveal " +
            "that they are Lord Carlos' daughter and a priest. The " +
            "priest officiates your wedding. You and Lord Carlos' " +
            "daughter live happily ever after.";
        game.character.has_found_true_love = true;
        return game;
    },

    "forget_what_you_were_doing": function(game) {
        game.message = "You forget what you were trying to do.";
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "freeze": function(game) {
        var messages = [
            "It's easy.",
            "You do.",
            "You freeze to death.",
            "You get mauled by a polar bear before you get a chance to " +
            "freeze to death.",
            "You get sleepy.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "freeze_in_sleep": function(game) {
        var messages = [
            "You freeze to death in your sleep.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "frog": function(game) {
        game.message = "You find the wizard. He turns you into a frog.";
        game.character.is_frog = true;
        return game;
    },

    "frog_advice": function(game) {
        game.message = "The wizard advises you to hop around. " +
            "He helps you follow his advice by turning you into a frog.";
        game.character.is_frog = true;
        return game;
    },

    "frog_and_die": function(game) {
        game.message = "You find the wizard. He turns you into a frog " +
            "and steps on you.";
        game.clover();
        return game;
    },

    //g

    "gambling_die": function(game) {
        game.message =  "The assassins see you gambling and " +
            "assassinate you.";
        game.die();
        return game;
    },

    "gambling_die_not": function(game) {
        game.message =  "The assassins see you gambling, but " +
            "don't recognize you since you're a woman now.";
        return game;
    },

    "gambling_lady": function(game) {
        game.message = "You get cleaned out by a pretty lady.";
        game.character.person = "olga";
        game.lose_all_items();
        return game;
    },

    "gambling_lose": function(game) {
        game.character.person = null;
        if (game.character.place === "docks") {
            game.message = "You dice with some pirates. " +
                "They easily beat you.";
            game.character.person = "pirates";
        } else {
            game.message = "You lose many games of poker.";
        }
        game.lose_all_items();
        return game;
    },

    "gambling_win": function(game) {
        game.character.person = null;
        if (game.character.place === "docks" &&
            game.persons.lord_arthur.alive === true) {
            game.message = "You dice with Lord Arthur. " +
                "He whips you soundly, however you also beat him at " +
                "gambling.";
            game.character.person = "lord_arthur";
        } else {
            game.message = "You win many games of dice.";
        }
        game.get_money("small_fortune");
        return game;
    },

    "gawk_and_get_assassinated": function(game) {
        game.message = "You are too distracted by all the pretty " +
            "women to notice the assassins closing in on you.";
        game.character.is_dead = true;
        return game;
    },

    "gawk_and_get_money": function(game) {
        game.message = "A woman mistakes you for a beggar and takes " +
            "pity on you.";
        game.get_money("pittance");
        return game;
    },

    "gawk_at_cat": function(game) {
        game.message = "You don't see any woman worth gawking at, " +
            "but you do see a cat worth gawking at.";
        game.get_item("cat");
        return game;
    },

    "gawk_at_cake": function(game) {
        game.message = "Comely women appear to be in short supply, " +
            "but you do notice a cake cooling on a window seal.";
        return game;
    },

    "gawk_at_men": function(game) {
        var messages = [
            "A strapping young lad notices you watching him, but he's too " +
            "shy to approach you and hastens away.",
            "A man makes eye contact with you and glances back at you " +
            "as he passes by. His wife is not pleased.",
            "A creepy old man winks at you as he walks by.",
            "You stop gawking when you realize the man is simple.",
            "The men also gawk at you since you're a woman.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "gawk_at_men_and_meet_drunk": function(game) {
        var messages = [
            "A drunk man notices you gawking at him and says, \"What you " +
            "looking at?\"",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "drunk";
        return game;
    },

    "gawk_at_men_and_meet_nobleman": function(game) {
        var messages = [
            "A nobleman looks you up and down and says he'd sleep with " +
            "you if he wasn't so busy.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "nobleman";
        return game;
    },

    "gawk_at_women": function(game) {
        var messages = [
            "A fair woman notices you and hastens away.",
            "A woman becomes annoyed with your gawking and throws salt in " +
            "your eyes.",
            "An equally creepy woman stares back at you before " +
            "disappearing into the crowd.",
            "You stop gawking when you realize it isn't a woman.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "get_asylum_and_get_arrested": function(game) {

        game.message = "Lord Bartholomew grants you asylum, but his " +
            "manor is soon stormed by Lord Daniel's men. You are arrested " +
            "for treason.";
        if (game.places.lord_bartholomew_manor.burnable === true) {
            game.places.lord_bartholomew_manor.burnable = false;
            game.places.lord_bartholomew_manor.name = "the smoldering " +
                "remains of Lord Bartholomew's manor";
        }
        game.arrested();
        return game;
    },

    "get_asylum_and_win": function(game) {
        game.message = "Lord Bartholomew grants you asylum and gives " +
            "you work shoveling coal into ovens. After a few years, you " +
            "fall in love with a cook who also works in the kitchens. " +
            "You eventually win her heart and live happily ever after.";
        game.character.has_found_true_love = true;
        return game;
    },

    "get_attacked": function(game) {
        var attempted_action;
        switch (game.action) {
            case "BURN":
                attempted_action = "start a fire";
                break;
            case "BUY_ITEM":
                attempted_action = "go shopping";
                break;
            case "GO_TO":
                attempted_action = "leave";
                break;
            case "LICK_THE_GROUND":
                attempted_action = "lick the " + game.get_ground();
                break;
            default:
                attempted_action = game.action[0].toLowerCase() +
                    game.action.slice(1, game.action.length - 1);
        }

        if (game.persons[
                game.character.person
            ].preferred_attack === "arrest") {
            game.message =
                "You try to " + attempted_action + ", but " +
                game.get_name() + " " +
                game.conjugate("throw") + " you in prison with the " +
                "other lunatics.";
            game.move_character("prison");
            game.character.person = "other_lunatics";
        } else {
            game.message =
                "You try to " + attempted_action + ", but " +
                game.get_name() + " " +
                game.conjugate("kill") + " you.";
            game.die();
        }
        return game;
    },

    "get_a_four-leaf_clover": function(game) {
        game.message = "You don't find any flowers, but you find a " +
        "four-leaf clover instead.";
        game.get_item("four-leaf clover");
        game.character.person = null;
        return game;
    },

    "get_a_bouquet": function(game) {
        var messages = [
            "You find many pretty flowers.",
            "A peasant girl picks flowers with you. She tells you she " +
            "wants to be like Lord Bartholomew when she grows up.",
            "You spend all day looking for flowers, but it was worth it.",
            "You get stung by a bee, but you still find many pretty flowers.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("bouquet of flowers");
        game.character.person = null;
        return game;
    },

    "get_frog": function(game) {
        var messages = [
            "While you are snooping around, a frog hops onto you.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("frog");
        return game;
    },

    "get_no_void_dust": function(game) {
        var messages = [
            "You reach for some void dust, but it's farther away than it " +
            "seems.",
            "The void dust slips between your fingers and disperses into " +
            "nothingness.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "get_pearl": function(game) {
        game.message = "You soon find a pearl in an oyster.";
        game.get_item("pearl");
        return game;
    },

    "get_poison_dagger": function(game) {
        game.message = "You find a poisoned dagger in a glass case.";
        game.get_weapon("poison_dagger");
        return game;
    },

    "get_punished": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "get_sap": function(game) {
        game.message = "You fall a tree and scrape the sap off your ax.";
        game.get_item("ball of sap");
        return game;
    },

    "get_sword_of_great_evil": function(game) {
        game.message = "The wizard eagerly trades you his most " +
            "valuable item.";
        game.lose_item("handful of void dust");
        game.get_weapon("sword_of_great_evil");
        return game;
    },

    "get_void_dust": function(game) {
        game.message = "";
        game.get_item("handful of void dust");
        return game;
    },

    "give_apple_to_orphan": function(game) {
        var messages = [
            "The orphan thanks you and runs off with the apple.",
            "The orphan thanks you and splits the apple with seven other " +
            "orphans.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("apple");
        return game;
    },

    "give_apple_to_orphan_rebuffed": function(game) {
        var messages = [
            "\"I don't need your charity!\" the orphan yells. He " +
            "spits on your shoes and runs away.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "give_apple_to_self": function(game) {
        var messages = [
            "Since you're an orphan, you give the apple to yourself.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "give_cat_eve": function(game) {
        var messages = [
            "Lord Carlos' daughter kills the cat.",
        ];
        game.message = functions.random_choice(messages);
        game.get_person().attracted += 1;
        game.lose_item("cat");
        return game;
    },

    "give_cat_olga": function(game) {
        var messages = [
            "She thinks the cat is adorable.",
        ];
        game.message = functions.random_choice(messages);
        game.get_person().attracted += 1;
        game.lose_item("cat");
        return game;
    },

    "give_flowers_eve": function(game) {
        var messages = [
            "She tosses the flowers out the window.",
            "She rips the bouquet to shreds.",
        ];
        game.message = functions.random_choice(messages);
        game.get_person().attracted += 1;
        game.lose_item("bouquet of flowers");
        return game;
    },

    "give_flowers_felicity": function(game) {
        var messages = [
            "She blushes as red as the roses you give her.",
            "\"Oh, you're so sweet. I can't believe Lord " +
            "Daniel had you locked up,\" she says.",
        ];
        game.message = functions.random_choice(messages);
        game.persons.felicity.attracted += 1;
        game.lose_item("bouquet of flowers");
        return game;
    },

    "give_flowers_mermaid": function(game) {
        var messages = [
            "She eats them.",
            "She isn't sure what the flowers are for, but she is happy " +
            "with your gift.",
        ];
        game.message = functions.random_choice(messages);
        game.get_person().attracted += 1;
        game.lose_item("bouquet of flowers");
        return game;
    },

    "give_flowers_more_than_twice": function(game) {
        var messages = [
            "She's even less impressed with these flowers than she was " +
            "with the previous ones.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("bouquet of flowers");
        return game;
    },

    "give_flowers_nymph_queen": function(game) {
        var messages = [
            "The nymph queen smiles at you and throws the flowers in the " +
            "air. The flowers float around and slowly circle above the " +
            "nymph queen.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("bouquet of flowers");
        return game;
    },

    "give_flowers_olga": function(game) {
        var messages = [
            "She gives you a kiss in return.",
            "She is delighted with your gift and puts one of the flowers " +
            "in her hair.",
            "She says she loves the flowers.",
        ];
        game.message = functions.random_choice(messages);
        game.get_person().attracted += 1;
        game.lose_item("bouquet of flowers");
        return game;
    },

    "give_flowers_twice": function(game) {
        var messages = [
            "She's less impressed with the second boquet of flowers.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("bouquet of flowers");
        return game;
    },

    "go_deeper_and_die": function(game) {
        var messages = [
            "You get utterly lost and die of dehydration.",
            "You manage to go very deep by falling into a chasm.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "go_deeper_to_hell": function(game) {
        var messages = [
            "You go so deep it starts getting warmer.",
            "You go so deep you get to the bottom of the world.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("gates_of_hell");
        return game;
    },

    "go_deeper_out": function(game) {
        var messages = [
            "You can't find a way to go deeper, but you find a way " +
            "out of the cave.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("countryside");
        return game;
    },

    "go_to": function(game) {
        game.message = "";
        game.move_character(game.destination);
        return game;
    },

    "go_upstairs_and_die": function(game) {
        game.message = "Olga invites you to her room upstairs. " +
            "When you get there, lots of passionate stabbing ensues.";
        game.character.is_dead = true;
        return game;
    },

    "go_upstairs_and_die_not": function(game) {
        game.message = "Olga invites you to her room upstairs. " +
            "When you get there, you realize she's one of Lord Carlos' " +
            "assassins, but, since you're a woman now, you don't think she " +
            "recognizes you.";
        return game;
    },

    "go_upstairs_with_olga": function(game) {
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
        game.character.place = "upstairs";
        game.message = functions.random_choice(messages);
        game.persons.olga.attracted += 1;
        return game;
    },

    "god_commits_arson": function(game) {
        game.burn(); // the order matters here since burn()
                          // overwrites the message
        game.message = "Your prayers are answered. " +
            game.message;
        return game;
    },

    "god_gives_you_a_spouse": function(game) {
        if (game.character.sex === FEMALE) {
            game.message = "Your prayers for a beautiful husband are " +
                "answered, but he soon leaves you.";
        } else {
            game.message = "Your prayers for a beautiful wife are " +
                "answered, but she soon leaves you.";
        }
        return game;
    },

    "god_gives_you_holy_strength": function(game) {
        game.message = "God gives you holy strength.";
        game.character.strength += 2;
        return game;
    },

    "god_gives_you_jewels": function(game) {
        game.message =
            "God does nothing for you, but you " +
            "find a bag of jewels someone left on the counter.";
        game.get_item("bag of jewels");
        return game;
    },

    "god_resurrects_cat": function(game) {
        game.message = "God hears your distress and brings the cat " +
            "back to life.";
        game.get_item("cat");
        return game;
    },

    "god_shows_you_the_way": function(game) {
        game.message = "God speaks to you and shows you the way.";
        switch (game.character.place) {
            case "ocean":
                game.move_character("docks");
                break;
            case "woods":
                game.move_character("woods");
                break;
        }
        return game;
    },

    "god_showers_you_with_gold": function(game) {
        game.message = "God rewards your devotion with a large " +
            "fortune.";
        game.get_money("large_fortune");
        return game;
    },

    "god_smites_you": function(game) {
        game.message = "God smites you for your " +
            functions.random_choice(["arrogance", "faithlessness",
                                     "foolishness", "heresy", "rudeness",
                                     "tactlessness"]) + ".";
        game.clover();
        return game;
    },

    "god_tells_you_stuff": function(game) {
        var messages = [
            "God tells you he is the Alpha and the Omega, but it's all " +
            "Greek to you.",
            "God tells you to get married.",
            "God tells you to kill Lord Carlos.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "god_tells_you_to_burn_stuff": function(game) {
        var messages = [
            "God tells you to burn stuff.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "god_tests_you": function(game) {
        game.message = "God decides to test you.";
        game.lose_all_items();
        return game;
    },

    "ground_tastes_cold": function(game) {
        game.message = "The ground tastes really cold.";
        return game;
    },

    "grovel_and_die": function(game) {
        var messages = [
            "Lord Carlos is having none of it.",
            "Lord Carlos isn't interested in your tired excuses.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "grovel_and_go_to_woods": function(game) {
        var messages = [
            "He asks a servant to get you out of his sight. You are " +
            "unceremoniously thrown out of the manor.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("woods");
        return game;
    },

    "grow_stronger_potion": function(game) {
        game.message = "You grow stronger.";
        game.character.strength += 2;
        game.lose_item("potion of strength");
        return game;
    },

    "grow_tail": function(game) {
        game.grow_tail();
        return game;
    },

    "grow_tail_potion": function(game) {
        game.grow_tail();
        game.lose_item("potion of tail growth");
        return game;
    },

    "guards_argue_with_you": function(game) {
        var messages = [
            "The guards argue with you about the finer points of the " +
            "justice system.",
            "The guards say, \"It's fair if Lord Daniel says it's fair.\"",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "guards";
        return game;
    },

    "guards_kill_you_for_homicide": function(game) {
        game.message = "The prison guards walk by and see all the " +
            "dead bodies in your cell. \"Let's put this last one out of " +
            "his misery,\" one of them says. They soon do.";
        game.die();
        return game;
    },

    "guards_stop_you_burning": function(game) {
        game.message = "The guards see you trying to start a fire " +
            "and conclude you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_complaining": function(game) {
        game.message = "The guards arrest you for " +
            functions.random_choice(["annoying them", "bringing down the mood",
                           "complaining", "dissenting",]) + ".";
        game.arrested();
        return game;
    },

    "guards_stop_you_dancing": function(game) {
        game.message = "The local guards see your jig and conclude " +
        "that you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_killing": function(game) {
        game.message = "The local guards see you killing everybody " +
            "and conclude that you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_licking": function(game) {
        game.message = "The local guards see you licking the " +
            game.get_ground() + " and conclude you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_naked": function(game) {
        game.message = "The guards catch you with your pants " +
            "down and conclude you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_rich": function(game) {
        game.message = "The local guards see you flaunting your " +
            "wealth and conclude that you must be rich.";
        game.character.person = "guards";
        return game;
    },

    "guards_stop_you_singing": function(game) {
        game.message = "The local guards see you singing and conclude " +
        "that you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_swinging_cat": function(game) {
        game.message = "The local guards see you swinging your cat " +
            "and conclude that you must be a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_stop_you_trash": function(game) {
        game.message = "The local guards see you looking through the " +
            "trash and accuse you of being a lunatic.";
        game.character.person = "guards";
        game.character.is_threatened = true;
        return game;
    },

    "guards_take_away_bodies": function(game) {
        game.message = "The prison guards remove the dead bodies " +
            "from you cell.";
        game.persons.other_lunatics.alive = true;
        return game;
    },

    "guards_watch_you_dancing": function(game) {
        game.message = 
            "The local guards gawk at you while you dance.";
        game.character.person = "guards";
        return game;
    },

    "guards_watch_you_rich": function(game) {
        game.message = "The local guards gape at your wealth.";
        game.character.person = "guards";
        return game;
    },

    "guards_watch_you_singing": function(game) {
        game.message = "The local guards gawk at you while you're " +
            "singing.";
        game.character.person = "guards";
        return game;
    },

    "guards_watch_you_swinging_cat": function(game) {
        game.message = "The local guards gawk at you while you're " +
            "swinging your cat around.";
        game.character.person = "guards";
        return game;
    },

    //h

    "hammer_from_st_george": function(game) {
        var gender_noun;
        if (game.character.sex === FEMALE) {
            gender_noun = "woman";
        } else {
            gender_noun = "man";
        }
        game.message = "St. George sees that you are a righteous " +
            gender_noun + " and gives you a weapon to do God's work.";
        game.get_weapon("iron_hammer");
        game.character.person = "st_george";
        return game;
    },

    "have_cake_keep_cake": function(game) {
        var messages = [
            "You can't.",
            "You can't figure out a way to make it work.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "have_cake_lose_cake": function(game) {
        var messages = [
            "You only manage to eat it.",
            "You still have your cake, but now it's in your belly.",
        ];
        game.message = functions.random_choice(messages);
        game.character.items.cake -= 1;
        return game;
    },

    "have_cake_void": function(game) {
        var messages = [
            "You succeed in doing both things. The paradox rips " +
            "a hole in the universe.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("void");
        return game;
    },

    "hide": function(game) {
        var messages = [
            "You hide from the assassins, but not from your own " +
            "dark thoughts.",
            "You hide for a couple of days, long enough " +
            "that you think the whole assassin thing has probably " +
            "blown over.",
            "You hide yourself very well, but you feel lonely.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "hide_and_die": function(game) {
        var messages = [
            "You trip in the darkness and break your neck.",
            "You hide in a sewer, but you get killed by a rat.",
        ];
        if (game.character.sex === MALE) {
            messages.push(
                "You don't hide well enough. The assassins find you anyway."
            )
        }
        game.message = functions.random_choice(messages);
        game.clover();
        game.character.person = null;
        return game;
    },

    "hide_and_find_coins": function(game) {
        var messages = [
            "While you're hiding in the alley, you notice some coins on " +
            "the ground.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_money("pittance");
        return game;
    },

    "hide_and_fight_rat": function(game) {
        var messages = [
            "You fight an epic battle against one of the rats on the " +
            "lower decks.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "hide_and_miss_out": function(game) {
        var messages = [
            "You miss all of the action.",
            "You don't get any of the treasure.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "hide_beneath_deck_and_die": function(game) {
        var messages = [
            "Lord Arthur has you killed for your cowardice.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "hide_in_void": function(game) {
        var messages = [
            "You hide so well, you leave the universe.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("void");
        return game;
    },

    "hire_assassin": function(game) {
        var messages = [
            "\"Whom should I kill?\" the assassin asks.",
            "\"Who needs killing?\" the assassin asks.",
            "You hire a fat assassin. He says he can kill anyone you name, " +
            "but you have your doubts.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "assassins";
        game.decrement_money();
        return game;
    },

    "hire_assassin_and_die": function(game) {
        var messages = [
            "The assassin recognizes you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "hit_assassin_with_cat": function(game) {
        game.message = "You hit an assassin with your cat.";
        game.character.person = "assassin";
        game.character.is_threatened = true;
        return game;
    },

    "hit_assassin_with_cat_not": function(game) {
        game.message = "You hit an assassin with your cat. ";
        var messages = [
            "She gives you a dirty look and goes about her business.",
            "She tells you to be more careful where you swing your cat " +
            "and goes about her business.",
        ];
        game.message += functions.random_choice(messages);
        return game;
    },

    "hold_your_own": function(game) {
        game.message = "You manage to hold your own during the " +
            "battle. You are given your share of the loot.";
        game.get_money("pittance");
        return game;
    },

    "hop": function(game) {
        game.message = "You hop.";
        game.character.person = null;
        return game;
    },

    "hop_a_lot": function(game) {
        game.message = "You hop a lot.";
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "human": function(game) {
        game.message = "A woman picks you up and kisses you " +
            "hoping to get a prince, instead she gets you. She is not " +
            "impressed.";
        game.character.is_frog = false;
        return game;
    },

    "human_with_fly_in_mouth": function(game) {
        game.message = "The spell wears off as you catch a fly. " +
            "You turn into a human and spit the fly out of your mouth.";
        game.character.is_frog = false;
        return game;
    },

    //i

    "impress_lord_arthur": function(game) {
        game.message = "Lord Arthur is " +
            functions.random_choice(["impressed", "pleased"]) +
            " with your enthusiasm and gives you a cutlass.";
        game.get_weapon("cutlass");
        return game;
    },

    "impress_lord_arthur_brave": function(game) {
        game.message = "Lord Arthur says, \"Your bravery would be " +
            "useful on the high seas.\" It soon is.";
        game.move_character("pirate_ship");
        return game;
    },

    "impress_lord_arthur_brave_as_woman": function(game) {
        game.message = "Lord Arthur says, \"Your bravery would be " +
            "useful on the high seas. I would make you part of my crew " +
            "if you weren't a bonnie lass.\"";
        return game;
    },

    "impress_olga": function(game) {
        var messages = [
            functions.capitalize(game.persons.olga.name) + " is enthralled by " +
            "your story.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "impress_simple_peasant": function(game) {
        var messages = [
            "The peasant agrees that you are a great man.",
            "You impress the simple peasant.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "infection": function(game) {
        game.message = "You catch a nasty infection and spend weeks " +
            "fighting it.";
        game.die();
        return game;
    },

    "ignored": function(game) {
        var messages = [
            "God ignores your prayers.",
            "God slights you by ignoring you.",
            "God tests your faith by ignoring your prayers.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    //j

    //k

    "keep_swimming": function(game) {
        var messages = [
            "You swim past several islands but keep looking for a better " +
            "one.",
            "You become so tired you start hallucinating that assassins " +
            "are swimming after you.",
            "As you swim, you start resenting the fact that God hasn't " +
            "saved you yet.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "kill": function(game) {
        var weapon = "bare hands";
        if (game.character.equipped_weapon !== "") {
            weapon = items.weapons_map[
                game.character.equipped_weapon
            ].name;
        }
        game.message =
            "You kill " +
            game.persons[game.character.person].name + " with " +
            "your " + weapon + ".";
        game.persons[game.character.person].alive = false;
        game.character.is_threatened = false;
        if (game.character.person === "wizard") {
            game.get_item("fancy red cloak");
        }
        game.character.person = null;
        return game;
    },

    "kill_lord_carlos": function(game) {
        game.message =
            "You are just about to dump a cauldron of hot soup on Lord " +
            "Carlos when he looks up and notices you. You then dump the " +
            "hot soup on him and he dies.",
        game.persons.lord_carlos.alive = false;
        game.move_character("lord_carlos_manor");
        return game;
    },

    "kill_merchants": function(game) {
        game.message = "You manage to kill several innocent " +
            "merchants.";
        if (game.persons.lord_arthur.alive === true) {
            game.message += " Lord Arthur is pleased and gives you a " +
                "large share the loot.";
            game.get_money("small_fortune");
        }
        return game;
    },

    "kill_nobody": function(game) {
        var messages = [
            "You don't see anybody in a fit of rage to kill.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "kill_self": function(game) {
        var messages = [
        ];
        if (game.character.place !== "ocean") {
            messages.push("You set yourself on fire and burn to a crisp.");
        } else {
            messages.push("You drown trying to set yourself on fire.");
        }
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "kill_self_fail": function(game) {
        var messages = [
            "You fail to come up with a good way to kill yourself.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "kill_self_in_fit_of_rage": function(game) {
        var messages = [
            "You start with yourself.",
            "You make no exceptions.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "kill_self_in_ocean": function(game) {
        var messages = [
            "You walk into the ocean and are suddenly inspired to write a " +
            "novel. You drown.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "killed_at_weapon_store": function(game) {
        game.message = "You now have a dagger. In your back. " +
            "You turn around to see an assassin looking satisfied with " +
            "herself.";
        game.clover();
        return game;
    },

    "killed_by_bee": function(game) {
        game.message = "You get stung by a killer bee. The bee isn't " +
            "a killer by breed but by disposition.";
        game.clover();
        return game;
    },

    "killed_by_dragon": function(game) {
        game.message = "Everything was going fine until you tried to " +
            "get a dragon to do your bidding.";
        game.die();
        return game;
    },

    "killed_by_dragon_red": function(game) {
        game.message = "The dragon is in no mood to chat.";
        game.die();
        return game;
    },

    "killed_by_eve": function(game) {
        game.message = "Lord Carlos' daughter laughs at your jokes " +
            "and serves you some wine. The wine is actually just a bunch " +
            "poison.";
        game.die();
        return game;
    },

    "killed_by_hero": function(game) {
        game.message =
            "You throw out your arm destroying the first three " +
            "civilizations and an opportunistic hero slays you.";
        game.die();
        return game;
    },

    "killed_by_horse": function(game) {
        game.message = "You sneak up behind a horse and yell, \"Boo!\"";
        game.die();
        return game;
    },

    "killed_by_lord_arthur": function(game) {
        game.message = "Lord Arthur has you killed for raising the " +
            "wrong sail.";
        game.clover();
        return game;
    },

    "killed_by_lord_carlos": function(game) {
        game.message = "Lord Carlos jumps down from some rafters and " +
            "assassinates you.";
        game.die();
        return game;
    },

    "killed_by_mob": function(game) {
        game.message = "You try to save the witch, but the peasants " +
            "kill you for meddling.";
        game.die();
        return game;
    },

    "killed_by_olga": function(game) {
        game.message =
            "When you squeeze her butt, she stabs you in the heart with a " +
            "poisoned dagger.";
        game.die();
        return game;
    },

    "killed_by_olga_noe": function(game) {
        game.message = "When you squeeze her butt, she looks back and " +
            "winks at you.";
        return game;
    },

    "killed_in_future": function(game) {
        game.message =
            "You wreak havoc on a titanic scale, but you eventually fall " +
            "asleep. By the time you wake up, science has advanced so much " +
            "that the world government simply nukes you into oblivion.";
        game.die();
        return game;
    },

    "kiss_frog_and_die": function(game) {
        var messages = [
            "Your frog turns into a prince. He is disgusted to be kissing " +
            "man and has you put to death.",
            "Your frog turns into an assassin. He assassinates you.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "kiss_frog_and_die_not": function(game) {
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
        game.message = functions.random_choice(messages);
        game.lose_item("frog");
        return game;
    },

    "kiss_frog_cat": function(game) {
        var messages = [
            "Your frog turns into a cat. ",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("cat");
        game.lose_item("frog");
        return game;
    },

    "kiss_frog_jewels": function(game) {
        var messages = [
            "Your frog turns into a prince. He rewards you for freeing him.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("bag of jewels");
        game.lose_item("frog");
        return game;
    },

    "kiss_frog_lose_frog": function(game) {
        var messages = [
            "The frog turns into a peasant woman. \"Oh blessed be Lord " +
            "Bartholomew!\" she exclaims.",
            "The frog turns into an ugly fat man. He starts shaking you " +
            "violently. \"I liked being a frog!\" he yells before storming " +
            "off.",
            "The frog turns into a guard. He says, \"You must be a lunatic " +
            "for kissing a frog, but I'll let this one slide.\"",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("frog");
        return game;
    },

    "kiss_frog_mushrooms": function(game) {
        var messages = [
            "Your frog turns into an old woman. She thanks you and gives " +
            "you a bunch of mushrooms.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("frog");
        game.get_item("black mushroom");
        game.get_item("many-colored mushroom");
        game.get_item("white mushroom");
        game.get_item("yellow mushroom");
        return game;
    },

    "kiss_frog_no_effect": function(game) {
        var messages = [
            "The frog seems to be into it.",
            "You feel stupid kissing a frog.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    //l

    "laugh_about_warden": function(game) {
        var messages = [
            "One of the prison guards pokes you with an eleven-foot pole. " +
            "\"No laughing,\" he says.",
            "You feel good for a second, then you remember you're " +
            "in prison.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lava_and_die": function(game) {
        var messages = [
            "You meet a fiery end.",
            "The lava is far less comfortable than you imagined.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "lava_swim": function(game) {
        var messages = [
            "The lava is hard to swim in, but it's nice and warm.",
            "You have a nice swim in a pool of lava.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "learn_about_assassins": function(game) {
        var messages = [
            "After asking around, you learn that the assassins live in a " +
            "manor out in the woods.",
            "Most people seem to think the town's guards are worse than " +
            "the assassins.",
            "Some of the people you talk to say that the assassins work " +
            "for Lord Carlos.",
            "Word on the street is that the assassins are hunting for " +
            "a man who likes to sing, dance, and set things on fire.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "leave_in_a_puff": function(game) {
        game.message = "";
        game.teleport();
        return game;
    },

    "lesbian_flirt_with_eve": function(game) {
        game.message = "Lord Carlos' daughter calls in an assassin " +
            "and orders him to escort you out of the manor.";
        game.move_character("woods");
        return game;
    },

    "lesbian_flirt_with_felicity": function(game) {
        game.message = functions.random_choice([
            "She is not pleased by your lesbian advances. She leaves in a " +
            "huff.",
            "She seems really embarrassed and leaves in a huff.",
        ]);
        game.persons.felicity.attracted = 0;
        return game;
    },

    "lick_ash": function(game) {
        var messages = [
            "You burn your tongue on an ember.",
            "You find the taste of ashes unpleasant.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lick_blood": function(game) {
        game.message = "You lick the blood off the " +
            game.get_ground() + ".";
        return game;
    },

    "lick_the_ocean": function(game) {
        game.message = "You drown swimming towards the ocean floor " +
            "with your tongue extended.";
        game.character.is_dead = true;
        return game;
    },

    "lick_the_salt": function(game) {
        game.message = "The ground tastes really salty.";
        return game;
    },

    "look_for_a_way_out_and_die": function(game) {
        var messages = [
            "You fall into a deep ravine.",
            "While you're looking for a way out, you breathe up all the " +
            "oxygen in the cave.",
            "While you're looking for a way out, you impale yourself on a " +
            "stalagmite.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "look_for_mermaids_and_die": function(game) {
        game.message = "You slip on a rock.";
        game.die();
        return game;
    },

    "look_for_mermaids_and_drown": function(game) {
        game.message = "You get taken out by a storm during your " +
            "search.";
        game.die();
        return game;
    },

    "look_for_nymphs_and_die": function(game) {
        game.message = "You see some nymphs bathing in a waterfall, " +
            "but they hex you for gawking. You climb a ridge and throw " +
            "yourself to your death.",
        game.clover();
        game.character.person = null;
        return game;
    },

    "loot_and_die": function(game) {
        game.message = "You are killed by a merchant defending her " +
            "shop.";
        game.die();
        return game;
    },

    "loot_arrested": function(game) {
        game.message = "You are arrested for attempting to steal a " +
            functions.random_choice(["cart", "chicken", "goat", "grape",]) +
            ". You are thrown in prison with the other lunatics.";
        game.arrested();
        return game;
    },

    "loot_item": function(game) {
        var item = functions.random_choice(items.MARKET_ITEMS);
        game.message = "You get away with " +
            functions.a_or_an(item[0]) + " " + item + ".";
        game.get_item(item);
        game.move_character("streets");
        return game;
    },

    "loot_items": function(game) {
        var item_one = functions.random_choice(["fancy red cloak", "fish",
                                                "many-colored mushroom" ]);
        var item_two = functions.random_choice(["bouquet of flowers", "frog",
                                                "white mushroom"]);
        game.message = "You grab some stuff and flee the market.";
        game.get_item(item_one);
        game.get_item(item_two);
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "loot_weapon": function(game) {
        var weapon = functions.random_choice(["dagger", "pitchfork",
                                              "cutlass", "hammer",
                                              "iron_hammer",
                                              "jeweled_cutlass"]);
        game.message = "You swipe " +
            functions.a_or_an(weapon[0]) + " " + weapon + ".";
        game.get_weapon(weapon);
        return game;
    },

    "lord_arthur_helps": function(game) {
        var messages = [
            "Lord Arthur says he knows of a town where you can find " +
            "a new wooden leg.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lord_arthur_tells_sail": function(game) {
        var messages = [
            "Lord Arthur tells you to " +
            functions.random_choice(["raise the sail faster",
                                     "scrub the deck"]) + ".",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lord_arthur_tells_scrub": function(game) {
        var messages = [
            "Lord Arthur tells you to " +
            functions.random_choice(["scrub harder", "raise a sail"]) + ".",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lord_bartholomew_chess": function(game) {
        var messages = [
            "Lord Bartholomew says " +
            functions.random_choice(["he likes chess and wouldn't mind " +
                           "playing with you",
                           "his children recently taught him to play",
                           "there's always time for a little fun in life",]) +
            ". He takes you to his chess parlor and sets up a board.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lord_carlos_chess": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "lord_daniel_lectures_you": function(game) {
        var messages = [
            "Lord Daniel explains to you that your lack of mental " +
            "capacity would never allow you to understand his complex " +
            "policies.",
            "Lord Daniel gives you a lengthy lecture about how life isn't " +
            "fair.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lord_daniel_throws_you_out": function(game) {
        var messages = [
            "Lord Daniel has his guards carry out of the tower and dump " +
            "in a pile of manure.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("streets");
        return game;
    },

    "lose_ax": function(game) {
        game.message = "You get your ax stuck in a tree and can't " +
        "get it back out.";
        game.lose_item("ax");
        return game;
    },

    "lose_coin_arthur": function(game) {
        var messages = [
            "Lord arthur takes the coin and tells you to forget you " +
            "ever had it.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        return game;
    },

    "lose_coin_bartholomew": function(game) {
        var gender_noun;
        if (game.character.sex === FEMALE) {
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
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        game.get_money("small_fortune");
        game.move_character("countryside");
        return game;
    },

    "lose_coin_carlos": function(game) {
        var messages = [
            "\"How did you get that?\" Lord Carlos wonders aloud. He " +
            "doesn't wait for a reply. He assassinates you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "lose_coin_daniel": function(game) {
        var messages = [
            "Lord Daniel has his guards seize you and take your coin. " +
            "They then defenestrate you. Fortunately, you land in a pile " +
            "hay.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        game.move_character("streets");
        return game;
    },

    "lose_fight": function(game) {
        var foe = game.persons[game.character.person].name;
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
        if (game.get_person().type !== "group") {
            messages = messages.concat([
                functions.capitalize(foe) + " is too quick for you.",
                "You punch " + foe + " in the face, but " + foe +
                " escalates the situation by killing you.",
            ]);
        }
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "lose_leg": function(game) {
        game.message = "You lose a leg in the battle, but Lord " +
            "Arthur gives you a replacement.";
        game.character.has_lost_leg = true;
        game.get_item("sailor peg");
        return game;
    },

    "lose_peg": function(game) {
        game.message = "While you're climbing up the top sails, your " +
            "sailor peg falls into the ocean.";
        game.lose_item("sailor peg");
        return game;
    },

    "lunatics_jeer": function(game) {
        var messages = [
            "You try to flirt with the fat lady, but the other lunatics " +
            "make kissing noises and laugh at you.",
            "You try to flirt with the fat lady, but the other lunatics " +
            "also start hitting on her.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lunatics_laugh_at_you": function(game) {
        var messages = [
            "The other lunatics laugh at you for biding your time.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "lunatics_trip_you": function(game) {
        var messages = [
            "While you're pacing around, one of the other lunatics trips " +
            "you and yells, \"STOP PACING!\"",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    //m

    "make_it_rain": function(game) {
        var messages = [
            "You celebrate by wandering around town throwing all of your " +
            "money in the air. You now have no money.",
        ];
        game.message = functions.random_choice(messages);
        game.character.money = NONE;
        game.move_character("streets");
        return game;
    },

    "make_out_with_dryad": function(game) {
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
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_item("ball of sap");
        return game;
    },

    "married": function(game) {
        if (game.character.person === "olga") {
            var messages = [
                "A bleary-eyed priestess performs a wedding for you and " +
                "Olga in an alley behind the church. Olga asks the " +
                "priestess if she would like to come along for the " +
                "honeymoon, but the priestess declines.",
            ];
            if (game.persons.lord_arthur.alive === true) {
                messages.push(
                "Lord Arthur performs a wedding for you and Olga on the " +
                "deck of his pirate ship. By the time the ceremony is over, " +
                "the ship has sailed. You are now both members of the crew."
                );
            }
            if (game.persons.lord_bartholomew.alive === true) {
                messages.push(
                "Lord Bartholomew performs a wedding for you and Olga in " +
                "the countryside. 20,000 people attend your wedding, but " +
                "you suspect they just wanted to see Lord Bartholomew."
                );
            }
            if (game.persons.wizard.alive === true) {
                messages.push(
                "The wizard performs a wedding for you and Olga in the " +
                "market. He turns you both into sheep after the vows, but " +
                "it's much safer being sheep."
                );
            }
            game.message = functions.random_choice(messages);
            game.character.has_found_true_love = true;
            game.message += " You and Olga live happily ever after.";
        }

        if (game.character.person === "felicity") {
            var felicity_messages = [];
            if (game.persons.st_george.alive === true) {
                felicity_messages.push("St. George secretly performs your " +
                    "wedding.");
            } else {
                felicity_messages.push("A priestess secretly performs your " +
                    "wedding.");
            }
            game.message = functions.random_choice(felicity_messages);
            game.character.has_found_true_love = true;
            game.message += " You and Felicity live happily ever after.";
        }
        return game;
    },

    "meet_blind_bartender": function(game) {
        var messages = [
            "The blind bartender sniffs the drink and grimaces before he " +
            "passses it to you.",
            "The blind bartender grumbles as he passes you a drink.",
            "The blind bartender says the drink's free on behalf of Lord " +
            "Bartholomew.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "blind_bartender";
        return game;
    },

    "meet_dragon_blue": function(game) {
        game.message = "You come across a blue dragon. She invites " +
            "you to her lair for tea.";
        game.character.person = "dragon_blue";
        return game;
    },

    "meet_dragon_red": function(game) {
        game.message = "You walk into a red dragon's den. " +
            "The dragon eyes you suspiciously.";
        game.character.person = "dragon_red";
        return game;
    },

    "meet_eve": function(game) {
        game.message = "You manage to sneak into Lord Carlos' " +
            "daughter's bedroom. She is " +
            functions.random_choice(["brushing her hair",
                           "painting a picture of you getting assassinated",
                           "petting her cat", "polishing a pearl",
                           "putting on jewelry", "reading on her bed",
                           "sharpening a dagger",
                           "squinting at herself in the mirror",
            ]) + ".";
        game.character.person = "eve";
        return game;
    },

    "meet_lord_carlos": function(game) {
        game.message = "You manage to sneak into Lord Carlos' study. " +
                    "He is " + functions.random_choice(
                    ["writing a letter.", "reading a book.",
                     "looking straight at you.", "eating a heart.",
                     "training a weasel.", "pacing around."]),
        game.character.person = "lord_carlos";
        game.character.is_threatened = true;
        return game;
    },

    "meet_mermaid": function(game) {
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
        game.message = functions.random_choice(messages) + " " +
            second_messages[functions.random_int(second_messages.length)];
        game.character.person = "mermaid";
        return game;
    },

    "meet_nymph_queen": function(game) {
        game.message = "You find the nymph queen " +
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
        game.character.person = "nymph_queen";
        return game;
    },

    "meet_olga": function(game) {
        if (game.persons.olga.name === "the pretty lady") {
            game.message =
            "During your investigation, you strike up a conversation with " +
            "a pretty lady.";
        } else {
            game.message =
            "During your investigation, you find yourself talking with Olga.";
        }
        game.character.person = "olga";
        return game;
    },

    "meet_peasant_lass": function(game) {
        game.message = "You find a peasant lass.";
        game.character.person = "peasant_lass";
        return game;
    },

    "meet_simple_peasant": function(game) {
        game.message = "You find a simple peasant man.";
        game.character.person = "simple_peasant";
        return game;
    },

    "meet_stray_dog": function(game) {
        game.message = "Unfortunately, you come across a stray dog. " +
            "It growls at you threateningly.";
        game.character.is_threatened = true;
        game.character.person = "dog";
        return game;
    },

    "meet_stray_donkey": function(game) {
        game.message = "While wandering the countryside, you find a " +
            "stray donkey... At least you think it's stray.";
        game.get_item("donkey");
        return game;
    },

    "meet_witch": function(game) {
        game.message = "You find a witch deep in the woods.";
        game.character.person = "witch";
        return game;
    },

    "men_gawk_at_you": function(game) {
        var messages = [
            "The men also gawk at you since you have a tail.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "merchant_ship_nest": function(game) {
        game.message = "You spot a merchant ship. A naval battle " +
            "ensues.";
        return game;
    },

    "merchant_ship_sail": function(game) {
        game.message = "While you're raising a sail, you see a " +
            "merchant ship. Lord Arthur orders you to help raid it.";
        return game;
    },

    "merchant_ship_scrub": function(game) {
        game.message = "While you're scrubbing the deck, you hear " +
            "Lord Arthur calling all hands to raid an approaching " +
            "merchant ship.";
        return game;
    },

    "mermaid_dislikes_your_song": function(game) {
        game.message = "The mermaid is annoyed by your song and " +
            "pushes you into the ocean.";
        game.move_character("ocean");
        return game;
    },

    "mermaid_gives_you_fish": function(game) {
        game.message = "The mermaid doesn't know where land is, but " +
            "she gives you a fish to console you.";
        game.get_item("fish");
        return game;
    },

    "mermaid_likes_your_dance": function(game) {
        game.message = "The mermaid laughs and claps her hands. " +
            "She is completely in awe of your legs.";
        game.get_person().attracted += 1;
        return game;
    },

    "mermaid_refuses": function(game) {
        game.message = "\"You're on land, silly!\" she says.";
        return game;
    },

    "mermaid_strands_you": function(game) {
        game.message = "The mermaid takes you out to sea, but gets " +
            "bored and leaves you there.";
        game.move_character("ocean");
        return game;
    },

    "mermaid_takes_you_back_to_land": function(game) {
        game.message = "She does.";
        var destination = functions.random_choice(["countryside", "docks", "woods"]);
        game.move_character(destination);
        return game;
    },

    "miss_eve": function(game) {
        game.message = "She dodges your love potion and throws a " +
            "dagger at you. You don't dodge.";
        game.die();
        return game;
    },

    "miss_nymph_queen": function(game) {
        game.message = "Your lack of organization hinders your " +
            "efforts as you fumble around in your bag looking for your " +
            "love potion. Meanwhile, the nymph queen turns you into a shrub.";
        game.lose_all_items();
        game.character.is_shrub = true;
        return game;
    },

    "miss_olga": function(game) {
        game.message = "You buy her a drink and manage to slip your " +
            "love potion into it, but she isn't looking at you when she " +
            "takes a sip and falls madly in love the blind bartender.";
        game.persons.olga.attracted = 1;
        game.lose_item("potion of love");
        game.character.person = null;
        return game;
    },

    "miss_priestess": function(game) {
        game.message = "You douse the priestess with your love " +
            "potion, but she doesn't fall in love with you. She tells you " +
            "she's already in love with God and turns you over to the " +
            "guards. You are thrown in prison with the other lunatics.";
        game.arrested();
        return game;
    },

    "mob_kills_you": function(game) {
        var messages = [
            "The mob doesn't stop to listen.",
            "The mob won't listen to reason.",
            "There's no reasoning with the mob.",
            "You get in a heated argument with the mob, which only makes it " +
            "angrier.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "mob_lets_you_off_the_hook": function(game) {
        var messages = [
            "You manage to convince the mob that this was all just a " +
            "misunderstanding.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_threatened = false;
        game.character.person = null;
        return game;
    },

    "monstrosity": function(game) {
        game.message =
            "You lick some spilled potion off the floor and start " +
            "growing at a monstrous rate. By the time you stop growing, " +
            "you have become a towering monstrosity.";
        game.character.is_monstrosity = true;
        return game;
    },

    "monstrosity_potion": function(game) {
        game.message =
            "You slurp down an odd tasting potion and start " +
            "growing at a monstrous rate. By the time you stop growing, " +
            "you have become a towering monstrosity.";
        game.character.is_monstrosity = true;
        return game;
    },

    "more_lunatics": function(game) {
        game.message = "The guards put fresh batch of lunatics in " +
            "your cell.";
        game.character.person = "other_lunatics";
        return game;
    },

    "mushroom_kills_you": function(game) {
        var messages = [
            "The mushroom tastes bittersweet.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "mushroom_makes_you_bigger": function(game) {
        var messages = [
            "You grow larger.",
        ];
        game.message = functions.random_choice(messages);
        game.character.strength += 1;
        game.lose_item("white mushroom");
        return game;
    },

    "mushroom_makes_you_smaller": function(game) {
        var messages = [
            "You shrink to the size of a peanut. A weasel soon comes " +
            "and eats you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "mushroom_tastes_bad": function(game) {
        var messages = [
            "You find the mushroom distasteful.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("yellow mushroom");
        return game;
    },

    //n

    "newt_race": function(game) {
        var messages = [
            "You come across a crowd of peasants racing newts.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "nf3_lose_bartholomew": function(game) {
        var messages = [
            "It quickly becomes obvious that Lord Bartholomew has played " +
            "the game more than six times. You are soon defeated.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "nf3_lose_carlos": function(game) {
        var messages = [
            "Lord Carlos soon has you backed into a corner. Checkmate.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "nf3_win_bartholomew": function(game) {
        var messages = [
            "Lord Bartholomew talks about politics during the whole game, " +
            "but at least you manage to beat him.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "nf3_win_carlos": function(game) {
        var messages = [
            "You eventually checkmate Lord Carlos. He tosses the chessboard " +
            "on the floor and pulls out a dagger.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "no_cutlass": function(game) {
        var messages = [
            "You find it difficult to swashbuckle without a cutlass. You " +
            "are soon cut down.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "no_fish": function(game) {
        var messages = [
            "You don't catch any fish.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "no_flowers": function(game) {
        game.message = "You can't find any flowers. Only grass.";
        game.character.person = null;
        return game;
    },

    "no_flowers_frog": function(game) {
        var messages = [
            "You don't find any flowers, but you find a frog.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("frog");
        game.character.person = null;
        return game;
    },

    "no_mushroom_frog": function(game) {
        var messages = [
            "You don't find a single mushroom, but you find a single frog.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.get_item("frog");
        return game;
    },

    "no_one_believes_you": function(game) {
        var messages = [
            "No one believes you.",
            "You can't convince anyone, not even yourself.",
            "You tell a servant, but she doesn't believe you.",
            "You tell a servant, but your cringeworthy acting isn't " +
            "fooling anyone.",
            "You tell a small child, but she says you're stupid and runs " +
            "away yelling, \"na-na na na-na.\"",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "no_one_cares": function(game) {
        game.message = "You sing your favorite song. No one cares.";
        return game;
    },

    "no_one_cares_about_your_leg": function(game) {
        game.message = "No one cares.";
        return game;
    },

    "no_one_wants_to_talk": function(game) {
        var messages = [
            "Assassins appear to be a taboo subject for most people.",
            "Nobody wants to talk to you.",
            "You ask around, but nobody has heard anything about " +
            "assassins.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "no_progress_swimming": function(game) {
        var messages = [
            "You keep your head up.",
            "You make very little progress.",
            "You manage to stay afloat.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "no_sea_turtle": function(game) {
        var messages = [
            "You can't find a sea turtle. Everywhere looks the same.",
            "You find a shark instead. It minds its own business.",
            "Your efforts to find a sea turtle are fruitless.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "no_true_pirate_says_that": function(game) {
        var messages = [
            "Lord Arthur tells you that no true pirate says that.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "lord_arthur";
        return game;
    },

    "no_way_out": function(game) {
        var messages = [
            "You fumble around in the darkness.",
            "You think you're going around in circles.",
            "You can't see anything, so you only manage to bump your head " +
            "on a rock.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "not_impressed": function(game) {
        var messages = [
            functions.capitalize(game.get_person().name) + " " +
            game.are_or_is() + " not impressed.",
            "You're the only one who's impressed.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "notice_pattern": function(game) {
        game.message =
            "You notice the warden carries the keys when he " +
            "inspects the cells. He inspects the cells with " +
            "an entourage of guards most weekends, but he " +
            "does it alone on holidays.";
        return game;
    },

    //o

    "offend_assassin": function(game) {
        var messages = [
            "The assassin is offended by your request. He assassinates you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "overhear_stuff": function(game) {
        var messages = [
            "you overhear some peasants excitedly talking about Lord " +
            "Bartholomew.",
            "you overhear a woman say a wizard turned her husband into a " +
            "frog.",
            "you overhear a some peasants talking about newt racing.",
            "you overhear a man complaining that he lost the best years of " +
            "his life working on Lord Arthur's pirate ship.",
            "you hear a man saying he would follow Lord Bartholomew to " +
            "the gates of Hell.",
            "you overhear a barmaid telling another barmaid that St. " +
            "George is as handsom as he is generous.",
        ];
        game.message = "While you're drinking, " +
            functions.random_choice(messages);
        return game;
    },

    //p

    "pace": function(game) {
        var messages = [
            "You get a feel for the geography of your cell.",
            "You get dizzy from going around in circles.",
            "You get nowhere.",
            "You walk dozens of miles back and forth.",
            "Your pacing makes you skinnier.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "pace_and_die": function(game) {
        var messages = [
            "Your pacing drives the prison guards crazy. They kick you to " +
            "death to restore their sanity.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "pace_and_get_frog": function(game) {
        var messages = [
            "While you're pacing, you notice a frog hopping through you " +
            "cell.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("frog");
        return game;
    },

    "pace_and_get_mushroom": function(game) {
        var messages = [
            "While you're pacing, you notice a yellow mushroom growing " +
            "in the filth of your cell."
        ];
        game.message = functions.random_choice(messages);
        game.get_item("yellow mushroom");
        return game;
    },

    "panic_and_die": function(game) {
        var messages = [
            "Panicking doesn't save you.",
            "Panicking doesn't help.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "panic_and_escape": function(game) {
        game.message = "You don't remember what you did, but you " +
            "somehow managed to escape.";
        game.teleport();
        return game;
    },

    "peasant_woman_impressed": function(game) {
        game.message = "A peasant woman sees you thump your chest " +
            "and is impressed. Unfortunately, her husband is not. He " +
            "ushers her away.";
        return game;
    },

    "peasants_laugh_at_tail": function(game) {
        game.message = "During your travels, some peasants laugh at " +
            "your outlandish tail.";
        return game;
    },

    "peasants_laugh_at_you": function(game) {
        game.message = "Some peasants laugh at you for acting like a " +
            "gorilla.";
        return game;
    },

    "penguins": function(game) {
        game.message = "While you're playing in the snow, you notice " +
            "some penguins.";
        return game;
    },

    "penguins_dont_care": function(game) {
        game.message = "The penguins don't care.";
        return game;
    },

    "pick_mushroom": function(game) {
        var mushroom = functions.random_choice(["black mushroom",
                                                "many-colored mushroom",
                                                "white mushroom",
                                                "yellow mushroom",]);
        game.message = "You pick a " + mushroom + ".";
        game.character.person = null;
        game.get_item(mushroom);
        return game;
    },

    "pirates_ruin_song": function(game) {
        game.message = "You are joined in song by a gang of " +
            "drunken pirates. They spill rum on you and ruin your song.";
        game.character.person = "pirates";
        return game;
    },

    "play_dead_and_die": function(game) {
        var messages = [
            "Just to be sure, " + game.get_name() + " " +
            game.conjugate("kill") + " you.",
            "You go the extra mile to make it realistic.",
            "You soon are.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "play_dead_works": function(game) {
        var messages = [
            functions.capitalize(game.get_name()) + " " +
            game.conjugate("decide") + " you are too pathetic to " +
            "kill.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "play_in_the_snow": function(game) {
        var messages = [
            "You make a snow woman.",
            "You make a snow angel.",
            "You make some yellow snow.",
            "You slide on your belly like a penguin.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "potion_eve": function(game) {
        var messages = [
            "Lord Carlos' daughter falls madly in love with you. " +
            "You flee to another country and get married. She is fun " +
            "to be around since she's magically enchanted to always be " +
            "nice to you. However, she is still horrible to everyone " +
            "else, so your life is always filled with adventure and " +
            "danger.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_lord_arthur": function(game) {
        var messages = [
            "Lord Arthur falls madly in love with you. He has his first " +
            "mate officiate your wedding on the deck of his ship. " +
            "You rule the seas together.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_lord_bartholomew": function(game) {
        var messages = [
            "Lord Bartholomew falls madly in love with you and professes " +
            "his love for you in an epic speech that hasn't ended by the " +
            "time his wife Beatrice finds you. When she sees how taken " +
            "Lord Bartholomew is with you, she has a mob of peasants burn " +
            "you at the stake for witchcraft.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "potion_lord_carlos": function(game) {
        var messages = [
            "Lord Carlos falls madly in love with you and decides to keep " +
            "you locked away in a tower so his wife Cass won't find you. " +
            "However, your presence doesn't escape her for long. You are " +
            "soon assassinated.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "potion_lord_daniel": function(game) {
        var messages = [
            "Lord Daniel falls madly in love with you. He arranges a " +
            "massive wedding and has 100 lunatics locked up to celebrate " +
            "the occassion. You both live happily ever after.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_mermaid": function(game) {
        var messages = [
            "The mermaid falls madly in love with you. You run into the " +
            "mermaid problem, but she " +
            functions.random_choice(["has a mouth", "has breasts",
                           "is fun to be around"]) +
            " so you still live happily ever after.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_nobleman": function(game) {
        var messages = [
            "The noble falls madly in love with you. He invites you to " +
            "his estate and shows you the high life. You eat so much cake " +
            "at the parties he throws that you grow a fashionable double " +
            "chin. You and the noble eventually get married and both live " +
            "happily ever after.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_nymph_queen": function(game) {
        var messages = [
            "The nymph queen falls madly in love with you. All of the " +
            "woodland creatures attend your wedding.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_olga": function(game) {
        var messages = [
            "You buy her a drink and manage to slip the love potion into " +
            "it. However, when you propose a toast to St. George and you " +
            "both take a drink, you fall madly in love with her. She " +
            "laughs and tells you she switched the drinks. You then get " +
            "married, have a dozen kids, and she makes you do all the " +
            "chores. It's still a good life though. You both live happily " +
            "ever after.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_priestess": function(game) {
        var messages = [
            "The priestess falls madly in love with you. Since she's " +
            "ordained to conduct weddings, she conducts your own wedding. " +
            "She is then excommunicated from the church for taking a " +
            "husband. The priestess responds by starting her own church, " +
            "which eventually leads to dozens of religious wars, however " +
            "you still both live happily ever after.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "potion_st_george": function(game) {
        var messages = [
            "St. George falls madly in love with you. He says God has " +
            "inspired him to take you as his bride. He soon does. You " +
            "both live happily ever after.",
        ];
        game.message = functions.random_choice(messages);
        game.character.has_found_true_love = true;
        return game;
    },

    "priest_agrees": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "priest_asks_you_to_breed_cats_elsewhere": function(game) {
        var messages = [
            "A priest asks you to do that elsewhere.",
            "A priest asks you to find a different place to breed your cats.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },


    "priest_disagrees": function(game) {
        var messages = [
            "The priest says he has is doubts.",
            "The priest says he would know it when he sees it.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "priest_fat": function(game) {
        var messages = [
            "The priest runs off crying.",
            "\"Food is my only indulgence,\" he says proudly.",
            "He says, \"Only God can judge me.\"",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "priest_sexist_chosen_one": function(game) {
        var messages = [
            "The priest says the chosen one will most certainly be a man.",
            "The priest tells you God would never have a woman to be " +
            "the chosen one.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "priest_sexist_fat": function(game) {
        var messages = [
            "The priest says it's unbecoming for a woman in insult a man.",
            "The priest tells you it's not a woman's place to critisize " +
            "men.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "priest_takes_pity": function(game) {
        var messages = [
            "The priest finds your argument so pitiful that he gives you " +
            "a pittance and sends you on your way.",
        ];
        game.message = functions.random_choice(messages);
        game.get_money("pittance");
        game.move_character("streets");
        return game;
    },

    "priestess_takes_offense": function(game) {
        game.message = "A priestess finds your lyrics " +
        functions.random_choice(["blasphemous", "cliché", "crude",
                                 "idiotic", "lewd",
                                 "mildly offensive", "uncreative"]) +
        " and has you thrown out of the church.";
        game.move_character("streets");
        return game;
    },

    "provoke_the_mob": function(game) {
        var messages = [
            "You try to distract the peasants by throwing stones at them " +
            "and insulting their mothers, but they burn the witch anyway. " +
            "Once they're done, they start charging at you with their " +
            "torches and pitchforks.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_threatened = true;
        game.character.person = "mob";
        return game;
    },

    "pull_beard_and_die": function(game) {
        var messages = [
            "It's real.",
            "\"Never do that again,\" the wizard says. He turns you into " +
            "a frog and stomps on you.",
        ];
        game.message = functions.random_choice(messages);
        die(game, "streets");
        return game;
    },

    "pull_beard_and_frog": function(game) {
        var messages = [
            "The wizard's beard is real, but he is so offended he turns " +
            "you into a frog.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_frog = true;
        return game;
    },

    "pull_beard_and_teleport": function(game) {
        var messages = [
            "The wizard lets out a yelp when you pull is beard. He " +
            "retaliates by conking you on the head with his staff.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("ocean");
        return game;
    },

    //q

    //r

    "rainbow": function(game) {
        var messages = [
            "You see a beautiful rainbow spanning over the countryside",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "rainbow_die": function(game) {
        var messages = [
            "While you're trying to find the bottom of the rainbow, you " +
            "slip on a pile of cow dung and break your neck.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "rainbow_fail": function(game) {
        var messages = [
            "Unfortunatley the rainbow escapes you.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "rainbow_gold": function(game) {
        var messages = [
            "You walk to where the rainbow meets the ground and find pot of " +
            "gold."
        ];
        game.message = functions.random_choice(messages);
        game.get_money("small_fortune");
        return game;
    },

    "raise_sail_and_get_to_land": function(game) {
        var destination = functions.random_choice(["arctic", "docks",
                                                   "mermaid_rock",
                                                   "woods",]);
        var messages = [
            "Your nautical efforts help the ship sail to " +
            game.places[destination].name + ".",
        ];
        game.message = functions.random_choice(messages);
        game.move_character(destination);
        return game;
    },

    "random_death": function(game) {
        var messages = [
            "The potion tastes bittersweet.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "random_killed_by_wizard": function(game) {
        var messages = [
            "The potion has no effect, but when the wizard comes in to the " +
            "laboratory, you feel compelled to flirt with him stroke his " +
            "beard. He is revolted and incinerates you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "random_move": function(game) {
        game.message = "";
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "random_strength": function(game) {
        var messages = [
            "The potion gives you washboard abs.",
            "Your muscles swell with strength.",
        ];
        game.message = functions.random_choice(messages);
        game.character.strength += 3;
        return game;
    },

    "random_out_of_lab": function(game) {
        game.message = "The potion has no effect, but when the wizard " +
            "comes in to the laboratory, you feel compelled to flirt with him " +
            "stroke his beard. He casts a spell on you to make you see him " +
            "for the horrible old man that he is and shoos you out of his " +
            "laboratory.";
        game.move_character("market");
        return game;
    },

    "read_and_die": function(game) {
        var messages = [
            "You open a cursed book.",
            "You read some arcane words aloud and accidentally cast a spell " +
            "that fills the room with flying swords.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "read_clover": function(game) {
        var messages = [
            "It's all Greek to you, but you find a " +
            "dried four-leaf clover between the pages.",
            "After reading a sentence or two, you realize you're out of " +
            "your depth, but you find a dried four-leaf clover between the " +
            "pages.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("four-leaf clover");
        return game;
    },

    "read_spell_book": function(game) {
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

            "You read about the wizard's theory that, since penguins live " +
            "at the bottom of the world, if he moves enough penguins " +
            "to the top of the world then the world should turn upsidedown.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "rebuffed_by_fat_lady": function(game) {
        var messages = [
            "She ignores your hoots.",
            "She ignores your whistling.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "rebuffed_by_felicity": function(game) {
        var messages = [
            "Felicity asks if she looks fat in her new dress. " +
            "You say, \"Yes.\" She doesn't speak to you for several days.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "rebuffed_by_olga": function(game) {
        game.message = "Her eyes glaze over while you struggle make " +
            "yourself sound interesting.";
        return game;
    },

    "red_cloak": function(game) {
        var messages = [
            "While snooping around, you find a red cloak with fire " +
            "embroidery.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("fancy red cloak");
        return game;
    },

    "repay_and_die": function(game) {
        var messages = [
            "Lord Carlos informs you that your death is the only form of " +
            "repayment he will accept. Your debts are soon settled.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "repay_and_live": function(game) {
        var messages = [
            "He takes your money but says, \"No amount of money can make " +
            "up for what you've done.\"",
        ];
        game.message = functions.random_choice(messages);
        game.character.money = "none";
        return game;
    },

    "rescued_by_lord_arthur": function(game) {
        game.message = "You are picked up by Lord Arthur's pirate " +
            "ship.";
        game.move_character("pirate_ship");
        return game;
    },

    "rescued_by_lord_arthur_as_woman": function(game) {
        game.message = "You are picked up by Lord Arthur's pirate " +
            "ship. Since it's bad luck to have a woman on board a pirate " +
            "ship, he takes you back to land.";
        game.move_character("docks");
        return game;
    },

    "ribbit": function(game) {
        game.message = "You ribbit.";
        return game;
    },

    "right_name": function(game) {
        game.message = "Lord Carlos' daughter smirks.";
        return game;
    },

    "riot": function(game) {
        game.message = "The play is put on by some Lord Daniel's " +
            "guards, the acting is terrible and the play portrays Lord " +
            "Bartholomew in a negative light. The audience starts a riot.";
        game.character.person = "guards";
        return game;
    },

    "run_away_with_head_die": function(game) {
        game.message = "You don't get very far.";
        game.die();
        return game;
    },

    "run_away_with_head_survive": function(game) {
        game.message = "You wake up in the wizard's laboratory. " +
            "The wizard mumbles something about his " +
            "resurrection spell working and conks you on the head " +
            "with his staff.";
        game.teleport();
        return game;
    },

    "run_away_without_head": function(game) {
        game.message = "Your body runs off into the sunset.";
        game.die();
        return game;
    },

    "run_like_chicken": function(game) {
        game.message = "You get a lot of laughs from your audience.";
        game.die();
        return game;
    },

    "run_like_chicken_watch": function(game) {
        game.message = "Your body puts on a good show for a few seconds.";
        game.die();
        return game;
    },

    //s

    "save_cat": function(game) {
        game.message = "You manage to save the cat and run like the " +
            "Devil.";
        game.get_item("cat");
        return game;
    },

    "save_witch": function(game) {
        game.message = "You manage to save the witch and escape into " +
            "the woods with her. The witch rewards you for saving her.";
        var item = functions.random_choice(["apple",
                                            "deep-cave newt",
                                            "four-leaf clover",
                                            "potion of love",]);
        game.get_item(item);
        game.move_character("woods");
        game.character.person = "witch";
        return game;
    },

    "saved_by_inuits": function(game) {
        game.message = "Some Inuits save you from the cold and take " +
            "you back to land in a kayak. They also give you a fish.";
        game.get_item("fish");
        game.move_character("countryside");
        return game;
    },

    "saved_by_lord_bartholomew": function(game) {
        game.message =  "You manage to snatch the keys off the " +
            "warden, but he notices and has you thrown in a deep dark " +
            "dungeon. However, you end up in a cell with some of Lord " +
            "Bartholomew's men. They are soon rescued and so are you.";
        game.move_character("lord_bartholomew_manor");
        return game;
    },

    "saved_by_mermaid": function(game) {
        game.message = "You sink into the depths and black out. " +
            "A mermaid is playing with your hair.";
        game.move_character("mermaid_rock");
        game.character.person = "mermaid";
        return game;
    },

    "saved_by_st_george": function(game) {
        game.message = "You throw yourself off a rooftop, but St. " +
            "George catches you and gives you a large fortune.",
        game.move_character("streets");
        game.character.person = "st_george";
        game.get_money("large_fortune");
        return game;
    },

    "saved_by_tail": function(game) {
        game.message = "While you're singing, you feel your tail hit " +
            "something behind you. You turn around just in time to see " +
            "an assassin.";
        game.character.is_threatened = true;
        game.character.person = "assassin";
        return game;
    },

    "saved_by_witch": function(game) {
        game.message = "A witch notices you and turns you back into " +
            "a human. You have failed to continue being a shrub.";
        game.character.is_shrub = false;
        game.character.person = "witch";
        return game;
    },

    "scrub_get_thrown_off_ship": function(game) {
        var messages = [
            "You dislocate your shoulder scrubbing and Lord Arthur has no " +
            "further use for you. He has you thrown off the ship.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("ocean");
        return game;
    },

    "scrub_the_deck": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "see_ship": function(game) {
        var messages = [
            "You see a ship in the distance. You are unable to reach it.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "see_wizard_with_penguins": function(game) {
        var messages = [
            "While you are waiting to freeze to death, you notice " +
            "the wizard dropping off a boatload of penguins.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "set_self_on_fire": function(game) {
        game.message = "You accidentally set yourself on fire and " +
        "promptly burn to a crisp.";
        game.character.is_dead = true;
        return game;
    },

    "sing_about_stuff": function(game) {
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
        game.message = functions.random_choice(messages);
        return game;
    },

    "sing_at_lord_carlos_manor": function(game) {
        var messages = [
            "This is no place for merry-making. You are soon assassinated.",
            "Your singing alerts Lord Carlos' men to your presence. " +
            "You are soon assassinated.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_dead = true;
        return game;
    },

    "sing_to_greeks": function(game) {
        game.message = "As you sing, a ship sails by. The captain is " +
            "tied to the mast. He is not impressed.";
        return game;
    },

    "sing_to_mermaid": function(game) {
        game.message = "The mermaid enjoys your singing and sings " +
            "with you.";
        game.get_person().attracted += 1;
        return game;
    },

    "sing_to_olga": function(game) {
        var messages = [
            "Olga interrupts your song by kissing you.",
            "You sing a romantic ballad. Olga is impressed.",
        ];
        game.message = functions.random_choice(messages);
        game.persons.olga.attracted += 1;
        return game;
    },

    "sneak_and_die": function(game) {
        var messages = [
            "One of the assassins sees you tiptoeing around in " +
            "broad daylight. He assassinates you.",
            "Your smell gives you away. You are soon assassinated.",
            "You get the hiccups. You are soon assassinated.",
            "You are sneaking through the stables when a man too fat to " +
            "avoid bumps into you. You are soon assassinated.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "sneak_and_die_bartholomew": function(game) {
        var messages = [
            "An old man notices you skulking around and starts yelling " +
            "about an assassin. You look behind you, but the old " +
            "man stabs you in the front.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "sneak_and_die_not": function(game) {
        var messages = [
            "One of the assassin sees you tiptoeing around. " +
            "Since he doesn't recognize you as a woman, he escorts you " +
            "out of the manor rather than assassinating you.",
            "You get the hiccups. You are soon discovered and escorted to " +
            "the woods.",
            "You are sneaking through the stables when a man too fat to " +
            "avoid bumps into you. You are soon escorted off the premises.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("woods");
        return game;
    },

    "sneak_bartholomew": function(game) {
        var messages = [
            "While prowling in the shadows of a hallway, you stub your " +
            "pinkie toe.",
            "While lurking in a shrub, you catch sight of the fair Lady " +
            "Beatrice.",
        ];
        if (game.persons.lord_bartholomew.alive === true) {
            messages.push(
                "While hiding behind a door, you overhear Lord Bartholomew " +
                "and his men plotting insurrection."
            );
        }
        game.message = functions.random_choice(messages);
        return game;
    },

    "sneak_cake": function(game) {
        var messages = [
            "While creeping around in the kitchens, you find a freshly " +
            "baked cake.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "sneak_eve_and_die": function(game) {
        var messages = [
            "You can't find Lord Carlos' daughter before Lord Carlos' " +
            "assassins find you.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        game.clover();
        return game;
    },

    "sneak_pitchfork": function(game) {
        var messages = [
            "While creeping around in the stables, you find a long " +
            "pitchfork.",
        ];
        game.get_weapon("long_pitchfork");
        game.message = functions.random_choice(messages);
        return game;
    },

    "snoop_around_and_die": function(game) {
        var messages = [
            "You accidentally knock over a bottle of roiling black vapor.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "someone_stops_you_burning": function(game) {
        var messages = [
            functions.capitalize(game.get_person().name) + " " +
            game.conjugate("notice") +
            " you trying to burn " +
            game.get_place().name +
            " to the ground and " +
            game.conjugate("kill") + " you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "song_cut_short": function(game) {
        var messages = [
            "Your song is cut short by an assassin's blade.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "st_george_gives_you_apple": function(game) {
        game.character.has_begged_st_george = true;
        game.message = "St. George says he just gave away the last of " +
            "his money, but he gives you an apple in consolation.";
        game.get_item("apple");
        return game;
    },

    "st_george_gives_you_money": function(game) {
        var money = functions.random_choice(["pittance", "small_fortune",
                                   "large_fortune"]);
        game.character.has_begged_st_george = true;
        game.message = "St. George gives you " +
            items.money_map[money].name + ".";
        game.get_money(money);
        return game;
    },

    "st_george_joins_you_in_prayer": function(game) {
        game.message = "St. George joins you in prayer.";
        game.character.person = "st_george";
        return game;
    },

    "st_george_kills_you": function(game) {
        var messages = [
            "St. George becomes annoyed with your lack of self-sufficiency " +
            "and smites you with his iron hammer.",
            "St. George becomes irritated with your begging and crushes " +
            "you with his iron hammer.",
            "St. George smites you with his saintly wrath for being " +
            "ungrateful.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "st_george_warns_you": function(game) {
        game.message = "St. George sees you flaunting your wealth " +
            "and warns you about the dangers of flamboyance.";
        game.character.person = "st_george";
        return game;
    },

    "start_tripping": function(game) {
        game.message = "You start feeling strange.";
        game.character.is_tripping = true;
        if (game.action ===
            "Chow down on your many-colored mushroom.") {
            game.character.items["many-colored mushroom"] -= 1;
        }
        return game;
    },

    "starve": function(game) {
        game.message =
            "You smash towns, flatten forests, level mountains, and " +
            "ultimately run out of food.";
        game.die();
        return game;
    },

    "starve_in_igloo": function(game) {
        game.message = "Your igloo protects you from the elements, " +
            "but not from your hunger.",
        game.die();
        return game;
    },

    "steal_and_die": function(game) {
        game.message = "The dragon is having none of it.";
        game.die();
        return game;
    },

    "steal_dragon_treasure": function(game) {
        var item = functions.random_choice([
            "bag of jewels", "fancy red cloak", "jeweled cutlass", "pearl",
            "pittance", "potion of love", "potion of transformation",
        ]);
        game.message = "You grab a " + item + " and make an epic " +
            "escape down the mountain.";
        if (item === "pittance") {
            game.get_money(item);
        } else if (item === "jeweled cutlass") {
            game.get_weapon("jeweled_cutlass");
        } else {
            game.get_item(item);
        }
        game.move_character("countryside");
        return game;
    },

    "steal_cutlass": function(game) {
        game.message = "Your plan goes swimmingly.";
        game.move_character("ocean");
        game.get_weapon("jeweled_cutlass");
        return game;
    },

    "steal_keys_and_die": function(game) {
        game.message = "When you try to take the warden's keys, the " +
            "guards notice and beat the life out of you.";
        game.die();
        return game;
    },

    "steal_keys_and_escape": function(game) {
        game.message = "It's surprisingly easy to steal the keys.";
        game.move_character("streets");
        return game;
    },

    "stepped_on": function(game) {
        game.message = "While you look for flies, someone steps on " +
            "you.";
        game.die();
        return game;
    },

    "stupid_move_and_lose": function(game) {
        game.message = "You never recover from that first move. You " +
            "lose the game.";
        return game;
    },

    "stupid_move_and_die": function(game) {
        game.message = "After seeing you make this move, Lord Carlos " +
            "is no longer concerned that you might beat him. He " +
            "assassinates you.";
        game.die();
        return game;
    },

    "stupid_move_and_win": function(game) {
        game.message = "You somehow manage to recover from your first " +
            "move and win the game. Lord Carlos is not pleased.";
        return game;
    },

    "suck_up_to_lord_arthur_cutlass": function(game) {
        game.message = "Lord Arthur rewards you for your subservience.";
        game.get_weapon("cutlass");
        return game;
    },

    "suck_up_to_lord_arthur_ocean": function(game) {
        game.message = "Lord Arthur sends you on a special mission to " +
            "to find sea turtles.";
        game.move_character("ocean");
        return game;
    },

    "suck_up_to_lord_bartholomew": function(game) {
        game.message = "Lord Bartholomew tells you that you need to " +
            "take more pride in yourself.";
        return game;
    },

    "suck_up_to_lord_bartholomew_countryside": function(game) {
        game.message = "Lord Bartholomew wishes you well and sends " +
            "you on your way.";
        game.move_character("countryside");
        return game;
    },

    "suck_up_to_lord_bartholomew_pitchfork": function(game) {
        game.message = "Lord Bartholomew takes a liking to you " +
            "and gives you a weapon to defend yourself against Lord " +
            "Daniel's men.";
        game.get_weapon("long_pitchfork");
        return game;
    },

    "suck_up_to_lord_carlos_and_die": function(game) {
        game.message = "Lord Carlos is not flattered.";
        game.die();
        return game;
    },

    "suck_up_to_lord_carlos_woods": function(game) {
        game.message = "Lord Carlos is disgusted by your subservience " +
            "and has his men throw you out a window.";
        game.move_character("woods");
        return game;
    },

    "suck_up_to_lord_daniel": function(game) {
        game.message = "Lord Daniel is annoyed that you're wasting " +
            "his time.";
        return game;
    },

    "suck_up_to_lord_daniel_hammer": function(game) {
        game.message = "Lord Daniel takes a liking to you and gives " +
            "you a job as a guard. He tells you to arrest any lunatics you " +
            "find, but his definition of \"lunatic\" is a little unclear.";
        game.get_weapon("hammer");
        game.move_character("streets");
        return game;
    },

    "suck_up_to_lord_daniel_streets": function(game) {
        game.message = "Lord Daniel sees through your brown-nosing " +
            "and sends you away.";
        game.move_character("streets");
        return game;
    },

    "suicide_by_st_george": function(game) {
        game.message =
            "You find St. George and pick a fight with him."; 
        game.die();
        return game;
    },

    "sunbathe_with_mermaid": function(game) {
        game.message = "When you open your eyes, you see a mermaid " +
            "sunbathing next to you.";
        game.character.person = "mermaid";
        return game;
    },

    "sunburnt": function(game) {
        game.message = "You get sunburnt.";
        return game;
    },

    "swashbuckle_and_die": function(game) {
        game.message = "A cabin boy stabs you in the back during " +
            "the fight.",
        game.die();
        return game;
    },

    "swim_a_jig": function(game) {
        game.message = "You swim a jig.";
        return game;
    },

    "swim_and_die": function(game) {
        var messages = [
            "You die of dehydration.",
            "You become exhausted and sink into the depths.",
            "You're in way over your head.",
            "You get eaten by a swarm of sharks.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "swim_to_arctic": function(game) {
        game.message = "You notice the water getting colder and soon " +
            "find ice.";
        game.move_character("arctic");
        return game;
    },

    "swim_to_the_end": function(game) {
        game.message = "You swim to the edge of the world and fall off.";
        game.die();
        return game;
    },

    "swim_to_woods": function(game) {
        game.message = "At long last, you see land and swim to shore.";
        game.move_character("woods");
        return game;
    },

    "swing_into_captain": function(game) {
        game.message = "You crash into the captain of the merchant " +
            "ship and knock him into the ocean. Lord Arthur rewards you " +
            "for your bravery after the battle.";
        game.get_item("fish");
        return game;
    },

    "swing_into_ocean": function(game) {
        game.message = "You fall into the ocean and no one bothers " +
            "to save you after the battle.";
        game.move_character("ocean");
        return game;
    },

    "swing_on_rope_and_die": function(game) {
        game.message = "You swing across to the other ship only to " +
            "impale yourself on a merchant's sword.";
        game.die();
        return game;
    },

    //t

    "tail_eve": function(game) {
        game.message = "Lord Carlos' daughter says your tail is gaudy.";
        return game;
    },

    "tail_helps_you_swim": function(game) {
        game.message = "Your tail helps you swim back to land.";
        game.move_character("countryside");
        return game;
    },

    "tail_mermaid": function(game) {
        game.message = "The mermaid says she likes your tail.";
        game.persons.mermaid.attracted += 1;
        return game;
    },

    "tail_olga": function(game) {
        game.message = "She says your tail is freaky and she likes " +
            "a lot.";
        game.persons.olga.attracted += 1;
        return game;
    },

    "take_the_cake": function(game) {
        game.message = "";
        game.get_item("cake");
        return game;
    },

    "tavern_song": function(game) {
        var messages = [
            "The sweet sound of your voice livens up the room.",
            "You get everyone in the tavern to sing along with you.",
            "Your voice gets lost in the noise of the room.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "tavern_song_and_meet_drunk": function(game) {
        var messages = [
            "A drunk man tells you you're singing the lyrics wrong.",
            "A drunk man sings along with you and ruins your song.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "drunk";
        return game;
    },

    "tavern_song_and_meet_olga": function(game) {
        var messages = [
            "A pretty lady tells you that you have a beautiful voice.",
            "You singing attracts the attention of a pretty lady.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "olga";
        return game;
    },

    "think": function(game) {
        var messages = [
            "You spend some time reevaluating your life " +
            "and conclude that you need to stay the course.",
            "You think God is probably listening to your thoughts.",
            "You think up some lyrics for a song.",
            "You think you might be the chosen one.",
            "Your contemplations lead to dark places.",
            "Your thinking ensures your existence.",
        ];
        if (game.character.sex === MALE) {
            messages.push("Since you're a man, you think about sex.");
            messages.push("You think you would make a good husband.");
        } else {
            messages.push("You think you would make a good wife.");
        }
        game.message = functions.random_choice(messages);
        return game;
    },

    "think_about_lord_arthur": function(game) {
        if (game.character.sex === FEMALE) {
            game.message = "You think it would be a bad idea to join " +
                "Lord Arthur's crew. Fortunately, Lord Arthur's pirates " +
                "are only press-ganging men.";
        } else {
            game.message = "You think it would be a bad idea to join " +
                "Lord Arthur's crew. He gives no choice.";
            game.move_character("pirate_ship");
        }
        return game;
    },

    "think_about_lord_bartholomew": function(game) {
        game.message = "You think about Lord Bartholomew.";
        return game;
    },

    "think_about_olga": function(game) {
        if (game.persons.olga.name === "the pretty lady") {
            game.message = "You think about a pretty lady you saw at " +
                "the tavern.";
        } else {
            game.message = "You think about Olga and feel lonely.";
        }
        return game;
    },

    "think_ax": function(game) {
        game.message = "While you're thinking, a guard hands you an " +
            "ax and tells you to chop some firewood for the cooks.";
        game.get_item("ax");
        return game;
    },

    "think_bad_smell": function(game) {
        game.message = "You think the bad smell might be coming from " +
            "you.";
        return game;
    },

    "think_bats": function(game) {
        game.message = "You think you hear bats, but you also think " +
            "you might be crazy.";
        return game;
    },

    "think_cold": function(game) {
        game.message = "You can't think about much besides how cold " +
            "you are.";
        return game;
    },

    "think_darkness": function(game) {
        game.message = "You think about the darkness that is crushing " +
            "in on you from all sides.";
        return game;
    },

    "think_discouraged": function(game) {
        var messages = [
            "After thinking for a while, you feel like the examined life " +
            "isn't worth living either.",
            "All you can think is \"Think. Think. Think.\"",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "think_death": function(game) {
        game.message = "You think about death.";
        return game;
    },

    "think_elaborate_scheme": function(game) {
        game.message = "You concoct an elaborate scheme.";
        return game;
    },

    "think_fire": function(game) {
        game.message = "You think about fire.";
        return game;
    },

    "think_four_ideas": function(game) {
        game.message = "You come up with four brilliant ideas.";
        return game;
    },

    "think_guard_men": function(game) {
        game.message = "You wonder if any guards would go for a " +
            "woman like you.";
        return game;
    },

    "think_ice": function(game) {
        game.message = "You think about ice.";
        return game;
    },

    "think_jump": function(game) {
        game.message = "You think you can survive the jump from the " +
            "top of the tower.";
        game.character.is_dead = true;
        return game;
    },

    "think_meaning_of_life": function(game) {
        game.message = "You ponder the meaning of life and " +
            "feel smug for being so philosophical.";
        return game;
    },

    "think_ocean_is_big": function(game) {
        game.message = "You think the ocean is really big.";
        return game;
    },

    "think_of_getting_stabbed": function(game) {
        game.message = "You think about how painful it would be to " +
            "get stabbed. You soon find out.";
        game.character.is_dead = true;
        return game;
    },

    "think_peasant_women": function(game) {
        game.message = "You wonder if any peasant women would go for " +
            "a man like you.";
        return game;
    },

    "think_pirates_laugh": function(game) {
        game.message = "Some pirates laugh at you for thinking.";
        return game;
    },

    "think_should_not_lick_ground": function(game) {
        game.message = "You think you probably shouldn't have licked " +
            "the " + game.get_ground() + ".";
        return game;
    },

    "think_suffocation": function(game) {
        game.message = "You think about suffocation.";
        return game;
    },

    "think_void": function(game) {
        var messages = [
            "You think about nothingness.",
            "You wonder what kind of god created God.",
            "You think about a person thinking about a person thinking " +
            "about a person thinking about a person thinking about...",
            "You wonder if there is such a thing as free will or if you're " +
            "just an observer in a pre-scripted universe.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "think_you_shouldnt_be_here": function(game) {
        game.message = "You think you probably shouldn't be here.";
        return game;
    },

    "throw_cat_and_keep_cat": function(game) {
        game.message = "Your cat goes ballistic and the dog runs " +
            "away in terror.";
        game.character.is_threatened = false;
        game.character.person = null;
        return game;
    },

    "throw_cats_at_cerberus": function(game) {
        game.message = "Each of the dog's heads chows down on a cat, giving " +
            "you enough time to run past the monster.";
        game.character.person = null;
        game.move_character("hell_1");
        return game;
    },

    "thrown_off_ship": function(game) {
        game.message = "Lord Arthur cringes and has you thrown off " +
            "the ship.";
        game.move_character("ocean");
        return game;
    },

    "thump_self_and_die": function(game) {
        game.message = "You thump yourself a bit too hard.";
        game.die();
        return game;
    },

    "tip_cow_and_die": function(game) {
        game.message = "You pull a cow on top of yourself and it " +
            "crushes you.",
        game.character.person = null;
        game.clover();
        return game;
    },

    "tip_cow_and_lynch_mob": function(game) {
        game.message = "Some peasants mistake you for a cow thief and " +
            "form a lynch mob.",
        game.character.person = "mob";
        game.character.is_threatened = true;
        return game;
    },

    "too_poor_to_hire_assassin": function(game) {
        var messages = [
            "It turns out assassins are a bit out of your price range.",
            "The market value of assassins is higher than you anticipated.",
            "You're too poor to hire an assassin.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "trade_coin_for_sword_of_great_good": function(game) {
        var messages = [
            "The blue dragon says she hopes you use the blade well.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        game.get_weapon("sword_of_great_good");
        return game;
    },

    "trade_coin_for_potion_of_love": function(game) {
        var messages = [
            "The dragon is happy to make the trade with you, but she warns " +
            "you that a potion of love has many unethical uses.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        game.get_item("potion of love");
        return game;
    },

    "trade_coin_for_large_fortune": function(game) {
        var messages = [
            "The blue dragon gives you a chest of gold and " +
            "flies you down mountain so you don't have to make the long " +
            "hike with so much weight on your back.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        game.get_money("large_fortune");
        return game;
    },

    "trade_coin_for_lord_carlos": function(game) {
        var messages = [
            "The blue dragon flies you to the woods and burns Lord Carlos' " +
            "manor to a crisp. She thanks you for the trade and flies away.",
        ];
        game.persons.lord_carlos.alive = false;
        game.places.lord_carlos_manor.burnable = false;
        game.places.lord_carlos_manor.name =
            "the smoldering remains of Lord Carlos' manor";
        game.message = functions.random_choice(messages);
        game.lose_item("shiny foreign coin");
        game.move_character("woods");
        return game;
    },

    "train_and_die": function(game) {
        var messages = [
            "You accidentally put your helmet on backwards and trip over a " +
            "balcony railing.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "train_and_win": function(game) {
        var messages = [
            "You beat the captain of the guards at wooden swordplay. " +
            "\"Not bad for a " + functions.random_choice(["lunatic", "peasant",
                                                "simpleton"]) +
            ",\" he says.",
            "You run like the Devil and outrun the other guards during " +
            "running practice.",
            "You hit the bulls eye during archery practice.",
        ];
        game.message = functions.random_choice(messages);
        game.message += " Training has made you stronger.";
        game.character.person = "guards";
        game.character.strength += 1;
        return game;
    },

    "train_stronger": function(game) {
        var messages = [
            "You are badly beaten at wooden swordplay, but you grow " +
            "stronger.",
            "You miss many marks practicing archery, but failure is the " +
            "road to success. You grow stronger.",
            "The guards leave you in the dust during running practice, but " +
            "you grow stronger.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "guards";
        game.character.strength += 1;
        return game;
    },

    "train_thrown_out": function(game) {
        game.message = "The guards throw you out for not filling out " +
        "the proper paperwork.";
        game.move_character("streets");
        return game;
    },

    "transform": function(game) {
        var messages = [];
        if (game.character.sex === FEMALE) {
            messages.push("You transform back into a man.");
            messages.push("You turn back into a man.");
            messages.push("You're back to being a man.");
            game.character.sex = MALE;
        } else {
            messages.push("You are now a woman.");
            messages.push("You transform into a woman.");
            messages.push("You turn into a lady version of yourself.");
            game.character.sex = FEMALE;
        }
        //St. George will not recognize you once you change sexes
        game.character.has_begged_st_george = false;
        game.message = functions.random_choice(messages);
        game.lose_item("potion of transformation");
        return game;
    },

    "trash_ax": function(game) {
        var messages = [
            "You find an old ax.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("ax");
        return game;
    },

    "trash_cat": function(game) {
        var messages = [
            "You find a somewhat agreeable cat.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("cat");
        return game;
    },

    "trash_die": function(game) {
        var messages = [
            "You attempt to look through the trash, but an assassin takes " +
            "it out.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "trash_nothing": function(game) {
        var messages = [
            "You don't find anything useful in the trash.",
            "You find a bad smell.",
            "You find a mirror in the trash. You see nothing of value.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "trash_the_place": function(game) {
        game.trash();
        if (functions.random_int(3) === 0) {
            game.message += " You find a red cloak in the wreckage.";
            game.get_item("fancy red cloak");
        }
        return game;
    },

    "trash_the_market_and_die": function(game) {
        var messages = [
            "You get trampled by a spooked horse.",
            "While you're trashing the place, a bunch of rioting peasants " +
            "overturn a cart on top of you.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "trash_the_place_and_die": function(game) {
        var messages = [
            "When you snap a fancy staff in half, you inadvertently set " +
            "a dark spirit free.",
        ];
        if (game.persons.wizard.alive === true &&
            game.character.items["fancy red cloak"] < 1) {
            messages.push("While you're wrecking stuff, the wizard runs " +
                "into the laboratory and incinerates you.");
        }
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "trip_over_a_cat": function(game) {
        game.message = "You trip over a cat and break your neck.";
        game.character.person = null;
        game.clover();
        return game;
    },

    "turn_board_around": function(game) {
        var messages = [
            "Lord Bartholomew beats you anyway.",
            "Lord Bartholomew laughs and says, \"Well, it looks like you " +
            "got me.\"",
            "Lord Bartholomew laughs and says, \"I'll have to try that one " +
            "on my kids.\"",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "turn_to_woman": function(game) {
        var messages = [
            "The wizard says you are a " +
            functions.random_choice(["tedious", "tiresome",]) +
            " man. He solves the problem by turning you into a woman.",
        ];
        game.message = functions.random_choice(messages);
        game.character.sex = FEMALE;
        return game;
    },

    //u

    //v

    "void_dance": function(game) {
        var messages = [
            "Dancing by yourself in the void makes you feel lonely.",
            "It's hard to dance with nothing to stand on.",
            "You dance across the stars.",
            "You flail around in the void.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "void_float": function(game) {
        var messages = [
            "You're not sure you're getting anywhere.",
            "You bump into the edge of the universe.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "void_float_dust": function(game) {
        var messages = [
            "As you float through the void, your gravity attracts rings of " +
            "void dust.",
        ];
        game.message = functions.random_choice(messages);
        game.get_item("handful of void dust");
        return game;
    },

    "void_killed_by_anomaly": function(game) {
        var messages = [
            "You get cought in a void storm.",
            "You get pulled into an anomaly.",
        ];
        game.message = functions.random_choice(messages);
        game.clover();
        return game;
    },

    "void_prayer": function(game) {
        var messages = [
            "You pray into the void.",
            "You wonder if you're too far way from God for him to hear you.",
            "Your prayer echoes through the void.",
            "Your prayers for void dust go unanswered.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "void_song": function(game) {
        var messages = [
            "You sing about how lost you are.",
            "Your song echoes across the universe.",
            "Your song scatters some void dust.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "void_sleep": function(game) {
        var messages = [
            "You dream of void dust.",
            "You have dreamless sleep.",
            "When you wake up, you have no idea how long you slept.",
            "The secrets of the universe are revealed to you in your " +
            "dreams. Unfortunately, you forget them when you wake up.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "void_strength": function(game) {
        var messages = [
            "The energy of the void gives you superhuman strength.",
        ];
        game.message = functions.random_choice(messages);
        game.character.strength += 3;
        return game;
    },

    "volcano_die": function(game) {
        var messages = [
            "A red dragon flies out of the volcano and roasts you with a " +
            "jet of flame.",
            "While you're climbing, you get incinerated by a cloud of hot " +
            "ash.",
            "You fall into a fissure.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "volcano_exercise": function(game) {
        var messages = [
            "You can't find your way up the volcano, but the exercise " +
            "helps you grow stronger.",
            "You find some unscalable cliffs near the top of the volcano, " +
            "but the exercise helps you grow stronger.",
        ];
        game.message = functions.random_choice(messages);
        game.character.strength += 1;
        return game;
    },

    "volcano_nothing": function(game) {
        var messages = [
            "You can't find your way to the top of the volcano.",
            "You make it to the top of the volcano, but your view is " +
            "blocked out by smoke, so you get bored and start climbing " +
            "back down.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    //w

    "wait_and_die": function(game) {
        var messages = [
            "You wait until the assassins come and take you out.",
            "You wait long enough to get surrounded by Lord Carlos' " +
            "assassins.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "wait_and_meet_eve": function(game) {
        var messages = [
            "You quickly get bored of waiting and wander into the Lord " +
            "Carlos' daughter's bedroom, where you find her sharpening a " +
            "dagger. She looks up and says, \"You again?\"",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "eve";
        return game;
    },

    "wait_and_meet_lord_carlos": function(game) {
        var messages = [
            "A few minutes later you see Lord Carlos striding toward you. " +
            "\"You have a lot of " +
            functions.random_choice(["audacity", "balls", "chutzpah", "gall",
                           "nerve",]) +
            " to come back here,\" he says.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_threatened = true;
        game.character.person = "lord_carlos";
        return game;
    },

    "wait_here_please": function(game) {
        var messages = [
            "You ask a servant about assassins. She asks you to wait where " +
            "you are.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "waiting_for_seal": function(game) {
        var messages = [
            "You manage to club a seal, but it swims away.",
            "While waiting for a seal, you get very cold.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "wake_in_world": function(game) {
        game.message = "You wake up back on Earth.";
        game.teleport();
        return game;
    },

    "wake_up": function(game) {
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
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "wake_up_assassinated": function(game) {
        game.message = "You are rudely awakened by an assassin's dagger.";
        game.character.person = null;
        game.clover();
        return game;
    },

    "wake_up_dead": function(game) {
        game.message = "You wake up dead.";
        game.character.person = null;
        game.clover();
        return game;
    },

    "wake_up_drown": function(game) {
        game.message = "You drown in your sleep.";
        game.character.is_dead = true;
        return game;
    },

    "wake_up_in_dungeon": function(game) {
        game.message = "You wake up in Lord Carlos' dungeon " +
            "and eventually die there.";
        game.character.is_dead = true;
        return game;
    },

    "wake_up_in_prison": function(game) {
        game.message = "You are rousted by some guards who toss you " +
            "in prison with the other lunatics.";
        game.move_character("prison");
        game.character.person = "other_lunatics";
        return game;
    },

    "wake_up_richer": function(game) {
        game.message = "You wake with a few coins on your cloak.";
        game.character.person = null;
        game.get_money("pittance");
        return game;
    },

    "wake_up_robbed": function(game) {
        game.message = "You wake up robbed of all your worldly " +
            "possessions.";
        game.character.person = null;
        game.lose_all_items();
        return game;
    },

    "wake_up_somewhere_else": function(game) {
        game.message = "You wake up a few hours later.";
        game.move_character(game.get_random_adjacent_destination());
        game.character.person = null;
        return game;
    },

    "wake_up_weasel": function(game) {
        game.message = "You wake up just in time to see an assassin " +
            "slip a weasel through the bars of your cell. " +
            "The weasel kills you.";
        game.character.is_dead = true;
        return game;
    },

    "wake_up_with_cat": function(game) {
        game.message = "You are pleasantly awakened by a cat rubbing " +
            "up against you.";
        game.character.person = null;
        game.get_item("cat");
        return game;
    },

    "walk_across_board": function(game) {
        game.message = "You walk across one of the boards on the deck.";
        return game;
    },

    "walk_into_ocean": function(game) {
        game.message = ".";
        game.move_character("ocean");
        return game;
    },

    "wander_the_countryside": function(game) {
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
        if (game.character.sex === FEMALE) {
            messages.push("You see a beautiful peasant man, unfortunately " +
                "he also has a beautiful wife."
            );
        } else {
            messages.push("You see a beautiful peasant woman, unfortunately " +
                "she also has a beautiful husband."
            );
        }
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "wander_while_singing": function(game) {
        game.message = "You wander aimlessly as you work your way " +
            "through an epic ballad.";
        game.move_character(game.get_random_adjacent_destination());
        return game;
    },

    "war_merchant_annoyed": function(game) {
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
        game.message = functions.random_choice(messages);
        game.move_character("streets");
        return game;
    },

    "warden_executes_you_for_homicide": function(game) {
        game.message = "When the wardon finds out what you've done, he has " +
            "you beheaded in the town square.";
        return game;
    },

    "watch_duty": function(game) {
        var messages = [
            "you don't see anything interesting.",
            "you see a \"birdle,\" a bird standing on a turtle.",
            "you see ocean in every direction.",
            "you see some storm clouds.",
        ];
        game.message = "During your watch duty, " +
            functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "watch_play": function(game) {
        var messages = [
            "The play satirizes Lord Daniel's lunacy policy. The actors " +
            "are arrested at the end of the play.",
            "The play portrays Lord Bartholomew in a glorious light. The " +
            "audience is very pleased and claps for so long that it becomes " +
            "awkward.",
            "The wedding at the end of the play makes you feel lonely.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "wealthy_people_sneer": function(game) {
        game.message = "Some truly wealthy people see you and sneer.";
        return game;
    },

    "what_a_shame": function(game) {
        game.message = "\"What a shame,\" an assassins says as he " +
            "steps into the room. He shoots you with a crossbow and leaves " +
            "you to die in Felicity's arms.";
        game.die();
        return game;
    },

    "witch_burning": function(game) {
        var messages = [
            "You find a mob of peasants about to perform a witch burning.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = null;
        return game;
    },

    "witch_cat_refuse": function(game) {
        var messages = [
            "The witch says she already has too many cats.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "witch_cat_nothing": function(game) {
        var messages = [
            "The witch takes your cat and says it will give her an " +
            "opportunity to find more ways to skin cats.",
            "The witch takes your cat and says it will taste great in a pie.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("cat");
        return game;
    },

    "witch_cat_trade": function(game) {
        var ingredient = functions.random_choice(["ball of sap",
                                                  "deep-cave newt",
                                                  "pearl",]);
        var messages = [
            "The witch gives you a " + ingredient + " in exchange.",
            "The witch smiles a terrible smile and gives you a " +
            ingredient + ".",
            "The witch thanks you and gives you a " + ingredient + ".",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("cat");
        game.get_item(ingredient);
        return game;
    },

    "witch_makes_potion_love": function(game) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("ball of sap");
        game.lose_item("bouquet of flowers");
        game.lose_item("many-colored mushroom");
        game.get_item("potion of love");
        return game;
    },

    "witch_makes_potion_strength": function(game) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("deep-cave newt");
        game.lose_item("white mushroom");
        game.get_item("potion of strength");
        return game;
    },

    "witch_makes_potion_tail_growth": function(game) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("cat");
        game.lose_item("pearl");
        game.get_item("potion of tail growth");
        return game;
    },

    "witch_makes_potion_transformation": function(game) {
        var messages = [
            "The witch takes some of your items and brews you a potion.",
        ];
        game.message = functions.random_choice(messages);
        game.lose_item("apple");
        game.lose_item("ball of sap");
        game.lose_item("black mushroom");
        game.get_item("potion of transformation");
        return game;
    },

    "witch_says_no": function(game) {
        var messages = [
            "The witch says she doesn't owe you any favors.",
            "The witch says she's feeling lazy.",
            "The witch says she's more the hexing kind of witch and not " +
            "the brewing kind of witch.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "wizard_compensates_you": function(game) {
        var messages = [
            "The wizard compensates you.",
        ];
        game.message = functions.random_choice(messages);
        game.character.items["yellow mushroom"] -= 1;
        game.get_item(functions.random_choice(["potion of love",
                                            "potion of tail growth",
                                            "four-leaf clover"]));
        return game;
    },

    "wizard_complains": function(game) {
        game.message = "The wizard complains that you are singing " +
            "off-key. He turns you into a frog and stomps on you.";
        game.character.is_dead = true;
        return game;
    },

    "wizard_dies": function(game) {
        var messages = [
            "The wizard chokes on the mushroom and dies.",
        ];
        game.message = functions.random_choice(messages);
        game.character.items["yellow mushroom"] -= 1;
        game.character.person = null;
        game.persons.wizard.alive = false;
        return game;
    },

    "wizard_eats_mushroom": function(game) {
        var messages = [
            "The wizard chews the mushroom with this mouth open.",
            "The wizard swallows the mushroom whole.",
            "The wizard eats the mushroom and belches.",
            "The wizard chows down on the mushroom, then complains he has " +
            "a stomach ache.",
        ];
        game.character.items["yellow mushroom"] -= 1;
        game.message = functions.random_choice(messages);
        return game;
    },

    "wizard_gives_you_advice": function(game) {
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
        if (game.character.sex === FEMALE) {
            messages.push("The wizard advises you to find a husband before " +
                "you get old and wrinkly like him.");
        }  else {
            messages.push("The wizard advises you to find a woman before " +
                "you get old and weird like him.");
        }
        game.message = functions.random_choice(messages);
        return game;
    },

    "wizard_gives_you_item": function(game) {
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
        game.message = functions.random_choice(messages);
        game.get_item(wizard_item);
        return game;
    },

    "wizard_gives_you_sword": function(game) {
        var messages = [
            "The wizard gives you an evil looking sword and advises you " +
            "to cause as much mayhem as you can.",
        ];
        game.message = functions.random_choice(messages);
        game.get_weapon("sword_of_great_evil");
        return game;
    },

    "wizard_gorilla": function(game) {
        var messages = [
            "The wizard says, \"If you like behaving like a gorilla so " +
            "much, why not be a gorilla?\" He tries to turn you into a " +
            "gorilla, but his spell only makes you " +
            functions.random_choice(["feel", "smell", "walk",]) +
            " like a gorilla.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "wizard_leaves_without_you": function(game) {
        var messages = [
            "The wizard ignores you and sails away before you can " +
            "get to his boat.",
            "The wizard leaves without you.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "wizard_sends_you_to_arctic": function(game) {
        var messages = [
            "The wizard catches you snooping around and conks you on the " +
            "head with his staff.",
        ];
        game.message = functions.random_choice(messages);
        game.move_character("arctic");
        return game;
    },

    "wizard_stops_you_trashing": function(game) {
        var messages = [
            "The wizard comes in while you're trashing the place and " +
            "starts yelling obscenities.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_threatened = true;
        game.character.person = "wizard";
        return game;
    },

    "wizard_teleport_arctic": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("arctic");
        return game;
    },

    "wizard_teleport_countryside": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("countryside");
        return game;
    },

    "wizard_teleport_lord_bartholomew_manor": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("lord_bartholomew_manor");
        return game;
    },

    "wizard_teleport_lord_carlos_manor": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("lord_carlos_manor");
        return game;
    },

    "wizard_teleport_pirate_ship": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("pirate_ship");
        return game;
    },

    "wizard_teleport_random": function(game) {
        var place = functions.random_choice([
                                             "docks",
                                             "dark_alley",
                                             "mermaid_rock",
                                             "ocean",
                                             "tavern",
                                             ]);
        game.message = functions.random_choice([
            "The wizard proves he could have teleported you there by " +
            "teleporting you to " + game.places[place].name + 
            " instead.",
            "The wizard ignores you request and teleports you to " +
            game.places[place].name + " instead.",
        ]);
        game.move_character(place);
        return game;
    },

    "wizard_teleport_smoking_volcano": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("smoking_volcano");
        return game;
    },

    "wizard_teleport_tower": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("tower");
        return game;
    },

    "wizard_teleport_woods": function(game) {
        game.message = game.get_wizard_teleport_message();
        game.move_character("woods");
        return game;
    },

    "wizard_unjust": function(game) {
        var messages = [
            "Having no further use for you, the wizard turns you into a " +
            "frog.",
        ];
        game.message = functions.random_choice(messages);
        game.character.is_frog = true;
        game.character.items["yellow mushroom"] -= 1;
        return game;
    },

    "wizard_wants_mushroom": function(game) {
        var messages = [
            "You find the wizard. He says he can smell that you have a " +
            "yellow mushroom and asks if he can have it.",
        ];
        game.message = functions.random_choice(messages);
        game.character.person = "wizard";
        return game;
    },

    "women_gawk_at_you": function(game) {
        var messages = [
            "The women also gawk at you since you have a tail.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "wowed_eve": function(game) {
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
        game.message = functions.random_choice(messages);
        game.persons.eve.attracted += 1;
        return game;
    },

    "wowed_mermaid": function(game) {
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
        game.message = functions.random_choice(messages);
        game.persons.mermaid.attracted += 1;
        return game;
    },

    "wowed_fat_lady": function(game) {
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
        game.message = functions.random_choice(messages);
        game.persons.felicity.attracted += 1;
        if (game.persons.felicity.attracted > 2 &&
            game.persons.felicity.name === "the fat lady") {
            game.persons.felicity.name = "Felicity";
            game.message = "You strike up a conversation and learn " +
                "that her name is Felicity.";
        }
        return game;
    },

    "wowed_felicity": function(game) {
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
        game.message = functions.random_choice(messages);
        game.persons.felicity.attracted += 1;
        return game;
    },

    "wowed_olga": function(game) {
        var gender_noun;
        var gender_possessive;
        if (game.character.sex === FEMALE) {
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
        game.message = functions.random_choice(messages);
        game.persons.olga.attracted += 1;
        if (game.persons.olga.attracted > 2 &&
            game.persons.olga.name === "the pretty lady") {
            game.persons.olga.name = "Olga";
            if (game.character.sex === FEMALE) {
                game.message += " She tells you her name is Olga. " +
                "You tell her your name is Josephine.";
            } else {
                game.message += " She tells you her name is Olga. " +
                "You also tell her your name.";
            }
        }
        return game;
    },

    "wowed_olga_upstairs": function(game) {
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
        game.message = functions.random_choice(messages);
        game.persons.olga.attracted += 1;
        if (game.persons.olga.attracted > 5) {
            game.message = "Olga grabs your hand. \"Life's too short, " +
            "let's get married!\"";
            game.marriage = true;
        }
        return game;
    },

    //x

    //y

    "yelling_doesnt_help": function(game) {
        var messages = [
            "Your shout echoes around the countryside.",
            "A flock of startled birds flys away.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "you_get_away_with_it": function(game) {
        var messages = [
            "Since Lord Arthur is dead, you get away with it.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    "you_get_mobbed": function(game) {
        var messages = [
            "The local peasants mob you. They take your money and your life.",
        ];
        game.message = functions.random_choice(messages);
        game.die();
        return game;
    },

    "your_sword_stops_you": function(game) {
        var messages = [
            "You can't get your sword of great good out of its sheath.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

    //z

    "zone_out": function(game) {
        var messages = [
            "You zone out while " +
            game.get_name() + " " + game.conjugate("talk") +
            " to you.",
            "You space out while " +
            game.get_name() + " " + game.conjugate("talk") +
            " about Lord Bartholomew.",
        ];
        game.message = functions.random_choice(messages);
        return game;
    },

};

exports.outcomes = outcomes;
