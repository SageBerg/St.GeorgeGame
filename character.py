"""
St. George Game
character.py
Sage Berg
Created: 9 Dec 2014
"""

import random

from raffle import Raffle
from actions import LickTheGround, LookForACat, LeaveInAPuff, SingASong
from display import Display


class Character(object):
    """
    Represents the character in the story who the player
    is role playing.
    """

    def __init__(self):
        self.best_weapon = ""
        self.attack = 0
        self.money = ""
        self.alive = True
        self.alone = True  # character has not found true love

        self.place = None
        self.person = None
        self.prev_act = None

        self.bags = {"a": Raffle(),
                     "b": Raffle(),
                     "c": Raffle(),
                     "d": Raffle()}
        self.bags["a"].add(LickTheGround())
        self.bags["b"].add(LookForACat())
        self.bags["c"].add(LeaveInAPuff())
        self.bags["d"].add(SingASong())

        self.actions = {"a": self.bags["a"].get(),
                        "b": self.bags["b"].get(),
                        "c": self.bags["c"].get(),
                        "d": self.bags["d"].get()}

    def die(self):
        """
        Kill the character.
        """
        Display().write("You are dead.")
        Display().disable()
        self.alive = False

    def generate_actions(self):
        """
        Selects actions from the options available.
        """
        for char in self.bags:
            if self.place:
                self.bags[char].merge(self.place.options[char])
            if self.person:
                self.bags[char].merge(self.person.options[char])
            #TODO actions will need an options method
            #if self.prev_act:
            #    self.bags[char].merge(self.prev_act.options[char])

        self.actions = {"a": self.bags["a"].get(),
                        "b": self.bags["b"].get(),
                        "c": self.bags["c"].get(),
                        "d": self.bags["d"].get()}
        for letter in "abcd":
            self.actions[letter] = self.bags[letter].get()

    def move(self, speed=1):
        """
        """
        visited = set([self.place])  # We don't go in circles
        at = self.place
        while speed:
            options = at.connections - visited
            if not options:
                break
            at = random.sample(options, 1)[0]
            speed -= 1
        self.moveTo(at)

    def moveTo(self, place):
        self.place = place
        Display().write('You find yourself in ' + str(self.place) + '.')

    def choose_action(self):
        """
        Prints your options and takes input from user.
        """
        print()
        print("a. " + str(self.actions["a"]))
        print("b. " + str(self.actions["b"]))
        print("c. " + str(self.actions["c"]))
        print("d. " + str(self.actions["d"]))
        print()
        choice = input()
        print()
        go_to_next = False
        while not go_to_next:
            if choice not in "abcd" or \
               len(choice) > 1 or \
               len(choice) == 0:
                print("Enter a, b, c, or d")
                choice = input()
            else:
                go_to_next = True
        return self.actions[choice]
