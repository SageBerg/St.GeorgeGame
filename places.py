"""
St. Georege Game
places.py
Sage Berg
Created: 7 Dec 2014
"""

from actions import *  # TODO should the actions go in here
import abc


class Place(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.connections = list()

    def __str__(self):
        return self.name

    @abc.abstractmethod
    def options(self, slot):
        """
        returns a list of tuples of action objects and their
        counts
        """
        return


class Tavern(Place):
    """
    This place is only intended to exist in the first frame
    each action here (except for LeaveInAHuffStart) is a special
    version of a normal action that will take the character to
    the Tavern place (as a side effect)
    """

    def __init__(self, name):
        self.name = "the tavern"
        self.connections = list()
        self.connections.append(TheStreets)

    def options(self, slot):
        """
        returns a list of tuples of action objects and their
        counts
        """
        return
