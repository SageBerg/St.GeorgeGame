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

    def execute(self, character):
        pass


# A slot actions


class AskAboutAssassins(Action):

    def __init__(self):
        self.name = "Ask about assassins."

    def execute(self, character):
        roll = random.randint(0, 9)
        if roll < 0:
            Display().write("The first person you ask about assassins turns out to be an assassin. She assassinates you.")
            character.die()
        elif roll == 6 or roll == 7 or roll < 10:
            Display().write("During your search, you strike up a conversation with a pretty lady.")
            character.person = persons.PrettyLady()
        else:
            Display().write("You ask around, but nobody has heard anything about any assassins.")


class Attack(Action):

    def __init__(self, person):
        self.name = "Attack " + person.pronouns.obj + "."

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

    def execute(self, character):
        pass


class LookForWeapons(Action):
    
    def __init__(self):
        self.name = "Look for weapons"

    def execute(self, character):
        Display().write("You find yourself talking to a wealthy war merchant.")
        character.person = persons.WealthyMerchant()


class KillYourselfInFrustration(Action):

    def __init__(self):
        self.name = "Kill yourself in frustration."

    def execute(self, character):
        character.die()


# B slot actions


class Buy(Action):

    def __init__(self, weapons):
        self.weapon = random.choice(weapons)
        self.name = "Buy a " + self.weapon.name

    def execute(self, character):
        Display().write("You now have a " + self.weapon.name)
        if character.attack < self.weapon.attack:
            character.weapon = self.weapon
            character.attack = self.weapon.attack


class BuyADrink(Action):

    def __init__(self):
        self.name = "Buy a drink."

    def execute(self, character):
        Display().write("The blind bartender grumbles as he passes you a drink.")
        character.person = persons.BlindBartender()


class BoastOfYourBravery(Action):

    def __init__(self):
        self.name = "Boast of your bravery."

    def execute(self, character):
        Display().write(character.person.pronouns.subj.capitalize() +
                        " is not impressed.")


class LookForACat(Action):

    def __init__(self):
        self.name = "Look for a cat."

    def execute(self, character):
        pass


# C slot actions


class LeaveInAHuff(Action):

    def __init__(self):
        self.name = "Leave in a huff."

    def execute(self, character):
        character.move(speed=1)


class LeaveInAPuff(Action):

    def __init__(self):
        self.name = "Leave in a puff."

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        character.move_to(random.sample(options, 1)[0])


# D slot actions


class SingASong(Action):

    def __init__(self):
        self.name = "Sing a song."

    def execute(self, character):
        def a_crowd_gathers():
            Display().write("A Crowd gathers to hear your music and throws you"
                            " a small fortune fortune in coins.")
            character.get_money(money.small_fortune)

        def the_locals_kill_you():
            Display().write("The locals hate your voice and soon mob you.")
            character.die()

        outcomes = Raffle()
        outcomes.add(a_crowd_gathers, weight=2)
        outcomes.add(the_locals_kill_you, weight=1)
        outcome = outcomes.get()
        outcome()
