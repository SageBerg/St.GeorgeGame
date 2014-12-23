import items
import actions
import places
import persons
from outcome import Outcome


class Cheat(actions.Action):
    """
    The cheat action is mostly meant for debugging.
    """
    def __init__(self, code):
        super().__init__()
        self.code = code

    def cheat(self, character):
        words = self.code.split(" ")
        if words[0].lower() == "go" and words[1] == "to":
            place_name = " ".join(words[2:])
            for place in places.Place.instances:
                if place.name == place_name:
                    character.move_to(place)
        if words[0] == "Felicity" and words[1] == "wow":
            persons.fat_lady.attracted += 20
        if words[0] == "get" and words[1] == "mushroom":
            character.add_item(items.YellowMushroom())

    def execute(self, character):
       self.outcomes.add(Outcome(character,
           None,
           funcs=[lambda: self.cheat(character)]
       ), weight=1)
