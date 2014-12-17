"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

import places
from character import Character
from display import Display
import actions


def main():
    """
    runs program
    """
    display = Display()
    display.enable()
    character = Character()
    character.place = places.tavern
    character.actions["a"] = actions.AskAboutAssassins()
    character.actions["b"] = actions.BuyADrink()
    character.actions["c"] = actions.LeaveInAHuff()
    character.actions["d"] = actions.SingASong()
    display.write("\n---The St. George Game---\n")
    display.write("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone:
        action = character.choose_action()
        display.enable()
        if not character.threatened or action.combat_action:
            action.execute(character)
        else:
            Display().write(character.person.pronouns.subj.capitalize() +
                            " attack" +
                            character.person.pronouns.tense + " you.")
            actions.Attack(character.person).execute(character)
            if not character.alive:
                break
        character.prev_act = action
        for item in character.items:
            item.contribute(character)
        character.generate_actions()

if __name__ == "__main__":
    main()
