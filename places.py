"""
St. Georege Game
places.py
Sage Berg
Created: 7 Dec 2014
"""

import abc

from raffle import Raffle


class Place(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.connections = set()
        self.options = dict()

    def __str__(self):
        return self.name


class Tavern(Place):
    """
    """

    def __init__(self):
        self.name = "the tavern"
        self.connections = set([TheStreets()])
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}


class TheStreets(Place):
    """
    """

    def __init__(self):
        self.name = "the streets"
        self.connections = set()
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
