"""
St. George Game
actions.py
Skyler Berg
Created: 16 Dec 2014
"""


class Item(object):
    """
    abstract class
    """

    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name


strength_potion = Item("potion of strength")
tail_potion = Item("potion of tail growth")
love_potion = Item("love potion")
sailor_peg = Item("sailor peg")
four_leaf_clover = Item("four-leaf clover")
bouquet_of_flowers = Item("bouquet of flowers")
fish = Item("fish")
seal_carcass = Item("seal carcass")
fire_proof_cloak = Item("fancy red cloak")
many_colored_mushroom = Item("many-colored mushroom")
black_mushroom = Item("black mushroom")
white_mushroom = Item("white mushroom")
yellow_mushroom = Item("yellow mushroom")
cat = Item("cat")
frog = Item("frog")
deep_cave_newt = Item("deep-cave newt")
pearl = Item("pearl")
jewels = Item("bag of jewels")
foreign_coin = Item("shiny foreign coin")
ax = Item("ax")
bottle_of_sap = Item("bottle of sap")
bottle_of_void_dust = Item("bottle of void dust")

pitchfork = Item("pitchfork")
dagger = Item("dagger")
cutlass = Item("cutlass")
hammer = Item("hammer")
long_pitchfork = Item("long pitchfork")
poisoned_dagger = Item("poisoned dagger")
jeweled_cutlass = Item("jeweled cutlass")
iron_hammer = Item("iron hammer")

buyable = [bouquet_of_flowers, fish, ax, pearl, sailor_peg]

black_market = [deep_cave_newt, love_potion, black_mushroom,
                tail_potion, strength_potion, fire_proof_cloak,
                many_colored_mushroom, white_mushroom]

weapons = [
    pitchfork,
    dagger,
    cutlass,
    hammer,
    long_pitchfork,
    poisoned_dagger,
    jeweled_cutlass,
    iron_hammer]

def get_weapon_price(weapon):
    """
    This function is a temporary solution that should be removed when a more
    general shopping solution is implemented.
    """
    if weapon == pitchfork:
        return 1
    if weapon == dagger:
        return 1
    if weapon == cutlass:
        return 1
    if weapon == hammer:
        return 1
    if weapon == long_pitchfork:
        return 1
    if weapon == poisoned_dagger:
        return 2
    if weapon == jeweled_cutlass:
        return 3
    if weapon == iron_hammer:
        return 2
