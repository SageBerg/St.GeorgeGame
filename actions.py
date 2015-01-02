import random
import abc

import places
from raffle import Raffle
import money
import items
import persons
from outcome import Outcome


class Action(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def slot(self):
        pass

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.combat_action = False
        self.outcomes = Raffle()

    @abc.abstractmethod
    def execute(self, character):
        """
        returns nothing, edits character attributes
        """

    def get_outcome(self, character):
        self.execute(character)
        outcome = self.outcomes.get()  # outcome may be function or instance
        # self.outcomes = Raffle()
        return outcome

    def __str__(self):
        return self.name


# A slot actions


class TrainWithTheGuards(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Train with the guards."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The guards throw you out for not filling out proper "
            "paperwork.",
            move_to=places.streets,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You break your neck in a training accidently.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You get the badly beaten in wooden swrodplay.",
            grow_stronger=1,
        ), weight=1)

        if character.get_attack() > 4:
            self.outcomes.add(Outcome(character,
                "You defeat the captain of the guards at wooden "
                "swordplay. \"Not bad for a {0},\" he says"
                ".".format(random.choice([
                    "peasant",
                    "lunatic",
                    "simpleton",
                    ])),
                succeed=True,
            ), weight=1)


class AskHerToBrew(Action):

    slot = "a"

    def __init__(self, potion):
        super().__init__()
        self.potion = potion
        self.name = "Ask her to brew a {0}.".format(self.potion.name)

    def execute(self, character):

        # potential errors here if none of the if statements execute
        # we'll have an empyt raffle

        if self.potion.name == "love potion":
            self.outcomes.add(Outcome(character,
                "The witch puts your ingredients in her cauldron and brews "
                "a large batch.",
                add_item=self.potion,
                funcs=[lambda: character.remove_item(items.bottle_of_sap),
                       lambda: character.remove_item(items.bouquet_of_flowers),
                       lambda: character.remove_item(items.many_colored_mushroom)]
            ), weight=1)

        if self.potion.name == "potion of tail growth":
            self.outcomes.add(Outcome(character,
                "The witch puts your ingredients in her cauldron and brews "
                "a large batch.",
                add_item=self.potion,
                funcs=[lambda: character.remove_item(items.cat),
                       lambda: character.remove_item(items.pearl)]
            ), weight=1)

        if self.potion.name == "potion of strength":
            self.outcomes.add(Outcome(character,
                "The witch puts your ingredients in her cauldron and brews "
                "a large batch.",
                add_item=self.potion,
                funcs=[lambda: character.remove_item(items.white_mushroom),
                       lambda: character.remove_item(items.deep_cave_newt)]
            ), weight=1)


class Think(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Think."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You come up with four brilliant ideas.",
            actions=[(LickTheGround(character.place), 10)]
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "All you can think is \"Think. Think. Think.\".",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You come up with a plan B in case things go south.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Since you're a man, you think about sex."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You spend some time reevalutating your life and conclude "
            "that you need to stay the course.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You get lost in your thoughts.",
        ), weight=1)

        if character.place != places.tavern and \
            persons.pretty_lady.name != "Olga":
            self.outcomes.add(Outcome(character,
                "You think about a pretty lady you saw in the tavern.",
                topic="marriage"
            ), weight=1)
        elif persons.pretty_lady.name == "Olga":
            self.outcomes.add(Outcome(character,
                "You think about Olga.",
                topic="marriage"
            ), weight=1)

        if character.place == places.wizards_lab or \
           character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "You think you probably shouldn't be here.",
            ), weight=8)

        if character.place == places.tavern or \
           character.place == places.dark_alley or \
           character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "You think about how painful it would be to get stabbed. "
                "You soon find out.",
                die=True
            ), weight=4)

        if character.place == places.docks or \
           character.place == places.ocean or \
           character.place == places.pirate_ship or \
           character.place == places.mermaid_rock:
            self.outcomes.add(Outcome(character,
                "You think the ocean is really big.",
            ), weight=8)

            self.outcomes.add(Outcome(character,
                "You think the bad smell might be coming from you.",
            ), weight=2)

        if character.place == places.tower:
            self.outcomes.add(Outcome(character,
                "You think you can survive the jump from the top of the "
                "tower.",
                die=True
            ), weight=5)

            self.outcomes.add(Outcome(character,
                "While you're thinking, a guard hands you an ax and tells "
                "you to chop some firewood for the cooks.",
                add_item=items.ax
            ), weight=5)

        if character.place == places.countryside:
            self.outcomes.add(Outcome(character,
                "You think about Lord Bartholomew.",
                topic="Lord Bartholomew"
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "You wonder if any peasant women would "
                "go for a man like you.",
                topic="peasants"
            ), weight=2)

        if character.place == places.woods:
            self.outcomes.add(Outcome(character,
                "You think about fire.",
                topic="fire"
            ), weight=3)

        if character.place == places.church:
            self.outcomes.add(Outcome(character,
                "You wonder what life is all about and feel smug "
                "for being so philosophical.",
                topic="yourself"
            ), weight=3)

        if character.place == places.arctic:
            self.outcomes.add(Outcome(character,
                "You think about ice.",
                topic="ice"
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "You can't think about much besides how cold you are.",
                topic="misery"
            ), weight=4)

        if character.place == places.cave:
            self.outcomes.add(Outcome(character,
                "You think about the darkness that is crushing in on you from "
                "all sides.",
            ), weight=9)

            self.outcomes.add(Outcome(character,
                "You think you hear bats, but you also think you might be crazy.",
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "You think about death."
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "You think about suffocation."
            ), weight=3)

        if character.person:
            self.outcomes.add(Outcome(character,
                "You zone out while " + character.person.name + " talk" +
                persons.get_tense(character.person) + ".",
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "You space out."
            ), weight=2)


class Yell(Action):

    slot = "a"

    def __init__(self, exclamation):
        super().__init__()
        self.exclamation = exclamation
        self.name = "Yell \"{0}!\"".format(exclamation)

    def execute(self, character):

        if self.exclamation == "I lost my leg":
            self.outcomes.add(Outcome(character,
                "No one cares.",
                fail=True,
            ), weight=1)


class ReadASpellBook(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Read a spell book."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You open a book of curses. It's cursed.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You learn that it takes sap, flowers, and a many-colored "
            "mushroom to make a love potion.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You learn that it takes a cat and a pearl "
            "mushroom to brew a potion of tail growth.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You learn that it takes a white mushoorm and deep-cave newt "
            "to brew a potion of strength.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find it arcane and boring.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You learn a spell to set things on fire, but it requires a "
            "focused mind.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The wizard's handwriting is terrible.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a four-clover in the pages of the spell book.",
            add_item=items.four_leaf_clover,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The first book you open appears to be the wizard's diary. "
            "{0}.".format(random.choice([
                "It is full of details about how he is too chicken to "
                "ask out a woman he often sees in the market.",
                "He appears to be obsessed with void dust, but can't "
                "figure out how to get any.",
                "It's mostly math proofs."])),
        ), weight=1)


class SuckUpTo(Action):

    slot = "a"

    def __init__(self, person):
        super().__init__()
        self.person = person
        self.name = "Suck up to {0}.".format(person)

    def execute(self, character):

        if self.person == persons.lord_arthur:

            self.outcomes.add(Outcome(character,
                "Lord Arthur sends you on a mission to find him a pet sea "
                "turtle.",
                move_to=places.ocean,
            ), weight=1)

        if self.person == persons.lord_bartholomew:

            self.outcomes.add(Outcome(character,
                "Lord Bartholomew wishes you well and sends you on your way.",
                move_to=places.countryside
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Lord Bartholomew takes a liking to you and gives you a long "
                "pitchfork.",
                add_item=items.long_pitchfork
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Lord Bartholomew tells you to take more pride in yourself.",
                succeed=True
            ), weight=1)

        if self.person == persons.lord_carlos:

            self.outcomes.add(Outcome(character,
                "He tells you that your are forgiven, but his men never fail."
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "He has you thrown out the window.",
                move_to=places.woods
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Lord Carlos is having none of it. He kills you.",
                die=True
            ), weight=1)

        if self.person == persons.lord_daniel:

            self.outcomes.add(Outcome(character,
                "Lord Daniel sends you away.",
                move_to=places.streets
            ), weight=1)


            self.outcomes.add(Outcome(character,
                "Lord Daniel questions your sanity.",
                fail=True
            ), weight=1)


class TellThemYouAreALunatic(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Tell them you are a lunatic."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "\"A rich lunatic,\" they say before moving along.",
            new_person=None,
        ), weight=1)


class Swashbuckle(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Swashbuckle."

    def execute(self, character):

        if character.has_item(items.cutlass) or \
           character.has_item(items.jeweled_cutlass):

            self.outcomes.add(Outcome(character,
                "You kill several innocent merchants. Lord Arthur is pleased "
                "and gives you a large share of the plunder.",
                get_money=money.large_fortune
            ), weight=1)

        else:

            self.outcomes.add(Outcome(character,
                "You find it difficult to swashbuckle without a cutless and "
                "are soon killed.",
                die=True
            ), weight=1)

        self.outcomes.add(Outcome(character,
            "You manage to hold your own. Afterwards Lord Arthur divies "
            "up the booty.",
            add_item=items.jewels
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A cabin boy stabs you in the back during the fight.",
            die=True
        ), weight=1)

        if not character.has_item(items.sailor_peg):

            self.outcomes.add(Outcome(character,
                "You lose your leg in the battle, but Lord Arthur gives you a peg "
                "leg as a replacement.",
                add_item=items.sailor_peg
            ), weight=1)


class LookForAssassins(Action):
    """
    Note: only use in dark alley
    """

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Look for assassins."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You don't see any.",
            die=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "The dark alley appears to be safe.",
        ), weight=1)


class PickSomeFlowers(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Pick some flowers."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "{0}".format(random.choice([
            "You find many pretty flowers.",
            "You peasant girl picks flowers with you. She tells you she "
            "wants to be like Lord Bartholomew when she grows up.",
            "You spend all day looking for flowers, but it was worth it.",
            "You get stung by a bee, but you still find many pretty flowers.",
            ])),
            add_item=items.bouquet_of_flowers,
            succeed=True,
        ), weight=4)

        self.outcomes.add(Outcome(character,
            "You don't find any flowers, but you find a four-leaf clover.",
            add_item=items.four_leaf_clover,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find any flowers. Only grass.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find any flowers. Only grass.",
            fail=True,
        ), weight=1)


class GoFishing(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Go fishing."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You don't catch any fish.",
            fail=True,
        ), weight=10)

        self.outcomes.add(Outcome(character,
            "You fish up an ax.",
            add_item=items.ax,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You fish up a pitchfork.",
            add_items=items.pitchfork,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You catch a fish.",
            add_item=items.fish,
            succeed=True,
        ), weight=10)

        if character.place == places.docks:
            self.outcomes.add(Outcome(character,
                "You don't catch any fish, but the assassins catch you.",
                clover=True,
                die=True,
            ), weight=1)


