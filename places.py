class Place(object):

    instances = set()
    by_name = dict()

    def __init__(self, name):
        """
        args: name: string
              populated: boolean
        """
        self.name = name
        self.connections = set()
        Place.by_name[name] = self
        if self.name != "the void":
            Place.instances.add(self)

    def __str__(self):
        return self.name


class Places(object):

    def __init__(self):
        self.places_dict = { 
            "arctic" : Place("the Arctic"),
            "cave" : Place("a dark cave"),
            "church" : Place("the church"),
            "countryside" : Place("the countryside"),
            "dark_alley" : Place("a dark alley"),
            "docks" : Place("the docks"),
            "lord_bartholomews_manor" : Place("Lord Bartholomew's manor"),
            "lord_carlos_manor" : Place("Lord Carlos' manor"),
            "market" : Place("the market"),
            "mermaid_rock" : Place("the mermaid rocks"),
            "ocean" : Place("the ocean"),
            "pirate_ship" : Place("a pirate ship"),
            "prison" : Place("prison"),
            "streets" : Place("the streets"),
            "tavern" : Place("the tavern"),
            "tower" : Place("the tower"),
            "upstairs" : Place("the upstairs of the tavern"),
            "void" : Place("the void"),
            "wizards_lab" : Place("the wizard's lab"),
            "woods" : Place("the woods"),
            }
        self.locked = set([
            self.places_dict["cave"],
            self.places_dict["prison"],
            self.places_dict["pirate_ship"],
            self.places_dict["ocean"],
            self.places_dict["void"]])
        self.burnable = set([
            self.places_dict["church"],
            self.places_dict["docks"],
            self.places_dict["lord_bartholomews_manor"],
            self.places_dict["lord_carlos_manor"],
            self.places_dict["market"],
            self.places_dict["tavern"],
            self.places_dict["tower"],
            self.places_dict["wizards_lab"],
            self.places_dict["woods"],
            ])
        self.burned = set()
        self.trashed = set()
        self.populated = frozenset([
            self.places_dict["docks"],
            self.places_dict["lord_bartholomews_manor"],
            self.places_dict["lord_carlos_manor"],
            self.places_dict["market"],
            self.places_dict["streets"],
            self.places_dict["tavern"],
            ])
        self.outside = frozenset([
            self.places_dict["arctic"],
            self.places_dict["cave"],
            self.places_dict["countryside"],
            self.places_dict["dark_alley"],
            self.places_dict["docks"],
            self.places_dict["market"],
            self.places_dict["mermaid_rock"],
            self.places_dict["ocean"],
            self.places_dict["pirate_ship"],
            self.places_dict["streets"],
            self.places_dict["woods"],
            ])
        self.inside = frozenset([
            self.places_dict["church"],
            self.places_dict["lord_bartholomews_manor"],
            self.places_dict["lord_carlos_manor"],
            self.places_dict["prison"],
            self.places_dict["tavern"],
            self.places_dict["tower"],
            self.places_dict["upstairs"],
            self.places_dict["wizards_lab"],
            ])
        self.town = frozenset([
            self.places_dict["church"],
            self.places_dict["dark_alley"],
            self.places_dict["docks"],
            self.places_dict["market"],
            self.places_dict["prison"],
            self.places_dict["streets"],
            self.places_dict["tavern"],
            self.places_dict["tower"],
            self.places_dict["upstairs"],
            self.places_dict["wizards_lab"],
            ])

arctic = Place("the Arctic")
cave = Place("a dark cave")
church = Place("the church")
countryside = Place("the countryside")
dark_alley = Place("a dark alley")
docks = Place("the docks")
lord_bartholomews_manor = Place("Lord Bartholomew's manor")
lord_carlos_manor = Place("Lord Carlos' manor")
market = Place("the market")
mermaid_rock = Place("the mermaid rocks")
ocean = Place("the ocean")
pirate_ship = Place("a pirate ship")
prison = Place("prison")
streets = Place("the streets")
tavern = Place("the tavern")
tower = Place("the tower")
upstairs = Place("the upstairs of the tavern")
void = Place("the void")
wizards_lab = Place("the wizard's lab")
woods = Place("the woods")

# sets of locations

locked = set([
    cave,
    prison,
    pirate_ship,
    ocean,
    void])

burnable = set([
    church,
    docks,
    lord_bartholomews_manor,
    lord_carlos_manor,
    market,
    tavern,
    tower,
    wizards_lab,
    woods])

burned = set()
trashed = set()

populated = frozenset([
    docks,
    lord_bartholomews_manor,
    lord_carlos_manor,
    market,
    streets,
    tavern])

outside = frozenset([
    arctic,
    cave,
    countryside,
    dark_alley,
    docks,
    market,
    mermaid_rock,
    ocean,
    pirate_ship,
    streets,
    woods])

inside = frozenset([
    church,
    lord_bartholomews_manor,
    lord_carlos_manor,
    prison,
    tavern,
    tower,
    upstairs,
    wizards_lab])

town = frozenset([
    church,
    dark_alley,
    docks,
    market,
    prison,
    streets,
    tavern,
    tower,
    upstairs,
    wizards_lab])

# Connections

arctic.connections.add(ocean)
church.connections.add(market)
church.connections.add(streets)
countryside.connections.add(docks)
countryside.connections.add(lord_bartholomews_manor)
countryside.connections.add(streets)
countryside.connections.add(woods)
dark_alley.connections.add(streets)
docks.connections.add(streets)
docks.connections.add(countryside)
lord_bartholomews_manor.connections.add(countryside)
lord_carlos_manor.connections.add(woods)
market.connections.add(church)
market.connections.add(streets)
market.connections.add(wizards_lab)
mermaid_rock.connections.add(ocean)
ocean.connections.add(arctic)
ocean.connections.add(docks)
ocean.connections.add(mermaid_rock)
ocean.connections.add(pirate_ship)
streets.connections.add(church)
streets.connections.add(countryside)
streets.connections.add(dark_alley)
streets.connections.add(docks)
streets.connections.add(market)
streets.connections.add(tavern)
streets.connections.add(tower)
tavern.connections.add(streets)
tower.connections.add(streets)
upstairs.connections.add(tavern)
wizards_lab.connections.add(market)
woods.connections.add(countryside)
woods.connections.add(lord_carlos_manor)
