"""
St. George Game
st.georgegame.py
Sage Berg
Created: 5 Dec 2014
Updated: 7 Dec 2014
"""

from random import choose


class Character(object):

    def __init__(self):
        self.best_weapon = ""
        self.attack = 0
        self.alive = True
        self.alone = True


class Person(object):

    def __init__(self, name, attack):
        self.name = name
        self.attack = attack
        self.pronoun = "it"


class Place(object):
    """
    abstract class
    """

    def __init__(self, name):
        self.name = name
        self.connections = list()

    def contribute(self):
        pass


class Frame(object):
    """

    """

    def __init__(self):
        self.message = ""

        self.place = None
        self.person = None
        self.prev_act = None

        self.bags_dict = {"a": OptionsBag(),
                          "b": OptionsBag(),
                          "c": OptionsBag(),
                          "d": OptionsBag()}
        for key in self.bags_dict:
            self.bags_dict[key].add(self.place.contribute(key))
            self.bags_dict[key].add(self.person.contribute(key))
            self.bags_dict[key].add(self.prev_act.contribute(key))

        self.a = self.bags_dict["a"].get_option()
        self.b = self.bags_dict["b"].get_option()
        self.c = self.bags_dict["c"].get_option()
        self.d = self.bags_dict["d"].get_option()
        self.actions_dict = {"a": self.a,
                             "b": self.b,
                             "c": self.c,
                             "d": self.d}

    def prompt(self):
        """
        prints outcome of last action (the message)
        takes input from user
        user input will spawn the next frame
        """
        print(self.message)
        print(self.a)
        print(self.b)
        print(self.c)
        print(self.d)
        choice = input()
        go_to_next = False
        while not go_to_next:
            if choice not in "abcd" or \
               len(choice) > 1 or \
               len(choice) == 0:
                print("Enter a, b, c, or d")
                choice = input()
            else:
                go_to_next = True
        print("good input")
        self.actions_dict[choice].execute()


class OptionsBag(object):
    #TODO improve time complexity later
    def __init__(self):
        self.options = list()

    def add(self, item, times=1):
        for i in times:
            self.options.append(item)

    def get_option(self):
        return choose(self.options)


class Action(object):
    """
    Abstract class
    """
    def __init__(self):
        pass

    def exectute():
        """
        returns a place, a person, and a prev_action
        """
        pass
