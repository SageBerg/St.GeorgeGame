from __future__ import print_function
import random

from raffle import Raffle
from cheats import Cheat

try:  # Python 2 compatibility
    input = raw_input
except NameError:
    pass


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
        for letter in "abcde":
            self.actions[letter] = self.bags[letter].get()
        self.reset_action_bags(character)

    def choose_action(self):
        """
        Prints your options and takes input from user.
        """
        print()
        for letter in "abcde":
            if self.actions.get(letter, None):
                print("{0}. {1}".format(letter, str(self.actions[letter])))
        print()
        choice = input()
        print()
        selected_action = None
        while selected_action is None:
            if self.actions.get(choice, None) is not None:
                selected_action = self.actions[choice]
            elif choice.split(" ")[0] == "cheat":  # Check for cheats
                selected_action =  Cheat(" ".join(choice.split(" ")[1:]))
            else:
                print("Enter the letter for the action you wish to select.")
                choice = input()
        return selected_action
