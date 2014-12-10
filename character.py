"""
St. George Game
character.py
Sage Berg
Created: 9 Dec 2014
"""

class Character(object):
    """
    Represents the character in the story who the player
    is role playing.
    """

    def __init__(self):
        self.best_weapon = ""
        self.attack = 0
        self.money = 0
        self.alive = True
        self.alone = True  # character has not found true love

    def buy(self):
        pass
