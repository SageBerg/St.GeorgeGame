"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

from character import Character
from display import Display
from places import Tavern
from actions import AskAboutAssassins, BuyADrink, LeaveInAHuff, SingASong


def main():
    display = Display()
    display.enable()
    character = Character()
    character.place = Tavern
    character.actions["a"] = AskAboutAssassins()
    character.actions["b"] = BuyADrink()
    character.actions["c"] = LeaveInAHuff()
    character.actions["d"] = SingASong()
    display.write("\n---The St. George Game---\n")
    display.write("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone:
        action = character.choose_action()
        display.enable()
        action.execute(character)

if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
