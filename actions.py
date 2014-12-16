"""
St. George Game
actions.py
Sage Berg
Created: 7 Dec 2014
"""

import random
import abc

import places
from display import Display
from raffle import Raffle
import money


class Action(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.outcomes = Raffle()
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def __str__(self):
        return self.name

    @abc.abstractmethod
    def exectute(self, character):
        """
        returns nothing, edits character attributes
        """

        def some_stuff():
            pass

# A slot actions


class AskAboutAssassins(Action):

    def __init__(self):
        super().__init__()
        self.name = "Ask about assassins."

    def execute(self, character):
        import persons

        def assassinated():
            Display().write("The first person you ask about assassins turns"
                            " out to be an assassin. She assassinates you.")
            character.die()

        def pretty_lady():
            Display().write("During your search, you strike up a conversation"
                            "with a pretty lady.")
            character.person = persons.pretty_lady

        def no_one_cares():
            Display().write("You ask around, but nobody has heard anything"
                            " about any assassins.")
            self.options["a"].add(KillYourselfInFrustration(), weight=5)
            character.prev_act = self

        self.outcomes.add(assassinated, weight=3)
        self.outcomes.add(no_one_cares, weight=100)
        if persons.pretty_lady.alive:
            self.outcomes.add(pretty_lady, weight=1)
        outcome = self.outcomes.get()
        outcome()


class Attack(Action):

    def __init__(self, person):
        super().__init__()
        self.name = "Attack " + person.pronouns.obj + "."

    def execute(self, character):
        if character.person.attack >= character.attack:
            Display().write(character.person.pronouns.subj.capitalize() +
                            " kill" + character.person.pronouns.tense +
                            " you.")
            character.die()
        else:
            Display().write("You kill " + character.person.pronouns.obj + ".")
            character.person.alive = False
            character.person = None
            character.threatened = False
            self.options["b"].add(BoastOfYourBravery(), 5)
            self.options["c"].add(FleeTheScene(), 5)


class LickTheGround(Action):

    def __init__(self):
        super().__init__()
        self.name = "Lick the ground."

    def execute(self, character):
        pass


class LookForWeapons(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for weapons."

    def execute(self, character):
        import persons

        Display().write("You find yourself talking to a wealthy war merchant.")
        character.person = persons.wealthy_merchant


class LookForStGeorge(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for St. George"

    def execute(self, character):
        import persons

        def lost():
            Display().write("While looking for St. George, you get lost in "
                            "your thoughts and realize you stopped paying "
                            "attention to where you were going.")
            LeaveInAHuff().execute(character)

        def find_st_george_at_church():
            Display().write("You find St. George at the church.")
            character.move_to(places.church, suppress_message=True)
            character.person = persons.st_george

        def find_st_george_at_market():
            Display().write("You find St. George in the market.")
            character.move_to(places.market, suppress_message=True)
            character.person = persons.st_george

        def find_st_george_at_streets():
            Display().write("You find St. George in the streets.")
            character.move_to(places.streets, suppress_message=True)
            character.person = persons.st_george

        def trip_over_a_cat():
            Display().write("You trip over a cat and break your neck.")
            character.die()

        self.outcomes.add(lost, weight=3)
        self.outcomes.add(trip_over_a_cat, weight=1)
        if persons.st_george.alive:
            self.outcomes.add(find_st_george_at_church, weight=10)
            self.outcomes.add(find_st_george_at_market, weight=5)
            self.outcomes.add(find_st_george_at_church, weight=5)
        outcome = self.outcomes.get()
        outcome()


class KillYourselfInFrustration(Action):

    def __init__(self):
        super().__init__()
        self.name = "Kill yourself in frustration."

    def execute(self, character):
        if character.place == places.docks:
            Display().write("You walk into the ocean and are suddenly "
                            "inspired to write a novel. You drown.")
            character.die()
            return
        deaths = ["You perform the ritual of the seppuku.",
                  "You set yourself on fire and burn to a crisp.",
                  ]
        Display().write(random.choice(deaths))
        character.die()


# B slot actions


class BegForMoney(Action):

    def __init__(self):
        super().__init__()
        self.name = "Beg for money."

    def execute(self, character):
        def forgot_wallet():
            Display().write("St. George tells you he has lost his "
                            "wallet in the church.")

        def pittance():
            Display().write(character.person.name + " gives you a pittance.")
            if character.money < 1:
                character.money = money.pittance

        def small_fortune():
            Display().write(character.person.name + " gives you a small "
                            "fortune.")
            if character.money < 2:
                character.money = money.small_fortune

        def large_fortune():
            Display().write(character.person.name + " gives you a large "
                            "fortune.")
            if character.money < 3:
                character.money = money.large_fortune

        if character.place != places.church:
            self.outcomes.add(forgot_wallet, weight=1)
        self.outcomes.add(pittance, weight=3)
        self.outcomes.add(small_fortune, weight=2)
        self.outcomes.add(large_fortune, weight=1)
        outcome = self.outcomes.get()
        outcome()


class Buy(Action):

    def __init__(self, weapons):
        super().__init__()
        self.weapon = random.choice(weapons)
        self.name = "Buy a " + self.weapon.name

    def execute(self, character):
        Display().write("You now have a " + self.weapon.name + ".")
        if character.attack < self.weapon.attack:
            character.weapon = self.weapon
            character.attack = self.weapon.attack


class BuyADrink(Action):

    def __init__(self):
        super().__init__()
        self.name = "Buy a drink."

    def execute(self, character):
        import persons

        if persons.blind_bartender.alive:
            Display().write("The blind bartender grumbles as he passes you a "
                            "drink.")
            character.person = persons.blind_bartender
        else:
            Display().write("No one is selling drinks.")


class BoastOfYourBravery(Action):

    def __init__(self):
        super().__init__()
        self.name = "Boast of your bravery."

    def execute(self, character):
        Display().write(character.person.pronouns.subj.capitalize() +
                        " is not impressed.")


class LookForACat(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for a cat."

    def execute(self, character):
        pass


# C slot actions


class LeaveInAHuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a huff."

    def execute(self, character):
        character.move(speed=1)


class LeaveInAPuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a puff."

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        character.move_to(random.sample(options, 1)[0])
        character.person = None


class FleeTheScene(Action):

    def __init__(self):
        super().__init__()
        self.name = "Flee the scene."

    def execute(self, character):
        character.move(2)
        character.person = None


class RunLikeTheDevil(Action):

    def __init__(self):
        super().__init__()
        self.name = "Run like the Devil."

    def execute(self, character):
        def escape():
            Display().write("The Devil is very fast, so you manage to get "
                            "away.")
            character.threatened = False
            character.person = None
            character.move(2)

        def get_caught():
            Display().write("You run like the Devil, but " +
                            character.person.pronouns.subj +
                            " also run" + character.person.pronouns.tense +
                            " like the Devil and "
                            "overtake" + character.person.pronouns.tense +
                            " you.")
            Attack(character.person)
            character.move(1)

        self.outcomes.add(escape, weight=9)
        self.outcomes.add(get_caught, weight=1)
        outcome = self.outcomes.get()
        outcome()


# D slot actions


class SingASong(Action):

    def __init__(self):
        super().__init__()
        self.name = "Sing a song."

    def execute(self, character):
        import persons

        def a_crowd_gathers():
            Display().write("A crowd gathers to hear your music and throws you"
                            " a small fortune in coins.")
            character.get_money(money.small_fortune)

        def the_locals_kill_you():
            Display().write("The locals hate your voice and soon mob you.")
            character.die()

        def assassins_notice_you():
            Display().write("While you're singing, "
                            "some men in black cloaks start to edge their "
                            "way toward you.")
            character.person = persons.assassins
            character.threatened = True

        def no_one_cares():
            Display().write("You sing your favorite song. No one cares.")
            self.options["a"].add(KillYourselfInFrustration(), weight=5)

        if character.place in places.Place.populated:
            self.outcomes.add(assassins_notice_you, weight=10)  # TODO fix weight
            self.outcomes.add(a_crowd_gathers, weight=2)
            self.outcomes.add(the_locals_kill_you, weight=1)
        self.outcomes.add(no_one_cares, weight=1)
        outcome = self.outcomes.get()
        outcome()
