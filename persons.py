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

    def __init__(self, Attack):
        self.name = "pretty lady"
        self.attack = 1
        self.pronouns = ("she", "her")
        self.options = {"a": ActionBag(),
                        "b": ActionBag(),
                        "c": ActionBag(),
                        "d": ActionBag()}
        self.options["a"].add(Attack())  # broken
        #self.options["b"].add(BoastOfYourBravery)
        #self.options["b"].add(BuyHerADrink)
        #self.options["c"].add(TalkAboutCats)
