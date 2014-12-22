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
                     "d": Raffle()}

    def add(self, action, slot, weight=1):
        self.bags[slot].add(action, weight)

    def generate_actions(self, character):
        """
        Selects actions from the options available.
        """
        for char in self.bags:
            if character.prev_act:
                self.bags[char].merge(character.prev_act.options[char])
            for item in character.items:
                self.bags[char].merge(item.options[char])
        self.actions = {"a": self.bags["a"].get(),
                        "b": self.bags["b"].get(),
                        "c": self.bags["c"].get(),
                        "d": self.bags["d"].get()}
        character.prev_act = None  # TODO Might need to move this
        for letter in "abcd":
            self.actions[letter] = self.bags[letter].get()
        self.reset_action_bags(character)

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
