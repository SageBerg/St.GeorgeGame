from actions import Action
from outcome import Outcome


class Croak(Action):

    slot = "a"

    def __init__(self):
        super(Croak, self).__init__()
        self.name = "Croak."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You croak",
            die=True,
        ), weight=1)


class Ribbit(Action):

    slot = "b"

    def __init__(self):
        super(Ribbit, self).__init__()
        self.name = "Ribbit."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "A woman notices you and kisses you, hoping you'll turn into a "
            "prince. Instead she gets you. She is not impressed.",
            funcs=[character.defrogify],
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Someone steps on you to stop you from making any more noise.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "A loose weasel hears your ribbit and eats you.",
            die=True
        ), weight=1)


class Hop(Action):

    slot = "c"

    def __init__(self):
        super(Hop, self).__init__()
        self.name = "Hop."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You hop.",
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You hop for a long while.",
            move=1
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "An assassin stabs you midair.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Jump into a lady's purse, find a small fortune. Too bad you "
            "can't take it with you. \n You eventually manage to hope out.",
            move=2
        ), weight=1)


class EatAFly(Action):

    slot = "d"

    def __init__(self):
        super(EatAFly, self).__init__()
        self.name = "Eat a fly."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You grow stronger.",
        ), weight=1)
