"""
St. George Game
weapons.py
Sage Berg
Created: 12 Dec 2014
"""

from collections import namedtuple

Weapon = namedtuple("Weapon", ["name", "attack", "price"])

weapons = [
    Weapon("pitchfork", 1, 1),
    Weapon("dagger", 2, 1),
    Weapon("cutlass", 3, 1),
    Weapon("hammer", 4, 1),
    Weapon("long pitchfork", 5, 1),
    Weapon("poisoned dagger", 6, 2),
    Weapon("jeweled cutlass", 7, 3),
    Weapon("iron hammer", 8, 2)]

pitchfork = weapons[0]
dagger = weapons[1]
cutlass = weapons[2]
hammer = weapons[3]
long_pitchfork = weapons[4]
poisoned_dagger = weapons[5]
jeweled_cutlass = weapons[6]
iron_hammer = weapons[7]
