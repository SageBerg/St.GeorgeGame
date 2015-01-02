import random

import money
import items  # TODO remove when done testing game


class Character(object):
    """
    Represents the character in the story who the player
    is role playing.
    """

    def __init__(self):
        self.items = {
            items.cat: 1,
            items.many_colored_mushroom: 1,
            items.love_potion: 1,
            items.pearl: 1,
            items.four_leaf_clover: 1}
        self.attack = 0
        self.money = money.large_fortune  # TODO start with money.none
        self.threatened = False
        self.trip = False
        self.is_frog = False
        self.is_monstrosity = False
        self.lost_peg_leg = False
        self.lose = False
        self.alive = True
        self.alone = True  # character has not found true love
        self.place = None
        self.person = None
        self.employers = set()

    def grow_stronger(self, amount):
        print("You grow stronger.")
        self.attack += amount

    def get_money(self, amount):
        if amount > self.money:
            self.money = amount
            print("You now have {0}.".format(money.to_str(amount)))
        elif self.money == money.pittance:
            print("You still only have {0}.".format(
                money.to_str(amount)))
        else:
            print("You still have {0}.".format(money.to_str(self.money)))

    def lose_all_money(self):
        if self.money != money.none:
            self.money = money.none
            print("You now have no money.")
        else:
            print("You still have no money.")

    def add_item(self, item):
        if self.has_item(item):
            print("You now have another " + str(item) + ".")
            self.items[item] += 1
        else:
            if str(item)[0] in "AEIOUaeiou":
                print("You now have an " + str(item) + ".")
            else:
                print("You now have a " + str(item) + ".")
            self.items[item] = 1

    def remove_item(self, item):
        self.items[item] -= 1
        assert(self.items[item] >= 0)
        if self.items[item] > 0:
            print("You now have one less " + str(item) + ".")
        elif str(item)[0] in "AEIOUaeiou":
            print("You no longer have an " + str(item) + ".")
        else:
            print("You no longer have a " + str(item) + ".")

    def remove_all_items(self):
        for item in set(self.items):
            if self.has_item(item):
                self.remove_item(item)

    def has_any_items(self):
        if len(self.items):
            return True
        return False

    def has_item(self, item):
        if item in self.items and self.items[item]:
            return True
        return False

    def item_count(self, item):
        return self.items.get(item, 0)

    def die(self):
        """
        Kill the character.
        """
        if self.place.name != "the void": 
            print("You are dead.")
        self.alive = False

    def move(self, distance=1):
        visited = set([self.place])  # We don't go in circles
        at = self.place
        while distance:
            options = at.connections - visited
            if not options:
                break
            at = random.sample(options, 1)[0]
            distance -= 1
        self.move_to(at)

    def move_to(self, place, suppress_message=False):
        self.place = place
        self.person = None  # WARNING: move then add people
                            # so move doesn't overwrite
                            # character.person immediately
        self.threatened = False
        if not suppress_message:
            print("You find yourself in " + str(self.place) + ".")

    def depegify(self):
        self.lost_peg_leg = True

    def monstrosify(self):
        self.is_monstrosity = True
        print("You are now a towering monstrosity.")

    def frogify(self):
        self.is_frog = True
        print("You are now a frog.")

    def defrogify(self):
        self.is_frog = False
        print("You are now yourself again.")

    def start_tripping(self):
        self.trip = True

    def stop_tripping(self):
        self.trip = False

    def win(self):
        """
        Win the game.
        """
        print("You win!")
        self.alone = False

    def add_employer(self, employer):
        self.employers.add(employer)

    def remove_employer(self, employer):
        self.employers.remove(employer)

    def is_employed_by(self, employer):
        if employer in self.employers:
            return True
        return False

    def get_attack(self):
        if self.has_item(items.iron_hammer):
            weapon_bonus = 8
        elif self.has_item(items.jeweled_cutlass):
            weapon_bonus = 7
        elif self.has_item(items.poisoned_dagger):
            weapon_bonus = 6
        elif self.has_item(items.long_pitchfork):
            weapon_bonus = 5
        elif self.has_item(items.hammer):
            weapon_bonus = 4
        elif self.has_item(items.cutlass):
            weapon_bonus = 3
        elif self.has_item(items.dagger):
            weapon_bonus = 2
        elif self.has_item(items.pitchfork):
            weapon_bonus = 1
        else:
            weapon_bonus = 0
        return weapon_bonus + self.attack
