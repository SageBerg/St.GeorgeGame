"""
St. George Game
actions.py
Skyler Berg
Created: 16 Dec 2014
"""

import abc

import actions
from raffle import Raffle


class Item(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def __str__(self):
        return self.name

    @abc.abstractmethod
    def contribute(self, character):
        """
        Add options for the player.
        returns nothing, edits character attributes
        """
        pass


class Cat(Item):

    def __init__(self):
        super().__init__()
        self.name = "cat"
        self.options["d"].add(actions.SwingYourCat(self), 1)

    def contribute(self, character):
        pass


class Pearl(Item):

    def __init__(self):
        super().__init__()
        self.name = "pearl"

    def contribute(self, character):
        pass
