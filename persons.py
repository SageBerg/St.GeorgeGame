"""
St. George Game
person.py
Sage Berg
Created: 7 Dec 2014
"""

from actions import *
from action_bag import ActionBag
import abc


class Person(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self, name, attack, pronoun):
        self.name = name
        self.attack = attack
        self.pronoun = pronoun

    @abc.abstractmethod
    def options(self):
        "returns an options_bag"
        pass


class PrettyLady(Person):

    def __init__(self, Attack, BoastOfYourBravery):
        self.name = "pretty lady"
        self.attack = 1
        self.pronouns = ("she", "her", "s")  # the s is to append to
                                             # verbs in output
        self.options = {"a": ActionBag(),
                        "b": ActionBag(),
                        "c": ActionBag(),
                        "d": ActionBag()}
        for i in range(10):
            self.options["a"].add(Attack(self))  
        self.options["b"].add(BoastOfYourBravery())
        #self.options["b"].add(BuyHerADrink)
        #self.options["c"].add(TalkAboutCats)
