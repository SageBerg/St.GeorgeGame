from __future__ import print_function  # for printing to stderr
# for exmaple: print(state.character.get_attack(), file=sys.stderr)
import sys

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
    def __init__(self, state):
        self.name = ""
        self.combat_action = False
        self.outcomes = Raffle()

    @abc.abstractmethod
    def execute(self, state):
        """
        returns nothing, edits game state 
        """

    def get_outcome(self, state):
        self.execute(state)
        outcome = self.outcomes.get()  # outcome may be function or instance
        return outcome

    def __str__(self):
        return self.name


# A slot actions


class KissYourFrog(Action):

    slot = "a"

    def __init__(self, state):
        super(KissYourFrog, self).__init__(state)
        self.name = random.choice(["Kiss your frog."]*9 + ["Snog your frog."])

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The frog turns into an assassin. He assassinates you.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into a cat.",
            remove_item=items.frog,
            add_item=items.cat,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into a prince. The prince rewards you with a bag "
            "of jewels.",
            remove_item=items.frog,
            add_item=items.jewels,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into a prince. The prince is disgusted to be "
            "kissing a man and has you put to death.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into a peasant woman. \"Oh blessed be Lord "
            "Bartholomew!\" she exclaims.",
            remove_item=items.frog,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into an ugly fat man. He starts shaking you "
            "violently. \"I liked being a frog!\" he yells before storming "
            "off.",
            remove_item=items.frog,
        ), weight=1)
        
        self.outcomes.add(Outcome(state,
            "The frog seems to enjoy it.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You feel stupid kissing a frog.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into a guard. He says you must be a lunatic for "
            "kissing a frog, but he lets this one slide.",
            remove_item=items.frog,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The frog turns into an old woman. She thanks you and gives you "
            "some mushrooms.",
            succeed=True,
            funcs_with_args=[(state.character.add_item, items.white_mushroom),
                             (state.character.add_item, items.black_mushroom),
                             (state.character.add_item, items.yellow_mushroom),
                             (state.character.add_item, items.many_colored_mushroom),
                            ],
            remove_item=items.frog,
        ), weight=1)


class Anne(Action):
    """
    used when guessing Eve's name
    """

    slot = "a"

    def __init__(self, state):
        super(Anne, self).__init__(state)
        self.name = "\"Anne.\""

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "She grimaces. \"That's my mother, you idiot!\"",
            die=True,
        ), weight=1)


class AskForAnAudienceWithLordBartholomew(Action):

    slot = "a"

    def __init__(self, state):
        super(AskForAnAudienceWithLordBartholomew, self).__init__(state)
        self.name = "Ask for an audience with Lord Bartholomew."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The first person you meet is Lord Bartholomew.",
            new_person=state.persons.persons_dict["lord_bartholomew"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The line to meet Lord Bartholomew is very long, "
            "so you lose patience and wander off.",
            move_to=state.places.places_dict["countryside"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are granted one." ,
            new_person=state.persons.persons_dict["lord_bartholomew"],
        ), weight=1)


class AskForAnAudienceWithLordDaniel(Action):

    slot = "a"

    def __init__(self, state):
        super(AskForAnAudienceWithLordDaniel, self).__init__(state)
        self.name = "Ask for an audience with Lord Daniel."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The guards laugh. \"{0},\" "
            "one of the guards says.".format(random.choice([
                "He has no time for peasants",
                "Such audacity",
                ])),
            new_person=state.persons.persons_dict["guards"],
            clover=True,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The guards mistake you for someone important and take you "
            "to Lord Daniel.",
            new_person=state.persons.persons_dict["lord_daniel"],
        ), weight=1)


class A3(Action):

    slot = "a"

    def __init__(self, state):
        super(A3, self).__init__(state)
        self.name = "a3."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "After seeing your pitifully stupid move, Lord Carlos is no "
            "longer concerned that you might beat him and has his "
            "servants assassinate you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You eventually win the game. Lord Carlos says no one "
            "can know of his defeat. He assassinates you.",
            die=True,
        ), weight=1)


class LaughAboutWarden(Action):

    slot = "a"

    def __init__(self, state):
        super(LaughAboutWarden, self).__init__(state)
        self.name = "Laugh about the warden doing it alone on holidays."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "One of the prison guards pokes you with an eleven-foot pole. "
            "\"No laughing!\" he says.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You feel good for a second, then you remember you're "
            "in prison.",
        ), weight=1)


class GiveHimTheYellowMushroom(Action):

    slot = "a"

    def __init__(self, state):
        super(GiveHimTheYellowMushroom, self).__init__(state)
        self.name = "Give him the yellow mushroom."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The wizard chows down on the yellow mushroom.",
            remove_item=items.yellow_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The wizard gives you a potion in return.",
            add_item=random.choice([items.love_potion,
                                    items.tail_potion,
                                    items.strength_potion]),
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Having no further use for you, the wizard turns you into a frog.",
            funcs=[state.character.frogify],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The wizard swallows the mushroom whole and chokes to death.",
            kill=state.persons.persons_dict["wizard"],
        ), weight=1)


class EnactYourElaborateScheme(Action):

    slot = "a"

    def __init__(self, state):
        super(EnactYourElaborateScheme, self).__init__(state)
        self.name = "Enact your elaborate scheme."

    def execute(self, state):

        if state.persons.persons_dict["lord_carlos"].alive:
            self.outcomes.add(Outcome(state,
                "You are just about to dump a cauldron of hot soup on Lord "
                "Carlos when he looks up and notices you. You then dump the "
                "hot soup on him and he dies.",
                new_person=state.persons.persons_dict["lord_carlos"],
                kill=state.persons.persons_dict["lord_carlos"],
                move_to=state.places.places_dict["lord_carlos_manor"],
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "Everything goes as planned until you ask a dragon to do your "
            "bidding.", 
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Your plan goes swimmingly.",
            add_item=items.jeweled_cutlass,
            move_to=state.places.places_dict["ocean"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "After several months, you realize you don't have what it takes " 
            "to be a clown.",
            fail=True,
            move_to=state.places.places_dict["market"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "After several years, you realize you don't have what it takes " 
            "to be a priest.",
            fail=True,
            move_to=state.places.places_dict["church"],
        ), weight=1)


class AskHerToTakeYouBackToLand(Action):

    slot = "a"

    def __init__(self, state):
        super(AskHerToTakeYouBackToLand, self).__init__(state)
        self.name = "Ask her to take you back to land."

    def execute(self, state):

        if state.character.place == state.places.places_dict["mermaid_rock"]:
            self.outcomes.add(Outcome(state,
                "She doesn't know where land is, but "
                "she gives you a fish.",
                add_item=items.fish,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "\"You're on land, silly!\" she says.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She takes you out to see, but gets bored and leaves you "
                "there.",
                move_to=state.places.places_dict["ocean"],
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She does.",
                move_to=state.places.places_dict["docks"],
            ), weight=1)


class AskHerToBrew(Action):

    slot = "a"

    def __init__(self, state, potion):
        super(AskHerToBrew, self).__init__(state)
        self.potion = potion
        self.name = "Ask her to brew a {0}.".format(self.potion.name)

    def execute(self, state):

        # potential errors here if none of the if statements execute
        # we'll have an empyt raffle

        if self.potion.name == "love potion":
            self.outcomes.add(Outcome(state,
                "The witch puts your ingredients in her cauldron and brews "
                "a large batch.",
                add_item=self.potion,
                funcs=[lambda: state.character.remove_item(items.bottle_of_sap),
                       lambda: state.character.remove_item(items.bouquet_of_flowers),
                       lambda: state.character.remove_item(items.many_colored_mushroom)]
            ), weight=1)

        if self.potion.name == "potion of tail growth":
            self.outcomes.add(Outcome(state,
                "The witch puts your ingredients in her cauldron and brews "
                "a large batch.",
                add_item=self.potion,
                funcs=[lambda: state.character.remove_item(items.cat),
                       lambda: state.character.remove_item(items.pearl)],
            ), weight=1)

        if self.potion.name == "potion of strength":
            self.outcomes.add(Outcome(state,
                "The witch puts your ingredients in her cauldron and brews "
                "a large batch.",
                add_item=self.potion,
                funcs=[lambda: state.character.remove_item(items.white_mushroom),
                       lambda: state.character.remove_item(items.deep_cave_newt)],
            ), weight=1)


class Think(Action):

    slot = "a"

    def __init__(self, state):
        super(Think, self).__init__(state)
        self.name = "Think."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You come up with four brilliant ideas.",
            actions=[(LickTheGround(state, state.character.place), 10)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You concoct an elaborate scheme.",
            actions=[(EnactYourElaborateScheme(state), 10000)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "All you can think is \"Think. Think. Think.\".",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You come up with a plan B in case things go south.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Since you're a man, you think about sex."
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You spend some time reevaluating your life and conclude "
            "that you need to stay the course.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You get lost in your thoughts.",
        ), weight=1)

        if state.character.place != state.places.places_dict["tavern"] and \
            state.persons.persons_dict["olga"].name != "Olga":
            self.outcomes.add(Outcome(state,
                "You think about a pretty lady you saw in the tavern.",
                topic="marriage",
            ), weight=1)
        elif state.persons.persons_dict["olga"].name == "Olga":
            self.outcomes.add(Outcome(state,
                "You think about Olga.",
                topic="marriage",
            ), weight=1)

        if state.character.place == state.places.places_dict["wizards_lab"] or \
           state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "You think you probably shouldn't be here.",
            ), weight=8)

        if state.character.place == state.places.places_dict["tavern"] or \
           state.character.place == state.places.places_dict["dark_alley"] or \
           state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "You think about how painful it would be to get stabbed. "
                "You soon find out.",
                die=True,
            ), weight=4)

        if state.character.place == state.places.places_dict["docks"]:
            self.outcomes.add(Outcome(state,
                "Some pirates laugh at you for thinking.",
                new_person=state.persons.persons_dict["pirates"],
            ), weight=8)

            if state.persons.persons_dict["lord_arthur"].alive:
                self.outcomes.add(Outcome(state,
                    "You think it would be a bad idea to join Lord Arthur's "
                    "crew. Lord Arthur gives you no choice.",
                    add_employer=state.persons.persons_dict["lord_arthur"],
                    move_to=state.places.places_dict["pirate_ship"],
                ), weight=4)

        if state.character.place == state.places.places_dict["docks"] or \
           state.character.place == state.places.places_dict["ocean"] or \
           state.character.place == state.places.places_dict["pirate_ship"] or \
           state.character.place == state.places.places_dict["mermaid_rock"]:
            self.outcomes.add(Outcome(state,
                "You think the ocean is really big.",
            ), weight=8)

            self.outcomes.add(Outcome(state,
                "You think the bad smell might be coming from you.",
            ), weight=2)

        if state.character.place == state.places.places_dict["tower"]:
            self.outcomes.add(Outcome(state,
                "You think you can survive the jump from the top of the "
                "tower.",
                die=True,
            ), weight=5)

            self.outcomes.add(Outcome(state,
                "While you're thinking, a guard hands you an ax and tells "
                "you to chop firewood for the cooks.",
                add_item=items.ax,
            ), weight=5)

        if state.character.place == state.places.places_dict["countryside"]:
            self.outcomes.add(Outcome(state,
                "You think about Lord Bartholomew.",
                topic="Lord Bartholomew",
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You wonder if any peasant women would "
                "go for a man like you.",
                topic="peasants",
            ), weight=2)

        if state.character.place == state.places.places_dict["woods"]:
            self.outcomes.add(Outcome(state,
                "You think about fire.",
                topic="fire",
            ), weight=3)

        if state.character.place == state.places.places_dict["church"]:
            self.outcomes.add(Outcome(state,
                "You wonder what life is all about and feel smug "
                "for being so philosophical.",
                topic="yourself",
            ), weight=3)

        if state.character.place == state.places.places_dict["arctic"]:
            self.outcomes.add(Outcome(state,
                "You think about ice.",
                topic="ice",
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You can't think about much besides how cold you are.",
                topic="misery",
            ), weight=4)

        if state.character.place == state.places.places_dict["cave"]:
            self.outcomes.add(Outcome(state,
                "You think about the darkness that is crushing in on you from "
                "all sides.",
            ), weight=9)

            self.outcomes.add(Outcome(state,
                "You think you hear bats, but you also think you might be crazy.",
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You think about death.",
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You think about suffocation.",
            ), weight=3)

        if state.character.person:
            self.outcomes.add(Outcome(state,
                "You zone out while " + state.character.person.name + " talk" +
                persons.get_tense(state.character.person) + ".",
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You space out.",
            ), weight=2)


class Yell(Action):

    slot = "a"

    def __init__(self, state, exclamation):
        super(Yell, self).__init__(state)
        self.exclamation = exclamation
        self.name = "Yell \"{0}!\"".format(exclamation)

    def execute(self, state):

        if self.exclamation == "I lost my leg":
            self.outcomes.add(Outcome(state,
                "No one cares.",
                fail=True,
            ), weight=1)
            
            if state.character.person == state.persons.persons_dict["lord_arthur"]:
                self.outcomes.add(Outcome(state,
                    "Lord Arthur says he knows a town where you can "
                    "find a wooden leg.",
                ), weight=10000)

        if self.exclamation == "There aren't penguins in the arctic":
            self.outcomes.add(Outcome(state,
                "The penguins don't care.",
                fail=True,
            ), weight=1)

        if self.exclamation == "Don't leave without me":
            self.outcomes.add(Outcome(state,
                "The wizard ignores you and sails away before you can "
                "get to his boat.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "The wizard leaves without you.",
                fail=True,
            ), weight=1)


class ReadASpellBook(Action):

    slot = "a"

    def __init__(self, state):
        super(ReadASpellBook, self).__init__(state)
        self.name = "Read a spellbook."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You open a book of curses. It's cursed.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You learn that it takes sap, flowers, and a many-colored "
            "mushroom to make a love potion.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You learn that it takes a cat and a pearl "
            "to brew a potion of tail growth.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You learn that it takes a white mushroom and a deep-cave "
            "newt to brew a potion of strength.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find the book arcane and boring.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You learn a spell to set things on fire, but it requires a "
            "focused mind.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The wizard's handwriting is terrible.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a four-leaf clover in the pages of the "
            "spellbook.",
            add_item=items.four_leaf_clover,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The first book you open appears to be the wizard's diary. "
            "{0}.".format(random.choice([
                "It is full of details about how he is too chicken to "
                "ask out a woman he often sees in the market",
                "He appears to be obsessed with void dust, but can't "
                "figure out how to get any.",
                "It's mostly math proofs."])),
        ), weight=1)


class SuckUpTo(Action):

    slot = "a"

    def __init__(self, state, person):
        super(SuckUpTo, self).__init__(state)
        self.person = person
        self.name = "Suck up to {0}.".format(person)
        self.combat_action = True

    def execute(self, state):

        if self.person == state.persons.persons_dict["lord_arthur"]:

            self.outcomes.add(Outcome(state,
                "Lord Arthur sends you on a mission to find him a pet sea "
                "turtle.",
                move_to=state.places.places_dict["ocean"],
            ), weight=1)

        if self.person == state.persons.persons_dict["lord_bartholomew"]:

            self.outcomes.add(Outcome(state,
                "Lord Bartholomew wishes you well and sends you on your way.",
                move_to=state.places.places_dict["countryside"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Bartholomew takes a liking to you and gives you a long "
                "pitchfork.",
                add_item=items.long_pitchfork,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Bartholomew tells you to take more pride in yourself.",
                succeed=True,
            ), weight=1)

        if self.person == state.persons.persons_dict["lord_carlos"]:

            self.outcomes.add(Outcome(state,
                "He tells you that your are forgiven, but his men never fail.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "He has you thrown out the window.",
                move_to=state.places.places_dict["woods"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Carlos is having none of it. He kills you.",
                die=True,
            ), weight=1)

        if self.person == state.persons.persons_dict["lord_daniel"]:

            self.outcomes.add(Outcome(state,
                "Lord Daniel sends you away.",
                move_to=state.places.places_dict["streets"],
            ), weight=1)


            self.outcomes.add(Outcome(state,
                "Lord Daniel questions your sanity.",
                fail=True,
            ), weight=1)


class TellThemYouAreALunatic(Action):

    slot = "a"

    def __init__(self, state):
        super(TellThemYouAreALunatic, self).__init__(state)
        self.name = "Tell them you are a lunatic."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "\"A rich lunatic,\" they say before moving along.",
            new_person=None,
        ), weight=1)


class Swashbuckle(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "a"

    def __init__(self, state):
        super(Swashbuckle, self).__init__(state)
        self.name = "Swashbuckle."

    def execute(self, state):

        if state.character.has_item(items.cutlass) or \
           state.character.has_item(items.jeweled_cutlass):

            if state.persons.persons_dict["lord_arthur"].alive:
                self.outcomes.add(Outcome(state,
                    "You kill several innocent merchants. Lord Arthur is "
                    "pleased and gives you a large share of the plunder.",
                    get_money=money.large_fortune,
                ), weight=1)
            else:
                self.outcomes.add(Outcome(state,
                    "You kill several innocent merchants. The captain is "
                    "pleased and gives you a large share of the plunder.",
                    get_money=money.large_fortune,
                ), weight=1)

        else:

            self.outcomes.add(Outcome(state,
                "You find it difficult to swashbuckle without a cutlass. "
                "You are soon killed.",
                die=True,
            ), weight=1)

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "You manage to hold your own. Afterwards Lord Arthur divvies "
                "up the booty.",
                add_item=items.jewels,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "You manage to hold your own. Afterwards you divide "
                "the booty.",
                add_item=items.jewels,
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "A cabin boy stabs you in the back during the fight.",
            die=True,
        ), weight=1)

        if not state.character.has_item(items.sailor_peg) and \
           state.persons.persons_dict["lord_arthur"].alive:

            self.outcomes.add(Outcome(state,
                "You lose your leg in the battle, but Lord Arthur gives you a "
                "sailor peg as a replacement.",
                add_item=items.sailor_peg,
            ), weight=1)


