"""
St. George Game
actions.py
Sage Berg
Created: 7 Dec 2014
"""

from random import randint
import abc


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
    def exectute(self, place, person, prev_act):
        """
        returns a place, a person, a previous action, and some
        text explaining the outcome of the action to the player
        """
        return


class copy_paste(Action):
    """
    """

    def __init__(self):
        self.name = ""

    def execute(self, place, person, prev_act):
        pass

class AskAboutAssassins(Action):
    """
    """
    
    def __init__(self):
        self.name = "Ask about assassins."

    def execute(self, place, person, prev_act):
        roll = randint(0,9)
        if roll < 6:
            return "The first person you ask about assassins turns out to be an assassin. She assassinates you. You die.", place, None, self
        elif roll == 6 or roll == 7:
            return "During your search, you strike up a conversation with a pretty lady.", place, None, self 
        else:
            return "You ask around, but nobody has heard anythingabout any assassins", place, None, self 


class BuyADrink(Action):
    """
    """

    def __init__(self):
        self.name = "Buy a drink."

    def execute(self, place, person, prev_act):
        pass


class LeaveInAHuff(Action):
    """
    """

    def __init__(self):
        self.name = "Leave in a huff."

    def execute(self, place, person, prev_act):
        pass


class SingASong(Action):
    """
    """

    def __init__(self):
        self.name = "Sing a song."

    def execute(self, place, person, prev_act):
        pass


