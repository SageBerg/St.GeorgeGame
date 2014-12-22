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
        self.attracted = 0

assassin = Person("the assassin", 6, Pronouns("the asassin", "the asassin", "s"))
assassins = Person("the assassins", 6, Pronouns("they", "them", ""))
blind_bartender = Person("the blind bartender", 1, Pronouns("he", "him", "s"))
fat_lady = Person("the fat lady", 4, Pronouns("she", "her", "s"))
guards = Person("the guards", 1, Pronouns("they", "the guards", ""))
other_lunatics = Person("the other lunatics", -1,
                        Pronouns("they", "the other lunatics", ""))
pretty_lady = Person("the pretty lady", 1, Pronouns("she", "her", "s"))
st_george = Person("St. George", 100, Pronouns("he", "him", "s"))
wealthy_merchant = Person("the wealthy merchant", 7,
                          Pronouns("he", "him", "s"))
wizard = Person("the wizard", 7, Pronouns("he", "him", "s"))


def meet_felicity():
    if fat_lady.attracted > 2:
        Display().write("You strike up a conversation and learn that her name "
                        "is Felicity.")
        fat_lady.name = "Felicity"
        fat_lady.pronouns = Pronouns("Felicity", "Felicity", "s")
        return True  # used in actions.FlirtWithFatLady
    return False


def felicity_loves_you():
    if fat_lady.attracted > 10:
        Display().write("Felicity whispers that she loves you.")
        return True  # used in actions.FlirtWithFelicity
    return False