class LookForAssassins(Action):
    """
    Note: only use in dark alley
    """

    slot = "a"

    def __init__(self, state):
        super(LookForAssassins, self).__init__(state)
        self.name = "Look for assassins."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You don't see any.",
            die=True,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "The dark alley appears to be safe.",
        ), weight=1)


class PickSomeFlowers(Action):

    slot = "a"

    def __init__(self, state):
        super(PickSomeFlowers, self).__init__(state)
        self.name = "Pick some flowers."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "{0}".format(random.choice([
            "You find many pretty flowers.",
            "A peasant girl picks flowers with you. She tells you she "
            "wants to be like Lord Bartholomew when she grows up.",
            "You spend all day looking for flowers, but it was worth it.",
            "You get stung by a bee, but you still find many pretty flowers.",
            ])),
            add_item=items.bouquet_of_flowers,
            succeed=True,
        ), weight=4)

        self.outcomes.add(Outcome(state,
            "You don't find any flowers, but you find a four-leaf clover.",
            add_item=items.four_leaf_clover,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You can't find any flowers. Only grass.",
            fail=True,
        ), weight=1)


class GoFishing(Action):

    slot = "a"

    def __init__(self, state):
        super(GoFishing, self).__init__(state)
        self.name = "Go fishing."

    def execute(self, state):

        if state.character.place == state.places.places_dict["docks"]:
            self.outcomes.add(Outcome(state,
                "Some pirates laugh at you. \"You'll never make a large "
                "fortune that way,\" one of them says.",
                new_person=state.persons.persons_dict["pirates"],
            ), weight=10)

        self.outcomes.add(Outcome(state,
            "You don't catch any fish.",
            fail=True,
        ), weight=10)

        self.outcomes.add(Outcome(state,
            "You fish up an ax.",
            add_item=items.ax,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You fish up a pitchfork.",
            add_item=items.pitchfork,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You catch a fish.",
            add_item=items.fish,
            succeed=True,
        ), weight=10)

        if state.character.place == state.places.places_dict["docks"]:
            self.outcomes.add(Outcome(state,
                "You don't catch any fish, but the assassins catch you.",
                clover=True,
                die=True,
            ), weight=1)


class TakeIt(Action):

    slot = "a"

    def __init__(self, state, wronged_party, item):
        super(TakeIt, self).__init__(state)
        self.wronged_party = wronged_party
        self.item = item
        self.name = "Take it."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            None,
            add_item=self.item,
        ), weight=3)

        if self.wronged_party.alive:
            self.outcomes.add(Outcome(state,
                self.wronged_party.name[0].upper() +
                self.wronged_party.name[1:] + " notice" +
                persons.get_tense(self.wronged_party) + 
                " you taking it and kill" +
                persons.get_tense(self.wronged_party) + " you.",
                clover=True,
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
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

    def __init__(self, state):
        super(AskAboutAssassins, self).__init__(state)
        self.name = "Ask about assassins."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The first person you ask about assassins turns "
            "out to be an assassin. She assassinates you.",
            clover=True,
            die=True,
        ), weight=3)

        self.outcomes.add(Outcome(state,
            "You ask around, but nobody has heard anything "
            "about assassins.",
            fail=True,
        ), weight=1)

        if state.character.place == state.places.places_dict["tavern"] and \
           state.persons.persons_dict["olga"].alive:
            self.outcomes.add(Outcome(state,
                "During your search, you strike up a conversation "
                "with a pretty lady.",
                new_person=state.persons.persons_dict["olga"],
            ), weight=1)

        if state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "You ask a servant about assassins. She asks you to wait where "
                "you are.",
            ), weight=10)


class AskDirections(Action):

    slot = "a"

    def __init__(self, state):
        super(AskDirections, self).__init__(state)
        self.name = "Ask directions."

    def execute(self, state):

        if state.character.person == state.persons.persons_dict["simple_peasant"]:
            self.outcomes.add(Outcome(state,
                "He tells you there are four directions, north, south, "
                "east, and west.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "He tells you the only direction worth going is to Lord "
                "Bartholomew's house.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "He says the town is yonder.",
            ), weight=1)

        if state.character.person == state.persons.persons_dict["peasant_lass"]:
            self.outcomes.add(Outcome(state,
                "She says Lord Carlos' manor is in the woods.",
                actions=[(GoTo(state, state.character.place,
                          specific_dest=state.places.places_dict["lord_carlos_manor"]),
                          10000)],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She says Lord Bartholomew's manor is nearby.",
                actions=[(GoTo(state, state.character.place,
                          specific_dest=state.places.places_dict["lord_bartholomews_manor"]),
                          10000)],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She says there's good mushroom picking in the woods.",
                actions=[(GoTo(state, state.character.place,
                          specific_dest=state.places.places_dict["woods"]), 10000)],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She babbles incoherently while eating a many-colored "
                "mushroom.",
            ), weight=1)


class AdmireYourJewels(Action):

    slot = "a"

    def __init__(self, state):

        super(AdmireYourJewels, self).__init__(state)
        self.name = "Admire your jewels."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You decide that your jewels outclass everything else you have.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You decide to store your jewels in your stomach for safe "
            "keeping.",
            remove_item=items.jewels,
            topic="mules",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a pearl in your bag of jewels",
            add_item=items.pearl,
            topic="pearls",
        ), weight=1)

        if state.character.place in state.places.populated:

            self.outcomes.add(Outcome(state,
                "You notice the reflection of a dagger in a particularly "
                "large ruby.",
                clover=True,
                die=True,
            ), weight=1)

        if state.character.place in state.places.town:

            self.outcomes.add(Outcome(state,
                "The guards catch you with your pants down. They conclude you "
                "must be a lunatic",
                new_person=state.persons.persons_dict["guards"],
                threat=True,
                topic='curious',
            ), weight=2)


class Apologize(Action):

    slot = "a"

    def __init__(self, state):
        super(Apologize, self).__init__(state)
        self.name = "Tell him you're sorry."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "\"I'm afraid 'sorry' won't cut it.\" His knife does.",
            die=True,
        ), weight=3)

        self.outcomes.add(Outcome(state,
            "\"Oh, you're not sorry yet,\" he says as he steps toward you.",
            threat=True,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "A bystander notices the assassin threatening you. "
            "\"The man said he was sorry, isn't that enough?\" "
            "he says. \"No,\" the assassin replies.",
            threat=True,
        ), weight=1)


class Attack(Action):

    slot = "a"

    def __init__(self, state, person):
        super(Attack, self).__init__(state)
        self.name = "Attack " + person.name + "."
        self.combat_action = True

    def execute(self, state):
        if state.character.person.attack >= state.character.get_attack():

            self.outcomes.add(state.character.person.preferred_attack(state))

        else:

            self.outcomes.add(Outcome(state,
                "You kill " + state.character.person.name + ".",
                unthreat=True,
                kill=True,
            ), weight=1)


class GoDivingForPearls(Action):

    slot = "a"

    def __init__(self, state):
        super(GoDivingForPearls, self).__init__(state)
        self.name = "Go diving for pearls."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Arthur's pet shark eats you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You soon find a pearl in an oyster.",
            add_item=items.pearl,
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You drown on a fool's errand",
            die=True,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You soon pry open an oyster and find a beautiful pearl. "
            "It's so dazzling you drown while gazing at it.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You exhaust yourself trying to find pearls and start to drown. "
            "A beautiful mermaid grabs you and hoists you to safety.",
            move_to=state.places.places_dict["mermaid_rock"],
            new_person=state.persons.persons_dict["mermaid"],
        ), weight=1)


class LickTheGround(Action):

    slot = "a"

    def __init__(self, state, place):
        super(LickTheGround, self).__init__(state)
        self.place = place
        if place in state.places.inside:
            self.ground = "floor"
        elif place == state.places.places_dict["pirate_ship"]:
            self.ground = "deck"
        else:
            self.ground = "ground"
        self.name = "Lick the {0}.".format(self.ground)

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You catch an infection and spend {0} weeks fighting "
            "it.".format(random.choice(["two", "three", "four",
                                        "five", "six"])),
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find the flavor of the {0} distasteful.".format(self.ground),
            fail=True,
        ), weight=3)

        if state.character.place in state.places.populated:
            self.outcomes.add(Outcome(state,
                "The local guards see you licking the {0} and accuse you of "
                "being a lunatic.".format(self.ground),
                new_person=state.persons.persons_dict["guards"],
                threat=True,
            ), weight=3)

        if state.character.place == state.places.places_dict["wizards_lab"]:
            self.outcomes.add(Outcome(state,
                "You lick some spilled potion off the floor and start "
                "growing at a monstrous rate.",
                funcs=[state.character.monstrosify],
            ), weight=20)

        if state.character.place == state.places.places_dict["ocean"]:
            self.outcomes.add(Outcome(state,
                "You drown while swimming toward the ocean floor with your "
                "tongue extended.",
                die=True,
            ), weight=10000)

        if state.character.place == state.places.places_dict["woods"]:
            self.outcomes.add(Outcome(state,
                "As you lick the ground, you notice it smells oddly familiar.",
            ), weight=3)

        if state.character.place == state.places.places_dict["arctic"]:
            self.outcomes.add(Outcome(state,
                "The ice tastes really cold.",
            ), weight=10)


class LookForAWeapon(Action):

    slot = "a"

    def __init__(self, state):
        super(LookForAWeapon, self).__init__(state)
        self.name = "Look for a weapon."

    def execute(self, state):

        if state.persons.persons_dict["wealthy_merchant"].alive:
            self.outcomes.add(Outcome(state,
                "You find yourself talking to a wealthy war merchant.",
                new_person=state.persons.persons_dict["wealthy_merchant"],
            ), weight=9)

        self.outcomes.add(Outcome(state,
            "You find one... in your back as an assassin walks away smoothly.",
            clover=True,
            die=True,
        ), weight=1)


class LookForVoidDust(Action):

    slot = "a"

    def __init__(self, state):
        super(LookForVoidDust, self).__init__(state)
        self.name = "Look for void dust."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The void is very clean. You can't find any.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The void is very dirty. You soon find some.",
            add_item=items.bottle_of_void_dust,
            succeed=True,
        ), weight=1)


class GoMushroomPicking(Action):

    slot = "a"

    def __init__(self, state):
        super(GoMushroomPicking, self).__init__(state)
        self.name = "Go mushroom picking."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You find a yellow mushroom.",
            add_item=items.yellow_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a white mushroom.",
            add_item=items.white_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a black mushroom.",
            add_item=items.black_mushroom,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a many-colored mushroom.",
            add_item=items.many_colored_mushroom,
            succeed=True,
        ), weight=1)


class LookForStGeorge(Action):

    slot = "a"

    def __init__(self, state):
        super(LookForStGeorge, self).__init__(state)
        self.name = "Look for St. George."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You forget what you were doing.",
            move=1,
        ), weight=3)

        self.outcomes.add(Outcome(state,
            "You trip over a cat and break your neck.",
            clover=True,
            die=True,
        ), weight=1)

        if state.persons.persons_dict["st_george"].alive:
            self.outcomes.add(Outcome(state,
                "You find St. George at the church.",
                move_to=state.places.places_dict["church"],
                new_person=state.persons.persons_dict["st_george"],
            ), weight=10)

            self.outcomes.add(Outcome(state,
                "You find St. George in the streets.",
                move_to=state.places.places_dict["streets"],
                new_person=state.persons.persons_dict["st_george"],
            ), weight=5)

            self.outcomes.add(Outcome(state,
                "You find St. George in the market.",
                move_to=state.places.places_dict["market"],
                new_person=state.persons.persons_dict["st_george"],
            ), weight=3)


class KillYourselfInFrustration(Action):

    slot = "a"

    def __init__(self, state):
        super(KillYourselfInFrustration, self).__init__(state)
        self.name = "Kill yourself in frustration."

    def execute(self, state):

        if state.character.place in [
                state.places.places_dict["docks"],
                state.places.places_dict["mermaid_rock"],
                state.places.places_dict["arctic"]]:
            self.outcomes.add(Outcome(state,
                "You walk into the ocean and are suddenly inspired to write "
                "a novel. You drown.",
                die=True,
            ), weight=5)

        if state.character.place in [state.places.places_dict["streets"], 
                                     state.places.places_dict["market"], 
                                     state.places.places_dict["church"]] \
           and state.persons.persons_dict["st_george"].alive:
            self.outcomes.add(Outcome(state,
                "You throw yourself off a rooftop, but St. George catches "
                "you and gives you a large fortune.",
                get_money=money.large_fortune,
                new_person=state.persons.persons_dict["st_george"],
            ), weight=2)

        if state.character.place in [state.places.places_dict["docks"]]:
            self.outcomes.add(Outcome(state,
                "You find Lord Arthur and ask him to kill you with his "
                "jeweled cutlass. He gladly obliges.",
                die=True,
            ), weight=5)

        self.outcomes.add(Outcome(state,
            "You perform the ritual of seppuku.",
            die=True,
        ), weight=3)

        if state.character.place != state.places.places_dict["ocean"]:
            if not state.character.has_item(items.fire_proof_cloak):
                self.outcomes.add(Outcome(state,
                    "You set yourself on fire and burn to a crisp.",
                    die=True,
                ), weight=3)
            else:
                self.outcomes.add(Outcome(state,
                    "You try to set yourself on fire, but your fancy red "
                    "cloak is fireproof.",
                    fail=True,
                ), weight=3)
        else:
            self.outcomes.add(Outcome(state,
                "You drown trying to set yourself on fire.",
                die=True,
            ), weight=3)

        if state.character.place == state.places.places_dict["countryside"] or \
           state.character.place == state.places.places_dict["lord_bartholomews_manor"] or \
           state.character.place == state.places.places_dict["streets"]:
            self.outcomes.add(Outcome(state,
                "You are about to impale yourself on a fence post when a "
                "small boy walks by. By the time he leaves, your stupidity "
                "is no longer compelling you to kill yourself.",
            ), weight=3)


class KillEverybodyInAFitOfRage(Action):

    slot = "a"

    def __init__(self, state):
        super(KillEverybodyInAFitOfRage, self).__init__(state)
        self.name = "Kill everybody in a fit of rage."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You start with yourself.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You make no exceptions.",
            die=True,
        ), weight=1)

        if state.character.person == state.persons.persons_dict["pirates"] and \
           state.character.place == state.places.places_dict["docks"] and \
           state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "You kill all the pirates. Lord Arthur says he is impressed "
                "with your skills and also happens to be in the market for "
                "a new crew. He forces you into his service.",
                move_to=state.places.places_dict["pirate_ship"],
            ), weight=10)


class SayYouLoveHer(Action):
    """
    NOTE: right now this is only for Felicity
    """

    slot = "a"

    def __init__(self, state, person):
        super(SayYouLoveHer, self).__init__(state)
        self.name = "Say you love her too."
        self.person = person

    def execute(self, state):

        if self.person == state.persons.persons_dict["felicity"]:

            self.outcomes.add(Outcome(state,
                "\"What a shame,\" an assassin says as he steps into the room. "
                "He shoots you with a crossbow.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity is overjoyed and secretly lets you out of prison "
                "that night. \"Let's get married!\" she says.",
                move_to=state.places.places_dict["streets"],
                new_person=state.persons.persons_dict["felicity"],
                actions=[
                    (MarryFelicity(state), 777),
                    (RunLikeTheDevil(state), 666)],
            ), weight=9)


class MarryOlga(Action):

    slot = "a"

    def __init__(self, state):
        super(MarryOlga, self).__init__(state)
        self.name = "Marry Olga."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "A bleary-eyed priestess performs a wedding for you and Olga in "
            "an alley behind the church. Olga asks the priestess if she would "
            "like to come along for the honeymoon, but the priestess "
            "declines.",
            win=True,
        ), weight=1)

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "Lord Arthur performs a wedding for you and Olga on the deck "
                "of his pirate ship. By the time the ceremony is over the "
                "ship has sailed. You are now both members of the crew.",
                win=True,
            ), weight=1)

        if state.persons.persons_dict["wizard"].alive:
            self.outcomes.add(Outcome(state,
                "The wizard performs a wedding for you and Olga in the market. "
                "He turns you both into sheep after the vows, but it is much "
                "safer being sheep.",
                win=True,
            ), weight=1)

        if state.persons.persons_dict["lord_bartholomew"].alive:
            self.outcomes.add(Outcome(state,
                "Lord Bartholomew performs a wedding for you and Olga in the "
                "countryside. 20,000 people attend your wedding, but you "
                "suspect they just wanted to see Lord Bartholomew.",
                win=True,
            ), weight=1)


class MarryFelicity(Action):

    slot = "a"

    def __init__(self, state):
        super(MarryFelicity, self).__init__(state)
        self.name = "Marry Felicity."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "St. George secretly performs a wedding for you and Felicity.",
            win=True,
        ), weight=9)


