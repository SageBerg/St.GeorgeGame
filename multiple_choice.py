"""
St. George Game
multiple_choice.py
Sage Berg, Skyler Berg
Created: 22 Dec 2014
"""

import random

from raffle import Raffle
from cheats import Cheat


class MultipleChoice(object):

    def __init__(self):
        self.actions = {}
        self.reset_action_bags()

    def reset_action_bags(self, character=None):
        self.bags = {"a": Raffle(),
                     "b": Raffle(),
                     "c": Raffle(),
                     "d": Raffle(),
                     "e": Raffle()}

    def add(self, action, weight=1):
        self.bags[type(action).slot].add(action, weight)

    def generate_actions(self, character):
        """
        Selects actions from the options available.
        """
        self.actions = {"a": self.bags["a"].get(),
                        "b": self.bags["b"].get(),
                        "c": self.bags["c"].get(),
                        "d": self.bags["d"].get(),
                        "e": self.bags["e"].get()}
        character.prev_act = None  # TODO Might need to move this
        for letter in "abcde":
            self.actions[letter] = self.bags[letter].get()
        self.reset_action_bags(character)

    def choose_action(self):
        """
        Prints your options and takes input from user.
        """
        e_off = random.randint(0, 249)
        print()
        print("a. " + str(self.actions["a"]))
        print("b. " + str(self.actions["b"]))
        print("c. " + str(self.actions["c"]))
        print("d. " + str(self.actions["d"]))
        if not e_off:
            print("e. " + str(self.actions["e"]))
        print()
        choice = input()
        print()
        go_to_next = False
        while not go_to_next:
            if choice not in set("abcde"):
                # Check for cheats
                if choice.split(" ")[0] == "cheat":
                    return Cheat(" ".join(choice.split(" ")[1:]))
                print("Enter a, b, c, or d.")
                choice = input()
            elif choice == "e":
                if not e_off:
                    go_to_next = True
                else:
                    print("Enter a, b, c, or d.")
                    choice = input()
            else:
                go_to_next = True
        return self.actions[choice]
