"""
St. George Game
character.py
Sage Berg
Created: 9 Dec 2014
"""

import random

from display import Display
import money


class Character(object):
    """
    Represents the character in the story who the player
    is role playing.
    """

    def __init__(self):
        self.items = set()
        self.best_weapon = ""
        self.attack = 0
        self.money = money.none
        self.threatened = False
        self.trip = False
        self.is_frog = False
        self.alive = True
        self.alone = True  # character has not found true love

        self.place = None
        self.person = None
        self.prev_act = None
        self.employers = set()

    def get_money(self, amount):
        if amount > self.money:
            self.money = amount
            Display().write("You now have {0}.".format(money.to_str(amount)))
        elif self.money == money.pittance:
            Display().write("You still only have {0}.".format(
                money.to_str(amount)))
        else:
            Display().write("You still have {0}.".format(money.to_str(amount)))

    def add_item(self, item):
        if self.has_item(type(item)):
            Display().write("You now have another " + str(item) + ".")
        elif str(item)[0] in "AEIOUaeiou":
            Display().write("You now have an " + str(item) + ".")
        else:
            Display().write("You now have a " + str(item) + ".")
        self.items.add(item)

    def get_item(self, item_class):
        for item in self.items:
            if isinstance(item, item_class):
                return item

    def remove_item(self, item):
        self.items.remove(item)
        if self.has_item(type(item)):
            Display().write("You now have one less " + str(item) + ".")
        else:
            Display().write("You no longer have a " + str(item) + ".")

    def remove_all_items(self):
        for item in set(self.items):
            self.remove_item(item)

    def has_any_items(self):
        if len(self.items):
            return True
        return False

    def has_item(self, item_class):
        if self.item_count(item_class):
            return True
        return False

    def item_count(self, item_class):
        count = 0
        for item in self.items:
            if isinstance(item, item_class):
                count += 1
        return count

    def die(self):
        """
        Kill the character.
        """
        Display().write("You are dead.")
        Display().disable()
        self.alive = False

    def move(self, distance=1):
        visited = set([self.place])  # We don't go in circles
        at = self.place
        while distance:
            options = at.connections - visited
            if not options:
                break
            at = random.sample(options, 1)[0]
            distance -= 1
        self.move_to(at)

    def move_to(self, place, suppress_message=False):
        self.place = place
        self.person = None  # WARNING: move then add people
                            # so move doesn't overwrite
                            # character.person immediately
        if not suppress_message:
            Display().write("You find yourself in " + str(self.place) + ".")

    def frogify(self):
        self.is_frog = True
        Display().write("You are now a frog.")

    def defrogify(self):
        self.is_frog = False
        Display().write("You are now yourself again.")

    def start_tripping(self):
        self.trip = True

    def stop_tripping(self):
        self.trip = False

    def win(self):
        """
        Win the game.
        """
        Display().write("You win!")
        Display().disable()
        self.alone = False

    def add_employer(self, employer):
        self.employers.add(employer)

    def remove_employer(self, employer):
        self.employers.remove(employer)

    def is_employed_by(self, employer):
        if employer in self.employers:
            return True
        return False