class TakeIt(Action):

    slot = "a"

    def __init__(self, wronged_party, item):
        super().__init__()
        self.wronged_party = wronged_party
        self.item = item
        self.name = "Take it."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            None,
            add_item=self.item,
        ), weight=3)

        if self.wronged_party.alive:
            self.outcomes.add(Outcome(character,
                self.wronged_party.name[0].upper() +
                self.wronged_party.name[1:] + " notice" +
                persons.get_tense(self.wronged_party) + " you taking it and kill" +
                persons.get_tense(self.wronged_party) + " you.",
                clover=True,
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                self.wronged_party.name[0].upper() +
                self.wronged_party.name[1:] + " notice" +
                persons.get_tense(self.wronged_party) + " you taking it and " +
                "become" +
                persons.get_tense(self.wronged_party) + " wroth with you.",
                new_person=self.wronged_party,
                threat=True,
            ), weight=1)


class AskAboutAssassins(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Ask about assassins."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The first person you ask about assassins turns "
            "out to be an assassin. She assassinates you.",
            clover=True,
            die=True
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You ask around, but nobody has heard anything "
            "about any assassins.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "During your search, you strike up a conversation "
            "with a pretty lady.",
            new_person=persons.pretty_lady
        ), weight=100) # TODO fix

        if character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "You ask a servant about assassins. She asks you to wait where "
                "you are.",
                actions=[(RunLikeTheDevil(), 40)],
            ), weight=10)


class AskDirections(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Ask directions."

    def execute(self, character):

        if character.person == persons.simple_peasant:
            self.outcomes.add(Outcome(character,
                "He tells you there are four directions, north, south, "
                "east, and west.",
                fail=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "He tells you the only direction worth going is to Lord "
                "Bartholomew's house.",
                fail=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "He says the town is yonder.",
            ), weight=1)

        if character.person == persons.peasant_lass:
            self.outcomes.add(Outcome(character,
                "She says Lord Carlos' manor is in the woods.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She says Lord Bartholomew's manor is nearby.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She says there's good mushroom picking in woods.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She babbles incoherently while eating a many-colored "
                "mushroom.",
            ), weight=1)


class AdmireYourJewels(Action):

    slot = "a"

    def __init__(self, jewels):

        super().__init__()
        self.name = "Admire your jewels."
        self.jewels = jewels

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You decide that your jewels outclass everything else you have."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You decide to store your jewels in your stomach for safe "
            "keeping.",
            remove_item=self.jewels,
            topic="mules"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a pearl in your bag of jewels",
            add_item=items.pearl,
            topic="pearls"
        ), weight=1)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "You notice the reflection of a dagger in a particularly "
                "large ruby.",
                clover=True,
                die=True,
            ), weight=1)

        if character.place in places.town:

            self.outcomes.add(Outcome(character,
                "The guards catch you with your pants down. They conclude you "
                "must be a lunatic",
                new_person=persons.guards,
                threat=True,
                topic='curious'
            ), weight=2)


class Apologize(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Tell him you're sorry."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "\"I'm afraid 'sorry' won't cut it.\" His knife does.",
            die=True,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "\"Oh, you're not sorry yet,\" he says as he steps toward you.",
            threat=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "A bystander notices the assassin threatening you. "
            "\"The man said he was sorry, isn't that enough?\" "
            "he says. \"No,\" the assassin replies.",
            threat=True,
        ), weight=1)


class Arrest(Action):

    slot = "a"

    def __init__(self, person):
        super().__init__()
        self.name = "Arrest " + person.name + "."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            character.person.name.capitalize() + " arrest" +
            persons.get_tense(character.person) + " you and throw you in "
            "prison with the other lunatics.",
            move_to=places.prison,
            new_person=persons.other_lunatics,
            fail=True
        ), weight=1)


class Attack(Action):

    slot = "a"

    def __init__(self, person):
        super().__init__()
        self.name = "Attack " + person.name + "."
        self.combat_action = True

    def execute(self, character):

        if character.person.attack >= character.get_attack():

            self.outcomes.add(Outcome(character,
                character.person.name[0].upper() +
                character.person.name[1:] + " kill" +
                persons.get_tense(character.person) + " you.",
                die=True,
            ), weight=1)
        else:

            self.outcomes.add(Outcome(character,
                "You kill " + character.person.name + ".",
                unthreat=True,
                kill=True,
            ), weight=1)


class GoDivingForPearls(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Go diving for pearls."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Lord Arthur's pet shark eats you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You soon find a pearl in an oyster.",
            add_item=items.pearl,
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You drown on a fool's errand",
            die=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You soon pry open an oyster and find beautiful pearl. "
            "It's so dazzling you drown while gazing at it.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You exhaust yourself trying to find pearls and start to drown. "
            "A beautiful mermaid grabs you and hoists you to safety.",
            move_to=places.mermaid_rock,
            new_person=persons.mermaid,
        ), weight=1)


class LickTheGround(Action):

    slot = "a"

    def __init__(self, place):
        super().__init__()
        self.place = place
        if place in places.inside:
            self.ground = "floor"
        elif place == places.pirate_ship:
            self.ground = "deck"
        else:
            self.ground = "ground"
        self.name = "Lick the {0}.".format(self.ground)

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You catch an infection and spend {0} weeks fighting "
            "it.".format(random.choice(["two", "three", "four",
                                        "five", "six"])),
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find the flavor of the {0} distasteful.".format(self.ground),
            fail=True,
        ), weight=3)

        if character.place in places.populated:
            self.outcomes.add(Outcome(character,
                "The local guards see you licking the {0} and accuse you of "
                "being a lunatic.".format(self.ground),
                new_person=persons.guards,
                threat=True,
            ), weight=3)

        if character.place == places.wizards_lab:
            self.outcomes.add(Outcome(character,
                "You lick some spilled potion off the floor and start "
                "growing at a monsterous rate.",
                funcs=[character.monstrosify],
            ), weight=20)

        if character.place == places.ocean:
            self.outcomes.add(Outcome(character,
                "You drown while swimming toward the ocean floor with your "
                "tongue extended.",
                die=True,
            ), weight=10000)

        if character.place == places.woods:
            self.outcomes.add(Outcome(character,
                "As you lick the ground, you notice it smells oddly familiar.",
            ), weight=3)

        if character.place == places.arctic:
            self.outcomes.add(Outcome(character,
                "The ice is realy cold.",
            ), weight=10)


class LookForAWeapon(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Look for a weapon."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You find yourself talking to a wealthy war merchant.",
            new_person=persons.wealthy_merchant,
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You find one... in your back as an assasin walks away smoothly.",
            clover=True,
            die=True,
        ), weight=1)


class LookForVoidDust(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Look for void dust."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The void is very clean. You can't find any.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You void is very dirty. You soon find some.",
            add_item=items.bottle_of_void_dust,
            succeed=True,
        ), weight=1)


class GoMushroomPicking(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Go mushroom picking."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You find a yellow mushroom.",
            add_item=items.yellow_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a white mushroom.",
            add_item=items.white_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a black mushroom.",
            add_item=items.black_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a many-colored mushroom.",
            add_item=items.many_colored_mushroom,
            succeed=True,
        ), weight=1)


class LookForStGeorge(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Look for St. George."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You forget what you were doing.",
            move=1,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You trip over a cat and break your neck.",
            clover=True,
            die=True
        ), weight=1)

        if persons.st_george.alive:
            self.outcomes.add(Outcome(character,
                "You find St. George at the church.",
                move_to=places.church,
                new_person=persons.st_george,
            ), weight=10)

            self.outcomes.add(Outcome(character,
                "You find St. George in the streets.",
                move_to=places.streets,
                new_person=persons.st_george,
            ), weight=5)

            self.outcomes.add(Outcome(character,
                "You find St. George in the market.",
                move_to=places.market,
                new_person=persons.st_george,
            ), weight=3)


class KillYourselfInFrustration(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Kill yourself in frustration."

    def execute(self, character):

        if character.place in [
                places.docks,
                places.mermaid_rock,
                places.arctic]:
            self.outcomes.add(Outcome(character,
                "You walk into the ocean and are suddenly inspired to write "
                "a novel. You drown.",
                die=True,
            ), weight=5)

        if character.place in [places.streets, places.market, places.church]:
            self.outcomes.add(Outcome(character,
                "You throw yourself off a rooftop, but St. George catches "
                "you and gives you a large fortune.",
                get_money=money.large_fortune,
                new_person=persons.st_george,
            ), weight=2)

        if character.place in [places.docks]:
            self.outcomes.add(Outcome(character,
                "You find Lord Arthur and ask him to kill you with his "
                "jeweled cutlass. He gladly obliges.",
                die=True,
            ), weight=5)

        self.outcomes.add(Outcome(character,
            "You perform the ritual of seppuku.",
            die=True,
        ), weight=3)

        if character.place != places.ocean:
            if not character.has_item(items.fire_proof_cloak):
                self.outcomes.add(Outcome(character,
                    "You set yourself on fire and burn to a crisp.",
                    die=True,
                ), weight=3)
            else:
                self.outcomes.add(Outcome(character,
                    "You try to set yourself on fire, but your fancy red "
                    "cloak is fireproof.",
                    fail=True,
                ), weight=3)
        else:
            self.outcomes.add(Outcome(character,
                "You drown trying to set yourself on fire.",
                die=True,
            ), weight=3)

        if character.place == places.countryside or \
           character.place == places.lord_bartholomews_manor or \
           character.place == places.streets:
            self.outcomes.add(Outcome(character,
                "You are about to impail yourself on a fence post when a "
                "small boy walks by. By the time he leaves, your stupidity "
                "is no longer compelling you to kill yourself.",
            ), weight=3)


class KillEverybodyInAFitOfRage(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Kill everybody in a fit of rage."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You start with yourself.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You make no exceptions.",
            die=True
        ), weight=1)


class SayYouLoveHer(Action):
    """
    NOTE: right now this is only for Felicity
    """

    slot = "a"

    def __init__(self, person):
        super().__init__()
        self.name = "Say you love her too."
        self.person = person

    def execute(self, character):

        if self.person == persons.fat_lady:
            self.outcomes.add(Outcome(character,
                "\"What a shame,\" an assassin says as he steps into the room. "
                "He shoots you with a crossbow.",
                die=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity is overjoyed and secretly lets you out of prison "
                "that night. \"Let's get married!\" she says.",
                move_to=places.streets,
                new_person=persons.fat_lady
            ), weight=9)


