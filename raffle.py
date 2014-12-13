"""
St. George Game
raffle.py
Sage Berg
Created: 9 Dec 2014
"""

from random import randint


class Raffle(object):
    """
    Raffle contains a list of action objects, one of which
    will be chosen and shown to the player.
    """

    def __init__(self):
        self.options = dict()  # Maps options to weights

    def add(self, option, weight=1):
        """
        """
        if option in self.options:
            self.options[option] += weight
        else:
            self.options[option] = weight

    def get(self):
        """
        chooses one action from the bag and returns it.
        """
        total_weights = 0
        for weight in self.options.values():
            total_weights += weight
        roll = randint(0, total_weights)
        for option, weight in self.options.items():
            if roll <= weight:
                return option
            else:
                roll -= weight

    def merge(self, other):
        """
        Merge the contents of another Raffle with this Raffle.
        """
        for option, weight in other.options.items():
            self.add(option, weight)
