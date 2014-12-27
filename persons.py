"""
St. George Game
person.py
Sage Berg
Created: 7 Dec 2014
"""

from collections import namedtuple

from raffle import Raffle
from display import Display

Pronouns = namedtuple("Pronouns", ["subj", "obj", "tense"])


class Person(object):

    def __init__(self, name, attack, pronouns, arrester=False):
        self.name = name
        self.attack = attack
        self.arrester = arrester
        self.pronouns = pronouns
        self.alive = True
        self.state = {}
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
        self.attracted = 0

assassin = Person("the assassin", 6,
                  Pronouns("the asassin", "the asassin", "s"))
assassins = Person("the assassins", 6,
                   Pronouns("the assassins", "the assassins", ""))
blind_bartender = Person("the blind bartender", 1, Pronouns("he", "him", "s"))
fat_lady = Person("the fat lady who feeds you", 4, Pronouns("she", "her", "s"))
guards = Person("the guards", 1, Pronouns("they", "the guards", ""), 
                arrester=True)
mermaid = Person("the mermaid", 3, Pronouns("the mermaid", "the mermaid", "s"))
mob = Person("the angry mob", 9,
             Pronouns("the angry mob", "the angry mob", "s"))
other_lunatics = Person("the other lunatics", -1,
                        Pronouns("they", "the other lunatics", ""))
peasant_lass = Person("the peasant lass", 7,
                      Pronouns("she", "her", "s"))
pirate_wench = Person("the pirate wench", 2,
                      Pronouns("the pirate wench", "the pirate wench", "s"))
pretty_lady = Person("the pretty lady", 1, Pronouns("she", "her", "s"))
simple_peasant = Person("the simple peasant", -1,
                        Pronouns("he", "the simple peasant", "s"))
st_george = Person("St. George", 100, Pronouns("he", "him", "s"))
wealthy_merchant = Person("the wealthy merchant", 7,
                          Pronouns("he", "him", "s"))
wizard = Person("the wizard", 7, Pronouns("he", "him", "s"))
lord_arthur = Person("Lord Arthur", 6, Pronouns("he", "him", "s"))
lord_bartholomew = Person("Lord Bartholomew", 4, Pronouns("he", "him", "s"))
lord_carlos = Person("Lord Carlos", 5, Pronouns("he", "him", "s"))
lord_daniel = Person("Lord Daniel", 7, Pronouns("he", "him", "s"))
