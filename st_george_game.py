"""
St. George Game
st_george_game.py
Sage Berg
Created: 5 Dec 2014
"""

from random import randint


class Character(object):
    """
    Represents the character in the story who the player
    is role playing.
    """

    def __init__(self):
        self.best_weapon = ""
        self.attack = 0
        self.alive = True
        self.alone = True  # character has not found true love yet


class ActionsBag(object):
    """
    ActionsBag contains a list of action objects, one of which
    will be chosen and shown to the player.
    """

    def __init__(self):
        self.options = dict()  # maps range tuples to actions
        self.roll_range = 0

    def add(self, action, times):
        # TODO take list of tuples as argument
        """
        args: times is ...

        """
        key = (self.roll_range, self.roll_range + times)
        self.options[key] = action
        self.roll_range += times

    def get_action(self):
        roll = randint(0, self.roll_range)
        # TODO check randints range
        for key in self.options:
            if roll >= key[0] and roll < key[1]:
                # TODO check for off by one error
                return self.options[key]


class Frame(object):
    """
    Each iteration of the game has a new frame object.
    The frame chooses what actions are available, displays the
    actions to the player, and executes the action taken
    """

    def __init__(self, message, place, person, prev_act):
        self.message = message
        self.place = place
        self.person = person
        self.prev_act = prev_act

        self.bags = {"a": ActionsBag(),
                     "b": ActionsBag(),
                     "c": ActionsBag(),
                     "d": ActionsBag()}
        for char in self.bags:
            if self.place:
                self.bags[char].add(self.place.options(char))
            if self.person:
                self.bags[char].add(self.person.options(char))
            if self.prev_act:
                self.bags[char].add(self.prev_act.options(char))

        self.a_action = self.bags["a"].get_action()
        self.b_action = self.bags["b"].get_action()
        self.c_action = self.bags["c"].get_action()
        self.d_action = self.bags["d"].get_action()
        self.actions = {"a": self.a_action,
                        "b": self.b_action,
                        "c": self.c_action,
                        "d": self.d_action}

    def prompt(self):
        """
        prints outcome of last action (the message)
        takes input from user
        user input will spawn the next frame
        """
        print(self.message)
        print(self.a_action)
        print(self.b_action)
        print(self.c_action)
        print(self.d_action)
        choice = input()
        go_to_next = False
        while not go_to_next:
            if choice not in "abcd" or \
               len(choice) > 1 or \
               len(choice) == 0:
                print("Enter a, b, c, or d")
                choice = input()
            else:
                go_to_next = True
        print("good input")
        self.actions[choice].execute(self.place,
                                     self.person,
                                     self.prev_act)