class ThumpYourselfOnTheChest(Action):

    slot = "a"

    def __init__(self, state):
        super(ThumpYourselfOnTheChest, self).__init__(state)
        self.name = "Thump yourself on the chest."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You feel quite manly.",
        ), weight=9)

        self.outcomes.add(Outcome(state,
            "You thump yourself a bit too hard.",
            die=True,
        ), weight=1)

        if state.character.place in state.places.populated or \
           state.character.place == state.places.places_dict["countryside"]:
            self.outcomes.add(Outcome(state,
                "A peasant woman sees you thump your chest and seems "
                "impressed. Unfortunately, her husband is not. He ushers her "
                "away.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Some peasants laugh at you for acting like a gorilla.",
                fail=True,
            ), weight=9)

        if state.character.person == state.persons.persons_dict["wizard"]:
            self.outcomes.add(Outcome(state,
                "The wizard says, \"If you like behaving like a gorilla so "
                "much why not be a gorilla?\" He tries to turn you into a "
                "gorilla, but his spell only makes you walk like a gorilla.",
                grow_stronger=2,
            ), weight=20)


# B slot actions


class TrainWithTheGuards(Action):

    slot = "b"

    def __init__(self, state):
        super(TrainWithTheGuards, self).__init__(state)
        self.name = "Train with the guards."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The guards throw you out for not filling out the proper "
            "paperwork.",
            move_to=state.places.places_dict["streets"],
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You accidentally break your neck during training.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You get the badly beaten in wooden swordplay.",
            grow_stronger=1,
        ), weight=1)

        if state.character.get_attack() > 4:
            self.outcomes.add(Outcome(state,
                "You defeat the captain of the guards at wooden "
                "swordplay. \"Not bad for a {0},\" he says"
                ".".format(random.choice([
                    "peasant",
                    "lunatic",
                    "simpleton",
                    ])),
                succeed=True,
            ), weight=1)


class Beth(Action):
    """
    Used when guessing Eve's name
    """

    slot = "b"

    def __init__(self, state):
        super(Beth, self).__init__(state)
        self.name = "\"Beth.\""

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Wrong answer. Lord Carlos' daughter assassinates you.",
            die=True,
        ), weight=1)


class HowlWithPain(Action):

    slot = "b"

    def __init__(self, state):
        super(HowlWithPain, self).__init__(state)
        self.name = "Howl with pain."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The manor's servants rush to your aid and carry you to "
            "Lord Bartholomew's priest "
            "to be healed. The priest informs them that it will require "
            "a true master to save you, so the servants rush you to "
            "town to be healed by St. George. He informs them "
            "that nothing is wrong with you. The servants are relieved and "
            "head back to the manor.",
            new_person=state.persons.persons_dict["st_george"],
            move_to=state.places.places_dict["church"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A maid shushes you. She says Lord Bartholomew's children are "
            "napping.",
        ), weight=1)


class RepayYourDebts(Action):
    """
    Assumes state.character.person == state.state.persons.persons_dict["lord_carlos"]
    """

    slot = "b"

    def __init__(self, state):
        super(RepayYourDebts, self).__init__(state)
        self.name = "Repay your debts."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "He takes your money but says, \"No amount of money can make up "
            "for what you've done.\"",
            lose_all_money=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "He informs you that your death is the only form of repayment he "
            "will accept. Your debts are soon settled.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "He takes your money and kills you.",
            die=True,
        ), weight=1)


class Nf3(Action):

    slot = "b"

    def __init__(self, state):
        super(Nf3, self).__init__(state)
        self.name = "Nf3."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You eventually checkmate Lord Carlos. He tosses the chessboard "
            "on the floor and pulls out a dagger.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Carlos soon has you backed into a corner. Checkmate.",
            die=True,
        ), weight=1)


class TryToTakeKeys(Action):

    slot = "b"

    def __init__(self, state):
        super(TryToTakeKeys, self).__init__(state)
        self.name = "Try to take the keys the next chance you get."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "When you try to take the warden's keys, the guards notice and "
            "beat the life out of you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "When you try to take the warden's keys, the guards notice and "
            "beat the tar out of you.",
        ), weight=4)

        self.outcomes.add(Outcome(state,
            "It's surprisingly easy to steal keys and get out of prison.",
            move_to=state.places.places_dict["streets"],
            succeed=True,
        ), weight=1)


class Grovel(Action):
    """
    Only use when state.character.person == state.persons.persons_dict["lord_carlos"]
    """

    slot = "b"

    def __init__(self, state):
        super(Grovel, self).__init__(state)
        self.name = "Grovel."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Carlos is having none of it. He kills you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Carlos kills you for being obsequious.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "He is not interested in your tired excuses. He kills you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "He asks a servant to get you out of his sight. You are "
            "unceremoniously thrown out of the manor.",
            move_to=state.places.places_dict["woods"],
        ), weight=1)


class ArmWrestle(Action):

    slot = "b"

    def __init__(self, state):
        super(ArmWrestle, self).__init__(state)
        self.name = "Arm wrestle with them to reclaim your dignity."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Even the lady pirates can easily beat you. They toss you "
            "in the ocean when they're done humiliating you.",
            move_to=state.places.places_dict["ocean"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You lose what little dignity you had left.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You manage to hold out long enough for Lord Arthur to "
            "bark orders at his men to press-gang hands for the voyage.",
            move_to=state.places.places_dict["pirate_ship"],
        ), weight=1)


class SlurpDown(Action):

    slot = "b"

    def __init__(self, state, potion):
        super(SlurpDown, self).__init__(state)
        self.potion = potion
        self.name = "{0}".format(random.choice([
            "Slurp down your ",
            "Take a swig of your ",
            "Down your ",
            "Chug your ",])) + self.potion.name + "."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Like homeopathy, the potion does nothing.",
        ), weight=1)

        if self.potion.name == "love potion":
            self.outcomes.add(Outcome(state,
                "You fall in love with yourself and give yourself a hug.",
                remove_item=items.love_potion,
            ), weight=10000)

        if self.potion.name == "potion of strength":
            self.outcomes.add(Outcome(state,
                None,
                remove_item=items.strength_potion,
                grow_stronger=4,
            ), weight=10000)

        if self.potion.name == "potion of tail growth":
            self.outcomes.add(Outcome(state,
                "You now have a tail.",
                remove_item=items.tail_potion,
            ), weight=10000)


class LookForWitches(Action):

    slot = "b"

    def __init__(self, state):
        super(LookForWitches, self).__init__(state)
        self.name = "Look for witches"

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You find a witch deep in the woods.",
            new_person=state.persons.persons_dict["witch"],
        ), weight=1)

        if state.character.place in state.places.burnable:
            self.outcomes.add(Outcome(state,
                "You can't find any witches. Only trees.",
                fail=True,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "You can't find any witches. Only burnt trees.",
                fail=True,
            ), weight=1)


class GawkAtWomen(Action):

    slot = "b"

    def __init__(self, state):
        super(GawkAtWomen, self).__init__(state)
        self.name = "{0} at women.".format(random.choice(
            ["Gawk", "Leer", "Stare"]))

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "A fair woman notices you and hastens away.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A woman becomes annoyed with you and throws salt in your eyes.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are too distracted by all the women to notice the "
            "assassins closing in on you.",
            die=True,
        ), weight=1)

        if self.name == "Gawk at women.":
            self.outcomes.add(Outcome(state,
                "You stop gawking when you realize it wasn't a woman.",
                fail=True,
                topic="androgyny",
            ), weight=1)

        if self.name == "Stare at women.":
            self.outcomes.add(Outcome(state,
                "An equally creepy woman stares back at you before "
                "disappearing into a dark alley.",
                actions=[(GoTo(state, state.places.places_dict["dark_alley"]), 5)],
            ), weight=1)

        if self.name == "Leer at women.":
            self.outcomes.add(Outcome(state,
                "You don't notice any women worth leering at, but you see a "
                "cat worth leering at.",
                add_item=items.cat,
            ), weight=1)


class SwingOnARope(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "b"

    def __init__(self, state):
        super(SwingOnARope, self).__init__(state)
        self.name = "Swing on a Rope."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You fall into the ocean and no one bothers to save you.",
            move_to=state.places.places_dict["ocean"],
        ), weight=1)

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "You manage to knock a merchant off a rope. Lord Arthur "
                "rewards your bravery after the battle is over.",
                succeed=True,
                add_item=items.fish,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "You manage to knock a merchant off a rope. The captain "
                "rewards your bravery after the battle is over.",
                succeed=True,
                add_item=items.fish,
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "A merchant cuts you down.",
            die=True,
        ), weight=1)


class Tithe(Action):

    slot = "b"

    def __init__(self, state):
        super(Tithe, self).__init__(state)
        self.name = "Tithe."

    def execute(self, state):

        if state.character.money == money.pittance:
            state.character.lose_all_money()

        self.outcomes.add(Outcome(state,
            "You feel {0}.".format(random.choice(
                ["like your sins will be forgiven", "holier",
                 "holy", "like a good person"])),
            succeed=True,
        ), weight=4)

        self.outcomes.add(Outcome(state,
            "You feel {0}.".format(random.choice(
                ["like you've been cheated", "like you wasted your money",
                 "like the church will waste the money", "unfulfilled"])),
            fail=True,
        ), weight=4)

        self.outcomes.add(Outcome(state,
            "A priestess blesses you.",
        ), weight=1)

        if state.persons.persons_dict["lord_carlos"].alive:
            self.outcomes.add(Outcome(state,
                "It was a good time to make peace with God. Lord Carlos steps "
                "out from behind a pillar and assassinates you.",
                die=True,
            ), weight=1)

        if state.character.get_attack() < 7 and state.persons.persons_dict["st_george"].alive:
            self.outcomes.add(Outcome(state,
                "St. George sees that you are a righteous man and gives you an "
                "iron hammer to help you do God's work.",
                add_item=items.iron_hammer,
                new_person=state.persons.persons_dict["st_george"],
            ), weight=1)


class BarterWithInuits(Action):

    slot = "b"

    def __init__(self, state):
        super(BarterWithInuits, self).__init__(state)
        self.name = "Barter with the Inuits."

    def execute(self, state):

        if not state.character.has_any_items:
            self.outcomes.add(Outcome(state,
                "You have nothing they want.",
                fail=True,
            ), weight=10000)

        if state.character.has_item(items.seal_carcass):
            self.outcomes.add(Outcome(state,
                "You trade your seal for passage back to land.",
                remove_item=items.seal_carcass,
                move_to=state.places.places_dict["woods"],
                topic="the Inuits",
            ), weight=9)

        self.outcomes.add(Outcome(state,
            "The Inuits drive a hard bargain, but take you to land in "
            "one of their kayaks.",
            funcs=[state.character.remove_all_items],
            move_to=state.places.places_dict["woods"],
            topic="the Inuits",
        ), weight=1)


class BuildAnIgloo(Action):

    slot = "b"

    def __init__(self, state):
        super(BuildAnIgloo, self).__init__(state)
        self.name = "Build an igloo."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "While building your igloo, you slip on some ice.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You can't figure out how to build an igloo.",
            fail=True,
        ), weight=1)

        if not state.character.has_item(items.seal_carcass):
            self.outcomes.add(Outcome(state,
                "Your igloo protects you from the elements, "
                "but not from your hunger.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You get bored and hungry inside your igloo.",
            ), weight=1)

        else:
            self.outcomes.add(Outcome(state,
                "You survive in your igloo until winter by eating your seal. "
                "The winter ice sheet allows you to get back to land.",
                move_to=state.places.places_dict["woods"],
                remove_item=items.seal_carcass,
                succeed=True,
            ), weight=50)


class Disguise(Action):

    slot = "b"

    def __init__(self, state):
        super(Disguise, self).__init__(state)
        self.fake_name = random.choice(["St. George.",
                                        "Lord Arthur.",
                                        "Lord Daniel."])
        self.name = "Tell the next person you meet that you are " + \
                    "{0}".format(self.fake_name)

    def execute(self, state):

        if state.character.place == state.places.places_dict["lord_bartholomews_manor"]:
            self.outcomes.add(Outcome(state,
                "No one is buying it.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You soon have an audience with Lord Bartholomew. When he "
                "realizes he's been tricked, he has his servants escort you "
                "out of the manor.",
                move_to=state.places.places_dict["countryside"],
            ), weight=1)

            if self.fake_name == "Lord Arthur":
                self.outcomes.add(Outcome(state,
                    "When you tell a gardener that you are Lord Arthur, "
                    "he laughs and says, \"Lord Arthur? This far inland? I "
                    "really doubt it.\"",
                    fail=True,
                ), weight=3)
                
            if self.fake_name == "Lord Daniel":
                self.outcomes.add(Outcome(state,
                    "When you tell a servant woman you are Lord Daniel, she beats "
                    "do death with a broom.",
                    die=True,
                ), weight=3)

        if state.character.place == state.places.places_dict["lord_carlos_manor"]:
            if state.persons.persons_dict["lord_carlos"].alive:
                self.outcomes.add(Outcome(state,
                    "You soon have an audience with Lord Carlos. He recognizes you "
                    "when you are admitted to his study.",
                    new_person=state.persons.persons_dict["lord_carlos"],
                    threat=True,
                ), weight=1)

            self.outcomes.add(Outcome(state,
                "No one is buying it. You are soon assassinated.",
                die=True,
            ), weight=1)


class BurnThePlaceToTheGround(Action):

    slot = "b"

    def __init__(self, state, place):
        super(BurnThePlaceToTheGround, self).__init__(state)
        self.place = place
        self.name = "Burn {0} to the ground.".format(place.name)

    def execute(self, state):

        if not state.character.has_item(items.fire_proof_cloak):
            self.outcomes.add(Outcome(state,
                "You accidentally set yourself on fire and promptly burn to "
                "the ground.",
                die=True,
            ), weight=1)
        else:
            if self.place in state.places.burnable:
                self.outcomes.add(Outcome(state,
                    "You almost perish in the blaze, but your "
                    "fancy red cloak is fireproof.",
                    burn_place=self.place,
                    succeed=True,
                    move_to=self.place,
                ), weight=1)

        if self.place in state.places.burnable:
            self.outcomes.add(Outcome(state,
                None,
                burn_place=self.place,
                succeed=True,
                move_to=self.place,
            ), weight=4)

        if state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "You get assassinated while looking for kindling.",
                die=True,
            ), weight=40)

        if state.character.person == state.persons.persons_dict["st_george"]:
            self.outcomes.add(Outcome(state,
                "St. George sees you attempting arson and smites you.",
                die=True,
            ), weight=30)

        if state.character.person == state.persons.persons_dict["st_george"]:
            self.outcomes.add(Outcome(state,
                "The wizard sees you attempting arson and turns you into a "
                "frog. He steps on you.",
                die=True,
            ), weight=20)


class SetThePlaceOnFire(BurnThePlaceToTheGround):

    slot = "a"

    def __init__(self, state, place):
        super(SetThePlaceOnFire, self).__init__(state, place)
        self.place = place
        self.name = "Set {0} ablaze.".format(place.name)


class BurnThePlaceToACrisp(BurnThePlaceToTheGround):

    slot = "c"

    def __init__(self, state, place):
        super(BurnThePlaceToACrisp, self).__init__(state, place)
        self.place = place
        self.name = "Burn {0} to a crisp.".format(place.name)


class LightUpThePlace(BurnThePlaceToTheGround):

    slot = "d"

    def __init__(self, state, place):
        super(LightUpThePlace, self).__init__(state, place)
        self.place = place
        self.name = "Light up {0}.".format(place.name)


class ClimbIntoTheCrowsNest(Action):

    slot = "b"

    def __init__(self, state):
        super(ClimbIntoTheCrowsNest, self).__init__(state)
        self.name = "Climb into the crow's nest."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You spot a merchant ship. A raid ensues.",
            actions=[
                (Swashbuckle(state), 1000),
                (SwingOnARope(state), 1000),
                (FireACanon(state), 1000),
                (HideUnderTheDeck(state), 1000)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are able to help guide the ship to land.",
            succeed=True,
            move_to=state.places.places_dict["woods"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are able to help guide the ship to the docks.",
            succeed=True,
            move_to=state.places.places_dict["docks"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You drop your bag on your way up the mast. A pirate takes it.",
            remove_all_items=True,
            fail=True,
            topic="treachery",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You fall off the mast on the way up mast.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A crow in the crow's nest caws in your face, startling "
            "you. You fall off the mast and land on the deck.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A crow in the crow's nest caws in your face, startling "
            "you. You fall off the mast and land in the water.",
            fail=True,
            move_to=state.places.places_dict["ocean"],
        ), weight=1)


class RaiseASail(Action):

    slot = "b"

    def __init__(self, state):
        super(RaiseASail, self).__init__(state)
        self.name = "Raise a sail."

    def execute(self, state):

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "Lord Arthur has you killed for raising the wrong sail.",
                clover=True,
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Arthur yells at you to scrub the deck.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "As you are raising a sail you see a merchant ship. Lord Arthur "
                "calls all hands to raid the ship.",
                actions=[
                    (Swashbuckle(state), 1000),
                    (SwingOnARope(state), 1000),
                    (FireACanon(state), 1000),
                    (HideUnderTheDeck(state), 1000)],
            ), weight=1)

            if not state.character.is_employed_by(state.persons.persons_dict["lord_arthur"]):

                self.outcomes.add(Outcome(state,
                    "Lord Arthur is impressed by your initiative and makes you a "
                    "member of the crew.",
                    add_employer=state.persons.persons_dict["lord_arthur"],
                ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "As you are raising a sail you see a merchant ship. The "
                "captain calls all hands to raid the ship.",
                actions=[
                    (Swashbuckle(state), 1000),
                    (SwingOnARope(state), 1000),
                    (FireACanon(state), 1000),
                    (HideUnderTheDeck(state), 1000)],
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "You help the ship return to the docks quicker.",
            succeed=True,
            move_to=state.places.places_dict["docks"],
        ), weight=1)


