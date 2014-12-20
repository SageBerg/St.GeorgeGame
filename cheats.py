import actions
import places
import persons


class Cheat(actions.Action):
    """
    The cheat action is mostly meant for debugging.
    """
    def __init__(self, code):
        super().__init__()
        self.code = code

    def execute(self, character):
        words = self.code.split(" ")
        if words[0].lower() == "go" and words[1] == "to":
            place_name = " ".join(words[2:])
            for place in places.Place.instances:
                if place.name == place_name:
                    character.move_to(place)
        if words[0] == "Felicity" and words[1] == "wow":
            persons.fat_lady.attracted += 20