class MarryOlga(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Marry Olga."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "A bleary-eyed priestess performs a wedding for you and Olga in "
            "alley behind the church. Olga asks the priestess if she would "
            "like to come along for the honeymoon, but the priestess declines.",
            win=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Arthur performs a wedding for you and Olga on the deck of "
            "deck of his pirate ship. By the time the ceremony is over the "
            "ship has sailed. You are now both members of the crew.",
            win=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The wizard performs a wedding for you and Olga in the market. "
            "He turns you both into sheep after the vows, but it is much "
            "safer being sheep.",
            win=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Bartholomew performs a wedding for you and Olga in the "
            "countryside, 20,000 people attend your wedding, but you suspect "
            "they just wanted to see Lord Bartholomew.",
            win=True
        ), weight=1)


class MarryFelicity(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Marry Felicity."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "St. George secretly performs a wedding for you and Felicity.",
            win=True
        ), weight=9)


class ThumpYourselfOnTheChest(Action):

    slot = "a"

    def __init__(self):
        super().__init__()
        self.name = "Thump yourself on the chest."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You feel quite manly.",
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You thump yourself a bit too hard.",
            die=True,
        ), weight=1)

        if character.place in places.populated or \
           character.place == places.countryside:
            self.outcomes.add(Outcome(character,
                "A peasant woman sees you thump your chest and seems "
                "impressed. Unfortunately her husband is not. He ushers her "
                "away.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Some peasants laugh at you for acting like a gorilla.",
                fail=True,
            ), weight=9)

        if character.person == persons.wizard:
            self.outcomes.add(Outcome(character,
                "The wizard says, \"If you like behaving like a gorilla so "
                "much why not be a gorilla?\" He tries to turn you into a "
                "gorilla, but his spell only makes you walk like a gorilla.",
                grow_stronger=2,
            ), weight=20)


# B slot actions


class SlurpDown(Action):

    slot = "b"

    def __init__(self, potion):
        super().__init__()
        self.potion = potion
        self.name = "{0}".format(random.choice([
            "Slurp down your ",
            "Take a swig of your ",
            "Down your ",
            "Chug your ",])) + self.potion.name + "."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Like homeopathy, the potion does nothing.",
        ), weight=1)

        if self.potion.name == "love potion":
            self.outcomes.add(Outcome(character,
                "You fall in love with yourself and give yourself a hug.",
                remove_item=items.love_potion,
            ), weight=10000)

        if self.potion.name == "potion of strength":
            self.outcomes.add(Outcome(character,
                None,
                remove_item=items.strength_potion,
                grow_stronger=4,
            ), weight=10000)

        if self.potion.name == "potion of tail growth":
            self.outcomes.add(Outcome(character,
                "You now have a tail.",
                remove_item=items.tail_potion,
            ), weight=10000)


class LookForWitches(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Look for witches"

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You find a witch deep in the woods.",
            new_person=persons.witch,
        ), weight=1)

        if character.place in places.burnable:
            self.outcomes.add(Outcome(character,
                "You can't find any witches. Only trees.",
                fail=True,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "You can't find any witches. Only burnt trees.",
                fail=True,
            ), weight=1)


class GawkAtWomen(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "{0} at women.".format(random.choice(
            ["Gawk", "Leer", "Stare"]))

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "A fair woman notices you and hastens away.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A woman becomes annoyed with you and throws salt in your eyes.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are too distracted by all the women to notice the "
            "assassins closing in on you.",
            die=True,
        ), weight=1)

        if self.name == "Gawk at women.":
            self.outcomes.add(Outcome(character,
                "You stop gawking when you realize it wasn't a woman.",
                fail=True,
                topic="androgyny",
            ), weight=1)

        if self.name == "Stare at women.":
            self.outcomes.add(Outcome(character,
                "An equally creepy woman stairs back at you before "
                "dissappearing into a dark alley.",
                actions=[(GoTo(places.dark_alley), 5)],
            ), weight=1)


class SwingOnARope(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Swing on a Rope."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You fall into the ocean and no one bothers to save you.",
            move_to=places.ocean,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You manage to knock a merchant off a rope. Lord Arthur rewards "
            "your bravery after the battle is over.",
            succeed=True,
            add_items=items.fish
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A merchant cuts you down.",
            die=True
        ), weight=1)


class Tithe(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Tithe."

    def execute(self, character):

        if character.money == money.pittance:
            character.lose_all_money()

        self.outcomes.add(Outcome(character,
            "You feel {0}.".format(random.choice(
                ["like your sins will be forgiven", "holier",
                 "holy", "like a good person"])),
            succeed=True,
        ), weight=4)

        self.outcomes.add(Outcome(character,
            "You feel {0}.".format(random.choice(
                ["like you've been cheated", "like you wasted your money",
                 "like the church will waste the money", "unfulfilled"])),
            fail=True,
        ), weight=4)

        self.outcomes.add(Outcome(character,
            "A priestess blesses you.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "It was a good time to make peace with God. Lord Carlos steps "
            "out from behind a pillar and assassinates you.",
            die=True,
        ), weight=1)

        if character.get_attack() > 7:
            self.outcomes.add(Outcome(character,
                "St. George sees that you are a righteous man and gives you an "
                "iron hammer to help you do God's work.",
                add_item=items.iron_hammer,
                new_person=persons.st_george,
            ), weight=1)


class BarterWithEskimos(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Barter with the Eskimos."

    def execute(self, character):

        if not character.has_any_items:
            self.outcomes.add(Outcome(character,
                "You have nothing they want.",
                fail=True,
            ), weight=10000)

        if character.has_item(items.seal_carcass):
            self.outcomes.add(Outcome(character,
                "You trade your seal for passage back to land.",
                move_to=places.woods,
                topic="Eskimos",
            ), weight=9)

        self.outcomes.add(Outcome(character,
            "The Eskimos drive a hard bargain, but take you back to land in "
            "one of their kayaks.",
            funcs=[character.remove_all_items],
            move_to=places.woods,
            topic="Eskimos",
        ), weight=1)


class BuildAnIgloo(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Build an igloo."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "While building your igloo, you slip on some ice and die.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't figure out how to build an igloo.",
            fail=True,
        ), weight=1)

        if not character.has_item(items.seal_carcass):
            self.outcomes.add(Outcome(character,
                "Your igloo protects you from the elements, "
                "but not from your hunger.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You get bored and hungry inside your igloo.",
            ), weight=1)

        else:
            self.outcomes.add(Outcome(character,
                "You survive in your igloo until winter by eating your seal. "
                "The winter ice sheet allows you to get back to land.",
                move_to=places.woods,
                remove_item=items.seal_carcass,
                succeed=True,
            ), weight=50)


class Disguise(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.fake_name = random.choice(["St. George.",
                                        "Lord Arthur.",
                                        "Lord Bartholomew.",
                                        "Lord Daniel."])
        self.name = "Tell the next person you meet that you are " + \
                    "{0}".format(self.fake_name)

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You soon have an audience with Lord Carlos. He recognizes you "
            "when you are admitted to his study.",
            new_person=persons.lord_carlos,
            threat=True,
        ), weight=100)

        self.outcomes.add(Outcome(character,
            "No one is buying it. You are soon assassinated.",
            die=True
        ), weight=1)


class BurnThePlaceToTheGround(Action):

    slot = "b"

    def __init__(self, place):
        super().__init__()
        self.place = place
        self.name = "Burn {0} to the ground.".format(place.name)

    def execute(self, character):

        if not character.has_item(items.fire_proof_cloak):
            self.outcomes.add(Outcome(character,
                "You accidentally set yourself on fire and promptly burn to "
                "the ground.",
                die=True
            ), weight=1)
        else:
            if self.place in places.burnable:
                self.outcomes.add(Outcome(character,
                    "You almost perish in the blaze, but your "
                    "fancy red cloak is fireproof.",
                    burn_place=self.place,
                    succeed=True,
                    move_to=self.place
                ), weight=1)

        if self.place in places.burnable:
            self.outcomes.add(Outcome(character,
                None,
                burn_place=self.place,
                succeed=True,
                move_to=self.place
            ), weight=4)

        if character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "You get assassinated while looking for kindling.",
                die=True
            ), weight=40)

        if character.person == persons.st_george:
            self.outcomes.add(Outcome(character,
                "St. George sees you attempting arson and smites you.",
                die=True
            ), weight=30)

        if character.person == persons.st_george:
            self.outcomes.add(Outcome(character,
                "The wizard sees you attempting arson and turns you into a "
                "frog. He steps on you.",
                die=True
            ), weight=20)


class SetThePlaceOnFire(BurnThePlaceToTheGround):

    slot = "a"

    def __init__(self, place):
        super().__init__(place)
        self.place = place
        self.name = "Set {0} ablaze.".format(place.name)


class BurnThePlaceToACrisp(BurnThePlaceToTheGround):

    slot = "c"

    def __init__(self, place):
        super().__init__(place)
        self.place = place
        self.name = "Burn {0} to a crisp.".format(place.name)


class LightUpThePlace(BurnThePlaceToTheGround):

    slot = "d"

    def __init__(self, place):
        super().__init__(place)
        self.place = place
        self.name = "Light up {0}.".format(place.name)


class ClimbIntoTheCrowsNest(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Climb into the crow's nest."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You spot a merchant ship. Lord Arthur calls all hands to raid "
            "the ship.",
            actions=[
                (Swashbuckle(), 1000),
                (SwingOnARope(), 1000),
                (FireACanon(), 1000),
                (HideUnderTheDeck(), 1000)]
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are able to help guide the ship to land.",
            succeed=True,
            move_to=places.woods
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are able to help guide the ship to the docks.",
            succeed=True,
            move_to=places.docks
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You drop your bag on your way up the mast. A pirate takes it.",
            remove_all_items=True,
            fail=True,
            topic="treachery"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You fall off the mast on the way up mast.",
            clover=True,
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A crow in the crow's nest caws louding in your face, startling "
            "you. You fall off the mast and land on the deck.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A crow in the crow's nest caws louding in your face, startling "
            "you. You fall off the mast and land in the water.",
            fail=True,
            move_to=places.ocean
        ), weight=1)


class RaiseASail(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Raise a sail."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Lord Arthur has you killed for raising the wrong sail.",
            clover=True,
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You help the ship return to the docks quicker.",
            succeed=True,
            move_to=places.docks
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Arthur yells at you to scrub the deck."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "As you are raising a sail you see a merchant ship. Lord Arthur "
            "calls all hands to raid the ship.",
            actions=[
                (Swashbuckle(), 1000),
                (SwingOnARope(), 1000),
                (FireACanon(), 1000),
                (HideUnderTheDeck(), 1000)]
        ), weight=1)

        if not character.is_employed_by(persons.lord_arthur):

            self.outcomes.add(Outcome(character,
                "Lord Arthur is impressed by your initiative and makes you a "
                "member of the crew.",
                add_employer=persons.lord_arthur,
            ), weight=1)


