"""
St. George Game
actions.py
Sage Berg
Created: 7 Dec 2014
"""

import random
import abc

import places
from display import Display
from raffle import Raffle
import money
import items


class Action(object):
    """
    abstract class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def __init__(self):
        self.name = ""
        self.combat_action = False 
        self.outcomes = Raffle()
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}

    def __str__(self):
        return self.name

    @abc.abstractmethod
    def execute(self, character):
        """
        returns nothing, edits character attributes
        """

        def some_stuff():
            pass

    def run_outcome(self):
        outcome = self.outcomes.get()
        outcome()
        self.outcomes = Raffle()

# A slot actions


class AskAboutAssassins(Action):

    def __init__(self):
        super().__init__()
        self.name = "Ask about assassins."

    def execute(self, character):
        import persons

        def assassinated():
            Display().write("The first person you ask about assassins turns"
                            " out to be an assassin. She assassinates you.")
            character.die()

        def pretty_lady():
            Display().write("During your search, you strike up a conversation"
                            "with a pretty lady.")
            character.person = persons.pretty_lady

        def no_one_cares():
            Display().write("You ask around, but nobody has heard anything"
                            " about any assassins.")
            self.options["a"].add(KillYourselfInFrustration(), weight=5)
            self.options["c"].add(LeaveInAHuff(), weight=5)
            self.options["d"].add(SingASong(about="assassins"), weight=5)
            character.prev_act = self

        self.outcomes.add(assassinated, weight=3)
        self.outcomes.add(no_one_cares, weight=1)
        if persons.pretty_lady.alive:
            self.outcomes.add(pretty_lady, weight=1)
        self.run_outcome()


class Apologize(Action):

    def __init__(self):
        super().__init__()
        self.name = "Apologize."
        self.combat_action = True

    def execute(self, character):

        def assassinated():
            Display().write("\"I'm afraid 'sorry' won't cut it.\" His knife "
                            "does.")
            character.die()

        def not_sorry_yet():
            Display().write("\"Oh, you're not sorry yet,\" he says as he steps "
                            "toward you.")
            self.options["c"].add(WaddleLikeGod(),5)

        def good_samaritan():
            Display().write("A bystander notices the assassin threatening you. "
                            "\"The man said he was sorry, isn't that enough?\" "
                            "he says. \"No,\" the assassin replys.")

        self.outcomes.add(assassinated, weight=3)
        self.outcomes.add(not_sorry_yet, weight=2)
        self.outcomes.add(good_samaritan, weight=1)
        self.run_outcome()


class Attack(Action):

    def __init__(self, person):
        super().__init__()
        self.name = "Attack " + person.pronouns.obj + "."
        self.combat_action = True 

    def execute(self, character):
        if character.person.attack >= character.attack:
            Display().write(character.person.pronouns.subj.capitalize() +
                            " kill" + character.person.pronouns.tense +
                            " you.")
            character.die()
        else:
            Display().write("You kill " + character.person.pronouns.obj + ".")
            character.person.alive = False
            character.person = None
            character.threatened = False
            self.options["b"].add(BoastOfYourBravery(), 5)
            self.options["c"].add(FleeTheScene(), 5)


class GoDivingForPearls(Action):

    def __init__(self):
        super().__init__()
        self.name = "Go diving for pearls."

    def execute(self, character):
        def eaten_by_shark():
            Display().write("Lord Arthur's pet shark eats you.")
            character.die()

        def find_pearl_death():
            Display().write("You soon pry open an oyster and find a large "
                            "pearl. It's so dazzling you drown while "
                            "gazing at it.")
            character.die()

        def find_pearl():
            Display().write("You soon find a pearl in an oyster. You now "
                            "have a pearl.")
            character.get_item(items.Pearl())

        def saved_by_merfolk():
            Display().write("You exhaust yourself trying to find pearls and "
                            "start to drown. Just when you think it's all "
                            "over, a beautiful mermaid grabs you and hoists "
                            "you onto some rocks.")
            character.place = places.mermaid_rock
            #character.person = persons.mermaid()

        self.outcomes.add(eaten_by_shark, weight=3)
        self.outcomes.add(saved_by_merfolk, weight=1)
        self.outcomes.add(find_pearl_death, weight=3)
        self.outcomes.add(find_pearl, weight=1)
        self.run_outcome()


class LickTheGround(Action):

    def __init__(self):
        super().__init__()
        self.name = "Lick the ground."

    def execute(self, character):
        import persons

        def get_infected_and_die():
            Display().write("You get an infection and spend three weeks "
                            "fighting it.")
            character.die()

        def you_dislike_the_taste():
            Display().write("You find the flavor of the ground to be "
                            "distastful.")
            self.options["a"].add(KillYourselfInFrustration(), 10)

        def the_guards_catch_you():
            Display().write("The local guards see you licking the ground and "
                            "accuse you of being a lunatic.")
            character.person = persons.guards
            self.options["a"].add(Attack(character.person), 10)
            self.options["b"].add(TellThemYouAreNotALunatic(excuse="hungry"),
                                  100)
        def drown_in_ocean():
            Display().write("You drown while swimming toward the ocean floor "
                            "with your tongue extended.")
            character.die()

        self.outcomes.add(you_dislike_the_taste, 5)
        self.outcomes.add(get_infected_and_die, 1)
        if character.place in places.populated:
            self.outcomes.add(the_guards_catch_you, 5)
        if character.place == places.ocean:
            self.outcomes = Raffle()  # There is only one outcome
            self.outcomes.add(drown_in_ocean, 10000)
        self.run_outcome()


class LookForAWeapon(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for a weapon."

    def execute(self, character):
        import persons

        def wealthy_merchant():
            Display().write("You find yourself talking to a wealthy war "
                            "merchant.")
            character.person = persons.wealthy_merchant

        def assassinated():
            Display().write("You find one... in your back as an assassin walks "
                            "away smoothly.")
            character.die()

        self.outcomes.add(wealthy_merchant, 4)
        self.outcomes.add(assassinated, 1)
        self.run_outcome()


class LookForStGeorge(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for St. George"

    def execute(self, character):
        import persons

        def lost():
            Display().write("While looking for St. George, you get lost in "
                            "your thoughts and realize you stopped paying "
                            "attention to where you were going.")
            LeaveInAHuff().execute(character)

        def find_st_george_at_church():
            Display().write("You find St. George at the church.")
            character.move_to(places.church, suppress_message=True)
            character.person = persons.st_george

        def find_st_george_at_market():
            Display().write("You find St. George in the market.")
            character.move_to(places.market, suppress_message=True)
            character.person = persons.st_george

        def find_st_george_at_streets():
            Display().write("You find St. George in the streets.")
            character.move_to(places.streets, suppress_message=True)
            character.person = persons.st_george

        def trip_over_a_cat():
            Display().write("You trip over a cat and break your neck.")
            character.die()

        self.outcomes.add(lost, weight=3)
        self.outcomes.add(trip_over_a_cat, weight=1)
        if persons.st_george.alive:
            self.outcomes.add(find_st_george_at_church, weight=10)
            self.outcomes.add(find_st_george_at_market, weight=5)
            self.outcomes.add(find_st_george_at_church, weight=5)
        self.run_outcome()


class KillYourselfInFrustration(Action):

    def __init__(self):
        super().__init__()
        self.name = "Kill yourself in frustration."

    def execute(self, character):
        if character.place == places.docks:
            Display().write("You walk into the ocean and are suddenly "
                            "inspired to write a novel. You drown.")
            character.die()
            return
        if character.place == places.streets or \
           character.place == places.market  or \
           character.place == places.church and random.randint(1,3) == 3:
            Display().write("You throw yourself off a rooftop, but St. "
                            "George catches you and gives you sack of coins.")
            character.get_money(money.large_fortune) 
            character.person = StGeorege()
            return
        if character.place == places.docks:
            Display().write("You see Lord Arthur on the docks and ask him to "
                            "kill you with his jeweled cutlass. He gladly obliges.")
            character.die()
            return
        deaths = ["You perform the ritual of the seppuku.",
                  "You set yourself on fire and burn to a crisp.",
                  ]
        Display().write(random.choice(deaths))
        character.die()


# B slot actions


class BegForMoney(Action):

    def __init__(self):
        super().__init__()
        self.name = "Beg for money."

    def execute(self, character):
        import persons

        def forgot_wallet():
            Display().write("St. George tells you he has lost his "
                            "wallet in the church.")

        def pittance():
            Display().write(character.person.name + " gives you a pittance.")
            character.get_money(money.pittance)
            character.person.state["given money"] = True

        def small_fortune():
            Display().write(character.person.name + " gives you a small "
                            "fortune.")
            character.get_money(money.small_fortune)
            character.person.state["given money"] = True

        def large_fortune():
            Display().write(character.person.name + " gives you a large "
                            "fortune.")
            character.get_money(money.large_fortune)
            character.person.state["given money"] = True

        def crushed_by_iron_hammer():
            Display().write("St. George becomes irrated by your begging and "
                            "crushes you with his iron hammer.")
            character.die()

        def smite():
            Display().write("St. George smites you with his saintly wraith "
                            "for being ungrateful.")
            character.die()

        def deaf_ears():
            Display().write("Your begging falls on deaf ears.")
            self.options["a"].add(KillYourselfInFrustration(), 10)
            self.options["c"].add(LeaveInAHuff(), 10)
            self.options["d"].add(SingASong(about="money"), 10)

        if character.person == persons.st_george:
            if character.person.state.get("given money", False):
                self.outcomes.add(crushed_by_iron_hammer, 1)
                self.outcomes.add(smite, 1)
            else:
                if character.place != places.church:
                    self.outcomes.add(forgot_wallet, 1)
                self.outcomes.add(pittance, 3)
                self.outcomes.add(small_fortune, 2)
                self.outcomes.add(large_fortune, 1)
        else:
            self.outcomes.add(deaf_ears, 1)
        self.run_outcome()


class Buy(Action):

    def __init__(self, weapons):
        super().__init__()
        self.weapon = random.choice(weapons)
        self.name = "Buy a " + self.weapon.name

    def execute(self, character):
        if character.money >= self.weapon.price:
            Display().write("You now have a " + self.weapon.name + ".")
            if character.attack < self.weapon.attack:
                character.weapon = self.weapon
                character.attack = self.weapon.attack
        else:
            Display().write("You can't afford this weapon.")
            self.options["a"].add(KillYourselfInFrustration(), 5)


class BuyADrink(Action):

    def __init__(self):
        super().__init__()
        self.name = "Buy a drink."

    def execute(self, character):
        import persons

        if persons.blind_bartender.alive:
            Display().write("The blind bartender grumbles as he passes you a "
                            "drink.")
            character.person = persons.blind_bartender
        else:
            Display().write("No one is selling drinks.")


class BoastOfYourBravery(Action):

    def __init__(self):
        super().__init__()
        self.name = "Boast of your bravery."

    def execute(self, character):
        Display().write(character.person.pronouns.subj.capitalize() +
                        " is not impressed.")


class LookForACat(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for a cat."

    def execute(self, character):
        import persons

        def dark_alley():
            Display().write("You follow a cat through the streets but "
                            "eventually lose track of it.")
            character.move_to(places.dark_alley)

        def get_a_cat():
            Display().write("You after days of searching, you manage to find "
                            "a cat.")
            character.get_item(items.Cat())

        def the_guards_catch_you():
            Display().write("The local guards notice you searching for a cat "
                            "and conclude that you must be a lunatic.")
            character.person = persons.guards
            self.options["a"].add(Attack(character.person), 10)
            self.options["b"].add(TellThemYouAreNotALunatic(excuse="lonely"),
                                  100)

        self.outcomes.add(dark_alley, 1)
        self.outcomes.add(get_a_cat, 1)
        self.outcomes.add(the_guards_catch_you, 1)
        self.run_outcome()


class TellThemYouAreNotALunatic(Action):

    def __init__(self, excuse):
        super().__init__()
        self.excuse = excuse
        self.name = "Tell them you are not a lunatic, " + \
            "you're just {0}.".format(excuse)

    def execute(self, character):
        if self.excuse[0] in "aeiou":
            Display().write("'An {0} lunatic,' they say.".format(self.excuse))
        else:
            Display().write("'A {0} lunatic,' they say.".format(self.excuse))
        Display().write("They throw you in prison with the other lunatics.")
        character.move_to(places.prison)


# C slot actions


class LookForTheWizard(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for the wizard."

    def execute(self, character):
        import persons

        def find_death():
            Display().write("You find him. He turns you into a frog and steps "
                            "on you.")
            character.die()

        def assassinated():
            Display().write("You look for the wizard, but the assassins are "
                            "looking for you. They find you.")
            character.die()

        def find_wizard_1():
            Display().write("You find the wizard in the market. He is telling "
                            "a woman how he cursed the icicles in the arctic.")
            character.move_to(places.market)
            character.person = persons.wizard

        def find_wizard_2():
            Display().write("You find the wizard in the market. He is telling "
                            "a woman about a mesmerizing pearl.")
            character.move_to(places.market)
            character.person = persons.wizard

        def find_st_george():
            Display().write("You can't find the wizard, but you find St. "
                            "George. He says the wizard is a little testy.")
            character.person = persons.StGeorge

        self.outcomes.add(assassinated, 1)
        self.outcomes.add(find_death, 3)
        self.outcomes.add(find_wizard_1, 2)
        self.outcomes.add(find_wizard_2, 2)
        self.outcomes.add(assassinated, 1)
        self.run_outcome()


class LeaveInAHuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a huff."

    def execute(self, character):
        def leave():
            character.move(speed=1)

        def assassinated():
            Display().write("The huffy manner in which you left causes some "
                            "assassins to notice you. They assassinate you.")
            character.die()

        self.outcomes.add(assassinated, 1)
        self.outcomes.add(leave, 9)
        self.run_outcome()


class LeaveInAPuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a puff."
        self.combat_action = True

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        character.move_to(random.sample(options, 1)[0])
        character.person = None
        character.threatened = False


class FleeTheScene(Action):

    def __init__(self):
        super().__init__()
        self.name = "Flee the scene."

    def execute(self, character):
        character.move(2)
        character.person = None


class GoTo(Action):

    def __init__(self, place):
        super().__init__()
        self.dest = random.sample(place.connections, 1)[0]
        self.name = "Go to " + str(self.dest) + "."

    def execute(self, character):
        import persons

        def stopped_by_guards():
            Display().write("On your way out of {0} you run headlong into "
                            "some guards and they say you must be a "
                            "lunatic.".format(character.place))
            character.person = persons.guards
            self.options["a"].add(Attack(character.person), 10)
            self.options["b"].add(
                TellThemYouAreNotALunatic(excuse="oblivious"), 100)

        def get_there():
            character.move_to(self.dest)
            character.person = None  # Might need a refactor

        if character.place in places.populated:
            self.outcomes.add(stopped_by_guards, 3)
        self.outcomes.add(get_there, 3)
        self.run_outcome()


class RunLikeTheDevil(Action):

    def __init__(self):
        super().__init__()
        self.name = "Run like the Devil."
        self.combat_action = True

    def execute(self, character):
        def escape():
            Display().write("The Devil is very fast, so you manage to get "
                            "away.")
            character.threatened = False
            character.person = None
            character.move(2)

        def get_caught():
            Display().write("You run like the Devil, but " +
                            character.person.pronouns.subj +
                            " also run" + character.person.pronouns.tense +
                            " like the Devil and "
                            "overtake" + character.person.pronouns.tense +
                            " you.")
            Attack(character.person).execute(character)
            character.move(1)

        self.outcomes.add(escape, weight=9)
        self.outcomes.add(get_caught, weight=1)
        self.run_outcome()


class WaddleLikeGod(Action):

    def __init__(self):
        super().__init__()
        self.name = "Waddle like God."
        self.combat_action = True

    def execute(self, character):
        def waddle():
            Display().write("God is very slow, so you don't manage to get "
                            "away.")
            Attack(character.person).execute(character)

        def waddle_waddle():
            Display().write("You waddle like God, but " +
                            character.person.pronouns.subj +
                            " also waddle" + character.person.pronouns.tense +
                            " like God and fail to"
                            " overtake" + character.person.pronouns.tense +
                            " you. You slowly get away.")
            character.threatened = False
            character.person = None
            character.move(1)

        self.outcomes.add(waddle, weight=9)
        self.outcomes.add(waddle_waddle, weight=1)
        self.run_outcome()


# D slot actions


class SingASong(Action):

    def __init__(self, about=None):
        super().__init__()
        self.about = about
        if about:
            self.name = "Sing a song about {0}.".format(about)
        else:
            self.name = "Sing a song."

    def execute(self, character):
        import persons

        def a_crowd_gathers():
            Display().write("A crowd gathers to hear your music and throws you"
                            " a small fortune in coins.")
            character.get_money(money.small_fortune)

        def the_locals_kill_you():
            Display().write("The locals hate your voice and soon mob you.")
            character.die()

        def assassins_notice_you():
            Display().write("While you're singing, "
                            "some men in black cloaks start to edge their "
                            "way toward you.")
            character.person = persons.assassins
            character.threatened = True

        def no_one_cares():
            Display().write("You sing your favorite song. No one cares.")
            self.options["a"].add(KillYourselfInFrustration(), weight=5)

        def song_angers_wizard():
            Display().write("The wizard complains that you are singing off "
                            "key. He turns you into a frog and steps on you.")
            character.die()

        if character.place in places.populated:
            self.outcomes.add(assassins_notice_you, weight=3)
            self.outcomes.add(a_crowd_gathers, weight=2)
            self.outcomes.add(the_locals_kill_you, weight=1)
        if character.person == persons.wizard:
            self.outcomes.add(song_angers_wizard, weight=20)
        if self.about == "assassins":
            self.outcomes.add(assassins_notice_you, weight=5)
        self.outcomes.add(no_one_cares, weight=1)
        self.run_outcome()


class SwingYourCat(Action):

    def __init__(self, cat):
        super().__init__()
        self.cat = cat
        self.name = "Swing your cat."

    def execute(self, character):
        import persons

        def hit_assassin():
            Display().write("You hit an assassin with your cat.")
            character.person = persons.assassin
            character.threatened = True

        def cat_runs_away():
            Display().write("Your cat manages to escape.")
            character.remove_item(self.cat)

        def the_guards_catch_you():
            Display().write("The local guards notice you swinging your cat "
                            "around and conclude that you must be a lunatic.")
            character.person = persons.guards
            self.options["a"].add(Attack(character.person), 10)
            self.options["b"].add(TellThemYouAreNotALunatic(excuse="angry"),
                                  100)

        if character.place in places.populated:
            self.outcomes.add(hit_assassin, weight=7)
            self.outcomes.add(the_guards_catch_you, weight=3)
        self.outcomes.add(cat_runs_away, weight=3)
        self.run_outcome()


class BurnThePlaceToTheGround(Action):

    def __init__(self, place):
        super().__init__()
        self.place = place
        self.name = "Burn {0} to the ground.".format(place.name)

    def execute(self, character):
        import persons

        def destroy_place():
            self.place.name = "the smoldering remains of " + self.place.name
            character.move_to(self.place)
            places.burnable.remove(self.place)

        def burn_yourself_up():
            Display().write("You accidentally set yourself on fire and "
                            "promptly burn to the ground.")
            character.die()
        
        def killed_by_st_george():
            Display().write("St. George sees you attempting arson and kills "
                            "you.")
            character.die()

        def killed_by_wizard():
            Display().write("The wizard sees you attempting arson and turns "
                            "you into a frog. He steps on you.")
            character.die()
             
        if character.person == persons.st_george:
            self.outcomes.add(killed_by_st_george, weight=30)
        if character.person == persons.wizard:
            self.outcomes.add(killed_by_wizard, weight=20)
        if self.place in places.burnable:
            self.outcomes.add(destroy_place, weight=2)
        self.outcomes.add(burn_yourself_up, weight=1)
        self.run_outcome()


class LookThroughSomeTrash(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look through some trash."

    def execute(self, character):
        import persons

        def assassin_takes_it_out():
            Display().write("You attempt to look through the trash, but an "
                            "assassin takes it out.")
            character.die()

        def find_a_cat():
            Display().write("While you are searching through the trash you "
                            "find an somewhat agreeable cat.")
            character.get_item(items.Cat())

        def guards_catch_you():
            Display().write("The local guards see you searching through the "
                            "trash and accuse you of being a lunatic.")
            character.person = persons.guards
            self.options["a"].add(Attack(character.person), 10)
            self.options["b"].add(TellThemYouAreNotALunatic(excuse="curious"),
                                  100)

        def nothing_useful():
            Display().write("You do not find anything useful in the trash.")
            self.options["a"].add(KillYourselfInFrustration(), 5)
            self.options["c"].add(LeaveInAHuff(), 5)
            self.options["d"].add(SingASong(about="trash"), 5)

        self.outcomes.add(assassin_takes_it_out, weight=2)
        self.outcomes.add(find_a_cat, weight=1)
        self.outcomes.add(guards_catch_you, weight=1)
        self.outcomes.add(nothing_useful, weight=1)
        self.run_outcome()
