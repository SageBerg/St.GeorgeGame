"""
places.py
Sage Berg
Created: 7 Dec 2014
"""


class Place(object):
    """
    abstract class
    """

    def __init__(self, name):
        self.name = name
        self.connections = list()

    def contribute(self):
        pass