class ScrubTheDeck(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Scrub the deck."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "As you are scrubing the deck you hear Lord Arthur calling all "
            "hands to raid an approaching merchant ship.",
            actions=[
                (Swashbuckle(), 1000),
                (SwingOnARope(), 1000),
                (FireACanon(), 1000),
                (HideUnderTheDeck(), 1000)]
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Arthur yells at you to raise a sail."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You dislocate your shoulder scrubbing and Lord Arthur has no "
            "further use for you. He has you thrown off the ship.",
            clover=True,
            die=True
        ), weight=1)

        if character.is_employed_by(persons.lord_arthur):

            self.outcomes.add(Outcome(character,
                "Lord Arthur yells at you to scrub harder.",
                new_person=persons.lord_arthur,
            ), weight=1)

        else:

            self.outcomes.add(Outcome(character,
                "Lord Arthur is impressed by your initiative and makes you a "
                "member of the crew.",
                new_person=persons.lord_arthur,
                add_employer=persons.lord_arthur,
            ), weight=1)


class PlayDead(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Play dead."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You soon are.",
            die=True
        ), weight=2)

        if character.person != persons.lord_carlos:
            self.outcomes.add(Outcome(character,
                "You are too pathetic for {0} to kill.".format(
                    character.person.name),
                unthreat=True,
                new_person=None,
                fail=True
            ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "Your patheticness does not soften Lord Carlos' {0} "
                "heart.".format(random.choice(["stony", "icy", "cold",
                                               "evil", "bitter", "cruel",])),
                die=True,
            ), weight=1)

        self.outcomes.add(Outcome(character,
            "You go the extra mile to make it realistic.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Just to be sure, {0} kill{1} you.".format(
                character.person.name,
                persons.get_tense(character.person)),
            die=True
        ), weight=1)


class PrayToAHigherPower(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Pray to a higher power."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Your prayers go unanswered.",
            fail=True
        ), weight=2)

        if character.has_any_items():
            self.outcomes.add(Outcome(character,
                "God decides to test you.",
                remove_all_items=True
            ), weight=2)

        self.outcomes.add(Outcome(character,
            "God speaks to you and shows you the way.",
            topic="arson"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "God tells you to marry the nymph queen.",
            topic="nymphs"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your prayers are answered.",
            get_money=money.small_fortune
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your prayers for a beautiful wife are answered but she soon "
            "leaves you.",
            fail=True,
            topic="divorce"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your prayers aren't answered, but the assassins' are.",
            clover=True,
            die=True
        ), weight=1)

        if character.place in places.burnable:

            self.outcomes.add(Outcome(character,
                "Your prayers are answered.",
                burn_place=character.place
            ), weight=1)

        if character.place == places.tavern:

            self.outcomes.add(Outcome(character,
                "God does nothing for you, but you do find a small sack of "
                "jewels someone left on a counter.",
                add_item=items.jewels,
                topic='jewels'
            ), weight=1)

        if character.place in places.town:

            self.outcomes.add(Outcome(character,
                "St. George joins you in prayer.",
                new_person=persons.st_george
            ), weight=1)


class BegForMoney(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Beg for money."

    def execute(self, character):

        if character.place != places.church and \
           character.person == persons.st_george:
            self.outcomes.add(Outcome(character,
                "St. George tells you he has lost his wallet in the church.",
            ), weight=1)


        if character.person == persons.st_george:
            if persons.st_george.state.get("given money", False):
                self.outcomes.add(Outcome(character,
                    "St. George becomes irritated by your begging "
                    "and crushes you with his iron hammer.",
                    die=True
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "St. George smites you with his saintly wraith "
                    "for being ungrateful.",
                    die=True
                ), weight=1)

            else:
                self.outcomes.add(Outcome(character,
                    character.person.name + " give" +
                    persons.get_tense(character.person) +
                    " you a pittance.",
                    beg=True,
                    get_money=money.pittance,
                ), weight=3)

                self.outcomes.add(Outcome(character,
                    character.person.name + " give" +
                    persons.get_tense(character.person) +
                    " you a small fortune.",
                    beg=True,
                    get_money=money.small_fortune,
                ), weight=2)

                self.outcomes.add(Outcome(character,
                    character.person.name + " give" +
                    persons.get_tense(character.person) +
                    " you a large fortune.",
                    beg=True,
                    get_money=money.large_fortune,
                ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "Your begging falls on deaf ears.",
                fail=True,
                beg=True,
                topic="money",
            ), weight=1)


class BideYourTime(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Bide your time."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You die of old age.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "As the days drag on, you go insane.",
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You notice the warden carries the keys when he "
            "inspects the cells. He inspects the cells with "
            "an entourage of guards most weekends, but he "
            "does it alone on holidays.",
        ), weight=2)
            #self.options["a"].add(LaughAboutWarden(), 5)
            #self.options["b"].add(TryToTakeKeys(), 5)
            #self.options["d"].add(WaitForAHoliday(), 5)

        if persons.fat_lady.attracted > -1 and persons.fat_lady.attracted < 3:
            self.outcomes.add(Outcome(character,
                "As the days pass, you find yourself more and more "
                "attracted to the fat woman who brings you food.",
            ), weight=3)


class BuyBlackMarketItem(Action):

    slot = "b"

    def __init__(self, items):
        super().__init__()
        self.item = random.choice(items)
        self.name = "Buy a " + self.item.name + "."

    def execute(self, character):

        if character.money > money.pittance:
            self.outcomes.add(Outcome(character,
                "You find a {0}.".format(random.choice([
                    "black market peddler",
                    "merchant witch",
                    "monger of rare items",])),
                add_item=self.item,
            ), weight=3)
        else:
            self.outcomes.add(Outcome(character,
                "You can't afford this item.",
                fail=True,
                topic="poverty",
            ), weight=3)

        self.outcomes.add(Outcome(character,
            "You find an assassin posing as a black market peddler.",
            die=True,
        ), weight=1)


class BuyItem(Action):

    slot = "b"

    def __init__(self, items):
        super().__init__()
        self.item = random.choice(items)
        if self.item.name[0] in "aeiou":
            self.name = "Buy an " + self.item.name + "."
        else:
            self.name = "Buy a " + self.item.name + "."

    def execute(self, character):

        if character.money != money.none:
            self.outcomes.add(Outcome(character,
                "",
                add_item=self.item,
            ), weight=3)
        else:
            self.outcomes.add(Outcome(character,
                "You can't afford this item.",
                fail=True,
                topic="poverty",
            ), weight=3)


class BuyWeapon(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.weapon = random.choice(items.weapons)
        self.name = "Buy a " + str(self.weapon) + "."

    def execute(self, character):

        if character.money >= items.get_weapon_price(self.weapon):

            self.outcomes.add(Outcome(character,
                None,
                add_item=self.weapon,
            ), weight=3)

        else:

            self.outcomes.add(Outcome(character,
                "You can't afford this weapon.",
                fail=True,
                topic="poverty",
            ), weight=3)


class BuyADrink(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Buy a drink."

    def execute(self, character):

        if persons.blind_bartender.alive:

            self.outcomes.add(Outcome(character,
                "The blind bartender grumbles as he passes you a drink.",
                new_person=persons.blind_bartender,
            ), weight=4)

            self.outcomes.add(Outcome(character,
                "The drink is poisoned.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "An assassin walks up and starts hitting on you... very hard.",
                die=True,
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "As you drink, you hear a peasant talking about how great "
                "Lord Bartholomew is.",
                topic='Lord Bartholomew'
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "A man in a black cloak sits next to you and orders a drink.",
                new_person=persons.assassin,
                topic="assassins"
            ), weight=2)

        else:
            self.outcomes.add(Outcome(character,
                "No one is selling.",
                fail=True,
            ), weight=1)


class BoastOfYourBravery(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Boast of your bravery."

    def execute(self, character):
        if not character.person:

            self.outcomes.add(Outcome(character,
                "You impress yourself.",
                succeed=True,
            ), weight=1)

        else:

            self.outcomes.add(Outcome(character,
                 character.person.name[0].upper() +
                 character.person.name[1:] +
                 " is not impressed.",
                 fail=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "As you boast of your exploits, {0} walks away.".format(
                    character.person.name),
                new_person=None,
                fail=True,
            ), weight=1)

            if character.person == persons.blind_bartender:

                self.outcomes.add(Outcome(character,
                    "The blind bartender starts pretending to be deaf.",
                    fail=True,
                ), weight=3)

            if character.person == persons.st_george:

                self.outcomes.add(Outcome(character,
                    "St. George warns you of the dangers of hubris.",
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "You tell St. George about the time you burnt a house "
                    "down and hey slays you for your wicked ways.",
                    die=True
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "St. George lauds your noble deeds and rewards you.",
                    get_money=money.large_fortune
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "St. George becomes irate when you claim to have slain a "
                    "dragon. He obliterates you.",
                    die=True
                ), weight=1)

            if character.person == persons.pretty_lady:

                self.outcomes.add(Outcome(character,
                    "Her eyes glaze over as you struggle to remember times "
                    "you were brave.",
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "She sees through your lies.",
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "She seems interested in your stories.",
                ), weight=1)

            if character.person == persons.fat_lady:

                self.outcomes.add(Outcome(character,
                    "She points out several inconsistencies in your story.",
                    flirt=-1,
                    fail=True
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "She seems to buy it.",
                    flirt=1
                ), weight=1)

            if character.person == persons.guards:

                self.outcomes.add(Outcome(character,
                    "You tell the guards that you are brave.\n 'A brave "
                    "lunatic,' they say and they throw you in prison.",
                    new_person=persons.other_lunatics,
                    move_to=places.prison
                ), weight=1)


class LookForACat(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Look for a cat."

    def execute(self, character):

        if character.has_item(items.fish):
            self.outcomes.add(Outcome(character,
                "A cat smells your fish and approaches you.",
                succeed=True,
                add_item=items.cat,
            ), weight=20)

        self.outcomes.add(Outcome(character,
            "After days of searching, you manage to find a cat.",
            succeed=True,
            add_item=items.cat,
        ), weight=14)

        self.outcomes.add(Outcome(character,
            "Your efforts to find a cat are fruitless.",
            fail=True,
        ), weight=6)

        self.outcomes.add(Outcome(character,
            "You see something out of the corner of your eye that looks like "
            "a cat. You chase it to no avail.",
            fail=True,
            topic="cats",
        ), weight=6)

        self.outcomes.add(Outcome(character,
            "You find a ferocious cat. It kills you.",
            clover=True,
            die=True,
        ), weight=1)

        if character.place in places.burnable and \
           character.place in places.town:

            self.outcomes.add(Outcome(character,
                "You knock a lantern over as you chase a cat.",
                burn_place=character.place
            ), weight=4)

        if character.place in places.populated and not character.place.locked:

            self.outcomes.add(Outcome(character,
                "You follow a cat through the streets but "
                "eventually lose track of it.",
                move_to=places.dark_alley,
            ), weight=6)

            self.outcomes.add(Outcome(character,
                "The local guards notice you searching for a cat "
                "and conclude that you must be a lunatic.",
                new_person=persons.guards,
                threat=True,
                topic="lonely",
            ), weight=6)

        if character.place == places.pirate_ship:
            self.outcomes.add(Outcome(character,
                "You find Lord Arthur's freakish cat. The cat has "
                "eight more tails than a normal cat.",
            ), weight=20)


class TellThemYouAreNotALunatic(Action):

    slot = "b"

    def __init__(self, topic):
        super().__init__()
        self.topic = topic
        self.name = "Tell them you are not a lunatic, " + \
            "you're just {0}.".format(topic)

    def execute(self, character):

        if self.topic[0] in "aeiou":
            self.outcomes.add(Outcome(character,
                "\"An {0} lunatic,\" they say.".format(self.topic),
                fail=True,
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "\"A {0} lunatic,\" they say.".format(self.topic),
                fail=True,
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=1)


class TipACow(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Tip a cow."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You are dissapointed to find out that cows can get back up "
            "easily.",
            new_person=None,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Some peasants see you trying to tip a cow and laugh at you.",
            new_person=None,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find any cows. Only sheep.",
            new_person=None,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You pull a cow on top of yourself and it crushes you.",
            new_person=None,
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You're not strong enough to push the cow over, but you notice a "
            "pearl in the field.",
            new_person=None,
            add_item=items.pearl,
            topic="pearls and cows",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Some peasants mistake you for a cow theif and form a lynch mob.",
            threat=True,
            new_person=persons.mob,
        ), weight=1)


class LookForSeaTurtles(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Look for sea turtles."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You don't see one. You also drown because you are in the ocean.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your efforts to find a sea turtle are fruitless.",
            fail=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find a sea turtle and follow it to shore.",
            move_to=places.woods,
            topic="sea turtles",
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find a sea turtle. Everywhere looks the same.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a shark instead. It minds its own business."
        ), weight=1)


class LookForMermaids(Action):

    slot = "b"

    def __init__(self):
        super().__init__()
        self.name = "Look for mermaids."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You are taken out by a storm during your search.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "After days of searching, you are not sure mermaids exist.",
            fail=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find a sea turtle instead.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are not sure where to look.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mermaid and she leads you back to her rock.",
            move_to=places.mermaid_rock,
            new_person=persons.mermaid
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a wooden mermaid figurehead on the front of Lord "
            "Arthur's ship. The crew hoists you abroad.",
            move_to=places.pirate_ship
        ), weight=1)


# C slot actions


class Hide(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Hide."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You hide from the assassins, but not from your own "
            "dark thoughts.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You hide for a couple of days, long enough "
            "that you think the whole assassin thing has probably "
            "blown over.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You try to hide in the sewer, but you end up "
            "drowning in filth.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You try to hide in the sewer, but you are killed "
            "by a rat.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You trip in the darkness and break your neck.",
            clover=True,
            die=True,
        ), weight=1)


