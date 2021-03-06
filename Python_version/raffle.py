from random import randint


class Raffle(object):
    """
    Raffle contains a list of action objects, one of which
    will be chosen and shown to the player
    """

    def __init__(self):
        self.options = dict()  # Maps options to weights

    def add(self, option, weight=1):
        """
        adds an option and its weight to the Raffle
        """
        if option in self.options:
            self.options[option] += weight
        else:
            self.options[option] = weight

    def get(self):
        """
        chooses one action from the bag and returns it
        """
        total_weights = 0
        for weight in self.options.values():
            total_weights += weight
        roll = randint(0, total_weights)
        for option, weight in self.options.items():
            if roll <= weight:
                return option
            else:
                roll -= weight

    def merge(self, other):
        """
        merges the contents of another Raffle with this Raffle
        """
        for option, weight in other.options.items():
            self.add(option, weight)

    def __len__(self):
        """
        returns the combined weight of all options in the Raffle
        """
        total = 0
        for _, weight in self.options.items():
            total += weight
        return total
