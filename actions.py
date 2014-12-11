"""
St. George Game
actions.py
Sage Berg
Created: 7 Dec 2014
"""

from random import randint
import abc

from display import Display


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
    """
    """

    def __init__(self):
        self.name = ""

    def execute(self, character):
        pass


# B slot actions


class AskAboutAssassins(Action):
    """
    """

    def __init__(self):
        self.name = "Ask about assassins."

    def execute(self, character):
        roll = randint(0, 9)
        if roll < 6:
            Display().write("The first person you ask about assassins turns out to be an assassin. She assassinates you.")
            character.die()
        elif roll == 6 or roll == 7:
            Display().write("During your search, you strike up a conversation with a pretty lady.")
        else:
            Display().write("You ask around, but nobody has heard anything about any assassins.")


class LickTheGround(Action):
    """
    """

    def __init__(self):
        self.name = "Lick the ground."

    def execute(self, character):
        pass


# B slot actions


class BuyADrink(Action):
    """
    """

    def __init__(self):
        self.name = "Buy a drink."

    def execute(self, character):
        pass


class LookForACat(Action):
    """
    """

    def __init__(self):
        self.name = "Look for a cat."

    def execute(self, character):
        pass


# C slot actions


class LeaveInAHuff(Action):
    """
    """

    def __init__(self):
        self.name = "Leave in a huff."

    def execute(self, character):
        pass


class LeaveInAPuff(Action):
    """
    """

    def __init__(self):
        self.name = "Leave in a puff."

    def execute(self, character):
        pass


# D slot actions


class SingASong(Action):
    """
    """

    def __init__(self):
        self.name = "Sing a song."

    def execute(self, character):
        pass
