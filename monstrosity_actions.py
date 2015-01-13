from actions import Action
from outcome import Outcome


class AnnihilateEverything(Action):

    slot = "a"

    def __init__(self):
        super(AnnihilateEverything, self).__init__()
        self.name = "Annihilate everything."

    def execute(self, character):
        self.outcomes.add(Outcome(character,
            "You start annihilating everything, but the Four Horsemen of "
            "the Apocalypse steal your thunder. You perish in the chaos.",
            die=True,
        ), weight=1)


class TerrorizeTheKingdom(Action):

    slot = "b"

    def __init__(self):
        super(TerrorizeTheKingdom, self).__init__()
        self.name = "Terrorize the kingdom."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You wreak havoc on a titanic scale, but you eventually fall "
            "asleep. By the time you wake up, science has advanced so much "
            "that the world government simply nukes you into oblivion.",
            die=True,
        ), weight=1)


class GoOnARampage(Action):

    slot = "c"

    def __init__(self):
        super(GoOnARampage, self).__init__()
        self.name = "Go on a rampage."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You smash towns, flatten forests, level mountains, and "
            "ultimately run out of food.",
            die=True,
        ), weight=1)


class DestroyAllHumanCivilizations(Action):

    slot = "d"

    def __init__(self):
        super(DestroyAllHumanCivilizations, self).__init__()
        self.name = "Destroy all human civilizations."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You throw out your arm destroying the first three civilizations "
            "and an opportunistic hero slays you.",
            die=True,
        ), weight=1)
