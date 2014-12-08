"""
places.py
Sage Berg
Created: 7 Dec 2014
"""

from actions import * #TODO should the actions go in here

class Place(object):
    """
    abstract class
    """

    def __init__(self, name):
        self.name = name
        self.connections = list()

    def options(self):
        """
        returns several action objects and 
        """
        pass
