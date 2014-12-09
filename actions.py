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


class AskAboutAssassins(Action):
    """
    Often bad option
    """

    def __init__(self):
        self.name = "Ask about assassins."

    def exectute(self, place, person, prev_act):
        roll = randint(0,9)
        if roll < 6:
            return tavern, assassin, AskAboutAssassins, 
                   "The first person you ask about assassins turns out to be an assassin. She assassinates you. You die."
            
        elif roll == 6 or roll == 7:
            return Tavern, pretty_lady, AskAboutAssassins
        else:
            return Tavern, tavern_crowd, AskAboutAssassins,
                   "You ask around, but nobody has heard anythingabout any assassins"

