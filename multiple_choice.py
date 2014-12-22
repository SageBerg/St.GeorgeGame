import random

from display import Display
from raffle import Raffle
from cheats import Cheat
import actions
import places
import persons


class MultipleChoice(object):

    def __init__(self):
        self.actions = {}
        self.reset_action_bags()

    def reset_action_bags(self, character=None):
        self.bags = {"a": Raffle(),
                     "b": Raffle(),
                     "c": Raffle(),
                     "d": Raffle()}
        self.bags["a"].add(actions.LickTheGround())
        if not character or not character.place or not character.place.locked:
            self.bags["b"].add(actions.LookForACat())
        self.bags["c"].add(actions.GoToSleep(), 2)
        self.bags["c"].add(actions.LeaveInAPuff())
        self.bags["d"].add(actions.SingASong())

    def generate_actions(self, character):
        """
        Selects actions from the options available.
        """
        self.reset_action_bags(character)
        if character.person:
            self.bags["a"].add(actions.Attack(character.person), weight=10)
        if character.threatened:
            self.bags["c"].add(actions.RunLikeTheDevil(), weight=9)
            self.bags["c"].add(actions.LeaveInAHuff(), weight=3)
            self.bags["c"].add(actions.WaddleLikeGod(), weight=1)
        if character.place and not character.threatened and not character.place.locked:
            for _ in range(3):
                self.bags["c"].add(actions.GoTo(character.place))
        if character.person != persons.wizard and (character.place == places.streets or
           character.place == places.market):
            self.bags["c"].add(actions.LookForTheWizard(), weight=2)
        if character.place == places.arctic and character.place.locked:
            Display().write("Your tongue is stuck to an icicle.")
        # TODO may need to add similar loop (above) for St. George
        for char in self.bags:
            if character.place:
                self.bags[char].merge(character.place.options[char])
            if character.person:
                self.bags[char].merge(character.person.options[char])
            if character.prev_act:
                self.bags[char].merge(character.prev_act.options[char])
            for item in character.items:
                self.bags[char].merge(item.options[char])
        if random.randint(0, 99) == 0 and character.place and character.place in \
           places.burnable:
            self.bags["a"].add(actions.SetThePlaceOnFire(character.place),
                               weight=666)
            self.bags["b"].add(actions.LightUpThePlace(character.place),
                               weight=666)
            self.bags["c"].add(actions.BurnThePlaceToACrisp(character.place),
                               weight=666)
            self.bags["d"].add(actions.BurnThePlaceToTheGround(character.place),
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
