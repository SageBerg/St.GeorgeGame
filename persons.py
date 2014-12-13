"""
St. George Game
person.py
Sage Berg
Created: 7 Dec 2014
"""

import abc
from collections import namedtuple

import actions
from raffle import Raffle 

Pronouns = namedtuple("Pronouns", ["subj", "obj", "tense"])


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

    def __init__(self):
        self.name = "pretty lady"
        self.attack = 1
        self.pronouns = Pronouns("she", "her", "s")
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
        self.options["a"].add(actions.Attack(self), weight=10)
        self.options["b"].add(actions.BoastOfYourBravery(), weight=5)
        #self.options["b"].add(BuyHerADrink)
        #self.options["c"].add(TalkAboutCats)