class LookForAWayOut(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Look for a way out."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You fumble around in the darkness.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You think you're going around in cicles.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't see anything, so you only manage to bump your head "
            "on a rock.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You slip on a slippery slope and fall to your death.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You don't find a way out, but you find a deep-cave newt.",
            add_item=items.deep_cave_newt,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find your way out of the cave.",
            move_to=places.woods,
            succeed=True,
        ), weight=1)


class ClimbUpTheTopSails(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Climb up the top sails."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Your peg leg falls into the ocean while you work on the sails.",
            remove_item=items.sailor_peg,
            funcs=[character.depegify],
        ), weight=1)


class TellAPriest(Action):

    slot = "c"

    def __init__(self, idea):
        super().__init__()
        self.idea = idea
        self.name = "Tell a priest " + self.idea + "."

    def execute(self, character):

        if self.idea == "that God doesn't exist":
            self.outcomes.add(Outcome(character,
                "The priest thinks for a moment and realizes you're "
                "right. \"What a fool I've been,\" he says. \"I'll go and "
                "become a peasant.\"",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "The priest thinks for a moment and realizes you're "
                "right. \"What a fool I've been,\" he says. \"I'm going to "
                "go and find a wife.\"",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "God smites you for your {0}.".format(random.choice([
                    "arrogance", "foolishness", "rudeness", "balsphemy",
                    "tactlessness", "faithlessness"])),
                clover=True,
                die=True,
            ), weight=2)

        if self.idea == "that he's fat":
            self.outcomes.add(Outcome(character,
                "He runs off crying.",
                succeed=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "\"Only God can judge me,\" he says.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "\"Food is my only indulgence,\" he says proudly.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "St. George overhears your comment and agrees with you, "
                "but throws you out of the church for rudeness.",
                move_to=places.streets,
            ), weight=1)

        if self.idea == "that you are the chosen one":
            self.outcomes.add(Outcome(character,
                "The priest finds your arguments so pitiful that he gives "
                "you a pittance and sends you on your way.",
                get_money=money.pittance,
                move_to=places.streets,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "He says he has his doubts.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "\"I would know it when I see it,\" he says.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "St. George overhears your comment and turns you, "
                "over to the guards on charges of lunacy.",
                move_to=places.prison,
                new_person=persons.other_lunatics
            ), weight=1)


class FireACanon(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Fire a cannon."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You manage to knock the merchant ship's mast down. It falls on you.",
            clover=True,
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You sink the merchant ship, plunder and all. Lord Arthur is not pleased.",
            fail=True,
            new_person=persons.lord_arthur
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You fumble around with the cannon, but Lord Arthur is convinced "
            "the you contributed to his victory and he gives you a bag of "
            "jewels.",
            add_item=items.jewels
        ), weight=1)


class ClubASeal(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Club a seal."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "After a few days of waiting at a hole in the ice, you freeze "
            "do death.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The local polar bears aren't happy with you on their turf. "
            "You are soon mauled.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "After a few days of waiting at a hole in the ice, you manage "
            "to club a seal.",
            add_item=items.seal_carcass,
            succeed=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You manage "
            "to club a seal, but it swims away.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "While waiting for a seal, you are very cold.",
        ), weight=1)


class CelebrateYourSuccess(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Celebrate your success."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You can't think of a better way to celebrate than twittling "
            "your thumbs.",
            fail=True,
        ), weight=1)

        if character.place in places.town:

            self.outcomes.add(Outcome(character,
                "You go see a play in the market.",
                move_to=places.market,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You go to a brothel and admire the decorations.",
                move_to=places.streets,
            ), weight=1)

        if character.place in places.populated and \
           character.money != money.none:

            self.outcomes.add(Outcome(character,
                "You wander around throwing all of your money in the air.",
                funcs=[character.lose_all_money],
            ), weight=1)

        if character.place == places.arctic:

            self.outcomes.add(Outcome(character,
                "You make a snow woman.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You make a snow angel.",
            ), weight=1)

        if character.place == places.tavern:

            self.outcomes.add(Outcome(character,
                "You drink until you black out.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You drink until you black out. You wake up weary and "
                "penniless.",
                move_to=places.dark_alley,
                funcs=[character.lose_all_money]
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You drink until you black out. "
                "Lord Arthur wakes you yelling that you need to get on with "
                "your duties.",
                move_to=places.pirate_ship,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You drink until you black out. "
                "You wake up in bed next to a peasant woman. "
                "Once the hangover wears off, you "
                "both live happily ever after.",
                win=True,
            ), weight=1)


class ChopDownATree(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Chop down a tree."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The tree falls on you.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A nymph hexes you. "
            "Throwing yourself in a pond suddenly seems like a good idea.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The tree makes a loud noise as it falls.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A tree falls in the forst. You hear it.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The tree starts to bleed and you collect its blood.",
            add_item=items.bottle_of_sap,
            succeed=True,
        ), weight=100)

        self.outcomes.add(Outcome(character,
            "You get your ax stuck in the tree and can't get it out.",
            remove_item=items.ax,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You enjoy chopping down the tree so much that you chop down "
            "many more and build yourself a cabin.",
            succeed=True,
        ), weight=1)


class ChowDown(Action):

    slot = "c"

    def __init__(self, food):
        super().__init__()
        self.food = food
        self.name = "Chow down on the " + str(food) + "."

    def execute(self, character):

        if self.food == items.many_colored_mushroom:
            if not character.trip:
                self.outcomes.add(Outcome(character,
                    "Your perception of the world begins to change.",
                    remove_item=items.many_colored_mushroom,
                    funcs=[character.start_tripping],
                ), weight=1)
            else:
                self.outcomes.add(Outcome(character,
                    "You feel normal again.",
                    remove_item=items.many_colored_mushroom,
                    funcs=[character.stop_tripping],
                ), weight=1)

        if self.food == items.yellow_mushroom:
            self.outcomes.add(Outcome(character,
                "You find the mushroom distasteful.",
                remove_item=items.yellow_mushroom,
            ), weight=1)

        if self.food == items.black_mushroom:
            self.outcomes.add(Outcome(character,
                "The mushroom tastes bittersweet.",
                remove_item=items.black_mushroom,
                die=True,
            ), weight=1)

        if self.food == items.white_mushroom:
            self.outcomes.add(Outcome(character,
                "You grow larger.",
                remove_item=items.white_mushroom,
                grow_stronger=1,
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You shrink to the size of a peanut. A weasel "
                "soon comes along and eats you.",
                remove_item=items.white_mushroom,
                die=True,
            ), weight=1)


