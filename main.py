"""
St. George Game
main.py
Sage Berg
Created: 5 Dec 2014
"""

from st_george_game import *


def main():
    character = Character()
    place = None
    person = None
    prev_act = None
    while character.alive and character.alone:
        curr_frame = Frame(place, person, prev_act)
        location, person, prev_act = curr_frame.prompt()


if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
