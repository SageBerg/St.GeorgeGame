"""
person.py
Sage Berg
Created: 7 Dec 2014
"""


class Person(object):
    """
    abstract class
    """

    def __init__(self, name, attack):
        self.name = name
        self.attack = attack
        self.pronoun = "it"
