class Item(object):
    """
    abstract class
    """

    by_name = dict()

    def __init__(self, name):
        self.name = name
        Item.by_name[name] = self

    def __str__(self):
        return self.name


def a_or_an(item):
    if str(item)[0] in "AEIOUaeiou":
        return "an"
    return "a"


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
