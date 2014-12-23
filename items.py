"""
St. George Game
actions.py
Skyler Berg
Created: 16 Dec 2014
"""

import abc


class Item(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""

    def __str__(self):
        return self.name


class ManyColoredMushroom(Item):

    def __init__(self):
        super().__init__()
        self.name = "many-colored mushroom"


class BlackMushroom(Item):

    def __init__(self):
        super().__init__()
        self.name = "black mushroom"


class WhiteMushroom(Item):

    def __init__(self):
        super().__init__()
        self.name = "white mushroom"


class YellowMushroom(Item):

    def __init__(self):
        super().__init__()
        self.name = "yellow mushroom"


class Cat(Item):

    def __init__(self):
        super().__init__()
        self.name = "cat"


class Pearl(Item):

    def __init__(self):
        super().__init__()
        self.name = "pearl"