class ScrubTheDeck(Action):

    slot = "b"

    def __init__(self, state):
        super(ScrubTheDeck, self).__init__(state)
        self.name = "Scrub the deck."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You scrub the deck until it sparkles, then you scrub it some "
            "more.",
        ), weight=1)

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "As you are scrubbing, the deck you hear Lord Arthur calling all "
                "hands to raid an approaching merchant ship.",
                actions=[
                    (Swashbuckle(state), 1000),
                    (SwingOnARope(state), 1000),
                    (FireACanon(state), 1000),
                    (HideUnderTheDeck(state), 1000)],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Arthur yells at you to raise a sail.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You dislocate your shoulder scrubbing and Lord Arthur has no "
                "further use for you. He has you thrown off the ship.",
                clover=True,
                die=True,
            ), weight=1)

            if state.character.is_employed_by(state.persons.persons_dict["lord_arthur"]):

                self.outcomes.add(Outcome(state,
                    "Lord Arthur yells at you to scrub harder.",
                    new_person=state.persons.persons_dict["lord_arthur"],
                ), weight=1)

            else:

                self.outcomes.add(Outcome(state,
                    "Lord Arthur is impressed by your initiative and makes you a "
                    "member of the crew.",
                    new_person=state.persons.persons_dict["lord_arthur"],
                    add_employer=state.persons.persons_dict["lord_arthur"],
                ), weight=1)


class PlayDead(Action):

    slot = "b"

    def __init__(self, state):
        super(PlayDead, self).__init__(state)
        self.name = "Play dead."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You soon are.",
            die=True,
        ), weight=2)

        if state.character.person != state.persons.persons_dict["lord_carlos"]:
            self.outcomes.add(Outcome(state,
                "You are too pathetic for {0} to kill.".format(
                    state.character.person.name),
                unthreat=True,
                new_person=None,
                fail=True,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "Your charade does not soften Lord Carlos' {0} "
                "heart.".format(random.choice(["stony", "icy", "cold",
                                               "evil", "bitter", "cruel",])),
                die=True,
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "You go the extra mile to make it realistic.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Just to be sure, {0} kill{1} you.".format(
                state.character.person.name,
                persons.get_tense(state.character.person)),
            die=True,
        ), weight=1)


class PrayToAHigherPower(Action):

    slot = "b"

    def __init__(self, state):
        super(PrayToAHigherPower, self).__init__(state)
        self.name = "Pray to a higher power."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Your prayers go unanswered.",
            fail=True,
        ), weight=2)

        if state.character.has_any_items():
            self.outcomes.add(Outcome(state,
                "God decides to test you.",
                remove_all_items=True,
            ), weight=2)

        self.outcomes.add(Outcome(state,
            "God speaks to you and shows you the way.",
            topic="arson",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "God tells you to marry the nymph queen.",
            topic="nymphs",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Your prayers are answered.",
            get_money=money.small_fortune,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Your prayers for a beautiful wife are answered but she soon "
            "leaves you.",
            fail=True,
            topic="divorce",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Your prayers aren't answered, but the assassins' are.",
            clover=True,
            die=True,
        ), weight=1)

        if state.character.place in state.places.burnable:

            self.outcomes.add(Outcome(state,
                "Your prayers are answered.",
                burn_place=state.character.place,
            ), weight=1)

        if state.character.place == state.places.places_dict["tavern"]:

            self.outcomes.add(Outcome(state,
                "God does nothing for you, but you do find a small sack of "
                "jewels someone left on a counter.",
                add_item=items.jewels,
                topic='jewels',
            ), weight=1)

        if state.character.place in state.places.town and \
           state.persons.persons_dict["st_george"].alive:

            self.outcomes.add(Outcome(state,
                "St. George joins you in prayer.",
                new_person=state.persons.persons_dict["st_george"],
            ), weight=1)


class BegForMoney(Action):

    slot = "b"

    def __init__(self, state):
        super(BegForMoney, self).__init__(state)
        self.name = "Beg for money."

    def execute(self, state):

        if state.character.place != state.places.places_dict["church"] and \
           state.character.person == state.persons.persons_dict["st_george"]:
            self.outcomes.add(Outcome(state,
                "St. George tells you he has lost his wallet in the church.",
            ), weight=1)


        if state.character.person == state.persons.persons_dict["st_george"]:
            if state.persons.persons_dict["st_george"].state.get("given money", False):
                self.outcomes.add(Outcome(state,
                    "St. George becomes irritated by your begging "
                    "and crushes you with his iron hammer.",
                    die=True,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "St. George smites you with his saintly wraith "
                    "for being ungrateful.",
                    die=True,
                ), weight=1)

            else:
                self.outcomes.add(Outcome(state,
                    state.character.person.name + " give" +
                    persons.get_tense(state.character.person) +
                    " you a pittance.",
                    beg=True,
                    get_money=money.pittance,
                ), weight=3)

                self.outcomes.add(Outcome(state,
                    state.character.person.name + " give" +
                    persons.get_tense(state.character.person) +
                    " you a small fortune.",
                    beg=True,
                    get_money=money.small_fortune,
                ), weight=2)

                self.outcomes.add(Outcome(state,
                    state.character.person.name + " give" +
                    persons.get_tense(state.character.person) +
                    " you a large fortune.",
                    beg=True,
                    get_money=money.large_fortune,
                ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "Your begging falls on deaf ears.",
                fail=True,
                beg=True,
                topic="money",
            ), weight=1)


class BideYourTime(Action):

    slot = "b"

    def __init__(self, state):
        super(BideYourTime, self).__init__(state)
        self.name = "Bide your time."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You die of old age.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "As the days drag on, you go insane.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The days turn to weeks and the weeks turn to months.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You eventually manage to dig a secret passage from your cell "
            "into a cave network.",
            move_to=state.places.places_dict["cave"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You notice the warden carries the keys when he "
            "inspects the cells. He inspects the cells with "
            "an entourage of guards most weekends, but he "
            "does it alone on holidays.",
            actions=[(LaughAboutWarden(state), 100),
                     (TryToTakeKeys(state), 100),
                     (WaitForAHoliday(state), 100),
                    ],
        ), weight=2)

        if state.persons.persons_dict["felicity"].attracted > -1 and \
           state.persons.persons_dict["felicity"].attracted < 3:
            self.outcomes.add(Outcome(state,
                "As the days pass, you find yourself more and more "
                "attracted to the fat woman who feeds you.",
            ), weight=2)


class BuyBlackMarketItem(Action):

    slot = "b"

    def __init__(self, state):
        super(BuyBlackMarketItem, self).__init__(state)
        self.item = random.choice(
            state.persons.persons_dict["black_market_merchant"].get_sells())
        self.price = state.persons.persons_dict["black_market_merchant"].get_sell_price(self.item)
        self.name = "Make a shady deal."

    def execute(self, state):

        if state.character.money >= self.price:

            self.outcomes.add(Outcome(state,
                "You cut a deal with a {0}.".format(random.choice([
                    "black market peddler",
                    "merchant witch",
                    "monger of rare items",])),
                add_item=self.item,
                lose_money=self.price,
            ), weight=3)

        else:

            self.outcomes.add(Outcome(state,
                "You try to buy {0} {1}, but you don't have the money.".format(
                    items.a_or_an(self.item),
                    str(self.item)),
                fail=True,
                topic="poverty",
            ), weight=3)

        self.outcomes.add(Outcome(state,
            "You find an assassin posing as a black market peddler.",
            die=True,
        ), weight=1)


class BuyItem(Action):

    slot = "b"

    def __init__(self, state):
        super(BuyItem, self).__init__(state)
        self.item = random.choice(state.persons.persons_dict["local_merchant"].get_sells())
        self.price = state.persons.persons_dict["local_merchant"].get_sell_price(self.item)
        self.name = "Buy {0} {1}.".format(
            items.a_or_an(self.item),
            str(self.item))

    def execute(self, state):

        if state.character.money != money.none:

            self.outcomes.add(Outcome(state,
                None,
                add_item=self.item,
                new_person=None,
                lose_money=self.price,
            ), weight=3)

        else:

            self.outcomes.add(Outcome(state,
                "You can't afford {0} {1}.".format(
                    items.a_or_an(self.item),
                    str(self.item)),
                new_person=None,
                fail=True,
                topic="poverty",
            ), weight=3)


class BuyWeapon(Action):

    slot = "b"

    def __init__(self, state):
        super(BuyWeapon, self).__init__(state)
        self.weapon = random.choice(state.persons.persons_dict["wealthy_merchant"].get_sells())
        self.price = state.persons.persons_dict["wealthy_merchant"].get_sell_price(self.weapon)
        self.name = "Buy a " + str(self.weapon) + "."

    def execute(self, state):

        if state.character.money >= self.price:

            self.outcomes.add(Outcome(state,
                None,
                add_item=self.weapon,
                lose_money=self.price,
            ), weight=3)

        else:

            self.outcomes.add(Outcome(state,
                "You can't afford it.",
                fail=True,
                topic="poverty",
            ), weight=3)


class BuyADrink(Action):

    slot = "b"

    def __init__(self, state):
        super(BuyADrink, self).__init__(state)
        self.name = "Buy a drink."

    def execute(self, state):

        if state.persons.persons_dict["blind_bartender"].alive:

            self.outcomes.add(Outcome(state,
                "The blind bartender grumbles as he passes you a drink.",
                new_person=state.persons.persons_dict["blind_bartender"],
            ), weight=4)

            self.outcomes.add(Outcome(state,
                "The drink is poisoned.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "An assassin walks up and starts hitting on you... very hard.",
                die=True,
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "As you drink, you hear a peasant talking about how great "
                "Lord Bartholomew is.",
                topic="Lord Bartholomew",
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "A man in a black cloak sits next to you and orders a drink.",
                new_person=state.persons.persons_dict["assassin"],
                topic="assassins",
            ), weight=2)

        else:
            self.outcomes.add(Outcome(state,
                "No one is selling.",
                fail=True,
            ), weight=1)


class BoastOfYourBravery(Action):

    slot = "b"

    def __init__(self, state):
        super(BoastOfYourBravery, self).__init__(state)
        self.name = "Boast of your bravery."

    def execute(self, state):
        if not state.character.person:

            self.outcomes.add(Outcome(state,
                "You impress yourself.",
                succeed=True,
            ), weight=1)

        else:

            self.outcomes.add(Outcome(state,
                 state.character.person.name[0].upper() +
                 state.character.person.name[1:] +
                 " is not impressed.",
                 fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "As you boast of your exploits, {0} walks away.".format(
                    state.character.person.name),
                new_person=None,
                fail=True,
            ), weight=1)

            if state.character.person == state.persons.persons_dict["blind_bartender"]:

                self.outcomes.add(Outcome(state,
                    "The blind bartender starts pretending to be deaf.",
                    fail=True,
                ), weight=3)

            if state.character.person == state.persons.persons_dict["st_george"]:

                self.outcomes.add(Outcome(state,
                    "St. George warns you of the dangers of hubris.",
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "You tell St. George about the time you burnt a house "
                    "down and hey slays you for your wicked ways.",
                    die=True,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "St. George lauds your noble deeds and rewards you.",
                    get_money=money.large_fortune,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "St. George becomes irate when you claim to have slain a "
                    "dragon. He obliterates you.",
                    die=True,
                ), weight=1)

            if state.character.person == state.persons.persons_dict["olga"]:

                self.outcomes.add(Outcome(state,
                    "Her eyes glaze over as you struggle to remember times "
                    "you were brave.",
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "She sees through your lies.",
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "She seems interested in your stories.",
                ), weight=1)

            if state.character.person == state.persons.persons_dict["felicity"]:

                self.outcomes.add(Outcome(state,
                    "She points out several inconsistencies in your story.",
                    flirt=-1,
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "She seems to buy it.",
                    flirt=1,
                ), weight=1)

            if state.character.person == state.persons.persons_dict["guards"]:

                self.outcomes.add(Outcome(state,
                    "You tell the guards that you are brave.\n 'A brave "
                    "lunatic,' they say and they throw you in prison.",
                    new_person=state.persons.persons_dict["other_lunatics"],
                    move_to=state.places.places_dict["prison"],
                ), weight=1)


class LookForACat(Action):

    slot = "b"

    def __init__(self, state):
        super(LookForACat, self).__init__(state)
        self.name = "Look for a cat."

    def execute(self, state):

        if state.character.has_item(items.fish):
            self.outcomes.add(Outcome(state,
                "A cat smells your fish and approaches you.",
                succeed=True,
                add_item=items.cat,
            ), weight=20)

        self.outcomes.add(Outcome(state,
            "After days of searching, you manage to find a cat.",
            succeed=True,
            add_item=items.cat,
        ), weight=14)

        self.outcomes.add(Outcome(state,
            "Your efforts to find a cat are fruitless.",
            fail=True,
        ), weight=6)

        self.outcomes.add(Outcome(state,
            "You see something out of the corner of your eye that looks like "
            "a cat. You chase it to no avail.",
            fail=True,
            topic="cats",
        ), weight=6)

        self.outcomes.add(Outcome(state,
            "You find a ferocious cat. It kills you.",
            clover=True,
            die=True,
        ), weight=1)

        if state.character.place in state.places.burnable and \
           state.character.place in state.places.town:

            self.outcomes.add(Outcome(state,
                "You knock a lantern over as you chase a cat.",
                burn_place=state.character.place,
            ), weight=4)

        if state.character.place in state.places.populated and not \
           state.character.place in state.places.locked:

            self.outcomes.add(Outcome(state,
                "You follow a cat through the streets but "
                "eventually lose track of it.",
                move_to=state.places.places_dict["dark_alley"],
            ), weight=6)

            self.outcomes.add(Outcome(state,
                "The local guards notice you searching for a cat "
                "and conclude that you must be a lunatic.",
                new_person=state.persons.persons_dict["guards"],
                threat=True,
                topic="lonely",
            ), weight=6)

        if state.character.place == state.places.places_dict["pirate_ship"]:
            self.outcomes.add(Outcome(state,
                "You find Lord Arthur's freakish cat. The cat has "
                "eight more tails than a normal cat.",
            ), weight=20)


class TellThemYouAreNotALunatic(Action):

    slot = "b"

    def __init__(self, state, topic):
        super(TellThemYouAreNotALunatic, self).__init__(state)
        self.topic = topic
        self.name = "Tell them you are not a lunatic, " + \
            "you're just {0}.".format(topic)

    def execute(self, state):

        if self.topic[0] in "aeiou":
            self.outcomes.add(Outcome(state,
                "\"An {0} lunatic,\" they say.".format(self.topic),
                fail=True,
                move_to=state.places.places_dict["prison"],
                new_person=state.persons.persons_dict["other_lunatics"],
            ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "\"A {0} lunatic,\" they say.".format(self.topic),
                fail=True,
                move_to=state.places.places_dict["prison"],
                new_person=state.persons.persons_dict["other_lunatics"],
            ), weight=1)


class TipACow(Action):

    slot = "b"

    def __init__(self, state):
        super(TipACow, self).__init__(state)
        self.name = "Tip a cow."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You are disappointed to find out that cows can get back up "
            "easily.",
            new_person=None,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Some peasants see you trying to tip a cow and laugh at you.",
            new_person=None,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You can't find any cows. Only sheep.",
            new_person=None,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You pull a cow on top of yourself and it crushes you.",
            new_person=None,
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You're not strong enough to push the cow over.",
            new_person=None,
            topic="cows",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Some peasants mistake you for a cow thief and form a lynch mob.",
            threat=True,
            new_person=state.persons.persons_dict["mob"],
        ), weight=1)


class LookForSeaTurtles(Action):

    slot = "b"

    def __init__(self, state):
        super(LookForSeaTurtles, self).__init__(state)
        self.name = "Look for sea turtles."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You see one. You also drown because you are in the ocean.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Your efforts to find a sea turtle are fruitless.",
            fail=True,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You find a sea turtle and follow it to shore.",
            move_to=state.places.places_dict["woods"],
            topic="sea turtles",
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You can't find a sea turtle. Everywhere looks the same.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a shark instead. It minds its own business.",
        ), weight=1)


