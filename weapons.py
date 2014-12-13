"""
St. George Game
weapons.py
Sage Berg
Created: 12 Dec 2014
"""

from collections import namedtuple

Weapon = namedtuple("Weapon", ["name", "attack", "price"])

pitchfork = Weapon("pitchforkr", 1, "pittance")
dagger = Weapon("dagger", 2, "pittance")
cutlass = Weapon("cutlass", 3, "pittance")
hammer = Weapon("hammer", 4, "pittance")
long_pitchfork = Weapon("long pitchfork", 5, "pittance")
poisoned_dagger = Weapon("poisoned dagger", 6, "small fortune")
jeweled_cutlass = Weapon("jeweled cutlass", 7, "large fortune")
iron_hammer = Weapon("dagger", 8, "small fortune")
