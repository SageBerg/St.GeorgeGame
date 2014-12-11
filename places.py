"""
St. Georege Game
places.py
Sage Berg
Created: 7 Dec 2014
"""

from actions import *  # TODO should the actions go in here
import abc

from action_bag import ActionBag


class Place(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.connections = list()
        self.options = dict()

    def __str__(self):
        return self.name


class Tavern(Place):
    """
    """

    def __init__(self):
        self.name = "the tavern"
        self.connections = [TheStreets]
        self.options = {"a": ActionBag(),
                        "b": ActionBag(),
                        "c": ActionBag(),
                        "d": ActionBag()}

class TheStreets(Place):
    """
    """

    def __init__(self):
        self.name = "the streets"
        self.connections = list()
        self.options = {"a": ActionBag(),
                        "b": ActionBag(),
                        "c": ActionBag(),
                        "d": ActionBag()}