class LookForMermaids(Action):

    slot = "b"

    def __init__(self, state):
        super(LookForMermaids, self).__init__(state)
        self.name = "Look for mermaids."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You find a wooden mermaid figurehead on the front of Lord "
            "Arthur's ship. The crew hoists you abroad.",
            move_to=state.places.places_dict["pirate_ship"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are taken out by a storm during your search.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a sea turtle instead.",
            fail=True,
        ), weight=1)

        if state.character.place == state.places.places_dict["mermaid_rock"]:
            self.outcomes.add(Outcome(state,
                "{0} {1}".format(random.choice([
                    "You almost step on one",
                    "You find one putting sea shells in her hair",
                    "There are mermaids everywhere, there's one next to you.",
                    "After hours of climbing around on the rocks you find "
                    "one.",
                    ]), random.choice([
                    "She spits water in your face and laughs.",
                    "She trips you with her fish tail.",
                    "She gives you some nasty tasting seaweed.",
                    "She's beautiful, but smells terrible.",
                    "She sings a song about Lord Arthur.",
                    ])),
                new_person=state.persons.persons_dict["mermaid"],
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You don't find any mermaids, but you find a shiny foreign "
                "coin.",
                add_item=items.foreign_coin,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You don't find any mermaids, but you find a small fortune "
                "in lost treasure.",
                get_money=money.small_fortune,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You slip on a rock.",
                clover=True,
                die=True,
            ), weight=1)

        if state.character.place == state.places.places_dict["ocean"]:
            self.outcomes.add(Outcome(state,
                "You find a mermaid. She leads you back to her rock.",
                move_to=state.places.places_dict["mermaid_rock"],
                new_person=state.persons.persons_dict["mermaid"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You are not sure where to look.",
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "After days of searching, you are not sure mermaids exist.",
                fail=True,
            ), weight=2)


# C slot actions


class ChatWithLordBartholomew(Action):

    slot = "c"

    def __init__(self, state):
        super(ChatWithLordBartholomew, self).__init__(state)
        self.name = "Chat with Lord Bartholomew."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew talks about the injustices in the world "
            "and how action is needed to set them right.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew is genuinly interested in your life story.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says that a cause is the only "
            "thing worth dying for.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew stresses the value of hard work and the "
            "importance of the peasant class.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew takes you on a walk and shows you the "
            "sights around the countryside. You don't get much of a chance "
            "to talk to him because too many peasants are clamoring to get "
            "his autograph.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says the only man of any value in the town is "
            "St. George.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says Lord Arthur is a rascal who will be "
            "delt with when the time comes.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says Lord Daniel is a tyrant who will be "
            "delt with when the time comes.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says Lord Carlos is a thug who will be "
            "delt with when the time comes. You couldn't agree more.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says the wizard is a dangerous man who will be "
            "delt with when the time comes.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew says family is the only thing worth living "
            "for.",
        ), weight=1)


class Eve(Action):
    """
    Used when guessing Eve's name
    """

    slot = "c"

    def __init__(self, state):
        super(Eve, self).__init__(state)
        self.name = "\"Eve.\""

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "She gives you the evil eye.",
            flirt=(state.persons.persons_dict["eve"], 2),
        ), weight=1)


class WaitForAHoliday(Action): 

    slot = "c"

    def __init__(self, state):
        super(WaitForAHoliday, self).__init__(state)
        self.name = "Wait for a holiday to make your move."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You manage to swipe the keys off the warden during his "
            "inspection. You make your escape that night.",
            move_to=state.places.places_dict["streets"],
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You almost get the keys off the warden.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You manage to snatch the keys off the warden, but he notices and "
            "has you thrown in a deep dark dungeon. However, you end up in "
            "a cell with some of Lord Bartholomew's men. They are soon rescued "
            "and so are you.",
            move_to=state.places.places_dict["lord_bartholomews_manor"],
        ), weight=1)


class ChallengeThemToAGameOfChess(Action):

    slot = "c"

    def __init__(self, state):
        super(ChallengeThemToAGameOfChess, self).__init__(state)
        self.name = "Challenge them to a game of chess."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Their opening move is smashing a bottle of rum over your head "
            ". You aren't thinking too straight during the game and "
            "quickly lose.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The pirates slash the chessboard in half with a cutlass and "
            "leave.",
            add_item=items.cutlass,
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You beat all the pirates easily. Lord Arthur says your "
            "wits could be invaluable on the high seas. They soon are.",
            move_to=state.places.places_dict["pirate_ship"],
            actions=[(LickTheGround(state, state.places.places_dict["pirate_ship"]), 1000)],
        ), weight=1)


class SunYourselfOnARock(Action):

    slot = "c"

    def __init__(self, state):
        super(SunYourselfOnARock, self).__init__(state)
        self.name = "Sun yourself on a rock."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You get sunburnt.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You get bronzed.",
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A roc snatches you and carries you 2000 miles before feeding "
            "you to its hatchlings.",
            clover=True,
            die=True,
        ), weight=1)

        if state.character.person != state.persons.persons_dict["mermaid"]:

            self.outcomes.add(Outcome(state,
                "When you open your eyes you see a mermaid sunbathing next to "
                "you.",
                new_person=state.persons.persons_dict["mermaid"],
            ), weight=1)


class ComplainAboutUnfairImprisonment(Action):

    slot = "c"

    def __init__(self, state):
        super(ComplainAboutUnfairImprisonment, self).__init__(state)
        self.name = "Complain about unfair imprisonment."

    def execute(self, state):

        if state.character.person != state.persons.persons_dict["lord_daniel"]:
            self.outcomes.add(Outcome(state,
                "The guards say it's fair if Lord Daniel says it's fair.",
                new_person=state.persons.persons_dict["guards"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "The guards argue with you about the finer points "
                "of the justice system.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "The guards arrest you on charges of lunacy and throw you in "
                "prison with the other lunatics.",
                new_person=state.persons.persons_dict["other_lunatics"],
                move_to=state.places.places_dict["prison"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "A bureaucrat says she'll let Lord Daniel know of your "
                "concerns.",
                succeed=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "A cook assures you that Lord Bartholomew will set things right.",
            ), weight=1)

        else:  # when talking wiht Lord Daniel
            self.outcomes.add(Outcome(state,
                "Lord Daniel has his guards carry out of the tower and dump "
                "in a pile of manure.",
                move_to=state.places.places_dict["streets"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Daniel explains to you that your lack of mental "
                "capacity would never allow you to understand his complex "
                "policies.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Daniel gives you a lengthy lecture about how life "
                "isn't fair.",
                topic="boredom",
            ), weight=1)


class Hide(Action):

    slot = "c"

    def __init__(self, state):
        super(Hide, self).__init__(state)
        self.name = "Hide."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You hide from the assassins, but not from your own "
            "dark thoughts.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You hide for a couple of days, long enough "
            "that you think the whole assassin thing has probably "
            "blown over.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You try to hide in the sewer, but you end up "
            "drowning in filth.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You try to hide in the sewer, but you are killed "
            "by a rat.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You trip in the darkness and break your neck.",
            clover=True,
            die=True,
        ), weight=1)


class E4(Action):

    slot = "c"

    def __init__(self, state):
        super(E4, self).__init__(state)
        self.name = "e4."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The game ends when Lord Carlos pins you with three queens.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You beat Lord Carlos in chess. He beats you in life.",
            die=True,
        ), weight=1)


class LookForAWayOut(Action):

    slot = "c"

    def __init__(self, state):
        super(LookForAWayOut, self).__init__(state)
        self.name = "Look for a way out."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You fumble around in the darkness.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You think you're going around in circles.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You can't see anything, so you only manage to bump your head "
            "on a rock.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You slip on a slippery slope and fall to your death.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You don't find a way out, but you find a deep-cave newt.",
            add_item=items.deep_cave_newt,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find your way out of the cave.",
            move_to=state.places.places_dict["woods"],
            succeed=True,
        ), weight=1)


class ClimbUpTheTopSails(Action):

    slot = "c"

    def __init__(self, state):
        super(ClimbUpTheTopSails, self).__init__(state)
        self.name = "Climb up the top sails."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Your sailor peg falls into the ocean while you work on the sails.",
            remove_item=items.sailor_peg,
            funcs=[state.character.depegify],
        ), weight=1)


class TellAPriest(Action):

    slot = "c"

    def __init__(self, state):
        super(TellAPriest, self).__init__(state)
        self.idea = random.choice([
            "that God doesn't exist",
            "that he's fat",
            "that you are the chosen one"])
        self.name = "Tell a priest " + self.idea + "."

    def execute(self, state):

        if self.idea == "that God doesn't exist":
            self.outcomes.add(Outcome(state,
                "The priest thinks for a moment and realizes you're "
                "right. \"What a fool I've been,\" he says. \"I'll go and "
                "become a peasant.\"",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "The priest thinks for a moment and realizes you're "
                "right. \"What a fool I've been,\" he says. \"I'm going to "
                "go and find a wife.\"",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "God smites you for your {0}.".format(random.choice([
                    "arrogance", "foolishness", "rudeness", "heresy",
                    "tactlessness", "faithlessness"])),
                clover=True,
                die=True,
            ), weight=2)

        if self.idea == "that he's fat":
            self.outcomes.add(Outcome(state,
                "He runs off crying.",
                succeed=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "\"Only God can judge me,\" he says.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "\"Food is my only indulgence,\" he says proudly.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "St. George overhears your comment and agrees with you, "
                "but throws you out of the church for rudeness.",
                move_to=state.places.places_dict["streets"],
            ), weight=1)

        if self.idea == "that you are the chosen one":
            self.outcomes.add(Outcome(state,
                "The priest finds your arguments so pitiful that he gives "
                "you a pittance and sends you on your way.",
                get_money=money.pittance,
                move_to=state.places.places_dict["streets"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "He says he has his doubts.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "\"I would know it when I see it,\" he says.",
            ), weight=1)

            if state.persons.persons_dict["st_george"].alive:
                self.outcomes.add(Outcome(state,
                    "St. George overhears your comment and turns you, "
                    "over to the guards on charges of lunacy.",
                    move_to=state.places.places_dict["prison"],
                    new_person=state.persons.persons_dict["other_lunatics"],
                ), weight=1)


class FireACanon(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "c"

    def __init__(self, state):
        super(FireACanon, self).__init__(state)
        self.name = "Fire a cannon."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You manage to knock the merchant ship's mast down. "
            "It falls on you.",
            clover=True,
            die=True,
        ), weight=1)

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "You sink the merchant ship, plunder and all. Lord Arthur "
                "is not pleased, so he flogs you with his cat. The cat seems "
                "more traumatized than you, but you get fairly scratched up.",
                new_person=state.persons.persons_dict["lord_arthur"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You fumble around with the cannon, but Lord Arthur is "
                "convinced you contributed to his victory and gives you a bag "
                "of jewels.",
                add_item=items.jewels,
            ), weight=1)


class ClubASeal(Action):

    slot = "c"

    def __init__(self, state):
        super(ClubASeal, self).__init__(state)
        self.name = "Club a seal."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "After a few days of waiting at a hole in the ice, you freeze "
            "do death.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The local polar bears aren't happy with you on their turf. "
            "You are soon mauled.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "After a few days of waiting at a hole in the ice, you manage "
            "to club a seal.",
            add_item=items.seal_carcass,
            succeed=True,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You manage "
            "to club a seal, but it swims away.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "While waiting for a seal, you are very cold.",
        ), weight=1)


class CelebrateYourSuccess(Action):

    slot = "c"

    def __init__(self, state):
        super(CelebrateYourSuccess, self).__init__(state)
        self.name = "Celebrate your success."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You can't think of a better way to celebrate than twiddling "
            "your thumbs.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You dance a jig.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You sing a song.",
        ), weight=1)

        if state.character.place in state.places.burnable:
            self.outcomes.add(Outcome(state,
                None,
                burn_place=state.character.place,
                succeed=True,
                move_to=state.character.place,
            ), weight=1)

        if state.character.place in state.places.town:

            self.outcomes.add(Outcome(state,
                "You go see a play in the market.",
                move_to=state.places.places_dict["market"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You go to a brothel and admire the decorations.",
                move_to=state.places.places_dict["streets"],
            ), weight=1)

        if state.character.place in state.places.populated and \
           state.character.money != money.none:

            self.outcomes.add(Outcome(state,
                "You wander around throwing all of your money in the air.",
                funcs=[state.character.lose_all_money],
            ), weight=1)

        if state.character.place == state.places.places_dict["arctic"]:

            self.outcomes.add(Outcome(state,
                "You make a snow woman.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You make a snow angel.",
            ), weight=1)

        if state.character.place == state.places.places_dict["tavern"]:

            self.outcomes.add(Outcome(state,
                "You drink until you black out.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You drink until you black out. You wake up weary and "
                "penniless.",
                move_to=state.places.places_dict["dark_alley"],
                funcs=[state.character.lose_all_money],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You drink until you black out. "
                "Lord Arthur wakes you by yelling that you need to get on "
                "with your duties.",
                move_to=state.places.places_dict["pirate_ship"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You drink until you black out. "
                "You wake up in bed next to a peasant woman. "
                "Once the hangover wears off, you "
                "both live happily ever after.",
                win=True,
            ), weight=1)


class ChopDownATree(Action):

    slot = "c"

    def __init__(self, state):
        super(ChopDownATree, self).__init__(state)
        self.name = "Chop down a tree."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The tree falls on you.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A nymph hexes you. "
            "Throwing yourself in a pond suddenly seems like a good idea.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The tree makes a loud noise as it falls.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A tree falls in the forest. You hear it.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The tree starts to bleed and you collect its blood.",
            add_item=items.bottle_of_sap,
            succeed=True,
        ), weight=100)

        self.outcomes.add(Outcome(state,
            "You get your ax stuck in the tree and can't get it out.",
            remove_item=items.ax,
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You enjoy chopping down the tree so much that you chop down "
            "many more trees and build a cabin.",
            succeed=True,
        ), weight=1)


class ChowDown(Action):

    slot = "c"

    def __init__(self, state, food):
        super(ChowDown, self).__init__(state)
        self.food = food
        self.name = "Chow down on the " + str(food) + "."

    def execute(self, state):

        if self.food == items.many_colored_mushroom:
            if not state.character.trip:
                self.outcomes.add(Outcome(state,
                    "Your perception of the world begins to change.",
                    remove_item=items.many_colored_mushroom,
                    funcs=[state.character.start_tripping],
                ), weight=1)
            else:
                self.outcomes.add(Outcome(state,
                    "You feel normal again.",
                    remove_item=items.many_colored_mushroom,
                    funcs=[state.character.stop_tripping],
                ), weight=1)

        if self.food == items.yellow_mushroom:
            self.outcomes.add(Outcome(state,
                "You find the mushroom distasteful.",
                remove_item=items.yellow_mushroom,
            ), weight=1)

        if self.food == items.black_mushroom:
            self.outcomes.add(Outcome(state,
                "The mushroom tastes bittersweet.",
                remove_item=items.black_mushroom,
                die=True,
            ), weight=1)

        if self.food == items.white_mushroom:
            self.outcomes.add(Outcome(state,
                "You grow larger.",
                remove_item=items.white_mushroom,
                grow_stronger=1,
            ), weight=2)

            if state.character.place == state.places.places_dict["woods"] or \
               state.character.place == state.places.places_dict["countryside"]:
                self.outcomes.add(Outcome(state,
                    "You shrink to the size of a peanut. A weasel "
                    "soon comes along and eats you.",
                    remove_item=items.white_mushroom,
                    die=True,
                ), weight=1)


