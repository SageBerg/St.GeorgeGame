"""
St. Georege Game
places.py
Sage Berg
Created: 7 Dec 2014
"""

from raffle import Raffle


class Place(object):
    """
    """

    instances = set()

    def __init__(self, name):
        self.name = name
        self.connections = set()
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
        Place.instances.add(self)

    def __str__(self):
        return self.name


tavern = Place("the tavern")
streets = Place("the streets")

# Connections
tavern.connections.add(streets)

streets.connections.add(tavern)
