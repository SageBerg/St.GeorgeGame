"""
St. George Game
character.py
Sage Berg
Created: 9 Dec 2014
"""

import random

import actions
from display import Display
import money
from raffle import Raffle


class Character(object):
    """
    Represents the character in the story who the player
    is role playing.
    """

    def __init__(self):
        self.best_weapon = ""
        self.attack = 0
        self.money = money.none
        self.alive = True
        self.alone = True  # character has not found true love

        self.place = None
        self.person = None
        self.prev_act = None

        self.reset_action_bags()
        self.generate_actions()

    def reset_action_bags(self):
        self.bags = {"a": Raffle(),
                     "b": Raffle(),
                     "c": Raffle(),
                     "d": Raffle()}
        self.bags["a"].add(actions.LickTheGround())
        self.bags["b"].add(actions.LookForACat())
        self.bags["c"].add(actions.LeaveInAPuff())
        self.bags["d"].add(actions.SingASong())

    def generate_actions(self):
        """
        Selects actions from the options available.
        """
        self.reset_action_bags()
        for char in self.bags:
            if self.place:
                self.bags[char].merge(self.place.options[char])
            if self.person:
                self.bags[char].merge(self.person.options[char])
            if self.prev_act:
                self.bags[char].merge(self.prev_act.options[char])

        self.actions = {"a": self.bags["a"].get(),
                        "b": self.bags["b"].get(),
                        "c": self.bags["c"].get(),
                        "d": self.bags["d"].get()}
        self.prev_act = None  # Might need to move this
        for letter in "abcd":
            self.actions[letter] = self.bags[letter].get()

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

    def get_money(self, amount):
        if amount > self.money:
            self.money = amount
            Display().write("You now have {0}.".format(money.to_str(amount)))
        elif self.money == money.pittance:
            Display().write("You still only have {0}.".format(
                money.to_str(amount)))
        else:
            Display().write("You still have {0}.".format(money.to_str(amount)))

    def die(self):
        """
        Kill the character.
        """
        Display().write("You are dead.")
        Display().disable()
        self.alive = False

    def move(self, speed=1):
        visited = set([self.place])  # We don't go in circles
        at = self.place
        while speed:
            options = at.connections - visited
            if not options:
                break
            at = random.sample(options, 1)[0]
            speed -= 1
        self.move_to(at)

    def move_to(self, place, suppress_message=False):
        self.place = place
        if not suppress_message:
            Display().write('You find yourself in ' + str(self.place) + '.')
