import random

import items
import money


class Outcome(object):

    def __init__(self,
                 state,
                 msg,
                 add_item=False,  # USAGE: items.item_name
                 remove_item=False,  # USAGE: items.item_name
                 remove_all_items=False,
                 clover=False,
                 grow_stronger=False,
                 beg=False,
                 burn_place=False,
                 trash_place=False,
                 lose=False,
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
                 funcs=(),  # USAGE [action]
                 funcs_with_args=(),  # USAGE [(action, arg)]
                 actions=(),  # USAGE: [(Action action(), int weight)]
                 succeed=False,
                 lose_money=None,  # USAGE: (int amount)
                 lose_all_money=False,
                 score=1,  # each action gives you one point by default
                 ):
        self.state = state
        self.add_item = add_item
        self.remove_item = remove_item
        self.remove_all_items = remove_all_items
        self.grow_stronger = grow_stronger
        self.clover = clover
        self.beg = beg
        self.burn_place = burn_place
        self.trash_place = trash_place
        self.character = state.character
        self.lose = lose
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
            for i in range(len(msg)):
                msg[i] = msg[i].strip(".,\"\'!")
                msg[i] = msg[i].lower()
            random.shuffle(msg)
            self.msg = msg[0][0].upper() + " ".join(msg)[1:] + "."
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
        self.funcs_with_args = funcs_with_args 
        self.actions = actions
        self.lose_money = lose_money
        self.lose_all_money = lose_all_money 
        self.score = score

    def execute(self):
        """
        NOTE: order of conditions must be logical (based on what should be
              printed first)
        """
        if self.msg:
            print(self.msg)

        if self.beg:
            self.character.person.state["given money"] = True
        if self.lock:
            self.state.places.locked.add(self.character.place)
        if self.burn_place:
            self.burn_place.name = "the smoldering remains of " \
                                   + self.burn_place.name
            self.state.places.burnable.remove(self.burn_place)
            self.state.places.burned.add(self.burn_place)
        if self.trash_place:
            self.trash_place.name = "the trashed remains of " \
                                    + self.trash_place.name
            self.state.places.trashed.add(self.trash_place)

        if self.kill:  # this needs to happen before move_to
            if self.new_person:  # use the new person
                person = self.new_person
            else:
                person = self.character.person
            person.alive = False
            self.character.person = None
            self.character.threatend = False

        if self.move:
            self.character.move(self.move)
        if self.move_to:
            self.character.move_to(self.move_to)
        if self.win:
            self.score += 100     
        self.character.score += self.score
        if self.die:
            if self.character.has_item(items.four_leaf_clover) and \
               self.clover:
                print("Or at least that's what you imagine would have "
                      "happened if you didn't have a four-leaf clover.")
            else:
                self.character.die()

        if self.new_person is None or self.new_person:
            if not self.kill:  
                # The person will already be dead if killed is true
                self.character.person = self.new_person

        if self.lose:
            self.character.lose = True
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
        for tup in self.funcs_with_args:
            tup[0](tup[1])  # tup[0] is the function
                            # tup[1] is the argument 
        if self.lose_money is not None:
            self.character.lose_money(self.lose_money)
        if self.lose_all_money:
            self.character.lose_all_money()
