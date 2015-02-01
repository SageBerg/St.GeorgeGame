class Place(object):

    def __init__(self, name):
        """
        args: name: string
        """
        self.name = name
        self.connections = set()

    def __str__(self):
        return self.name


class Places(object):
    """
    instance of Places is contained in the state object (under state.places)
    Places represents the state of the places in a given world 
    """

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

        self.places_dict["arctic"].connections.add(self.places_dict["ocean"])
        self.places_dict["church"].connections.add(self.places_dict["market"])
        self.places_dict["church"].connections.add(self.places_dict["streets"])
        self.places_dict["countryside"].connections.add(self.places_dict["docks"])
        self.places_dict["countryside"].connections.add(self.places_dict["lord_bartholomews_manor"])
        self.places_dict["countryside"].connections.add(self.places_dict["streets"])
        self.places_dict["countryside"].connections.add(self.places_dict["woods"])
        self.places_dict["dark_alley"].connections.add(self.places_dict["streets"])
        self.places_dict["docks"].connections.add(self.places_dict["streets"])
        self.places_dict["docks"].connections.add(self.places_dict["countryside"])
        self.places_dict["lord_bartholomews_manor"].connections.add(self.places_dict["countryside"])
        self.places_dict["lord_carlos_manor"].connections.add(self.places_dict["woods"])
        self.places_dict["market"].connections.add(self.places_dict["streets"])
        self.places_dict["market"].connections.add(self.places_dict["church"])
        self.places_dict["market"].connections.add(self.places_dict["wizards_lab"])
        self.places_dict["mermaid_rock"].connections.add(self.places_dict["ocean"])
        self.places_dict["ocean"].connections.add(self.places_dict["arctic"])
        self.places_dict["ocean"].connections.add(self.places_dict["docks"])
        self.places_dict["ocean"].connections.add(self.places_dict["mermaid_rock"])
        self.places_dict["ocean"].connections.add(self.places_dict["pirate_ship"])
        self.places_dict["streets"].connections.add(self.places_dict["church"])
        self.places_dict["streets"].connections.add(self.places_dict["countryside"])
        self.places_dict["streets"].connections.add(self.places_dict["dark_alley"])
        self.places_dict["streets"].connections.add(self.places_dict["docks"])
        self.places_dict["streets"].connections.add(self.places_dict["market"])
        self.places_dict["streets"].connections.add(self.places_dict["tavern"])
        self.places_dict["streets"].connections.add(self.places_dict["tower"])
        self.places_dict["tavern"].connections.add(self.places_dict["streets"])
        self.places_dict["tower"].connections.add(self.places_dict["streets"])
        self.places_dict["upstairs"].connections.add(self.places_dict["tavern"])
        self.places_dict["wizards_lab"].connections.add(self.places_dict["market"])
        self.places_dict["woods"].connections.add(self.places_dict["countryside"])
        self.places_dict["woods"].connections.add(self.places_dict["lord_carlos_manor"])
