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

    def __init__(self, name):
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

    def __str__(self):
        return self.name


artic = Place("the artic")
cave = Place("a dark cave")
church = Place("the church")
countryside = Place("the countryside")
dark_alley = Place("a dark alley")
docks = Place("the docks")
lord_bartholomews_manor = Place("Lord Bartholomew's manor")
lord_carlos_manor = Place("Lord Carlos' manor")
market = Place("the market")
mermaid_rock = Place("the mermaid rock")
ocean = Place("the ocean")
pirate_ship = Place("a pirate ship")
prison = Place("prison")
streets = Place("the streets")
tavern = Place("the tavern")
tower = Place("the tower")
upstairs = Place("the upstairs of the tavern")
wizards_lab = Place("the wizard's lab")
woods = Place("the woods")

# sets of locations

populated = set([
    docks,
    lord_bartholomews_manor,
    lord_carlos_manor,
    market,
    streets,
    tavern])

burnable = set([
    church,
    docks,
    lord_bartholomews_manor,
    lord_carlos_manor,
    market,
    prison,
    tavern,
    tower,
    wizards_lab,
    woods])


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
dark_alley.options["d"].add(actions.LookThroughSomeTrash(), weight=5)

for place in burnable:
    place.options["d"].add(actions.BurnThePlaceToTheGround(place), weight=5)