class FlirtWith(Action):

    slot = "c"

    def __init__(self, person):
        super().__init__()
        self.person = person
        self.name = "Flirt with {0}.".format(person.name)

    def execute(self, character):

        if self.person == persons.fat_lady and \
           persons.fat_lady.name != "Felicity":

            self.outcomes.add(Outcome(character,
                "She ignores your hoots.",
                flirt=(persons.fat_lady, -1),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores your whistling.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you when you say \"Hello,\" but "
                "you catch her glancing at you throughout the day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She smiles, but doesn't reply to the love "
                "poem you recite to her.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you, but wears a low-cut blouse the next day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you, but gives you more food the next day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you, but gives you more food the next day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            if persons.fat_lady.attracted > 3:
                def change_name():
                    persons.fat_lady.name = "Felicity"
                self.outcomes.add(Outcome(character,
                    "You strike up a conversation and learn that her name is "
                    "Felicity.",
                    flirt=(persons.fat_lady, 2),
                    funcs=[change_name]
                ), weight=1000)

        elif self.person == persons.fat_lady:  # We know her name

            self.outcomes.add(Outcome(character,
                "Felicity blows you kisses.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity leans in close and kisses your cheek.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity talks with you for hours. She only "
                "stops when the warden barks at her to get "
                "back to work.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity tells you she asked the warden to "
                "let you out, but he has a strict \"No lunatics "
                "on the streets\" policy.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity says she thinks about you a lot.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity laughs at all your jests, even the bad ones.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity asks if she looks fat in her new dress. "
                "You say \"Yes.\" She doesn't speak to you for several days.",
                flirt=(persons.fat_lady, -1),
            ), weight=1)

            if persons.fat_lady.attracted > 10:
                self.outcomes.add(Outcome(character,
                    "Felicity whispers that she loves you.",
                    love_confessor=persons.fat_lady
                ), weight=100)

        if self.person == persons.pretty_lady and \
           persons.pretty_lady.name != "Olga":

            self.outcomes.add(Outcome(character,
                "When you sqeeze her butt, she stabs you in the heart with a "
                "poisoned dagger.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You play a game of darts together. You get upset when you "
                "lose.",
                flirt=(persons.pretty_lady, -1),
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You find out that you both like "
                "cats. She says her cat loves being petted.",
                flirt=(persons.pretty_lady, 2),
            ), weight=100)  # FIXME

            self.outcomes.add(Outcome(character,
                "You say the flower in her hair looks goes well with "
                "her eyes. She says you can smell her flower if you like.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She sits on your lap when you buy her a drink.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You both laugh about how bad the ale is. The blind bartender "
                "is not pleased.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You have a meal together.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She plays with your hair while you talk of your exploits.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            if persons.pretty_lady.attracted > 3:
                def change_name():
                    persons.pretty_lady.name = "Olga"
                self.outcomes.add(Outcome(character,
                    "She says her name is Olga. You also tell your name.",
                    flirt=(persons.pretty_lady, 2),
                    funcs=[change_name]
                ), weight=10000)

        elif self.person == persons.pretty_lady and \
             character.place == places.tavern:  # We know her name

            self.outcomes.add(Outcome(character,
                "You follow Olga to her room, "
                "where she shows you some paintings she's borrowing "
                "from Lord Carlos.",
                new_person=persons.pretty_lady,
                move_to=places.upstairs,
                flirt=(persons.pretty_lady, 2),
            ), weight=300) # FIXME

            self.outcomes.add(Outcome(character,
                "You follow her to her room upstairs. Lots of passionate "
                "stabbing ensues.",
                clover=True,
                die=True,
            ), weight=1)

        elif self.person == persons.pretty_lady and \
             character.place == places.upstairs:

            self.outcomes.add(Outcome(character,
                "{0}".format(random.choice([
                "You make passionate love together.",
                "You sleep together.",
                "You do it.",
                "Olga does lots of nice things to you.",
                ])),
                succeed=True,
                flirt=(persons.pretty_lady, 2),
            ), weight=400)  # FIXME

            self.outcomes.add(Outcome(character,
                "Olga whispers that she's been stalking you.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You both stay up late talking by candlelight.",
                flirt=(persons.pretty_lady, 3),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Olga tells you her life story. Half of it seems made up.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You compliment her on her borrowed paintings. She is pleased.",
                flirt=(persons.pretty_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Olga turns out to be an assassin. She assassinates you.",
                clover=True,
                die=True,
            ), weight=1)

            if persons.pretty_lady.attracted > 10:
                self.outcomes.add(Outcome(character,
                    "Olga grabs your hand. \"Life's too short, "
                    "let's get married!\"",
                    love_confessor=persons.pretty_lady
                ), weight=1000)

        if self.person == persons.eve:
            self.outcomes.add(Outcome(character,
                "She ignores your inuendos, but lets you come to the river "
                "with her so she can drown a bag of kittens.",
                flirt=(persons.eve, 1),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She tells you to hide in a chest, because she thinks her "
                "father is coming. She locks you in the chest and doesn't "
                "let you out for a week.",
                flirt=(persons.eve, 1),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She says she wants to make love to you in the woods, "
                "but you lose track of her in the darkness. She doesn't "
                "come back for you.",
                move_to=places.woods,
                fail=True,
                flirt=(persons.eve, 1),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She asks you to prove your devotion to her by cleaning her "
                "room. She seems pleased with your work.",
                flirt=(persons.eve, 1),
            ), weight=1)


class GoToSleep(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Go to sleep."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You wake up dead.",
            clover=True,
            die=1
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You have a nightmare about weasels.",
            topic="weasels",
            new_person=None
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You dream of fire.",
            topic="fire",
            new_person=None
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You have a wonderful dream that you married a nymph and took her "
            "to bed in Lord Carlos' manor.",
            new_person=None
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You wake up well-rested some hours later.",
            new_person=None
        ), weight=2)

        if character.place == places.prison:
            self.outcomes.add(Outcome(character,
                "You wake up just in time to see an assassin slip a weasel "
                "between the bars of your cell. The weasel kills you.",
                clover=True,
                die=True
            ), weight=3)

        if character.place == places.ocean:
            self.outcomes.add(Outcome(character,
                "You drown in your sleep.",
                die=True
            ), weight=100)

        if not character.place.locked:
            self.outcomes.add(Outcome(character,
                "You wake up some hours later.",
                move=2,
                new_person=None
            ), weight=3)

        if character.place in places.populated and not character.place.locked:

            self.outcomes.add(Outcome(character,
                "You are pleasantly awakened by a cat rubbing itself against "
                "you.",
                add_item=items.cat,
                new_person=None
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You wake up robbed of all your worldly possessions.",
                remove_all_items=True,
                funcs=[character.lose_all_money],
                new_person=None
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You are rudely awakened by an assassin's dagger.",
                clover=True,
                die=True
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You wake up with some coins on your cloak.",
                get_money=money.pittance,
                topic="money",
                new_person=None
            ), weight=2)


class LookForTheWizard(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Look for the wizard."

    def execute(self, character):

        if character.has_item(items.yellow_mushroom):
            self.outcomes.add(Outcome(character,
                "When you find him, he can smell that you have a yellow "
                "mushroom. He asks if he can have it.",
                move_to=places.market,
                new_person=persons.wizard
            ), weight=30)

        self.outcomes.add(Outcome(character,
            "You find him. He turns you into a frog and steps on you.",
            die=1
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find him. He turns you into a frog and tries to step on you "
            "but you manage to hop away.",
            funcs=[character.frogify],
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "When you find him. He gives you a frog.",
            add_item=items.frog,
            move_to=places.market,
            new_person=persons.wizard
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You look for the wizard, but the assassins are looking for you. "
            "They find you.",
            die=1
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find the wizard. He is telling a woman how he "
            "cursed the icicles in the arctic.",
            move_to=places.market,
            new_person=persons.wizard
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find the wizard. He is telling a woman about "
            "a mesmerizing pearl.",
            move_to=places.market,
            new_person=persons.wizard
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You see the wizard emptying a flask into a well.",
            move_to=places.market,
            new_person=persons.wizard
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find the wizard, but you find St. George. He says the "
            "wizard is a little testy.",
            new_person=persons.st_george
        ), weight=1)


class LeaveInAHuff(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Leave in a huff."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            None,
            move=1
        ), weight=29)

        if character.place in places.populated:
            self.outcomes.add(Outcome(character,
                "The huffy manner in which you left causes some assassins to "
                "notice you. They assassinate you.",
                die=True
            ), weight=1)


class LeaveInAPuff(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Leave in a puff."
        self.combat_action = True

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        place = random.sample(options, 1)[0]

        self.outcomes.add(Outcome(character,
            None,
            move_to=place
        ), weight=3)


class FleeTheScene(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Flee the scene."

    def execute(self, character):
        self.outcomes.add(Outcome(character,
            None,
            move=2,
            new_person=None
        ), weight=3)


class GoTo(Action):

    slot = "c"

    def __init__(self, place):
        super().__init__()
        self.dest = random.sample(place.connections, 1)[0]
        self.name = "Go to " + str(self.dest) + "."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You absent mindedly leave {0}".format(character.place),
            move=1,
            new_person=None
        ), weight=3)

        self.outcomes.add(Outcome(character,
            None,
            move_to=self.dest,
            new_person=None
        ), weight=3)

        if self.dest == places.dark_alley:

            self.outcomes.add(Outcome(character,
                "You go into a dark alley. You do not come out.",
                die=True
            ), weight=3)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "On your way out of {0} you run headlong into some guards and "
                "they say you must be a lunatic.".format(character.place),
                new_person=persons.guards,
                threat=True,
                topic="oblivious"
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "As you are entering {0}, you notice an assassin following "
                "you.".format(self.dest),
                move_to=self.dest,
                threat=True,
                new_person=persons.assassin
            ), weight=2)

            if character.has_item(items.cat):
                self.outcomes.add(Outcome(character,
                    "Your cat notices an assassin approaching. You do not.",
                    die=True,
                ), weight=1)

            overhear_template = "As you leave " + character.place.name + \
                " you overhear {0}."

            self.outcomes.add(Outcome(character,
                overhear_template.format("someone say that the town's well "
                    "has been poisoned"),
                move_to=self.dest
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("someone talking about how nice St. "
                    "George was to them"),
                move_to=self.dest
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("a man talking being a pirate on "
                    "Lord Arthur's ship"),
                move_to=self.dest
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("a woman asking around about "
                    "assassins"),
                move_to=self.dest
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("some men are planning a trip to "
                    "the woods to look for nymphs"),
                move_to=self.dest
            ), weight=1)


class RunLikeTheDevil(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Run like the Devil."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The Devil is very fast, so you manage to get away.",
            move=2,
            succeed=True
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You run like the Devil, but " + character.person.name +
            " also run" + persons.get_tense(character.person) + " like the Devil "
            "and overtake" + persons.get_tense(character.person) + " you.",
            die=True
        ), weight=1)

        if character.person == persons.fat_lady and \
           persons.fat_lady.attracted > 9:
            self.outcomes.add(Outcome(character,
                "The Devil is very fast and not very fat, so you manage to get "
                "away unmarried.",
                new_person=None,
                move=2,
                succeed=True,
                flirt=(persons.fat_lady, -666)
            ), weight=666)

        if character.person == persons.pretty_lady and \
           persons.pretty_lady.attracted > 9:
            self.outcomes.add(Outcome(character,
                "The Devil is pretty fast but Olga is prettier and faster. "
                "She strangles you to death.",
                die=True,
                flirt=(persons.pretty_lady, -666)
            ), weight=666)

            self.outcomes.add(Outcome(character,
                "The Devil is very fast, so you manage to get away unmarried.",
                new_person=None,
                move=2,
                succeed=True,
                flirt=(persons.pretty_lady, -666)
            ), weight=666)


class WaddleLikeGod(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Waddle like God."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "God is very slow, so you don't manage to get away.",
            die=True
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You waddle like God, but " + character.person.name +
            " also waddle" + persons.get_tense(character.person) + " like God and "
            "fail to overtake" + persons.get_tense(character.person) + " you. You "
            "slowly get away.",
            move=1
        ), weight=1)


