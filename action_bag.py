"""
St. George Game
action_bag.py
Sage Berg
Created: 9 Dec 2014
"""

from random import randint


class ActionBag(object):
    """
    ActionBag contains a list of action objects, one of which
    will be chosen and shown to the player.
    """

    def __init__(self):
        self.options = dict()  # maps range tuples to actions
        self.roll_range = 0

    def add(self, options):
        """
        args: a list of tuples
        each tuple has an action object and a an integer
        and ending with an integer
        """
        for tup in options:
            action = tup[0]
            times = tup[1]
            key = (self.roll_range, self.roll_range + times)
            self.options[key] = action
            self.roll_range += times

    def get_action(self):
        """
        chooses one action from the bag and returns it
        """
        roll = randint(0, self.roll_range)
        for key in self.options:
            if roll >= key[0] and roll < key[1]:
                return self.options[key]
