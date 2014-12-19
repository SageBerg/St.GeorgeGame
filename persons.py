"""
St. George Game
person.py
Sage Berg
Created: 7 Dec 2014
"""

from collections import namedtuple

import actions
import weapons
from raffle import Raffle

Pronouns = namedtuple("Pronouns", ["subj", "obj", "tense"])


class Person(object):

    def __init__(self, name, attack, pronouns):
        self.name = name
        self.attack = attack
        self.pronouns = pronouns
        self.alive = True
        self.state = {}
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

assassin = Person("assassin", 6, Pronouns("the asassin", "the asassin", "s"))
assassins = Person("assassins", 6, Pronouns("they", "them", ""))
blind_bartender = Person("the blind bartender", 1, Pronouns("he", "him", "s"))
guards = Person("the guards", 1, Pronouns("they", "the guards", ""))
other_lunatics = Person("the other lunatics", -1, 
                        Pronouns("they", "the other lunatics", ""))
pretty_lady = Person("pretty lady", 1, Pronouns("she", "her", "s"))
st_george = Person("St. George", 100, Pronouns("he", "him", "s"))
wealthy_merchant = Person("the wealthy merchant", 7,
                          Pronouns("he", "him", "s"))
wizard = Person("the wizard", 7, Pronouns("he", "him", "s"))

assassin.options["d"].add(actions.Apologize(), weight=10)

assassins.options["b"].add(actions.BoastOfYourBravery(), weight=1)

blind_bartender.options["b"].add(actions.BoastOfYourBravery(), weight=1)

pretty_lady.options["b"].add(actions.BoastOfYourBravery(), weight=5)

st_george.options["b"].add(actions.BegForMoney(), weight=10)

wealthy_merchant.options["b"].add(actions.BoastOfYourBravery(), weight=1)
wealthy_merchant.options["b"].add(actions.Buy(weapons.weapons), weight=10)

wizard.options["b"].add(actions.BoastOfYourBravery(), weight=2)
#wizard.options["b"].add(actions.BuyAPotion, weight=3)
wizard.options["d"].add(actions.SingASong(), weight=2)
