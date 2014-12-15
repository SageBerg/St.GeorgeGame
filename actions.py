"""
St. George Game
actions.py
Sage Berg
Created: 7 Dec 2014
"""

import random
import abc

import places
import persons
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

    def __str__(self):
        return self.name

    @abc.abstractmethod
    def exectute(self, character):
        """
        returns nothing, edits character attributes
        """
        return


class copy_paste(Action):

    def __init__(self):
        self.name = ""
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        pass


# A slot actions


class AskAboutAssassins(Action):

    def __init__(self):
        self.name = "Ask about assassins."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        def assassinated():
            Display().write("The first person you ask about assassins turns out to be an assassin. She assassinates you.")
            character.die()

        def pretty_lady():
            Display().write("During your search, you strike up a conversation with a pretty lady.")
            character.person = persons.PrettyLady()

        def no_one_cares():
            Display().write("You ask around, but nobody has heard anything about any assassins.")
            self.options["a"].add(KillYourselfInFrustration(), weight=50)
            character.prev_act = self 

        outcomes = Raffle()
        outcomes.add(assassinated, weight=3)
        outcomes.add(pretty_lady, weight=1)
        outcomes.add(no_one_cares, weight=100)
        outcome = outcomes.get()
        outcome()
            

class Attack(Action):

    def __init__(self, person):
        self.name = "Attack " + person.pronouns.obj + "."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        if character.person.attack >= character.attack:
            Display().write(character.person.pronouns.subj.capitalize() + " kill" +
                            character.person.pronouns.tense + " you.")
            character.die()
        else:
            Display().write("You kill " + character.person.pronouns.obj)


class LickTheGround(Action):

    def __init__(self):
        self.name = "Lick the ground."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        pass


class LookForWeapons(Action):
    
    def __init__(self):
        self.name = "Look for weapons."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        Display().write("You find yourself talking to a wealthy war merchant.")
        character.person = persons.WealthyMerchant()


class LookForStGeorge(Action):
    
    def __init__(self):
        self.name = "Look for St. George"
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        def lost():
            Display().write("While looking for St. George, you get lost in "
                            "your thoughts and realize you stopped paying "
                            "attention to where you were going.")
            LeaveInAHuff().execute(character)     

        def find_st_george_at_church():
            Display().write("You find St. George at the church.")
            character.move_to(places.church, suppress_message=True)
            character.person = persons.StGeorge()

        def find_st_george_at_market():
            Display().write("You find St. George in the market.")
            character.move_to(places.market, suppress_message=True)
            character.person = persons.StGeorge()

        def find_st_george_at_streets():
            Display().write("You find St. George in the streets.")
            character.move_to(places.streets, suppress_message=True)
            character.person = persons.StGeorge()
             
        def trip_over_a_cat():
            Display().write("You trip over a cat and break your neck.")
            character.die()

        outcomes = Raffle()
        outcomes.add(lost, weight=3)
        outcomes.add(trip_over_a_cat, weight=1)
        outcomes.add(find_st_george_at_church, weight=10)
        outcomes.add(find_st_george_at_market, weight=5)
        outcomes.add(find_st_george_at_church, weight=5)
        outcome = outcomes.get()
        outcome()


class KillYourselfInFrustration(Action):

    def __init__(self):
        self.name = "Kill yourself in frustration."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        if character.place == places.docks:
            Display().write("You walk into the ocean and are suddenly " 
                            "inspired to write a novel. You drown.") 
            character.die()
            return
        deaths = ["You perform the ritual of the seppuku.",
                  "You set yourself on fire and burn to a crisp", 
                  ]
        Display().write(random.choice(deaths))
        character.die()


# B slot actions


class Buy(Action):

    def __init__(self, weapons):
        self.weapon = random.choice(weapons)
        self.name = "Buy a " + self.weapon.name
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        Display().write("You now have a " + self.weapon.name)
        if character.attack < self.weapon.attack:
            character.weapon = self.weapon
            character.attack = self.weapon.attack


class BuyADrink(Action):

    def __init__(self):
        self.name = "Buy a drink."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        Display().write("The blind bartender grumbles as he passes you a drink.")
        character.person = persons.BlindBartender()


class BoastOfYourBravery(Action):

    def __init__(self):
        self.name = "Boast of your bravery."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        Display().write(character.person.pronouns.subj.capitalize() +
                        " is not impressed.")


class LookForACat(Action):

    def __init__(self):
        self.name = "Look for a cat."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        pass


# C slot actions


class LeaveInAHuff(Action):

    def __init__(self):
        self.name = "Leave in a huff."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        character.move(speed=1)


class LeaveInAPuff(Action):

    def __init__(self):
        self.name = "Leave in a puff."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        character.move_to(random.sample(options, 1)[0])


# D slot actions


class SingASong(Action):

    def __init__(self):
        self.name = "Sing a song."
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def execute(self, character):
        def a_crowd_gathers():
            Display().write("A Crowd gathers to hear your music and throws you"
                            " a small fortune in coins.")
            character.get_money(money.small_fortune)

        def the_locals_kill_you():
            Display().write("The locals hate your voice and soon mob you.")
            character.die()

        outcomes = Raffle()
        outcomes.add(a_crowd_gathers, weight=2)
        outcomes.add(the_locals_kill_you, weight=1)
        outcome = outcomes.get()
        outcome()
