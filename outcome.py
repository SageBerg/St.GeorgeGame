"""
St. George Game
outcome.py
Sage Berg
Created: 21 Dec 2014
"""

import random

from display import Display
import places


class Outcome(object):

    def __init__(self,
                 character,
                 msg,

                 add_item=False,  # USAGE: items.Item()
                 remove_item=False,  # USAGE: character.get_item(items.Item)
                 remove_all_items=False,
                 new_weapon=False,  # USAGE: weapons[x]
                 grow_stronger=False,
                 beg=False,
                 burn_place=False,
                 die=False,
                 fail=False,
                 get_money=False,
                 kill=False,
                 lock=False,
                 move=False,
                 move_to=False,
                 new_person=False,
                 win=False,
                 threat=False,
                 unthreat=False,
                 flirt=None,  # USAGE: (person, int)
                 love_confessor=None,  # USAGE: person
                 add_employer=None,
                 remove_employer=None,
                 topic=None,
                 funcs=(), # USAGE [action]
                 actions=(),  # USAGE: [(Action action(), srt slot, int weight)]
                 succeed=False
                 ):
        self.add_item = add_item
        self.remove_item = remove_item
        self.remove_all_items = remove_all_items
        self.new_weapon = new_weapon
        self.grow_stronger = grow_stronger
        self.beg = beg
        self.burn_place = burn_place
        self.character = character
        self.die = die
        self.fail = fail
        self.succeed = succeed
        self.get_money = get_money
        self.kill = kill
        self.lock = lock
        self.move = move
        self.move_to = move_to
        if msg and self.character.trip:
            msg = msg.split(" ")
            random.shuffle(msg)
            self.msg = " ".join(msg)
        else:
            self.msg = msg
        self.new_person = new_person
        self.win = win
        self.threat = threat
        self.unthreat = unthreat
        self.flirt = flirt
        self.love_confessor = love_confessor
        self.topic = topic
        self.add_employer = add_employer
        self.remove_employer = remove_employer
        self.funcs = funcs
        self.actions = actions

    def execute(self):
        """
        NOTE: order of conditions must be logical (based on what should be
              printed first)
        """
        if self.msg:
            Display().write(self.msg)

        if self.new_weapon and self.character.attack < self.new_weapon.attack:
            self.character.weapon = self.new_weapon
            self.character.attack = self.new_weapon.attack
            if self.new_weapon.name[0] in "aeiou":
                Display().write("You now have an " +
                                self.new_weapon.name + ".")
            else:
                Display().write("You now have a " + self.new_weapon.name + ".")
        if self.beg:
            self.character.person.state["given money"] = True
        if self.lock:
            self.character.place.locked = True
        if self.burn_place:
            self.burn_place.name = "the smoldering remains of " \
                                   + self.burn_place.name
            places.burnable.remove(self.burn_place)
            places.burned.add(self.burn_place)

        if self.kill:
            self.character.person.alive = False
            self.character.person = None
            self.character.threatend = False
        if self.move:
            self.character.move(self.move)
        if self.move_to:
            self.character.move_to(self.move_to)
        if self.new_person is None or self.new_person:
            self.character.person = self.new_person
        if self.die:
            self.character.die()
        if self.add_item:
            self.character.add_item(self.add_item)
        if self.remove_item:
            self.character.remove_item(self.remove_item)
        if self.remove_all_items:
            self.character.remove_all_items()
        if self.get_money:
            self.character.get_money(self.get_money)
        if self.win:
            self.character.win()
        if self.threat:
            self.character.threatened = True
        if self.unthreat:
            self.character.threatened = False
        if self.add_employer:
            self.character.add_employer(self.add_employer)
        if self.remove_employer:
            self.character.remove_employer(self.remove_employer)
        if self.flirt:
            self.flirt[0].attracted += self.flirt[1]
        if self.grow_stronger:
            self.character.grow_stronger(self.grow_stronger)
        for func in self.funcs:
            func()
