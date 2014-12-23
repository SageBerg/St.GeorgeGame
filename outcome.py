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

                 beg=False,
                 burn_place=False,
                 die=False,
                 fail=False,
                 add_item=False,
                 get_money=False,
                 kill=False,
                 lock=False,
                 move=False,
                 move_to=False,
                 new_person=False,
                 win=False,
                 topic=None
                 ):
        self.beg = beg
        self.burn_place = burn_place
        self.character = character
        self.die = die
        self.fail = fail
        self.add_item = add_item
        self.get_money = get_money
        self.kill = kill
        self.lock = lock
        self.move = move
        self.move_to = move_to
        self.msg = msg
        self.new_person = new_person
        self.win = win
        self.topic = topic

    def execute(self):
        """
        NOTE: order of conditions must be logical (based on what should be
              printed first)
        """
        if self.beg:
            self.character.person.state["given money"] = True
        if self.lock:
            self.character.place.locked = True
        if self.burn_place:
            self.burn_place.name = "the smoldering remains of " \
                                   + self.burn_place.name
        if self.new_person:
            self.character.person = self.new_person

        Display().write(self.msg)

        if self.kill:
            self.character.person.alive = False
            self.character.person = None
            self.character.threatend = False
        if self.move:
            self.character.move(self.move)
        if self.move_to:
            self.character.move_to(self.move_to)
        if self.die:
            self.character.die()
        if self.add_item:
            self.character.add_item(self.add_item)
        if self.get_money:
            self.character.get_money(self.get_money)
        if self.win:
            self.character.win()
