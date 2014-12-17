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
    display = Display()
    display.enable()
    threat_level = 0
    character = Character()
    character.place = places.tavern
    character.actions["a"] = actions.AskAboutAssassins()
    character.actions["b"] = actions.BuyADrink()
    character.actions["c"] = actions.LeaveInAHuff()
    character.actions["d"] = actions.SingASong()
    display.write("\n---The St. George Game---\n")
    display.write("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone:
        if character.threatened:
            threat_level += 1
            if threat_level > 1:
                Display().write("A skuffle breaks out.")
                actions.Attack(character.person).execute(character)
                if not character.alive:
                    break
        else:
            threat_level = 0
        action = character.choose_action()
        display.enable()
        action.execute(character)
        character.prev_act = action
        for item in character.items:
            item.contribute(character)
        character.generate_actions()

if __name__ == "__main__":
    main()
