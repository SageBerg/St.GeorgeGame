"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

from frame import Frame
from character import Character
from places import Tavern
from actions import AskAboutAssassins, BuyADrink, LeaveInAHuff, SingASong


def main():
    character = Character()
    msg = "You are in a tavern. The local assassins hate you."
    opening_frame = Frame(msg, Tavern, None, None)
    opening_frame.actions["a"] = AskAboutAssassins()
    opening_frame.actions["b"] = BuyADrink()
    opening_frame.actions["c"] = LeaveInAHuff()
    opening_frame.actions["d"] = SingASong()
    curr_frame = opening_frame
    while character.alive and character.alone:
        action = curr_frame.prompt()
        msg, place, person, prev_act = action.execute(curr_frame.place,
                                                      curr_frame.person,
                                                      curr_frame.prev_act)
        curr_frame = Frame(msg, place, person, prev_act)

if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
