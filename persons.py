class Person(object):

    def __init__(self, name, attack, group=False, arrester=False):
        self.name = name
        self.attack = attack
        self.arrester = arrester
        self.group = group
        self.alive = True
        self.state = {}
        self.attracted = 0

    def __str__(self):
        return self.name

def get_tense(person):
    if person.group:
        return ""
    return "s"

assassin = Person("the assassin", 6)
assassins = Person("the assassins", 6, group=True)
blind_bartender = Person("the blind bartender", 1)
fat_lady = Person("the fat lady who feeds you", 4)
eve = Person("Lord Carlos' daughter", 4)
guards = Person("the guards", 4, group=True, arrester=True)
mermaid = Person("the mermaid", 3)
mob = Person("the angry mob", 9)  # Mob is not a group; grammar hack
other_lunatics = Person("the other lunatics", -1, group=True)
peasant_lass = Person("the peasant lass", 7)
pirate_wench = Person("the pirate wench", 2)
pretty_lady = Person("the pretty lady", 1)
simple_peasant = Person("the simple peasant", -1)
st_george = Person("St. George", 100)
wealthy_merchant = Person("the merchant", 7)
witch = Person("the witch", 7)
wizard = Person("the wizard", 7)
lord_arthur = Person("Lord Arthur", 6)
lord_bartholomew = Person("Lord Bartholomew", 4)
lord_carlos = Person("Lord Carlos", 5)
lord_daniel = Person("Lord Daniel", 7)
