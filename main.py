"""
St. George Game
main.py
Sage Berg
Created: 5 Dec 2014
"""

from st_george_game import Character, Frame, ActionBag
from places import Tavern
from actions import AskAboutAssassins, BuyADrink, LeaveInAHuff, SingASong

def main():
    character = Character()
    msg = "You are in a tavern. The local assassins hate you."
    opening_frame = Frame(msg, Tavern, None, None)
    opening_frame.a_action = AskAboutAssassins()
    opening_frame.b_action = BuyADrink() 
    opening_frame.c_action = LeaveInAHuff()
    opening_frame.d_action = SingASong()
    opening_frame.prompt()
    while character.alive and character.alone:
        curr_frame = Frame(place, person, prev_act)
        location, person, prev_act = curr_frame.prompt()

if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
