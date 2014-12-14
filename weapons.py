"""
St. George Game
weapons.py
Sage Berg
Created: 12 Dec 2014
"""

from collections import namedtuple

Weapon = namedtuple("Weapon", ["name", "attack", "price"])

weapons = [
Weapon("pitchfork", 1, "pittance"),
Weapon("dagger", 2, "pittance"),
Weapon("cutlass", 3, "pittance"),
Weapon("hammer", 4, "pittance"),
Weapon("long pitchfork", 5, "pittance"),
Weapon("poisoned dagger", 6, "small fortune"),
Weapon("jeweled cutlass", 7, "large fortune"),
Weapon("dagger", 8, "small fortune") ]
