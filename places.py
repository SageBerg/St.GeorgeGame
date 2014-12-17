"""
St. Georege Game
places.py
Sage Berg
Created: 7 Dec 2014
"""

from raffle import Raffle
import actions


class Place(object):

    instances = set()
    populated = set()
    burnable = set()

    def __init__(self, name, populated=False, burnable=False):
        """
        args: name: string
              populated: boolean
        """
        self.name = name
        self.connections = set()
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
        Place.instances.add(self)
        if populated:
            Place.populated.add(self)
        if burnable:
            Place.burnable.add(self)

    def __str__(self):
        return self.name


artic = Place("the artic")
cave = Place("a dark cave")
church = Place("the church", burnable=True)
countryside = Place("the countryside")
dark_alley = Place("a dark alley")
docks = Place("the docks", populated=True, burnable=True)
lord_bartholomews_manor = Place("lord Bartholomew's manor", populated=True, burnable=True)
lord_carlos_manor = Place("lord Carlos' manor", burnable=True)
market = Place("the market", populated=True, burnable=True)
mermaid_rock = Place("the mermaid rock")
ocean = Place("the ocean")
pirate_ship = Place("a pirate ship")
prison = Place("prison", burnable=True)
streets = Place("the streets", populated=True)
tavern = Place("the tavern", populated=True, burnable=True)
tower = Place("the tower", burnable=True)
upstairs = Place("the upstairs of the tavern")
wizards_lab = Place("the wizard's lab", burnable=True)
woods = Place("the woods", burnable=True)

# Connections

artic.connections.add(ocean)
cave.connections.add(woods)
church.connections.add(market)
church.connections.add(streets)
countryside.connections.add(docks)
countryside.connections.add(lord_bartholomews_manor)
countryside.connections.add(streets)
countryside.connections.add(woods)
dark_alley.connections.add(streets)
docks.connections.add(pirate_ship)
docks.connections.add(streets)
docks.connections.add(woods)
lord_bartholomews_manor.connections.add(countryside)
lord_carlos_manor.connections.add(woods)
market.connections.add(church)
market.connections.add(streets)
market.connections.add(wizards_lab)
mermaid_rock.connections.add(ocean)
ocean.connections.add(artic)
ocean.connections.add(docks)
ocean.connections.add(mermaid_rock)
ocean.connections.add(pirate_ship)
pirate_ship.connections.add(docks)
pirate_ship.connections.add(ocean)
prison.connections.add(streets)
streets.connections.add(church)
streets.connections.add(countryside)
streets.connections.add(dark_alley)
streets.connections.add(docks)
streets.connections.add(market)
streets.connections.add(prison)
streets.connections.add(tavern)
streets.connections.add(tower)
tavern.connections.add(streets)
tower.connections.add(streets)
upstairs.connections.add(tavern)
wizards_lab.connections.add(market)
woods.connections.add(cave)
woods.connections.add(countryside)
woods.connections.add(docks)
woods.connections.add(lord_carlos_manor)

# actions

market.options["a"].add(actions.LookForAWeapon(), weight=10)
ocean.options["a"].add(actions.GoDivingForPearls(), weight=10)
streets.options["a"].add(actions.LookForStGeorge(), weight=2)
tavern.options["b"].add(actions.BuyADrink(), weight=2)
tavern.options["b"].add(actions.AskAboutAssassins(), weight=1)

for place in Place.burnable:
    place.options["d"].add(actions.BurnThePlaceToTheGround(place), weight=5)