class FlirtWith(Action):

    slot = "c"

    def __init__(self, state, person):
        super(FlirtWith, self).__init__(state)
        self.person = person
        self.name = "Flirt with {0}.".format(person.name)

    def execute(self, state):

        if self.person == state.persons.persons_dict["mermaid"]:
            self.outcomes.add(Outcome(state,
                "You run into the mermaid problem.",
                fail=True,
            ), weight=1000)

        if self.person == state.persons.persons_dict["felicity"] and \
           state.persons.persons_dict["felicity"].name != "Felicity":

            self.outcomes.add(Outcome(state,
                "She ignores your hoots.",
                flirt=(state.persons.persons_dict["felicity"], -1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She ignores your whistling.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She ignores you when you say \"Hello,\" but "
                "you catch her glancing at you throughout the day.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She smiles, but doesn't reply to the love "
                "poem you recite to her.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She ignores you, but wears a low-cut blouse the next day.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She ignores you, but gives you more food the next day.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            if state.persons.persons_dict["felicity"].attracted > 3:
                def change_name():
                    state.persons.persons_dict["felicity"].name = "Felicity"
                self.outcomes.add(Outcome(state,
                    "You strike up a conversation and learn that her name is "
                    "Felicity.",
                    flirt=(state.persons.persons_dict["felicity"], 2),
                    funcs=[change_name],
                ), weight=1000)

        elif self.person == state.persons.persons_dict["felicity"]:  # We know her name

            self.outcomes.add(Outcome(state,
                "Felicity blows you kisses.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity leans in close and kisses your cheek.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity talks with you for hours. She only "
                "stops when the warden barks at her to get "
                "back to work.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity tells you she asked the warden to "
                "let you out, but he has a strict \"No lunatics "
                "on the streets\" policy.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity says she thinks about you a lot.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity laughs at all your jests, even the bad ones.",
                flirt=(state.persons.persons_dict["felicity"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Felicity asks if she looks fat in her new dress. "
                "You say \"Yes.\" She doesn't speak to you for several days.",
                flirt=(state.persons.persons_dict["felicity"], -1),
            ), weight=1)

            if state.persons.persons_dict["felicity"].attracted > 10:
                self.outcomes.add(Outcome(state,
                    "Felicity whispers that she loves you.",
                    love_confessor=state.persons.persons_dict["felicity"],
                ), weight=100)

        if self.person == state.persons.persons_dict["olga"] and \
           state.persons.persons_dict["olga"].name != "Olga":

            self.outcomes.add(Outcome(state,
                "When you squeeze her butt, she stabs you in the heart with a "
                "poisoned dagger.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You play a game of darts together, but you get upset when "
                "you lose and ruin the mood.",
                flirt=(state.persons.persons_dict["olga"], -1),
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You find out that you both like "
                "cats. She says her cat loves being petted.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You amuse her with realistic impreesions of bird "
                "songs. She says she likes a man who's good with his tongue.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She is impressed with your juggling and says she likes a man "
                "with skilled hands.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You say the flower in her hair goes well with "
                "her eyes. She says you can smell her flower if you like.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She sits on your lap when you buy her a drink.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            if state.persons.persons_dict["blind_bartender"].alive:
                self.outcomes.add(Outcome(state,
                    "You both laugh about how bad the ale is. The blind bartender "
                    "is not pleased.",
                    flirt=(state.persons.persons_dict["olga"], 2),
                ), weight=1)

            self.outcomes.add(Outcome(state,
                "You have a meal together.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She plays with your hair while you talk of your exploits.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            if state.persons.persons_dict["olga"].attracted > 3:
                def change_name():
                    state.persons.persons_dict["olga"].name = "Olga"
                self.outcomes.add(Outcome(state,
                    "She says her name is Olga. You also tell your name.",
                    flirt=(state.persons.persons_dict["olga"], 2),
                    funcs=[change_name],
                ), weight=10000)

        elif self.person == state.persons.persons_dict["olga"] and \
             state.character.place == state.places.places_dict["tavern"]:

            self.outcomes.add(Outcome(state,
                "You follow Olga to her room, "
                "where she shows you some paintings she's borrowing "
                "from Lord Carlos.",
                new_person=state.persons.persons_dict["olga"],
                move_to=state.places.places_dict["upstairs"],
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "You follow her to her room upstairs. Lots of passionate "
                "stabbing ensues.",
                clover=True,
                die=True,
            ), weight=1)

        elif self.person == state.persons.persons_dict["olga"] and \
             state.character.place == state.places.places_dict["upstairs"]:

            self.outcomes.add(Outcome(state,
                "{0}".format(random.choice([
                "You make passionate love together.",
                "You sleep together.",
                "Olga does lots of nice things to you.",
                ])),
                succeed=True,
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=4)

            self.outcomes.add(Outcome(state,
                "Olga whispers that she's been stalking you.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You both stay up late talking by candlelight.",
                flirt=(state.persons.persons_dict["olga"], 3),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Olga tells you her life story. Half of it seems made up.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You compliment her on her borrowed paintings. She is pleased.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Olga turns out to be an assassin. She assassinates you.",
                clover=True,
                die=True,
            ), weight=1)

            if state.persons.persons_dict["olga"].attracted > 10:
                self.outcomes.add(Outcome(state,
                    "Olga grabs your hand. \"Life's too short, "
                    "let's get married!\"",
                    love_confessor=state.persons.persons_dict["olga"],
                ), weight=1000)

        if self.person == state.persons.persons_dict["eve"]:
            self.outcomes.add(Outcome(state,
                "She asks if you even remember her name. "
                "You say, \"Of course I remember your name. It's...\"",
                actions=[(Anne(state), 10000), (Beth(state), 10000),
                         (Eve(state), 10000), (Donna(state), 10000)],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You look at her bookshelf and compliment her on her choice "
                "of books. She casts doubt on your ability to read.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "When you try to get close to her, she trips you and laughs.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She lets you live with her for a few months under the "
                "condition that she gets to treat you poorly.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You say she has pretty lips. She says your lips are only "
                "pretty when they're shut.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She ignores your innuendos, but lets you come to the river "
                "with her so she can drown a bag of kittens.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She tells you to hide in a chest, because she thinks her "
                "father is coming. She locks you in the chest and doesn't "
                "let you out for a week.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She says she wants to make love to you in the woods, "
                "but you lose track of her in the darkness. She doesn't "
                "come back for you.",
                move_to=state.places.places_dict["woods"],
                fail=True,
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "She asks you to prove your devotion to her by cleaning her "
                "room. She seems pleased with your work.",
                flirt=(state.persons.persons_dict["eve"], 1),
            ), weight=1)

            if state.persons.persons_dict["eve"].attracted > 3:

                self.outcomes.add(Outcome(state,
                    "Your suave advances lead to several rounds of passionate "
                    "sex with Lord Carlos' daughter that night. Unfortunately, "
                    "you don't wake up at "
                    "dawn. You wake up in the middle of the night when two "
                    "hooded assassins kidnap you take you to a dungeon full "
                    "of torture devices. They are about to put you in an "
                    "iron maiden when they take off their hoods and reveal "
                    "that they are Lord Carlos' daughter and a priest. The "
                    "priest officiates your wedding.",
                    win=True,
                ), weight=10000)


class GoToSleep(Action):

    slot = "c"

    def __init__(self, state):
        super(GoToSleep, self).__init__(state)
        self.name = "Go to sleep."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You wake up dead.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You have a nightmare about weasels.",
            topic="weasels",
            new_person=None,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You dream of fire.",
            topic="fire",
            new_person=None
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You have a wonderful dream that you married a nymph and took her "
            "to bed in Lord Carlos' manor.",
            new_person=None,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You wake up well-rested some hours later.",
            new_person=None,
        ), weight=2)

        if state.character.place == state.places.places_dict["prison"]:
            self.outcomes.add(Outcome(state,
                "You wake up just in time to see an assassin slip a weasel "
                "between the bars of your cell. The weasel kills you.",
                clover=True,
                die=True,
            ), weight=3)

        if state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "You wake up in Lord Carlos' dungeon. You never leave.",
                die=True,
            ), weight=100)

        if state.character.place == state.places.places_dict["ocean"]:
            self.outcomes.add(Outcome(state,
                "You drown in your sleep.",
                die=True,
            ), weight=100)

        if not state.character.place in state.places.locked:
            self.outcomes.add(Outcome(state,
                "You wake up some hours later.",
                move=2,
                new_person=None,
            ), weight=3)

        if state.character.place in state.places.populated and not \
           state.character.place in state.places.locked:

            self.outcomes.add(Outcome(state,
                "You are pleasantly awakened by a cat rubbing itself against "
                "you.",
                add_item=items.cat,
                new_person=None,
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You wake up robbed of all your worldly possessions.",
                remove_all_items=True,
                funcs=[state.character.lose_all_money],
                new_person=None,
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You are rudely awakened by an assassin's dagger.",
                clover=True,
                die=True,
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You wake up with some coins on your cloak.",
                get_money=money.pittance,
                topic="money",
                new_person=None,
            ), weight=2)


class LookForTheWizard(Action):

    slot = "c"

    def __init__(self, state):
        super(LookForTheWizard, self).__init__(state)
        self.name = "Look for the wizard."

    def execute(self, state):

        if state.persons.persons_dict["wizard"].alive:
            if state.character.has_item(items.yellow_mushroom):
                self.outcomes.add(Outcome(state,
                    "When you find him, he can smell that you have a yellow "
                    "mushroom. He asks if he can have it.",
                    move_to=state.places.places_dict["market"],
                    new_person=state.persons.persons_dict["wizard"],
                    actions=[(GiveHimTheYellowMushroom(state), 100)],
                ), weight=100)

            self.outcomes.add(Outcome(state,
                "You find him. He turns you into a frog and steps on you.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You find him. He turns you into a frog and tries to step on you "
                "but you manage to hop away.",
                funcs=[state.character.frogify],
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "When you find him. He gives you a frog.",
                add_item=items.frog,
                move_to=state.places.places_dict["market"],
                new_person=state.persons.persons_dict["wizard"],
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You find the wizard. He is telling a woman how he "
                "cursed the icicles in the arctic.",
                move_to=state.places.places_dict["market"],
                new_person=state.persons.persons_dict["wizard"],
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You find the wizard. He is telling a woman about "
                "a mesmerizing pearl.",
                move_to=state.places.places_dict["market"],
                new_person=state.persons.persons_dict["wizard"],
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You see the wizard emptying a flask into a well.",
                move_to=state.places.places_dict["market"],
                new_person=state.persons.persons_dict["wizard"],
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "You look for the wizard, but the assassins are looking for you.",
            die=True,
        ), weight=1)

        if state.persons.persons_dict["st_george"].alive:
            if state.persons.persons_dict["wizard"].alive:
                self.outcomes.add(Outcome(state,
                    "You can't find the wizard, but you find St. George. "
                    "He says the wizard is a little testy.",
                    new_person=state.persons.persons_dict["st_george"],
                ), weight=1)
            else:
                self.outcomes.add(Outcome(state,
                    "You can't find the wizard since the wizard is dead, "
                    "but you find St. George. He says the wizard was a "
                    "complicated man.",
                    new_person=state.persons.persons_dict["st_george"],
                ), weight=1)


class LeaveInAHuff(Action):

    slot = "c"

    def __init__(self, state):
        super(LeaveInAHuff, self).__init__(state)
        self.name = "Leave in a huff."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            None,
            move=1,
        ), weight=49)

        if state.character.place in state.places.populated:
            self.outcomes.add(Outcome(state,
                "The huffy manner in which you left causes some assassins to "
                "notice you. They assassinate you.",
                die=True,
            ), weight=1)


class LeaveInAPuff(Action):

    slot = "c"

    def __init__(self, state):
        super(LeaveInAPuff, self).__init__(state)
        self.name = "Leave in a puff."
        self.combat_action = True

    def execute(self, state):
        place = state.character.place 
        while place == state.character.place:
            place = state.places.places_dict[random.choice(
               list(state.places.places_dict.keys()))]

        self.outcomes.add(Outcome(state,
            None,
            move_to=place,
        ), weight=3)


class FleeTheScene(Action):

    slot = "c"

    def __init__(self, state):
        super(FleeTheScene, self).__init__(state)
        self.name = "Flee the scene."

    def execute(self, state):
        self.outcomes.add(Outcome(state,
            None,
            move=2,
            new_person=None,
            unthreat=True,
        ), weight=3)


class GoTo(Action):

    slot = "c"

    def __init__(self, state, place, specific_dest=None):
        super(GoTo, self).__init__(state)
        if specific_dest:
            self.dest = specific_dest
        else:
            self.dest = random.sample(place.connections, 1)[0]
        self.name = "Go to " + str(self.dest) + "."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            None,
            move_to=self.dest,
            new_person=None,
        ), weight=3)

        if self.dest == state.places.places_dict["dark_alley"]:

            self.outcomes.add(Outcome(state,
                "You go into a dark alley. You do not come out.",
                die=True,
            ), weight=3)

        if state.character.place in state.places.populated:

            self.outcomes.add(Outcome(state,
                "On your way out of {0} you run headlong into some guards. "
                "They say you must be a lunatic.".format(state.character.place),
                new_person=state.persons.persons_dict["guards"],
                threat=True,
                topic="oblivious",
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "As you are entering {0}, you notice an assassin following "
                "you.".format(self.dest),
                move_to=self.dest,
                threat=True,
                new_person=state.persons.persons_dict["assassin"],
            ), weight=2)

            if state.character.has_item(items.cat):
                self.outcomes.add(Outcome(state,
                    "Your cat notices an assassin approaching. You do not.",
                    clover=True,
                    die=True,
                ), weight=1)

            overhear_template = "As you leave " + state.character.place.name + \
                " you overhear {0}."

            self.outcomes.add(Outcome(state,
                overhear_template.format("someone say that the town's well "
                    "has been poisoned"),
                move_to=self.dest,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                overhear_template.format("someone talking about how nice St. "
                    "George was to them"),
                move_to=self.dest,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                overhear_template.format("a man talking being a pirate on "
                    "Lord Arthur's ship"),
                move_to=self.dest,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                overhear_template.format("a woman asking around about "
                    "assassins"),
                move_to=self.dest,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                overhear_template.format("some men are planning a trip to "
                    "the woods to look for nymphs"),
                move_to=self.dest,
            ), weight=1)


class RunLikeTheDevil(Action):

    slot = "c"

    def __init__(self, state):
        super(RunLikeTheDevil, self).__init__(state)
        self.name = "Run like the Devil."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The Devil is very fast, so you manage to get away.",
            move=2,
            succeed=True,
        ), weight=9)

        self.outcomes.add(Outcome(state,
            "You run like the Devil, but " + state.character.person.name +
            " also run" + persons.get_tense(state.character.person) + 
            " like the Devil "
            "and overtake" + persons.get_tense(state.character.person) + " you.",
            die=True,
        ), weight=1)

        if state.character.person == state.persons.persons_dict["felicity"] and \
           state.persons.persons_dict["felicity"].attracted > 9:
            self.outcomes.add(Outcome(state,
                "The Devil is very fast and not very fat, so you manage to get "
                "away unmarried.",
                new_person=None,
                move=2,
                succeed=True,
                flirt=(state.persons.persons_dict["felicity"], -666),
            ), weight=666)

        if state.character.person == \
           state.persons.persons_dict["olga"] and \
           state.persons.persons_dict["olga"].attracted > 9:
            self.outcomes.add(Outcome(state,
                "The Devil is pretty fast but Olga is prettier and faster. "
                "She strangles you to death.",
                die=True,
                flirt=(state.persons.persons_dict["olga"], -666),
            ), weight=666)

            self.outcomes.add(Outcome(state,
                "The Devil is very fast, so you manage to get away unmarried.",
                new_person=None,
                move=2,
                succeed=True,
                flirt=(state.persons.persons_dict["olga"], -666)
            ), weight=666)


class WaddleLikeGod(Action):

    slot = "c"

    def __init__(self, state):
        super(WaddleLikeGod, self).__init__(state)
        self.name = "Waddle like God."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "God is very slow, so you don't manage to get away.",
            die=True,
        ), weight=9)

        self.outcomes.add(Outcome(state,
            "You waddle like God, but " +
            state.character.person.name +
            " also waddle" +
            persons.get_tense(state.character.person) + " like God and "
            "fail to overtake" +
            persons.get_tense(state.character.person) + " you. You "
            "slowly get away.",
            move=1,
        ), weight=1)


class WanderTheCountryside(Action):

    slot = "c"

    def __init__(self, state):
        super(WanderTheCountryside, self).__init__(state)
        self.name = "Wander the countryside."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Not all those who wander are lost, but you are.",
            fail=True,
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a mob of peasants about to perform a witch burning.",
            actions=[(SaveTheWitch(state), 30)],
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a mob of peasant children about to perform a cat "
            "burning.",
            actions=[(SaveTheCat(state), 30)],
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "All of the peasants you meet talk about Lord Bartholomew like "
            "he's God's gift to the world.",
            new_person=None,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a mob of peasants burning Lord Daniel in effigy.",
            new_person=None,
        ), weight=1)

        if state.persons.persons_dict["simple_peasant"].alive:
            self.outcomes.add(Outcome(state,
                "You find a simple peasant.",
                new_person=state.persons.persons_dict["simple_peasant"],
            ), weight=1)

        if state.persons.persons_dict["peasant_lass"].alive:
            self.outcomes.add(Outcome(state,
                "You find a peasant lass.",
                new_person=state.persons.persons_dict["peasant_lass"],
            ), weight=1)


class Swim(Action):

    slot = "c"

    def __init__(self, state):
        super(Swim, self).__init__(state)
        self.name = "Swim."

    def execute(self, state):

        if type(self) == JustKeepSwimming or type(self) == KeepSwimming:
            next_action = JustKeepSwimming(state)
        else:
            next_action = KeepSwimming(state)

        self.outcomes.add(Outcome(state,
            "You manage to stay afloat.",
            actions=[(next_action, 10000)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You keep your head up.",
            actions=[(next_action, 10000)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You see a ship in the distance. You are unable to reach it.",
            actions=[(next_action, 10000)],
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You make very little progress.",
            actions=[(next_action, 10000)],
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You die of dehydration.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are in way over your head.",
            die=True,
        ), weight=1)


class KeepSwimming(Swim):

    slot = "c"

    def __init__(self, state):
        super(KeepSwimming, self).__init__(state)
        self.name = "Keep swimming."

    def execute(self, state):
        super(KeepSwimming, self).execute(state)

        self.outcomes.add(Outcome(state,
            "You die of exhaustion.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are picked up by Lord Arthur's pirate ship.",
            move_to=state.places.places_dict["pirate_ship"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a mermaid sitting on a rock.",
            move_to=state.places.places_dict["mermaid_rock"],
            new_person=state.persons.persons_dict["mermaid"],
        ), weight=1)

        if state.character.has_item(items.cat):

            self.outcomes.add(Outcome(state,
                "Your cat dies.",
                actions=[(JustKeepSwimming(state), 10000)],
                remove_item=items.cat,
                fail=True,
            ), weight=1)


class JustKeepSwimming(KeepSwimming):

    slot = "c"

    def __init__(self, state):
        super(JustKeepSwimming, self).__init__(state)
        self.name = "Just keep swimming."

    def execute(self, state):
        super(JustKeepSwimming, self).execute(state)

        self.outcomes.add(Outcome(state,
            "You die of exhaustion.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You finally find land.",
            move_to=state.places.places_dict["docks"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "As you swim, you notice the water getting colder. You eventually "
            "find ice.",
            move_to=state.places.places_dict["arctic"],
            fail=True
        ), weight=1)


class E4(Action):

    slot = "c"

    def __init__(self, state):
        super(E4, self).__init__(state)
        self.name = "E4."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You lose the game. Lord Carlos celebrates his victory by "
            "assassinating you.",
            die=True,
        ), weight=1)


class ChallengeHimToAGameOfChess(Action):
    """
    Used with Lord Carlos and Lord Bartholomew 
    """

    slot = "c"

    def __init__(self, state):
        super(ChallengeHimToAGameOfChess, self).__init__(state)
        self.name = "Challenge him to a game of chess."
        self.combat_action = True

    def execute(self, state):

        if state.character.person == state.persons.persons_dict["lord_carlos"]:

            self.outcomes.add(Outcome(state,
                "Lord Carlos says he has no time to waste on fools, but "
                "when you imply that he's afraid he'll lose, "
                "he has his servants set up a chessboard.",
                actions=[(A3(state), 10000),
                         (Nf3(state), 10000),
                         (E4(state), 10000),
                         (AskForADraw(state), 10000)],
            ), weight=1)

        if state.character.person == state.persons.persons_dict["lord_bartholomew"]:

            self.outcomes.add(Outcome(state,
                "Lord Bartholomew says there's always time for a little fun "
                "in his life. He takes you to his chess parlor and sets up "
                "a board.",
                #actions=[(A3(state), 10000),
                #         (Nf3(state), 10000),
                #         (E4(state), 10000),
                #         (TurnBoard(state), 10000)],
            ), weight=1)


class WalkThePlank(Action):

    slot = "c"

    def __init__(self, state):
        super(WalkThePlank, self).__init__(state)
        self.name = "Walk the plank."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You walk across one of the planks on the deck.",
            topic="walking the plank",
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You fall into the ocean.",
            move_to=state.places.places_dict["ocean"],
        ), weight=3)

        self.outcomes.add(Outcome(state,
            "Lord Arthur's pet shark emerges from the depths and snatches you "
            "as you fall.",
            clover=True,
            die=True,
        ), weight=1)


