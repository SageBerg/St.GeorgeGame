"""
St. George Game
frame.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

from action_bag import ActionBag


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

    def prompt(self):
        """
        prints outcome of last action (the message)
        takes input from user
        user input will spawn the next frame
        """
        print()
        print(self.message)
        print()
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
        return self.actions[choice]