class WanderTheCountryside(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Wander the countryside."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Not all those who wonder are lost. You are.",
            fail=True,
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mob of peasants about to perform a witch burning.",
            actions=[(SaveTheWitch(), 30)],
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mob of peasant children about to perform a cat "
            "burning.",
            actions=[(SaveTheCat(), 30)],
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "All of the peasants you meet talk about Lord Bartholomew like "
            "he's God's gift to the world.",
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mob of peasants burning Lord Daniel in effigy.",
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a simple peasant.",
            new_person=persons.simple_peasant,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a peasant lass.",
            new_person=persons.peasant_lass,
        ), weight=1)


class Swim(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Swim."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You manage to stay afloat."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You keep your head up."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You see a ship in the distance. You are unable to reach it.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You make very little progress.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You die of dehydration.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are in way over your head.",
            die=True
        ), weight=1)


class KeepSwimming(Swim):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Keep swimming."

    def execute(self, character):
        super().execute(character)

        self.outcomes.add(Outcome(character,
            "You die of exhaustion.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are picked up by Lord Arthur's pirate ship.",
            move_to=places.pirate_ship,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mermaid sitting on a rock.",
            move_to=places.mermaid_rock,
            new_person=persons.mermaid
        ), weight=1)

        if character.has_item(items.cat):
            self.outcomes.add(Outcome(character,
                "Your cat dies.",
                remove_item=items.cat,
                fail=True
            ), weight=1)


class JustKeepSwimming(KeepSwimming):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Just keep swimming."

    def execute(self, character):
        super().execute(character)

        self.outcomes.add(Outcome(character,
            "You die of exhaustion.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You finally find land.",
            move_to=places.docks
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "As you swim, you notice the water getting colder. You eventually "
            "find land",
            move_to=places.arctic,
            fail=True
        ), weight=1)


class WalkThePlank(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Walk the plank."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You walk across one of the planks on the deck.",
            topic="walking the plank",
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You fall into the ocean.",
            move_to=places.ocean
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "Lord Arthur's pet shark emerges from the depths and snatches you "
            "as you fall.",
            clover=True,
            die=True
        ), weight=1)


class TrashThePlace(Action):

    slot = "c"

    def __init__(self):
        super().__init__()
        self.name = "Trash the place."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            None,
            trash_place=character.place,
            succeed=True,
            move_to=character.place
        ), weight=4)

        self.outcomes.add(Outcome(character,
            "You find a fancy red cloak in the wreckage",
            add_item=items.fire_proof_cloak,
            trash_place=character.place,
            succeed=True,
            move_to=character.place
        ), weight=1)

        if character.place == places.market:
            self.outcomes.add(Outcome(character,
                "You get trampled to death by a spooked horse.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You are arrested on charges of lunacy and get "
                "thrown in prison with the other lunatics.",
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=1)

        if character.place == places.wizards_lab:
            if not character.has_item(items.fire_proof_cloak):
                self.outcomes.add(Outcome(character,
                    "One of the potions you break blows up the lab.",
                    die=True,
                ), weight=2)
            else:
                self.outcomes.add(Outcome(character,
                    "One of the potions you break blows up the lab, but "
                    "Your fancy red cloak protects you from annihilation.",
                ), weight=2)

            self.outcomes.add(Outcome(character,
                "You snap a staff in half, but a dark spirit escapes from the "
                "staff.",
                die=True,
            ), weight=2)

            if character.person == persons.wizard:
                self.outcomes.add(Outcome(character,
                    "The wizard incinerates you.",
                    die=True,
                ), weight=20)

            if character.place == places.wizards_lab and \
               character.person != persons.wizard:
                self.outcomes.add(Outcome(character,
                    "The wizard walks in and starts yelling obscenities.",
                    new_person=persons.wizard,
                    threat=True,
                ), weight=1)


# D slot actions

class GiveFlowers(Action):

    slot = "d"

    def __init__(self, woman):
        super().__init__()
        self.woman = woman
        self.name = "Give " + woman.name + " your bouquet of flowers."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "She is quite pleased with your gift.",
            remove_item=items.bouquet_of_flowers,
            flirt=(character.person, 3),
        ), weight=3)

class Loot(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Loot."

    def execute(self, character):

        item = random.choice(items.buyable)

        if item.name[0] in "aeiou":
            self.outcomes.add(Outcome(character,
                "You get away with an " + item.name + ".",
                add_item=item,
                move=1,
            ), weight=3)
        else:
            self.outcomes.add(Outcome(character,
                "You get away with a " + item.name + ".",
                add_item=item,
                move=1,
            ), weight=3)

        self.outcomes.add(Outcome(character,
            "You are killed by merchant defending her store.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are arrested for attempting to steal an apple.",
            move_to=places.prison,
            new_person=persons.other_lunatics
        ), weight=1)


class WatchAPlay(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Watch a play."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The play saterizes Lord Daniel's policy on lunacy. The actors are arrested at the end of the play."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The play portrays Lord Bartholomew in a glorious light.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The play is put on by some Lord Daniel's guards, the acting is "
            "terrible and the play portrays Lord Bartholomew in a negative "
            "light. The audience starts a riot.",
            new_person=persons.guards,
            actions=[
                     (Attack(persons.guards), 10000),
                     (BurnThePlaceToTheGround(places.market), 10000),
                     (TrashThePlace(), 10000),
                     (Loot(), 10000)
                     ],
        ), weight=1)


class FlauntYourWealth(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Flaunt your wealth."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The local peasants mob you. They take your money and your life.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The guards notice you and conclude you must be rich.",
            new_person=persons.guards,
            actions=[(TellThemYouAreALunatic(), 10000)],
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "St. George notices you and warns you of the dangers of "
            "flamboyance.",
            new_person=persons.st_george,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Some truely wealthy people see you and sneer.",
            fail=True,
        ), weight=1)


class FreezeToDeath(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Freeze to death."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "It's easy.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You get sleepy.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You do.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You freeze to death.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You get mauled by a polar bear before you get a chance to "
            "freeze to death.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Some eskimos save you from the cold and take you back to land "
            "in a Kayak. They also give you a fish.",
            add_item=items.fish,
            move_to=places.countryside,
            succeed=True,
        ), weight=2)


class Panic(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Panic!"
        self.combat_action = True

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        place = random.sample(options, 1)[0]

        self.outcomes.add(Outcome(character,
            "You don't remember what you did, but you seem to have gotten "
            "away.",
            move_to=place,
            succeed=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Panicking doesn't help.",
            die=True,
        ), weight=4)

        self.outcomes.add(Outcome(character,
            "Panicking doesn't save you.",
            die=True,
        ), weight=5)


class SingASong(Action):

    slot = "d"

    def __init__(self, topic=None):
        super().__init__()
        self.topic = topic
        if topic:
            self.name = "Sing a song about {0}.".format(topic)
        else:
            self.name = "Sing a song."

    def execute(self, character):

        if character.place == places.church:
            self.outcomes.add(Outcome(character,
                "A priestess finds your lyrics {0} and has you thrown out of "
                "the church.".format(random.choice(
                    ["blasphemous", "crude", "idiotic", "offensive",
                     "mildly offensive", "uncreative"])),
                fail=True,
                move_to=places.streets,
            ), weight=10)

        if character.place == places.upstairs and \
           character.person == persons.pretty_lady:
            self.outcomes.add(Outcome(character,
                "You sing a romantic ballad. Olga is impressed.",
                flirt=(persons.pretty_lady, 2),
            ), weight=20)

            self.outcomes.add(Outcome(character,
                "Olga interrupts your song by kissing you.",
                flirt=(persons.pretty_lady, 2),
            ), weight=20)

        if character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "This is no place for merry-making. You are soon "
                "assassinated.",
                die=True,
            ), weight=5)

            self.outcomes.add(Outcome(character,
                "Your singing alerts Lord Carlos' assassins to your "
                "presence.",
                die=True,
            ), weight=10)

        if character.place == places.mermaid_rock:
            self.outcomes.add(Outcome(character,
                "As you sing, a ship sails by. The crew has wax in their "
                "ears and the captain is tied to the mast. He is not "
                "impressed.",
                fail=True,
            ), weight=10)

            if character.person == persons.mermaid:
                self.outcomes.add(Outcome(character,
                    "The mermaid enjoys your singing and sings with you.",
                    flirt=(persons.mermaid, 2),
                ), weight=20)

                self.outcomes.add(Outcome(character,
                    "The mermaid is displeased with your choice of lyrics and "
                    "pushes you into the ocean.",
                    move_to=places.ocean,
                    flirt=(persons.mermaid, -1),
                    fail=True,
                ), weight=10)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "Your singing is too loud for you to hear the footsteps of an "
                "assassin. He assassinates you.",
                die=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "A crowd gathers to hear your music and throws you a small "
                "fortune in coins.",
                get_money=money.small_fortune
            ), weight=2)


        if character.place == places.mermaid_rock:
            self.outcomes.add(Outcome(character,
                "As you sing, a ship sails by. The crew has wax in their "
                "ears and the captain is tied to the mast. He is not "
                "impressed.",
                fail=True,
            ), weight=10)

            if character.person == persons.mermaid:
                self.outcomes.add(Outcome(character,
                    "The mermaid enjoys your singing and sings with you.",
                    flirt=(persons.mermaid, 2),
                ), weight=20)

                self.outcomes.add(Outcome(character,
                    "The mermaid is displeased with your choice of lyrics and "
                    "pushes you into the ocean.",
                    move_to=places.ocean,
                    flirt=(persons.mermaid, -1),
                    fail=True,
                ), weight=10)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "Your singing is too loud for you to hear the footsteps of an "
                "assassin. He assassinates you.",
                die=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "A crowd gathers to hear your music and throws you a small "
                "fortune in coins.",
                get_money=money.small_fortune
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "The locals hate your voice and soon mob you.",
                clover=True,
                die=True
            ), weight=1)

            if not character.person:
                self.outcomes.add(Outcome(character,
                    "While you're singing, some men in black cloaks start to "
                    "edge their way toward you.",
                    new_person=persons.assassins,
                    threat=True
                ), weight=3)

        if self.topic == "assassins":
            self.outcomes.add(Outcome(character,
                "An assassin notices you singing about assassins and "
                "assassinates you",
                die=True
            ), weight=5)

        if character.person == persons.wizard:
            self.outcomes.add(Outcome(character,
                "The wizard complains that you are singing off-key. He turns "
                "you into a frog and steps on you.",
                die=True
            ), weight=20)

        if not character.place.locked:

            self.outcomes.add(Outcome(character,
                "You wander aimlessly as you work your way through an epic "
                "ballad.",
                move=1
            ), weight=1)

        if self.topic is None:

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Arthur, captain of the pirates.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Bartholomew, leader of the "
                "peasants.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Carlos, kingpin of the assassins.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Daniel, head of the guard.",
            ), weight=1)

        self.outcomes.add(Outcome(character,
            "You sing your favorite song. No one cares.",
        ), weight=2)