class TrashThePlace(Action):

    slot = "c"

    def __init__(self, state):
        super(TrashThePlace, self).__init__(state)
        self.name = "Trash the place."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            None,
            trash_place=state.character.place,
            succeed=True,
            move_to=state.character.place,
        ), weight=4)

        self.outcomes.add(Outcome(state,
            "You find a fancy red cloak in the wreckage.",
            add_item=items.fire_proof_cloak,
            trash_place=state.character.place,
            succeed=True,
            move_to=state.character.place,
        ), weight=1)

        if state.character.place == state.places.places_dict["market"]:
            self.outcomes.add(Outcome(state,
                "You get trampled to death by a spooked horse.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You are arrested on charges of lunacy and get "
                "thrown in prison with the other lunatics.",
                move_to=state.places.places_dict["prison"],
                new_person=state.persons.persons_dict["other_lunatics"],
            ), weight=1)

        if state.character.place == state.places.places_dict["wizards_lab"]:
            if not state.character.has_item(items.fire_proof_cloak):
                self.outcomes.add(Outcome(state,
                    "One of the potions you break blows up the lab.",
                    die=True,
                ), weight=2)
            else:
                self.outcomes.add(Outcome(state,
                    "One of the potions you break blows up the lab, but "
                    "Your fancy red cloak protects you from annihilation.",
                ), weight=2)

            self.outcomes.add(Outcome(state,
                "You snap a staff in half and a dark spirit escapes from the "
                "staff.",
                die=True,
            ), weight=2)

            if state.character.person == state.persons.persons_dict["wizard"]:
                self.outcomes.add(Outcome(state,
                    "The wizard incinerates you.",
                    die=True,
                ), weight=20)

            if state.character.place == state.places.places_dict["wizards_lab"] and \
               state.character.person != state.persons.persons_dict["wizard"] and \
               state.persons.persons_dict["wizard"].alive:
                self.outcomes.add(Outcome(state,
                    "The wizard walks in and starts yelling obscenities.",
                    new_person=state.persons.persons_dict["wizard"],
                    threat=True,
                ), weight=1)


# D slot actions


class TurnBoard(Action):
    """
    Used for chess games against Lord Bartholomew
    """

    slot = "d"

    def __init__(self, state):
        super(TurnBoard, self).__init__(state)
        self.name = "Play poorly and turn the board around once you're losing."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew laughs and concedes.",
            succeed=True,
        ), weight=1)


class Donna(Action):
    """
    Used when guessing Eve's name
    """

    slot = "d"

    def __init__(self, state):
        super(Donna, self).__init__(state)
        self.name = "\"Donna.\""

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "She snakes her head. \"What a shame. I was starting to like "
            "you.\" She throws a dagger into your guts.",
            die=True,
        ), weight=1)


class AskForAsylum(Action):

    slot = "d"

    def __init__(self, state):
        super(AskForAsylum, self).__init__(state)
        self.name = "Ask for asylum."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Bartholomew grants you asylum and gives you work shoveling "
            "coal into ovens. After a few years, you fall in love with a cook "
            "who also works in the kitchens. You eventually win her heart and "
            "live happily ever after.",
            win=True,
        ), weight=1)

        if state.character.place in state.places.burnable:
            self.outcomes.add(Outcome(state,
                "Lord Bartholomew grants you asylum, but his manor is soon "
                "stormed by Lord Daniel's guards. You are arrested for "
                "treason.",
                burn_place=state.character.place,
                kill=state.persons.persons_dict["lord_bartholomew"],
                move_to=state.places.places_dict["prison"],
            ), weight=1000)
        else:
            self.outcomes.add(Outcome(state,
                "Lord Bartholomew grants you asylum, but his manor is soon "
                "stormed by Lord Daniel's guards. You are arrested for "
                "treason.",
                kill=state.persons.persons_dict["lord_bartholomew"],
                move_to=state.places.places_dict["prison"],
            ), weight=1000)


class AskForADraw(Action):

    slot = "d"

    def __init__(self, state):
        super(AskForADraw, self).__init__(state)
        self.name = "Ask for a draw."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Carlos has you drawn and quartered for your impudence.",
            die=True,
        ), weight=1)


class MakeItHard(Action):

    slot = "d"

    def __init__(self, state):
        super(MakeItHard, self).__init__(state)
        self.name = "Make it hard for Lord Carlos to kill you."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Lord Carlos is no slouch, he kills you anyway.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Screaming gibberish in his face only stuns him for so long.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Carlos is better at killing than you are at not "
            "being killed.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You prevent Lord Carlos from killing you, but he calls in "
            "one of his assassins and has her do it.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You tell Lord Carlos that you're his son, he doesn't care.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You spit in his eyes.",
            actions=[RunLikeTheDevil(state), 666],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You hide behind a painting Lord Carlos that is loathe "
            "to destroy. He loathes you more.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "He kills you as you try to get into an suit of "
            "armor.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You flee the country.",
            move_to=state.places.places_dict["arctic"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You flee to the woods and hide in a deep cave... "
            "perhaps a little too deep.",
            move_to=state.places.places_dict["cave"],
        ), weight=1)


class ShowYourForeignCoin(Action):

    slot = "d"

    def __init__(self, state):
        super(ShowYourForeignCoin, self).__init__(state)
        self.name = "Show him your shiny foreign coin."

    def execute(self, state):

        if state.character.person == state.persons.persons_dict["lord_bartholomew"]:

            self.outcomes.add(Outcome(state,
                "\"Damn, son. Where'd you find this?\" Lord Bartholomew asks. "
                "He doesn't wait for your answer. Instead he takes the "
                "coin and gives you a small fortune.",
                remove_item=items.foreign_coin,
                get_money=money.small_fortune,
            ), weight=1)

        elif state.character.person == state.persons.persons_dict["lord_daniel"]:

            self.outcomes.add(Outcome(state,
                "Lord Daniel has his guards seize you and take your coin. "
                "They then defenestrate you. Fortunately, you land in a pile "
                "hay.",
                move_to=state.places.places_dict["streets"],
                remove_item=items.foreign_coin,
            ), weight=1)


class DouseHerWithYourLovePotion(Action):

    slot = "d"

    def __init__(self, state, lady):
        super(DouseHerWithYourLovePotion, self).__init__(state)
        self.lady = lady
        self.name = "Douse " + self.lady.name + " with your love potion."

    def execute(self, state):

        if state.character.person == state.persons.persons_dict["mermaid"]:

            self.outcomes.add(Outcome(state,
                "The mermaid falls madly in love with you. "
                "You run into the mermaid problem, but {0}, "
                "so you still live happily ever after."
                ".".format(random.choice([
                    "she has a mouth",
                    "she has breasts",
                    "she is fun to be around",
                    "helps you adjust to life at sea",
                    ])),
                win=True,
            ), weight=1)

        elif state.character.person == state.persons.persons_dict["eve"]:

            self.outcomes.add(Outcome(state,
                "She dodges the potion and starts screaming. You are "
                "soon assassinated.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Carlos' daughter falls madly in love with you. "
                "You flee to another country and get married. She is fun "
                "to be around since she's magically enchanted to always be "
                "nice to you. However, she is still horrible to everyone "
                "else. So your life is always filled with adventure and "
                "danger.",
                win=True,
            ), weight=1)

        elif state.character.person == state.persons.persons_dict["nymph_queen"]:
            
            self.outcomes.add(Outcome(state,
                "You miss. The nymph queen giggles and turns you into a shrub.",
                score=100,
                lose=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "The nymph queen falls madly in love with you. All of the "
                "woodland creatures attend your wedding.",
                win=True,
            ), weight=1)

        else:

            self.outcomes.add(Outcome(state,
                "You fumble around in your bags looking for the love potion, "
                "but your lack of organization hinders you.",
            ), weight=1)



class DrugHerWithYourLovePotion(Action):

    slot = "d"

    def __init__(self, state, lady):
        super(DrugHerWithYourLovePotion, self).__init__(state)
        self.lady = lady
        self.name = "Drug " + self.lady.name + " with your love potion."

    def execute(self, state):

        if state.character.person == state.persons.persons_dict["olga"]:

            self.outcomes.add(Outcome(state,
                "The pretty lady notices you slipping the potion into her "
                "drink. She stabs you in the gut and leaves.",
                die=True,
            ), weight=1)

            if state.persons.persons_dict["blind_bartender"].alive:
                self.outcomes.add(Outcome(state,
                    "You distract her by pointing out a wart on the blind "
                    "bartender's nose. After she takes a drink, she looks "
                    "back at the blind bartender and falls in love with him.",
                    new_person=None,
                    fail=True,
                    remove_item=items.love_potion,
                ), weight=1)

            self.outcomes.add(Outcome(state,
                "You manage to drug her. She becomes very flirty with you.",
                flirt=(state.persons.persons_dict["olga"], 10),
                remove_item=items.love_potion,
                succeed=True,
            ), weight=1)


class LookForNymphs(Action):

    slot = "d"

    def __init__(self, state):
        super(LookForNymphs, self).__init__(state)
        self.name = "Look for nymphs."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You find the nymph queen {0}. Her beauty is "
            "{1}.".format(random.choice(["watering flowers in a meadow",
                                         "levitating above a pond",
                                         "feeding a stag",
                                         "teaching a goblin to read",
                                         "tanning in a ray of sunshine",
                                         "doing tai chi in a meadow"]),
                          random.choice(["intoxicating", "dazzling",
                                         "exhilarating", "overwhelming",
                                         "only rivaled by her attractiveness."
                                         ])),
            new_person=state.persons.persons_dict["nymph_queen"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You see some nymphs bathing in a waterfall, but they hex "
            "you for gawking. You climb a ridge and throw yourself "
            "to your death.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You see some nymphs but they fade away before you can get close.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You slip and tumble into a hole in the ground.",
            move_to=state.places.places_dict["cave"],
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "{0}.".format(random.choice(["You can't find any", 
                       "Your efforts to find nymphs are fruitless",
                       "You find an apple tree instead",
                       "You don't see any nymphs. Only trees",
                      ])),
        ), weight=4)

        self.outcomes.add(Outcome(state,
            "You find a witch instead.",
            new_person=state.persons.persons_dict["witch"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You notice a man in a dark cloak stalking you.",
            new_person=state.persons.persons_dict["assassin"],
            threat=True,
        ), weight=1)


class GiveCat(Action):

    slot = "d"

    def __init__(self, state, woman):
        super(GiveCat, self).__init__(state)
        self.woman = woman
        self.name = "Give " + woman.name + " your cat."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "She thinks the cat is adorable.",
            remove_item=items.cat,
            flirt=(state.character.person, 3),
        ), weight=3)


class GiveFlowers(Action):

    slot = "d"

    def __init__(self, state, woman):
        super(GiveFlowers, self).__init__(state)
        self.woman = woman
        self.name = "Give " + woman.name + " your bouquet of flowers."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "She is pleased with your gift.",
            remove_item=items.bouquet_of_flowers,
            flirt=(state.character.person, 3),
        ), weight=3)


class Loot(Action):

    slot = "d"

    def __init__(self, state):
        super(Loot, self).__init__(state)
        self.name = "Loot."

    def execute(self, state):

        item = random.choice(state.persons.persons_dict["local_merchant"].get_sells() +
                             state.persons.persons_dict["wealthy_merchant"].get_sells())

        if item.name[0] in "aeiou":
            self.outcomes.add(Outcome(state,
                "You get away with an " + item.name + ".",
                add_item=item,
                move=1,
            ), weight=3)
        else:
            self.outcomes.add(Outcome(state,
                "You get away with a " + item.name + ".",
                add_item=item,
                move=1,
            ), weight=3)

        self.outcomes.add(Outcome(state,
            "You are killed by a merchant defending her store.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You are arrested for attempting to steal an apple.",
            move_to=state.places.places_dict["prison"],
            new_person=state.persons.persons_dict["other_lunatics"],
        ), weight=1)


class WatchAPlay(Action):

    slot = "d"

    def __init__(self, state):
        super(WatchAPlay, self).__init__(state)
        self.name = "Watch a play."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The play satirizes Lord Daniel's policy on lunacy. "
            "The actors are arrested at the end of the play.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The play portrays Lord Bartholomew in a glorious light. The "
            "audience is very pleased and claps for so long that it becomes "
            "awkward.",
        ), weight=1)

        if state.places.places_dict["market"] in state.places.burnable:

            self.outcomes.add(Outcome(state,
                "The play is put on by some of Lord Daniel's guards. The "
                "acting is horrible and the play portrays Lord Bartholomew in "
                "a negative light. The audience starts a riot.",
                new_person=state.persons.persons_dict["guards"],
                actions=[
                         (Attack(state, state.persons.persons_dict["guards"]), 10000),
                         (BurnThePlaceToTheGround(state, state.places.places_dict["market"]), 10000),
                         (TrashThePlace(state), 10000),
                         (Loot(state), 10000)
                         ],
            ), weight=1)

        else:

            self.outcomes.add(Outcome(state,
                "The play is put on by some Lord Daniel's guards, the acting is "
                "terrible and the play portrays Lord Bartholomew in a negative "
                "light. The audience starts a riot.",
                new_person=state.persons.persons_dict["guards"],
                actions=[
                         (Attack(state, state.persons.persons_dict["guards"]), 10000),
                         (TrashThePlace(state), 10000),
                         (Loot(state), 10000)
                         ],
            ), weight=1)



class FlauntYourWealth(Action):

    slot = "d"

    def __init__(self, state):
        super(FlauntYourWealth, self).__init__(state)
        self.name = "Flaunt your wealth."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The local peasants mob you. They take your money and your life.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The guards notice you and conclude you must be rich.",
            new_person=state.persons.persons_dict["guards"],
            actions=[(TellThemYouAreALunatic(state), 10000)],
        ), weight=1)

        if state.persons.persons_dict["st_george"].alive:
            self.outcomes.add(Outcome(state,
                "St. George notices you and warns you of the dangers of "
                "flamboyance.",
                new_person=state.persons.persons_dict["st_george"],
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "Some truly wealthy people see you and sneer.",
            fail=True,
        ), weight=1)


class FreezeToDeath(Action):

    slot = "d"

    def __init__(self, state):
        super(FreezeToDeath, self).__init__(state)
        self.name = "Freeze to death."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "While you're trying to freeze to death, you notice some "
            "penguins nearby.",
            actions=[(Yell(state, "that there aren't penguins in the arctic"), 100)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "While you are waiting to freeze to death, you notice "
            "the wizard dropping off a boatload of penguins.",
            actions=[(Yell(state, "Don't leave without me"), 10000)],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "It's easy.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You get sleepy.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You do.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You freeze to death.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You get mauled by a polar bear before you get a chance to "
            "freeze to death.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Some Inuits save you from the cold and take you back to land "
            "in a kayak. They also give you a fish.",
            add_item=items.fish,
            move_to=state.places.places_dict["countryside"],
            succeed=True,
        ), weight=2)


class Panic(Action):

    slot = "d"

    def __init__(self, state):
        super(Panic, self).__init__(state)
        self.name = "Panic!"
        self.combat_action = True

    def execute(self, state):
        #under revision 
        """
        options = state.places.Place.instances - set([state.character.place])
        place = random.sample(options, 1)[0]

        self.outcomes.add(Outcome(state,
            "You don't remember what you did, but you seem to have gotten "
            "away.",
            move_to=place,
            succeed=True,
        ), weight=1)
        """

        self.outcomes.add(Outcome(state,
            "Panicking doesn't help.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Panicking doesn't save you.",
            die=True,
        ), weight=1)


