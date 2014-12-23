from actions import Action
from outcome import Outcome

class Croak(Action):
    
    def __init__(self):
        super().__init__()
        self.name = "Croak."

    def execute(self, character):
        
        self.outcomes.add(Outcome(character,
            "You croak",
            die=True,
        ), weight=1)


class Ribbit(Action):
    
    def __init__(self):
        super().__init__()
        self.name = "Ribbit."

    def execute(self, character):
        
        self.outcomes.add(Outcome(character,
            "A woman notices you and kisses you, hoping your'll turn into a "
            "prince. Instead she gets you. She is not impressed.",
            funcs=[character.defrogify], 
        ), weight=1)


class Hop(Action):
    
    def __init__(self):
        super().__init__()
        self.name = "Hop."

    def execute(self, character):
        
        self.outcomes.add(Outcome(character,
            "You hop.",
        ), weight=1)


class EatAFly(Action):
    
    def __init__(self):
        super().__init__()
        self.name = "Eat a fly."

    def execute(self, character):
        
        self.outcomes.add(Outcome(character,
            "You grow stronger.",
        ), weight=1)
