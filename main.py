"""
St. George Game
main.py
Sage Berg
Created: 5 Dec 2014
"""

from st_george_game import Character, Frame, ActionsBag


def main():
    character = Character()
    msg = "You are in a tavern. The local assassins hate you."
    opening_frame = Frame
    opening_frame.prompt()
    while character.alive and character.alone:
        curr_frame = Frame(place, person, prev_act)
        location, person, prev_act = curr_frame.prompt()


def spawn_opening_frame():
    """
    Note: The first frame does not have a place, since its
          options are always supposed to be the same. Any
          action taken in this frame will move the player
          to the tavern. From the player's perspective he
          is already in the tavern.
    """
    opening_frame = Frame(m, None, None, None)
    return opening_frame

if __name__ == "__main__":
    while True:  # the game automatically restarts
        main()
