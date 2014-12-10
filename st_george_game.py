"""
St. George Game
st_george_game.py
Sage Berg, Skyler Berg
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
        self.money = 0
        self.alive = True
        self.alone = True  # character has not found true love

    def buy(self):
        pass


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

        self.bags = {"a": ActionBag(),
                     "b": ActionBag(),
                     "c": ActionBag(),
                     "d": ActionBag()}
        for char in self.bags:
            if self.place:
                self.bags[char].add(self.place.options(char))
            if self.person:
                self.bags[char].add(self.person.options(char))
            if self.prev_act:
                self.bags[char].add(self.prev_act.options(char))

        self.actions = {"a": self.bags["a"].get_action(),
                        "b": self.bags["b"].get_action(),
                        "c": self.bags["c"].get_action(),
                        "d": self.bags["d"].get_action()}

    def prompt(self):
        """
        prints outcome of last action (the message)
        takes input from user
        user input will spawn the next frame
        """
        print(self.message)
        print("a. " + str(self.actions["a"]))
        print("b. " + str(self.actions["b"]))
        print("c. " + str(self.actions["b"]))
        print("d. " + str(self.actions["d"]))
        print()
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
