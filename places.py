"""
St. Georege Game
places.py
Sage Berg
Created: 7 Dec 2014
"""

from raffle import Raffle


class Place(object):
    """
    """

    instances = set()

    def __init__(self, name):
        self.name = name
        self.connections = set()
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
        Place.instances.add(self)

    def __str__(self):
        return self.name


tavern = Place("the tavern")
upstairs = Place("the upstairs of the tavern")
streets = Place("the streets")
market = Place("the market")
countryside = Place("the countryside")
ocean = Place("the ocean")
prison = Place("prison")
cave = Place("a dark cave")
dark_alley = Place("a dark alley")
church = Place("the church")
tower = Place("the tower")
docks = Place("the docks")
pirate_ship = Place("a pirate ship")
mermaid_rock = Place("the mermaid rock")
artic = Place("the artic")
lord_carlos_manor = Place("lord Carlos' manor")
lord_bartholomews_manor = Place("lord Bartholomew's manor")
wizards_lab = Place("the wizard's lab")
woods = Place("the woods")

# Connections
tavern.connections.add(streets)

upstairs.connections.add(tavern)

streets.connections.add(tavern)
streets.connections.add(church)
streets.connections.add(dark_alley)
streets.connections.add(prison)
streets.connections.add(market)
streets.connections.add(countryside)
streets.connections.add(docks)
streets.connections.add(tower)

market.connections.add(streets)
market.connections.add(wizards_lab)
market.connections.add(church)

countryside.connections.add(streets)
countryside.connections.add(docks)
countryside.connections.add(woods)
countryside.connections.add(lord_bartholomews_manor)

tower.connections.add(streets)

wizards_lab.connections.add(market)

prison.connections.add(streets)

cave.connections.add(woods)

woods.connections.add(cave)
woods.connections.add(countryside)
woods.connections.add(lord_carlos_manor)

lord_carlos_manor.connections.add(woods)

dark_alley.connections.add(streets)

docks.connections.add(woods)
docks.connections.add(streets)

lord_bartholomews_manor.connections.add(countryside)

mermaid_rock.connections.add(ocean)

ocean.connections.add(docks)
ocean.connections.add(pirate_ship)
ocean.connections.add(mermaid_rock)
ocean.connections.add(artic)

church.connections.add(streets)
church.connections.add(market)

pirate_ship.connections.add(ocean)
pirate_ship.connections.add(docks)

artic.connections.add(ocean)
