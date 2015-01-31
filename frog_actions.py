from actions import Action
from outcome import Outcome


class Croak(Action):

    slot = "a"

    def __init__(self, state):
        super(Croak, self).__init__(state)
        self.name = "Croak."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You croak",
            die=True,
        ), weight=1)


class Ribbit(Action):

    slot = "b"

    def __init__(self, state):
        super(Ribbit, self).__init__(state)
        self.name = "Ribbit."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "A woman notices you and kisses you, hoping you'll turn into a "
            "prince. Instead she gets you. She is not impressed.",
            funcs=[state.character.defrogify],
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Someone steps on you to stop you from making any more noise.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "A loose weasel hears your ribbit and eats you.",
            die=True,
        ), weight=1)


class Hop(Action):

    slot = "c"

    def __init__(self, state):
        super(Hop, self).__init__(state)
        self.name = "Hop."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You hop.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "You hop for a long while.",
            move=1,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "An assassin stabs you midair.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Jump into a lady's purse, find a small fortune. Too bad you "
            "can't take it with you. \n You eventually manage to hope out.",
            move=2,
        ), weight=1)


class EatAFly(Action):

    slot = "d"

    def __init__(self, state):
        super(EatAFly, self).__init__(state)
        self.name = "Eat a fly."

    def execute(self, state):

        self.outcomes.add(Outcome(state,
            "You grow stronger.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "The fly tastes more delicious than any food you've eaten as a human.",
        ), weight=1)

        self.outcomes.add(Outcome(state,
            "Someone accidentally steps on you while you're looking for flies.",
            die=True,
        ), weight=1)
