"""
St. George Game
main.py
Sage Berg
Created: 5 Dec 2014
Updated: 7 Dec 2014
"""

from stgeorgegame import *


def main():
    character = Character()
    place = None
    person = None
    prev_act = None
    while character.alive and character.alone:
        curr_frame = Frame(place, person, prev_act)
        location, person, prev_act = curr_frame.prompt()

    """
    tavern = Place("the tavern")
    streets = Place("the streets")
    church = Place("the church")
    docks = Place("the docks")
    marketplace = Place("the marketplace")
    countryside = Place("the countryside")
    prison = Place("the prison")
    """


if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