class SwingYourCat(Action):

    slot = "d"

    def __init__(self, cat):
        super().__init__()
        self.cat = cat
        self.name = "Swing your cat."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You hit an assassin with your cat.",
            new_person=persons.assassin,
            threat=True,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "Your cat manages to escape.",
            remove_item=self.cat
        ), weight=2)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "The local guards notice you swinging your cat around and "
                "conclude that you must be a lunatic.",
                new_person=persons.guards,
                threat=True,
                topic="angry"
            ), weight=3)


class LookThroughSomeTrash(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Look through some trash."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You attempt to look through the trash, but an assassin takes it "
            "out.",
            die=True
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "While you are searching through the trash you find an somewhat "
            "agreeable cat.",
            add_item=items.cat
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The local guards see you searching through the trash and accuse "
            "you of being a lunatic.",
            add_item=items.cat,
            new_person=persons.guards,
            threat=True,
            topic="curious"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You do not find anything useful in the trash.",
            fail=True,
            topic="trash"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mirror in the trash. You see nothing of value.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a bad smell.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find an old ax.",
            succeed=True,
            add_item=items.ax
        ), weight=1)


class DanceAJig(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Dance a jig."

    def execute(self, character):

        if character.place != places.ocean:
            self.outcomes.add(Outcome(character,
                "You get sweaty.",
            ), weight=9)

            self.outcomes.add(Outcome(character,
                "You have a grand old time.",
            ), weight=5)

            if character.place != places.void:
                self.outcomes.add(Outcome(character,
                    "You step in a puddle and get your britches wet.",
                    fail=True,
                ), weight=3)

                self.outcomes.add(Outcome(character,
                    "You break your ankle and fall to the ground. You catch "
                    "yourself but break your wrist, hit your head on the "
                    "ground and your neck.",
                    die=True,
                ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "You drown trying to dance.",
                die=True,
            ), weight=5)

            self.outcomes.add(Outcome(character,
                "You swim a jig",
                topic="jigs",
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You can't dance a jig, you're in the ocean.",
                fail=True,
            ), weight=2)

        if character.place == places.woods:
            fae = random.choice(["fairaes", "sprites",
                                 "pixies", "dryads",
                                 "nymphs", "spirits"])
            self.outcomes.add(Outcome(character,
                "Some {0} dance with you and then fade away.".format(fae),
            ), weight=20)

            self.outcomes.add(Outcome(character,
                "Some goblins dance with you and then kill you.",
                die=True,
            ), weight=3)

        if character.place in places.populated:
            self.outcomes.add(Outcome(character,
                "Some local peasants are entertained by your antics and toss "
                "you some coins.",
                get_money=money.pittance
            ), weight=10)

            self.outcomes.add(Outcome(character,
                "Many peasants start dancing with you and begin singing about "
                "Lord Bartholomew.",
            ), weight=15)

        if character.place == places.countryside:
            self.outcomes.add(Outcome(character,
                "Many peasants start dancing with you and begin singing an "
                "ode to Lord Bartholomew.",
            ), weight=25)

        if character.person == persons.mermaid:
            self.outcomes.add(Outcome(character,
                "She laughs and claps and seems completely in awe of your "
                "legs.",
                flirt=(persons.mermaid, 30),
            ), weight=1)

        if character.person == persons.guards:  # TODO these two may not happen
            self.outcomes.add(Outcome(character,
                "\"We got a dancer,\" one of them says. They throw you in "
                "prison.",
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=100)

            self.outcomes.add(Outcome(character,
                "\"Eh, he's all right,\" one of them says. The guards "
                "go on their way.",
                topic="guards",
            ), weight=100)

        if character.place == places.arctic:
            self.outcomes.add(Outcome(character,
                "You get sweaty. The sweat freezes on you. "
                "You freeze to death.",
                die=True,
            ), weight=30)

        if character.place == places.cave:
            self.outcomes.add(Outcome(character,
                "Dancing fails to cheer you up.",
                fail=True,
            ), weight=10)

            self.outcomes.add(Outcome(character,
                "You slip on a rock and fall to your death.",
                clover=True,
                die=True,
            ), weight=15)

        if character.place == places.tavern or \
           character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "Some assassins immediately notice you dancing and assassinate "
                "you.",
                die=True,
            ), weight=15)


class Drown(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Drown."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You drown.",
            die=True
        ), weight=1)


class Sink(Drown):

    def __init__(self):
        super().__init__()
        self.name = "Sink."


class SaveTheCat(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Save the cat."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You escape with the cat.",
            succeed=True,
            add_item=items.cat,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You escape with the cat, but the cat escapes you. \n"
            "You almost got a cat",
            fail=True,
        ), weight=1)


class YellAPiratePhrase(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.phrase = random.choice(
            ["Shiver me timbers",
             "Dead men tell no tales",
             "Arr Matey",
             "Avast",
             "Aye Aye",
             "Send 'em to Dave Jone's locker",
             "Thare she blows",
             "Hoist the Jolly Roger",
             "Walk the plank",
             "Yo, ho, ho, and a bottle of rum",
             "All hands on deck",
             "Land ho",
             "X marks the spot",
             "Ahoy"])
        self.name = "Yell \"{0}!\"".format(self.phrase)

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Lord Arthur has you thrown off the ship.",
            move_to=places.ocean,
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Arthur tells you that no true pirate says \"{0}.\"".format(
                self.phrase),
            new_person=persons.lord_arthur,
            fail=True
        ), weight=1)

        if character.is_employed_by(persons.lord_arthur):

            self.outcomes.add(Outcome(character,
                "Lord Arthur tells you that you are no longer a member of the "
                "crew.",
                remove_employer=persons.lord_arthur,
                fail=True
            ), weight=1)

        else:

            self.outcomes.add(Outcome(character,
                "Lord Arthur is impressed by your enthusiasm and makes you a "
                "member of the crew.",
                new_person=persons.lord_arthur,
                add_employer=persons.lord_arthur,
                topic="piracy",
            ), weight=1)


class SaveTheWitch(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Save the witch."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You have trouble untying her and the peasants kill you for "
            "meddling.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You escape with her. She thanks you and gives you "
            "a deep-cave newt before you part ways.",
            add_item=items.deep_cave_newt,
            move_to=places.woods,
            topic=random.choice(["heroism", "newts", "witches"]),
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "In your rush to save the witch, you trip over a rock. "
            "You wake up near the smoldering remains of the witch's "
            "pyre.",
            fail=True,
        ), weight=1)


class DoSomeFarmWork(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Do some farmwork."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You spend a season picking apples.",
            get_money=money.pittance,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You spend a season milking cows for a farmer woman. "
            "She keeps trying to marry you to her attractive "
            "daughter, but her daughter is having none of it.",
            get_money=money.pittance,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You spend a season bailing hay.",
            get_money=money.pittance,
            add_item=pitchfork
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You spend a season harvesting wheat. You enjoy the change of "
            "pace.",
            get_money=money.pittance,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You spend a season slaughtering hogs. You find a shiny foreign "
            "coin in one of the hogs.",
            get_money=money.pittance,
            add_item=items.foreign_coin
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find work, but the assassins find you.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "During your duties, you get kicked by a mule. You somehow don't "
            "die.",
            get_money=money.pittance,
            topic="mules"
        ), weight=1)


class DoSomeGambling(Action):

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Do some gambling."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You win.",
            get_money=random.choice([money.pittance, money.small_fortune]),
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You lose.",
            funcs=[character.lose_all_money],
            fail=True,
        ), weight=1)

        if character.place == places.tavern:
            self.outcomes.add(Outcome(character,
                "You get cleaned out by a pretty lady.",
                funcs=[character.lose_all_money],
                fail=True,
            ), weight=1)

        if character.place == places.tavern or \
           character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "It was gambling to stay here. The assassins find you.",
                die=True,
            ), weight=1)

        if character.place == places.docks:

            self.outcomes.add(Outcome(character,
                "You play some dice with Lord Arthur. He whips you soundly. "
                "However, you win and earn a small fortune.",
                get_money=money.small_fortune,
                succeed=True,
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You play some dice with Lord Arthur. He whips you soundly.",
                funcs=[character.lose_all_money],
                fail=True,
            ), weight=2)


class SneakAround(Action):
    """
    Only use in Lord Carlos' manor
    """

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Sneak around."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "One of the assassin guards noticies you tiptoeing around in "
            "board daylight. He assassinates you.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your smell gives you away. You are soon assassinated.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You get the hiccups. You are soon assassinated.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are sneaking through the stables when a man too fat to "
            "avoid bumps into you. You are soon assassinated.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Carlos jumps down from some rafters and assassinates you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a poisoned dagger in a glass case.",
            add_item=items.poison_daggar,
            succeed=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You manage to sneak into Lord Carlos' "
            "daugher's bedroom. She is {0}".format(random.choice(
            ["reading at her desk.", "sharpening a dagger.",
             "petting her cat.", "putting on jewelry.",
             "painting a picture of you getting assassinated.",])),
            new_person=persons.eve,
        ), weight=1000)  # TODO fix weight

        self.outcomes.add(Outcome(character,
            "You manage to sneak into Lord Carlos' "
            "study. He is {0}".format(random.choice(
            ["writing a letter.", "reading a book.",
             "looking straight at you.", "eating a steak.",
             "training a weasel.", "pacing around."])),
            new_person=persons.lord_carlos,
            threat=True,
        ), weight=1)


class HideUnderTheDeck(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Hide under the deck."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You miss all of the action."
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You fight an epic battle against one of the rats on the lower decks."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Lord Arthur has you killed when he hears of your cowardice.",
            die=True
        ), weight=1)


class SnoopAround(Action):
    """
    Only use in Wizard's lab
    """

    slot = "d"

    def __init__(self):
        super().__init__()
        self.name = "Snoop around."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The Wizard finds you and conks you on the head with his staff.",
            move_to=places.arctic,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You accidentally knock over a bottle of roiling black vapor.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a fancy red cloak.",
            actions=[(TakeIt(persons.wizard, items.fire_proof_cloak), 100)],
            topic="cloaks",
        ), weight=1)


# E slot actions


class EnterTheVoid(Action):

    slot = "e"

    def __init__(self):
        super().__init__()
        self.name = "Enter the void."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            None,
            move_to=places.void,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "There's no air in the void.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You get lost in limbo forever.",
            die=True,
        ), weight=1)
