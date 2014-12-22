"""
St. George Game
outcome.py
Sage Berg
Created: 21 Dec 2014
"""

from display import Display

class Outcome(object):
    
    def __init__(self, 
                 character, 
                 msg,

                 burn_place=False,
                 die=False, 
                 fail=False, 
                 get_item=False,
                 get_money=False, 
                 move=False, 
                 move_to = False,
                 new_person=False,
                 win=False, 
                 ):
        self.burn_place = burn_place
        self.character = character
        self.die = die
        self.fail = fail
        self.get_item = get_item
        self.get_money = get_money
        self.move = move
        self.move_to = move_to
        self.msg = msg
        self.new_person = new_person
        self.win = win

    def execute(self):
        """
        NOTE: order of conditions must be logical (based on what should be 
              printed first)
        """
        if self.burn_place:
            self.burn_place.name = "the smoldering remains of " \
                                   + self.burn_place.name
        if self.new_person:
            self.character.person = self.new_person

        Display().write(self.msg)

        if self.move:
            self.character.move(self.move)
        if self.move_to:
            self.character.move_to(self.move_to)
        if self.die:
            self.character.die() 
        if self.get_item:
            self.character.get_item(self.get_item)
        if self.win:
            self.character.win()
