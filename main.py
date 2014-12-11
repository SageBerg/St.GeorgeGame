"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

from character import Character
from places import Tavern
from actions import AskAboutAssassins, BuyADrink, LeaveInAHuff, SingASong


def main():
    character = Character()
    msg = "You are in a tavern. The local assassins hate you."
    character.place = Tavern
    character.message = msg
    character.actions["a"] = AskAboutAssassins()
    character.actions["b"] = BuyADrink()
    character.actions["c"] = LeaveInAHuff()
    character.actions["d"] = SingASong()
    print()
    print("---The St. George Game---")
    while character.alive and character.alone:
        action = character.choose_action()
        action.execute(character)
        if not character.alive:
            print()
            print(character.message)
            print()

if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