class SingASong(Action):

    slot = "d"

    def __init__(self, state, topic=None):
        super(SingASong, self).__init__(state)
        self.topic = topic
        if topic:
            self.name = "Sing a song about {0}.".format(topic)
        else:
            self.name = "Sing a song."

    def execute(self, state):

        if state.character.place == state.places.places_dict["church"]:
            self.outcomes.add(Outcome(state,
                "A priestess finds your lyrics {0} and has you thrown out of "
                "the church.".format(random.choice(
                    ["blasphemous", "crude", "idiotic", "offensive",
                     "mildly offensive", "uncreative"])),
                fail=True,
                move_to=state.places.places_dict["streets"],
            ), weight=10)

        if state.character.place == state.places.places_dict["docks"]:
            self.outcomes.add(Outcome(state,
                "You are soon joined in song by a gang of drunken pirates. "
                "They spill rum on you and ruin your song.",
                new_person=state.persons.persons_dict["pirates"],
            ), weight=5)

        if state.character.place == state.places.places_dict["upstairs"] and \
           state.character.person == state.persons.persons_dict["olga"]:
            self.outcomes.add(Outcome(state,
                "You sing a romantic ballad. Olga is impressed.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=20)

            self.outcomes.add(Outcome(state,
                "Olga interrupts your song by kissing you.",
                flirt=(state.persons.persons_dict["olga"], 2),
            ), weight=20)

        if state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "This is no place for merry-making. You are soon "
                "assassinated.",
                die=True,
            ), weight=5)

            self.outcomes.add(Outcome(state,
                "Your singing alerts Lord Carlos' assassins to your "
                "presence.",
                die=True,
            ), weight=10)

        if state.character.place == state.places.places_dict["mermaid_rock"]:
            self.outcomes.add(Outcome(state,
                "As you sing, a ship sails by. The "
                "captain is tied to the mast. He is not "
                "impressed.",
                fail=True,
            ), weight=10)

            if state.character.person == state.persons.persons_dict["mermaid"]:
                self.outcomes.add(Outcome(state,
                    "The mermaid enjoys your singing and sings with you.",
                    flirt=(state.persons.persons_dict["mermaid"], 2),
                ), weight=20)

                self.outcomes.add(Outcome(state,
                    "The mermaid is displeased with your choice of lyrics and "
                    "pushes you into the ocean.",
                    move_to=state.places.places_dict["ocean"],
                    flirt=(state.persons.persons_dict["mermaid"], -1),
                    fail=True,
                ), weight=10)

        if state.character.place in state.places.populated:

            self.outcomes.add(Outcome(state,
                "Your singing is too loud for you to hear the footsteps of an "
                "assassin. He assassinates you.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "A crowd gathers to hear your music and throws you a small "
                "fortune in coins.",
                get_money=money.small_fortune,
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "The locals hate your voice and soon mob you.",
                clover=True,
                die=True,
            ), weight=1)

            if not state.character.person:
                self.outcomes.add(Outcome(state,
                    "While you're singing, some men in black cloaks start to "
                    "edge their way toward you.",
                    new_person=state.persons.persons_dict["assassins"],
                    threat=True,
                ), weight=3)

        if self.topic == "assassins":
            self.outcomes.add(Outcome(state,
                "An assassin notices you singing about assassins and "
                "assassinates you",
                die=True,
            ), weight=5)

        if state.character.person == state.persons.persons_dict["wizard"]:
            self.outcomes.add(Outcome(state,
                "The wizard complains that you are singing off-key. He turns "
                "you into a frog and steps on you.",
                die=True,
            ), weight=20)

        if not state.character.place in state.places.locked:

            self.outcomes.add(Outcome(state,
                "You wander aimlessly as you work your way through an epic "
                "ballad.",
                move=1,
            ), weight=1)

        if self.topic is None:

            self.outcomes.add(Outcome(state,
                "You sing a song about Lord Arthur, captain of the pirates.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You sing a song about Lord Bartholomew, leader of the "
                "peasants.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You sing a song about Lord Carlos, kingpin of the assassins.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You sing a song about Lord Daniel, leader of the guards.",
            ), weight=1)

        self.outcomes.add(Outcome(state,
            "You sing your favorite song. No one cares.",
        ), weight=2)


class SwingYourCat(Action):

    slot = "d"

    def __init__(self, state):
        super(SwingYourCat, self).__init__(state)
        self.name = "Swing your cat."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "Your cat manages to escape.",
            remove_item=items.cat,
        ), weight=2)

        if state.character.place in state.places.populated:

            self.outcomes.add(Outcome(state,
                "You hit an assassin with your cat.",
                new_person=state.persons.persons_dict["assassin"],
                threat=True,
            ), weight=3)

            self.outcomes.add(Outcome(state,
                "The local guards notice you swinging your cat around and "
                "conclude that you must be a lunatic.",
                new_person=state.persons.persons_dict["guards"],
                threat=True,
                topic="mad",
            ), weight=3)


class LookThroughSomeTrash(Action):

    slot = "d"

    def __init__(self, state):
        super(LookThroughSomeTrash, self).__init__(state)
        self.name = "Look through some trash."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You attempt to look through the trash, but an assassin takes it "
            "out.",
            die=True,
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "While you are searching through the trash you find a somewhat "
            "agreeable cat.",
            add_item=items.cat,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The local guards see you searching through the trash and accuse "
            "you of being a lunatic.",
            add_item=items.cat,
            new_person=state.persons.persons_dict["guards"],
            threat=True,
            topic="curious",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You do not find anything useful in the trash.",
            fail=True,
            topic="trash",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a mirror in the trash. You see nothing of value.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a bad smell.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find an old ax.",
            succeed=True,
            add_item=items.ax,
        ), weight=1)


class DanceAJig(Action):

    slot = "d"

    def __init__(self, state):
        super(DanceAJig, self).__init__(state)
        self.name = "Dance a jig."

    def execute(self, state):

        if state.character.place != state.places.places_dict["ocean"]:
            self.outcomes.add(Outcome(state,
                "You get sweaty.",
            ), weight=9)

            self.outcomes.add(Outcome(state,
                "You have a grand old time.",
            ), weight=5)

            if state.character.place != state.places.places_dict["void"]:
                self.outcomes.add(Outcome(state,
                    "You step in a puddle and get your britches wet.",
                    fail=True,
                ), weight=3)

                self.outcomes.add(Outcome(state,
                    "You break your ankle and fall to the ground. You catch "
                    "yourself but break your wrist, hit your head on the "
                    "ground and your neck.",
                    die=True,
                ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "You drown trying to dance.",
                die=True,
            ), weight=5)

            self.outcomes.add(Outcome(state,
                "You swim a jig",
                topic="jigs",
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You can't dance a jig, you're in the ocean.",
                fail=True,
            ), weight=2)

        if state.character.place == state.places.places_dict["woods"]:
            fae = random.choice(["fairaes", "sprites",
                                 "pixies", "dryads",
                                 "nymphs", "spirits"])
            self.outcomes.add(Outcome(state,
                "Some {0} dance with you and then fade away.".format(fae),
            ), weight=20)

            self.outcomes.add(Outcome(state,
                "Some goblins dance with you and then kill you.",
                die=True,
            ), weight=3)

        if (state.character.place in state.places.town and \
           state.character.place not in state.places.locked) or \
           state.character.place == state.places.places_dict["countryside"]:
            self.outcomes.add(Outcome(state,
                "The local peasants are entertained by your antics and toss "
                "you some coins.",
                get_money=money.pittance,
            ), weight=10)

            self.outcomes.add(Outcome(state,
                "Many peasants start dancing with you and begin singing about "
                "Lord Bartholomew.",
            ), weight=15)

        if state.character.place == state.places.places_dict["countryside"]:
            self.outcomes.add(Outcome(state,
                "Many peasants start dancing with you and begin singing an "
                "ode to Lord Bartholomew.",
            ), weight=25)

        if state.character.person == state.persons.persons_dict["mermaid"]:
            self.outcomes.add(Outcome(state,
                "She laughs and claps and seems completely in awe of your "
                "legs.",
            ), weight=1)

        if state.character.person == state.persons.persons_dict["guards"]:  # TODO these don't happen 
                                                # because this is not a 
                                                # combat action
            self.outcomes.add(Outcome(state,
                "\"We got a dancer,\" one of them says. They throw you in "
                "prison.",
                move_to=state.places.places_dict["prison"],
                new_person=state.persons.persons_dict["other_lunatics"],
            ), weight=100)

            self.outcomes.add(Outcome(state,
                "\"Eh, he's all right,\" one of them says. The guards "
                "go on their way.",
                topic="guards",
            ), weight=100)

        if state.character.place == state.places.places_dict["arctic"]:
            self.outcomes.add(Outcome(state,
                "You get sweaty. The sweat freezes on you. "
                "You freeze to death.",
                die=True,
            ), weight=30)

        if state.character.place == state.places.places_dict["cave"]:
            self.outcomes.add(Outcome(state,
                "Dancing fails to cheer you up.",
                fail=True,
            ), weight=10)

            self.outcomes.add(Outcome(state,
                "You slip on a rock and fall to your death.",
                clover=True,
                die=True,
            ), weight=15)

        if state.character.place == state.places.places_dict["tavern"] or \
           state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "Some assassins immediately notice you dancing and assassinate "
                "you.",
                die=True,
            ), weight=15)


class Drown(Action):

    slot = "d"

    def __init__(self, state):
        super(Drown, self).__init__(state)
        self.name = "Drown."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You drown.",
            die=True,
        ), weight=1)


class Sink(Drown):

    def __init__(self, state):
        super(Sink, self).__init__(state)
        self.name = "Sink."


class SaveTheCat(Action):

    slot = "d"

    def __init__(self, state):
        super(SaveTheCat, self).__init__(state)
        self.name = "Save the cat."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You escape with the cat.",
            succeed=True,
            add_item=items.cat,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You escape with the cat, but the cat escapes you.\n"
            "You almost got a cat",
            fail=True,
        ), weight=1)


class YellAPiratePhrase(Action):

    slot = "d"

    def __init__(self, state):
        super(YellAPiratePhrase, self).__init__(state)
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

    def execute(self, state):

        if state.persons.persons_dict["lord_arthur"].alive:
            self.outcomes.add(Outcome(state,
                "Lord Arthur has you thrown off the ship.",
                move_to=state.places.places_dict["ocean"],
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Lord Arthur tells you that no true pirate "
                "says \"{0}.\"".format(
                    self.phrase),
                new_person=state.persons.persons_dict["lord_arthur"],
                fail=True,
            ), weight=1)

            if state.character.is_employed_by(state.persons.persons_dict["lord_arthur"]):
                self.outcomes.add(Outcome(state,
                    "Lord Arthur tells you that you are no longer a member of "
                    "the crew.",
                    remove_employer=state.persons.persons_dict["lord_arthur"],
                    fail=True,
                ), weight=1)
            else:
                self.outcomes.add(Outcome(state,
                    "Lord Arthur is impressed by your enthusiasm and makes "
                    "you a member of the crew.",
                    new_person=state.persons.persons_dict["lord_arthur"],
                    add_employer=state.persons.persons_dict["lord_arthur"],
                    topic="piracy",
                ), weight=1)
        else:
            self.outcomes.add(Outcome(state,
                "Since Lord Arthur is dead, you get away with it.",
                succeed=True,
            ), weight=1)
        

class SaveTheWitch(Action):

    slot = "d"

    def __init__(self, state):
        super(SaveTheWitch, self).__init__(state)
        self.name = "Save the witch."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You have trouble untying her and the peasants kill you for "
            "meddling.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You escape with her. She thanks you and gives you "
            "a deep-cave newt before you part ways.",
            add_item=items.deep_cave_newt,
            move_to=state.places.places_dict["woods"],
            topic=random.choice(["heroism", "newts", "witches"]),
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "In your rush to save the witch, you trip over a rock. "
            "You wake up near the smoldering remains of the witch's "
            "pyre.",
            fail=True,
        ), weight=1)


class DoSomeFarmWork(Action):

    slot = "d"

    def __init__(self, state):
        super(DoSomeFarmWork, self).__init__(state)
        self.name = "Do some farm work."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You spend a season picking apples.",
            get_money=money.pittance,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You spend a season milking cows for a farmer woman. "
            "She keeps trying to marry you to her attractive "
            "daughter, but her daughter is having none of it.",
            get_money=money.pittance,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You spend a season bailing hay.",
            get_money=money.pittance,
            add_item=items.pitchfork,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You spend a season harvesting wheat. You enjoy the change of "
            "pace.",
            get_money=money.pittance,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You spend a season slaughtering hogs. You find a shiny foreign "
            "coin in one of the hogs.",
            get_money=money.pittance,
            add_item=items.foreign_coin,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find work, but the assassins find you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "During your duties, you get kicked by a mule. You somehow don't "
            "die.",
            get_money=money.pittance,
            topic="mules",
        ), weight=1)


class DoSomeGambling(Action):

    slot = "d"

    def __init__(self, state):
        super(DoSomeGambling, self).__init__(state)
        self.name = "Do some gambling."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You win.",
            get_money=random.choice([money.pittance, money.small_fortune]),
            succeed=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You lose.",
            funcs=[state.character.lose_all_money],
            fail=True,
        ), weight=1)

        if state.character.place == state.places.places_dict["tavern"]:
            self.outcomes.add(Outcome(state,
                "You get cleaned out by a pretty lady.",
                new_person = state.persons.persons_dict["olga"],
                funcs=[state.character.lose_all_money],
                fail=True,
            ), weight=1)

        if state.character.place == state.places.places_dict["tavern"] or \
           state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "It was a gamble to stay here. The assassins find you.",
                die=True,
            ), weight=1)

        if state.character.place == state.places.places_dict["docks"]:

            self.outcomes.add(Outcome(state,
                "You play some dice with Lord Arthur. He whips you soundly. "
                "However, you win and earn a small fortune.",
                get_money=money.small_fortune,
                succeed=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You play some dice with Lord Arthur. He whips you soundly.",
                funcs=[state.character.lose_all_money],
                fail=True,
            ), weight=2)

            self.outcomes.add(Outcome(state,
                "You dice with some pirates. They easily beat you.",
                new_person=state.persons.persons_dict["pirates"],
                funcs=[state.character.lose_all_money],
                fail=True,
            ), weight=1)


class SneakAround(Action):
    """
    Only use in Lord Carlos' manor
    """

    slot = "d"

    def __init__(self, state):
        super(SneakAround, self).__init__(state)
        self.name = "Sneak around."

    def execute(self, state):

        if state.character.place == state.places.places_dict["lord_bartholomews_manor"]:
            self.outcomes.add(Outcome(state,
                "While prowling in the shadows of a hallway, you stub your "
                "pinkie toe.",
                actions=[(HowlWithPain(state), 10000)],
                fail=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "While lurking in a shrub, you catch sight of the fair Lady "
                "Beatrice.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "While hiding behind a door, you overhear Lord Bartholomew "
                "and his men plotting insurrection.",
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "While creeping around in the stables, you find a long "
                "pitchfork.",
                add_item=items.long_pitchfork
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "An old man notices you skulking around and starts yelling "
                "about an assassin. You look behind you, but the old "
                "man stabs you in the front.",
                die=True,
            ), weight=1)

        if state.character.place == state.places.places_dict["lord_carlos_manor"]:
            self.outcomes.add(Outcome(state,
                "One of the assassin guards sees you tiptoeing around in "
                "board daylight. He assassinates you.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "Your smell gives you away. You are soon assassinated.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You get the hiccups. You are soon assassinated.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You are sneaking through the stables when a man too fat to "
                "avoid bumps into you. You are soon assassinated.",
                die=True,
            ), weight=1)

            self.outcomes.add(Outcome(state,
                "You find a poisoned dagger in a glass case.",
                add_item=items.poisoned_dagger,
                succeed=True,
            ), weight=1)

            if state.persons.persons_dict["eve"].alive:

                self.outcomes.add(Outcome(state,
                    "You manage to sneak into Lord Carlos' "
                    "daughter's bedroom. She is {0}".format(random.choice(
                    ["reading at her desk.", "sharpening a dagger.",
                     "petting her cat.", "putting on jewelry.",
                     "painting a picture of you getting assassinated.",])),
                    new_person=state.persons.persons_dict["eve"],
                ), weight=2)

            if state.persons.persons_dict["lord_carlos"].alive:

                self.outcomes.add(Outcome(state,
                    "Lord Carlos jumps down from some rafters and assassinates you.",
                    die=True,
                ), weight=1)

                self.outcomes.add(Outcome(state,
                    "You manage to sneak into Lord Carlos' "
                    "study. He is {0}".format(random.choice(
                    ["writing a letter.", "reading a book.",
                     "looking straight at you.", "eating a heart.",
                     "training a weasel.", "pacing around."])),
                    new_person=state.persons.persons_dict["lord_carlos"],
                    threat=True,
                ), weight=2)


class HideUnderTheDeck(Action):
    """
    Note: only use when attacking merchant ship
    """

    slot = "d"

    def __init__(self, state):
        super(HideUnderTheDeck, self).__init__(state)
        self.name = "Hide under the deck."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You miss all of the action."
        ), weight=2)

        self.outcomes.add(Outcome(state,
            "You fight an epic battle against one of the rats on the "
            "lower decks.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Lord Arthur has you killed when he hears of your cowardice.",
            die=True,
        ), weight=1)


class SnoopAround(Action):
    """
    Only use in Wizard's lab
    """

    slot = "d"

    def __init__(self, state):
        super(SnoopAround, self).__init__(state)
        self.name = "Snoop around."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "The Wizard finds you and conks you on the head with his staff.",
            move_to=state.places.places_dict["arctic"],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You accidentally knock over a bottle of roiling black vapor.",
            clover=True,
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a fancy red cloak.",
            actions=[(TakeIt(state, state.persons.persons_dict["wizard"], items.fire_proof_cloak), 100)],
            topic="cloaks",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You find a frog.",
            add_item=items.frog,
            topic="frogs",
        ), weight=1)


# E slot actions


class EnterTheVoid(Action):

    slot = "e"

    def __init__(self, state):
        super(EnterTheVoid, self).__init__(state)
        self.name = "Enter the void."
        self.combat_action = True

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            None,
            move_to=state.places.places_dict["void"],
        ), weight=3)

        self.outcomes.add(Outcome(state,
            "There's no air in the void.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You get lost in limbo forever.",
            lose=True,
        ), weight=1)
