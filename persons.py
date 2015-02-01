import outcome
import places
import items
import money


def get_tense(person):
    if person.group:
        return ""
    return "s"

class Person(object):

    instances = []  #factor this out
    by_name = dict()

    def __init__(self, name, attack, group=False):
        self.name = name
        self.attack = attack
        self.group = group
        self.alive = True
        self.state = {}
        self.attracted = 0
        self.preferred_attack = self.kill 
        Person.instances.append(self)
        Person.by_name[name] = self
        self.buys = dict()
        self.sells = dict()

    def get_buys(self):
        return list(self.buys.keys())

    def get_sells(self):
        return list(self.sells.keys())

    def add_buys(self, item, price):
        self.buys[item] = price

    def add_sells(self, item, price):
        self.sells[item] = price

    def get_buy_price(self, item):
        return self.buys[item]

    def get_sell_price(self, item):
        return self.sells[item]

    def kill(self, state, verb="kill"):
        return outcome.Outcome(state,
            self.name[0].upper() + self.name[1:] + " " + verb +
            get_tense(self) + " you.",
            die=True)

    def assassinate(self, state):
        return self.kill(state, verb="assassinate")

    def arrest(self, state):
        return outcome.Outcome(state,
            self.name[0].upper() + self.name[1:] + " throw" +
            get_tense(self) + " you in prison with the other "
            "lunatics.",
            new_person=state.persons.persons_dict["other_lunatics"],
            move_to=state.places.places_dict["prison"],
            remove_all_items=True
            )

    def __str__(self):
        return self.name


class Persons(object):

    def __init__(self):
        self.persons_dict = {
            "assassin" : Person("the assassin", 6),
            "assassins": Person("the assassins", 6, group=True),
            "blind_bartender": Person("the blind bartender", 1),
            "fat_lady": Person("the fat lady who feeds you", 4),
            "eve": Person("Lord Carlos' daughter", 4),
            "guards": Person("the guards", 4, group=True),
            "mermaid": Person("the mermaid", 3),
            "mob": Person("the angry mob", 9),
            "nymph_queen": Person("the nymph queen", 10),
            "other_lunatics": Person("the other lunatics", -1, group=True),
            "peasant_lass": Person("the peasant lass", 7),
            "pirates": Person("the pirates", 6, group=True),
            "pretty_lady": Person("the pretty lady", 1),
            "simple_peasant": Person("the simple peasant", -1),
            "st_george": Person("St. George", 100),
            "wealthy_merchant": Person("the merchant", 7),
            "witch": Person("the witch", 7),
            "wizard": Person("the wizard", 7),
            "lord_arthur": Person("Lord Arthur", 6),
            "lord_bartholomew": Person("Lord Bartholomew", 4),
            "lord_carlos": Person("Lord Carlos", 5),
            "lord_daniel": Person("Lord Daniel", 7),
            "black_market_merchant": Person("black market merchant", 5),
            "local_merchant": Person("local merchant", 3),
        }
        self.persons_dict["assassin"].preferred_attack = \
            self.persons_dict["assassin"].assassinate
        self.persons_dict["assassins"].preferred_attack = \
            self.persons_dict["assassins"].assassinate
        self.persons_dict["eve"].preferred_attack = \
            self.persons_dict["eve"].assassinate
        self.persons_dict["lord_carlos"].preferred_attack = \
            self.persons_dict["lord_carlos"].assassinate
        self.persons_dict["guards"].preferred_attack = \
            self.persons_dict["guards"].arrest
        self.persons_dict["black_market_merchant"].add_sells(items.deep_cave_newt, money.small_fortune)
        self.persons_dict["black_market_merchant"].add_sells(items.love_potion, money.large_fortune)
        self.persons_dict["black_market_merchant"].add_sells(items.fire_proof_cloak, money.large_fortune)
        self.persons_dict["black_market_merchant"].add_sells(items.tail_potion, money.small_fortune)
        self.persons_dict["black_market_merchant"].add_sells(items.strength_potion, money.small_fortune)
        self.persons_dict["black_market_merchant"].add_sells(items.many_colored_mushroom, money.pittance)
        self.persons_dict["black_market_merchant"].add_sells(items.white_mushroom,  money.pittance)
        self.persons_dict["black_market_merchant"].add_sells(items.black_mushroom, money.pittance)
        self.persons_dict["wealthy_merchant"].add_sells(items.pitchfork, money.pittance)
        self.persons_dict["wealthy_merchant"].add_sells(items.dagger, money.pittance)
        self.persons_dict["wealthy_merchant"].add_sells(items.cutlass, money.pittance)
        self.persons_dict["wealthy_merchant"].add_sells(items.hammer, money.pittance)
        self.persons_dict["wealthy_merchant"].add_sells(items.long_pitchfork, money.pittance)
        self.persons_dict["wealthy_merchant"].add_sells(items.poisoned_dagger, money.small_fortune)
        self.persons_dict["wealthy_merchant"].add_sells(items.jeweled_cutlass, money.large_fortune)
        self.persons_dict["wealthy_merchant"].add_sells(items.iron_hammer, money.small_fortune)
        self.persons_dict["local_merchant"].add_sells(items.bouquet_of_flowers, money.pittance)
        self.persons_dict["local_merchant"].add_sells(items.fish, money.pittance)
        self.persons_dict["local_merchant"].add_sells(items.ax, money.pittance)
        self.persons_dict["local_merchant"].add_sells(items.pearl, money.pittance)
        self.persons_dict["local_merchant"].add_sells(items.sailor_peg, money.pittance)
