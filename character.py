"""
St. George Game
character.py
Sage Berg
Created: 9 Dec 2014
"""

import random

from display import Display
from raffle import Raffle
from cheats import Cheat
import actions
import money
import persons
import places


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
        self.bags["c"].add(actions.GoToSleep(), 2)
        self.bags["c"].add(actions.LeaveInAPuff())
        self.bags["d"].add(actions.SingASong())

    def generate_actions(self):
        """
        Selects actions from the options available.
        """
        self.reset_action_bags()
        if self.person:
            self.bags["a"].add(actions.Attack(self.person), weight=10)
        if self.threatened:
            self.bags["c"].add(actions.RunLikeTheDevil(), weight=9)
            self.bags["c"].add(actions.LeaveInAHuff(), weight=3)
            self.bags["c"].add(actions.WaddleLikeGod(), weight=1)
        if self.place and not self.threatened and not self.place.locked:
            for _ in range(3):
                self.bags["c"].add(actions.GoTo(self.place))
        if self.person != persons.wizard and (self.place == places.streets or \
           self.place == places.market):
            self.bags["c"].add(actions.LookForTheWizard(), weight=2)
        # TODO may need to add similar loop (above) for St. George
        for char in self.bags:
            if self.place:
                self.bags[char].merge(self.place.options[char])
            if self.person:
                self.bags[char].merge(self.person.options[char])
            if self.prev_act:
                self.bags[char].merge(self.prev_act.options[char])
            for item in self.items:
                self.bags[char].merge(item.options[char])
        if random.randint(0, 99) == 0 and self.place and self.place in \
           places.burnable:
            self.bags["a"].add(actions.SetThePlaceOnFire(self.place),
                               weight=666)
            self.bags["b"].add(actions.LightUpThePlace(self.place),
                               weight=666)
            self.bags["c"].add(actions.BurnThePlaceToACrisp(self.place),
                               weight=666)
            self.bags["d"].add(actions.BurnThePlaceToTheGround(self.place),
                               weight=666)
        self.actions = {"a": self.bags["a"].get(),
                        "b": self.bags["b"].get(),
                        "c": self.bags["c"].get(),
                        "d": self.bags["d"].get()}
        self.prev_act = None  # TODO Might need to move this
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
            if choice not in set("abcd"):
                # Check for cheats
                if choice.split(" ")[0] == "cheat":
                    return Cheat(" ".join(choice.split(" ")[1:]))
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

    def get_item(self, item):
        if self.has_item(type(item)):
            Display().write("You now have another " + str(item) + ".")
        elif str(item)[0] in "AEIOUaeiou":
            Display().write("You now have an " + str(item) + ".")
        else:
            Display().write("You now have a " + str(item) + ".")
        self.items.add(item)

    def remove_item(self, item):
        self.items.remove(item)
        if self.has_item(type(item)):
            Display().write("You now have one less " + str(item) + ".")
        else:
            Display().write("You no longer have a " + str(item) + ".")

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

    def move(self, speed=1):  # TODO speed unused
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
