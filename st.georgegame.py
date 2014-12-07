"""
St. George Game
st.georgegame.py
Sage Berg
Created: 5 Dec 2014
Updated: 6 Dec 2014
"""

from random import choose

class Character(object):

    def __init__(self):
        self.best_weapon = ""
        self.attack = 0
        self.location = None


class NPC(object):

    def __init__(self, name, attack):
        self.name = name
        self.attack = attack
        self.pronoun = "it"

class Place(object):
    
    def __init__(self, name):
        self.name = name 
        self.connections = list()

class Frame(object):
    """
    
    """

    def __init__(self):
        self.place = None
        self.person = None
        self.previous_action = None

        bags_dict = {"a":OptionsBag(), 
                     "b":OptionsBag(), 
                     "c":OptionsBag(),
                     "d":OptionsBig()}
        for key in bags_dict:
            bags_dict[key].add(self.place.contribute(key))
            bags_dict[key].add(self.person.contribute(key))
            bags_dict[key].add(self.previous_action.contribute(key))
        
class OptionsBag(object):
    #TODO improve time complexity later 
    def __init__(self):
        self.options = list()

    def add(self, item, times=1):
        for i in times:
            self.options.append(item)

    def get_option():
        return choose(self.options)

class Action(object):
