"""
St. George Game
weapons.py
Sage Berg
Created: 12 Dec 2014
"""

from collections import namedtuple

Weapon = namedtuple("Weapon", ["name", "attack", "price"])
dagger = Weapon("dagger", 2, "pittance")
