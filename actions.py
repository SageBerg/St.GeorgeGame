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

    def clean_execute(self, character):
        self.options = {"a": Raffle(),
                        "b": Raffle(),
                        "c": Raffle(),
                        "d": Raffle()}
        self.execute(character)
        self.run_outcome()        

    @abc.abstractmethod
    def execute(self, character):
        """
        returns nothing, edits character attributes
        """

        def some_stuff():
            pass

    def run_outcome(self):
        outcome = self.outcomes.get()
        if outcome:
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


class Apologize(Action):

    def __init__(self):
        super().__init__()
        self.name = "Tell him you're sorry."
        self.combat_action = True

    def execute(self, character):

        def assassinated():
            Display().write("\"I'm afraid 'sorry' won't cut it.\" His knife "
                            "does.")
            character.die()

        def not_sorry_yet():
            Display().write("\"Oh, you're not sorry yet,\" he says as he steps "
                            "toward you.")
            self.options["c"].add(WaddleLikeGod(), 5)

        def good_samaritan():
            Display().write("A bystander notices the assassin threatening you. "
                            "\"The man said he was sorry, isn't that enough?\" "
                            "he says. \"No,\" the assassin replys.")

        self.outcomes.add(assassinated, weight=3)
        self.outcomes.add(not_sorry_yet, weight=2)
        self.outcomes.add(good_samaritan, weight=1)
        


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
            if not character.place.locked:
                self.options["c"].add(FleeTheScene(), 5)
            self.options["b"].add(BoastOfYourBravery(), 5)


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
                            "distasteful.")
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

        def woods_smell():
            Display().write("As you lean down to lick the ground, you realize "
                            "it smells oddly familiar.")
        def cursed_ice():
            #Display().write("You get your tongue stuck to an icicle.")
            self.options["a"].add(KillYourselfInFrustration(), 10)
            places.arctic.locked = True

        self.outcomes.add(you_dislike_the_taste, 5)
        self.outcomes.add(get_infected_and_die, 1)
        if character.place in places.populated:
            self.outcomes.add(the_guards_catch_you, 5)
        if character.place == places.woods:
            self.outcomes.add(woods_smell, 3)
        if character.place == places.arctic:
            self.outcomes.add(cursed_ice, 100)
        if character.place == places.ocean:
            self.outcomes = Raffle()  # There is only one outcome
            self.outcomes.add(drown_in_ocean, 10000)


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


class LookForMushrooms(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for mushrooms."

    def execute(self, character):

        def gross_mushroom():
            Display().write("You find a yellow mushroom.")
            self.options["a"].add(ChowDown(items.YellowMushroom()), 10)
            #self.options["d"].add(actions.pick(items.yellow_mushroom), 2)

        def psych_mushroom():
            Display().write("You find a many-colored mushroom.")
            self.options["a"].add(ChowDown(items.ManyColoredMushroom()), 10)
            #self.options["d"].add(actions.pick(items.psych_mushroom), 2)

        def wonderland_mushroom():
            Display().write("You find a white mushroom.")
            self.options["a"].add(ChowDown(items.WhiteMushroom()), 10)
            #self.options["d"].add(actions.pick(items.white_mushroom), 2)

        def poison_mushroom():
            Display().write("You find a black mushroom.")
            self.options["a"].add(ChowDown(items.BlackMushroom()), 10)
            #self.options["d"].add(actions.pick(items.black_mushroom), 2)

        self.outcomes.add(gross_mushroom, 1)
        self.outcomes.add(psych_mushroom, 1)
        self.outcomes.add(wonderland_mushroom, 1)
        self.outcomes.add(poison_mushroom, 1)


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
            LeaveInAHuff().clean_execute(character)

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


class KillYourselfInFrustration(Action):

    def __init__(self):
        super().__init__()
        self.name = "Kill yourself in frustration."

    def execute(self, character):
        import persons

        def the_awakening():
            Display().write("You walk into the ocean and are suddenly "
                            "inspired to write a novel. You drown.")
            character.die()

        def st_george_saves_you():
            Display().write("You throw yourself off a rooftop, but St. "
                            "George catches you and gives you sack of coins.")
            character.get_money(money.large_fortune)
            character.person = persons.StGeorege()

        def lord_arthur_kills_you():
            Display().write("You see Lord Arthur and ask him to kill you with "
                            "his jeweled cutlass. He gladly obliges.")
            character.die()

        def seppuku():
            Display().write("You perform the ritual of the seppuku.")
            character.die()

        def burn_to_a_crisp():
            Display().write("You set yourself on fire and burn to a crisp.")
            character.die()

        if character.place in [places.docks, places.pirate_ship]:
            self.outcomes.add(lord_arthur_kills_you, weight=3)
        if character.place in places.populated:
            self.outcomes.add(st_george_saves_you, weight=3)
        if character.place == places.docks:
            self.outcomes.add(the_awakening, weight=7)
        self.outcomes.add(seppuku, weight=3)
        self.outcomes.add(burn_to_a_crisp, weight=3)


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


class BideYourTime(Action):

    def __init__(self):
        super().__init__()
        self.name = "Bide your time."

    def execute(self, character):
        import persons

        def die_of_age():
            Display().write("You die of old age.")
            character.die()

        def go_insane():
            Display().write("As the days drag on, you go insane.")

        def notice_a_pattern():
            Display().write("You notice the warden carries the keys when he "
                            "inspects the cells. He inspects the cells with "
                            "an entourage of guards most weekends, but he "
                            "does it alone on holidays.")
            #self.options["a"].add(LaughAboutWarden(), 5)
            #self.options["b"].add(TryToTakeKeys(), 5)
            #self.options["d"].add(WaitForAHoliday(), 5)

        def fat_woman():
            Display().write("As the days pass, you find yourself more and more "
                            "attracted to the fat woman who brings you food.")

        self.outcomes.add(die_of_age, 1)
        self.outcomes.add(go_insane, 3)
        self.outcomes.add(notice_a_pattern, 2)
        if persons.fat_lady.attracted > -1 and persons.fat_lady.attracted < 3: 
            self.outcomes.add(fat_woman, 3)


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
            self.options["d"].add(SingASong(about="poverty"), 5)


class BuyADrink(Action):

    def __init__(self):
        super().__init__()
        self.name = "Buy a drink."

    def execute(self, character):
        import persons

        def get_a_drink():
            Display().write("The blind bartender grumbles as he passes you a "
                            "drink.")
            character.person = persons.blind_bartender

        def assassin_hits_on_you():
            Display().write("An assassin walks up and starts hitting on "
                            "you... very hard.")
            character.die()

        def no_one_is_selling():
            Display().write("No one is selling drinks.")

        if persons.blind_bartender.alive:
            self.outcomes.add(get_a_drink, 3)
        else:
            self.outcomes.add(no_one_is_selling, 3)
        self.outcomes.add(assassin_hits_on_you, 1)


class BoastOfYourBravery(Action):

    def __init__(self):
        super().__init__()
        self.name = "Boast of your bravery."

    def execute(self, character):
        if not character.person:
            Display().write("You impress yourself.")
        else:
            Display().write(character.person.pronouns.subj.capitalize() +
                            " is not impressed.")


class LookForACat(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for a cat."

    def execute(self, character):
        import persons

        def fruitless():
            Display().write("Your efforts to find a cat are fruitless.")

        def chase_a_cat():
            Display().write("You see something out of the corner of your eye "
                            "that looks like a cat. You chase it to no avail.")
            character.move(1)
            self.options["d"].add(SingASong(about="cats"), 5)

        def it_kills_you():
            Display().write("You find a ferocious cat. It kills you.")
            character.die()

        def dark_alley():
            Display().write("You follow a cat through the streets but "
                            "eventually lose track of it.")
            character.move_to(places.dark_alley)
            self.options["d"].add(SingASong(about="cats"), 5)

        def get_a_cat():
            Display().write("You after days of searching, you manage to find "
                            "a cat.")
            character.get_item(items.Cat())

        def the_guards_catch_you():
            Display().write("The local guards notice you searching for a cat "
                            "and conclude that you must be a lunatic.")
            character.person = persons.guards
            self.options["b"].add(TellThemYouAreNotALunatic(excuse="lonely"),
                                  100)

        def lord_arthurs_cat():
            Display().write("You find Lord Arthur's freakish cat. The cat has "
                            "eight more tails than a normal cat.")

        self.outcomes.add(get_a_cat, 7)
        self.outcomes.add(fruitless, 3)
        self.outcomes.add(chase_a_cat, 3)
        self.outcomes.add(it_kills_you, 1)
        if character.place in places.populated and not character.place.locked:
            self.outcomes.add(dark_alley, 3)
            self.outcomes.add(the_guards_catch_you, 1)
        if character.place == places.pirate_ship:
            self.outcomes.add(lord_arthurs_cat, 10)


class TellThemYouAreNotALunatic(Action):

    def __init__(self, excuse):
        super().__init__()
        self.excuse = excuse
        self.name = "Tell them you are not a lunatic, " + \
            "you're just {0}.".format(excuse)

    def execute(self, character):
        import persons

        if self.excuse[0] in "aeiou":
            Display().write("'An {0} lunatic,' they say.".format(self.excuse))
        else:
            Display().write("'A {0} lunatic,' they say.".format(self.excuse))
        Display().write("They throw you in prison with the other lunatics.")
        character.move_to(places.prison)
        character.person = persons.other_lunatics
        self.options["a"].add(KillYourselfInFrustration(), 5)


# C slot actions


class ChowDown(Action):

    def __init__(self, food):
        super().__init__()
        self.food = food
        self.name = "Chow down on the " + str(food) + "."

    def execute(self, character):

        def trip_out():
            pass

        def trip_in():
            Display().write("You feel normal again.")

        def gross():
            Display().write("You find the mushroom distasteful.")

        def large():
            Display().write("You grow larger.")
            character.attack += 1 

        def white_death():
            Display().write("You grow taller.")
            character.die()

        def poison():
            Display().write("The mushroom tastes bittersweet.")
            character.die()
        
        if isinstance(self.food, items.YellowMushroom):
            self.outcomes.add(gross, 1)
        if isinstance(self.food, items.WhiteMushroom):
            self.outcomes.add(large, 2)
            self.outcomes.add(white_death, 1)
        if isinstance(self.food, items.BlackMushroom):
            self.outcomes.add(poison, 1)
        if isinstance(self.food, items.ManyColoredMushroom):
            if not character.trip:
                self.outcomes.add(trip_out, 1)
            else:
                self.outcomes.add(trip_in, 1)


class FlirtWithFatLady(Action):

    def __init__(self):
        super().__init__()
        self.name = "Flirt with the fat lady who feeds you."

    def execute(self, character):
        import persons

        def ignored_hoots():
            Display().write("She ignores your hoots.")
            persons.fat_lady.attracted -= 3 

        def ignored_whistling():
            Display().write("She ignores your whistling.")
            persons.fat_lady.attracted -= 2 

        def she_looks():
            Display().write("She ignores you when you say \"Hello,\" but "
                            "you catch her glancing at you throughout the day.")

        def she_smiles():
            Display().write("She smiles, but doesn't reply to the love "
                            "poem you recite to her.")

        def she_wears_sexy_clothes():
            Display().write("She ignores you, but wears a low-cut blouse "
                            "the next day.")

        def she_slips_you_food():
            Display().write("She ignores you, but gives you more food "
                            "the next day.")

        won_over = persons.meet_felicity()
        if won_over:
            places.prison.options["c"] = Raffle()
            places.prison.options["c"].add(FlirtWithFelicity(), weight=40)
        else:
            self.outcomes.add(ignored_hoots, 1)
            self.outcomes.add(ignored_whistling, 1)
            self.outcomes.add(she_looks, 1)
            self.outcomes.add(she_smiles, 1)
            self.outcomes.add(she_slips_you_food, 1)
            self.outcomes.add(she_wears_sexy_clothes, 1)
        persons.fat_lady.attracted += 2 


class FlirtWithFelicity(Action):

    def __init__(self):
        super().__init__()
        self.name = "Flirt with Felicity."

    def execute(self, character):
        import persons

        def blows_kisses():
            Display().write("Felicity blows you kisses.")

        def kiss():
            Display().write("Felicity leans in close and kisses your cheek.")

        def talks():
            Display().write("Felicity talks with you for hours. She only "
                            "stops when the warden barks at her to get "
                            "back to work.")

        def helps():
            Display().write("Felicity tells you she asked the warden to "
                            "let you out, but he has a strict \"No lunatics "
                            "on the streets\" policy.")

        def lonely():
            Display().write("Felicity says she thinks about you a lot.")

        def laughs():
            Display().write("Felicity laughs at all your jests, even the bad "
                            "ones.")

        def fat_in_dress():
            Display().write("Felicity asks if she looks fat in her new dress. "
                            "You say \"Yes.\" She doesn't speak to you for "
                            "several days.")
            persons.fat_lady.attracted -= 3

        won_over = persons.felicity_loves_you()
        if won_over:
            places.prison.options["c"] = Raffle()
            places.prison.options["a"].add(SayYouLoveHer(), weight=777)
        else:
            self.outcomes.add(blows_kisses, 1)
            self.outcomes.add(kiss, 1)
            self.outcomes.add(talks, 1)
            self.outcomes.add(helps, 1)
            self.outcomes.add(lonely, 1)
            self.outcomes.add(laughs, 1)
            self.outcomes.add(fat_in_dress, 1)
        persons.fat_lady.attracted += 2


class GoToSleep(Action):

    def __init__(self):
        super().__init__()
        self.name = "Go to sleep."

    def execute(self, character):
        import persons

        def prison_death_by_assassin():
            Display().write("You wake up just in time to see "
                            "an assassin slip a weasal between the bars of "
                            "your cell. The weasel kills you.")
            character.die()
            character.person = None

        def cat_wakes_you():
            Display().write("You are pleasantly awakened by a cat rubbing "
                            "itself against you.")
            character.get_item(items.Cat())
            character.person = None

        def awake_in_new_place():
            Display().write("You wake up some hours later.")
            character.move(2)
            character.person = None

        def stabbed():
            Display().write("You are rudely awakened by an assassin's dagger.")
            character.die()

        def wake_up_rested():
            Display().write("You wake up well-rested some hours later.")
            character.person = None

        def nice_dream():
            Display().write("You have a wonderful dream that you married a "
                            "nymph and took her to bed in Lord Carlos' "
                            "manor.")
            character.person = None

        def fire_dream():
            Display().write("You dream of fire.")
            self.options["b"].add(SingASong(about="fire"), 3)
            character.person = None

        def nightmare():
            Display().write("You have a nightmare about weasels.")
            self.options["b"].add(SingASong(about="weasels"), 3)
            character.person = None

        def robbed():
            Display().write("You wake up robbed of all your worldly "
                            "possessions.")
            character.items = set()
            character.person = None

        def pittance():
            Display().write("You wake up with a few coins on your cloak.")
            character.get_money(money.pittance)
            self.options["d"].add(SingASong(about="money"), 5)
            character.person = None

        def drown():
            Display().write("You drown in your sleep.")
            character.die()

        def dead():
            Display().write("You wake up dead.")
            character.die()

        if character.place == places.prison:
            self.outcomes.add(prison_death_by_assassin, 3)
        if character.place == places.ocean:
            self.outcomes.add(drown, 100)
        if not character.place.locked:
            self.outcomes.add(awake_in_new_place, 3)
        if character.place in places.populated and not character.place.locked:
            self.outcomes.add(cat_wakes_you, 2)
            self.outcomes.add(stabbed, 2)
            self.outcomes.add(robbed, 2)
            self.outcomes.add(pittance, 2)
        self.outcomes.add(wake_up_rested, 2)
        self.outcomes.add(nightmare, 2)
        self.outcomes.add(fire_dream, 1)
        self.outcomes.add(nice_dream, 2)
        self.outcomes.add(dead, 1)


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

        def find_wizard_by_well():
            Display().write("You see the wizard emptying a flask into a well "
                            "in the market.")
            character.move_to(places.market)
            character.person = persons.wizard

        def find_st_george():
            Display().write("You can't find the wizard, but you find St. "
                            "George. He says the wizard is a little testy.")
            character.person = persons.StGeorge

        self.outcomes.add(find_death, 3)
        self.outcomes.add(find_wizard_1, 2)
        self.outcomes.add(find_wizard_2, 2)
        self.outcomes.add(find_wizard_by_well, 1)
        self.outcomes.add(assassinated, 1)


class LeaveInAHuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a huff."

    def execute(self, character):
        def leave():
            character.move(distance=1)

        def assassinated():
            Display().write("The huffy manner in which you left causes some "
                            "assassins to notice you. They assassinate you.")
            character.die()

        self.outcomes.add(assassinated, 1)
        self.outcomes.add(leave, 9)


class LeaveInAPuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a puff."
        self.combat_action = True

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        character.move_to(random.sample(options, 1)[0])
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

        def absent_minded():
            Display().write("You absent mindedly leave {0}".format(
                character.place))
            character.move(1)
            character.person = None  # Might need a refactor

        def get_there():
            character.move_to(self.dest)
            character.person = None  # Might need a refactor

        def overhear(message):
            Display().write("As you leave {0} you overhear {1}.".format(
                character.place, message))
            character.move_to(self.dest)
            character.person = None  # Might need a refactor

        def assassin_follows():
            Display().write("As you are entering {0}, you notice an assassin "
                            "following you.".format(self.dest))
            character.move_to(self.dest)
            character.person = persons.assassin
            character.threatened = True

        if character.place in places.populated:
            self.outcomes.add(lambda: overhear(
                "someone say that the town's well has been poisoned"), 1)
            self.outcomes.add(lambda: overhear(
                "someone talking about how nice St. George was to them"), 1)
            self.outcomes.add(lambda: overhear(
                "a woman talks about how hear baby was eaten by a werewolf"), 1)
            self.outcomes.add(lambda: overhear(
                "a man talking being a pirate on Lord Arthur's ship"), 1)
            self.outcomes.add(lambda: overhear(
                "a woman asking around about assassins"), 1)
            self.outcomes.add(lambda: overhear(
                "some men are planning a trip to the woods to look for nymphs"), 1)
            self.outcomes.add(stopped_by_guards, 3)
            self.outcomes.add(assassin_follows, 2)
        self.outcomes.add(get_there, 3)
        self.outcomes.add(absent_minded, 3)


class RunLikeTheDevil(Action):

    def __init__(self):
        super().__init__()
        self.name = "Run like the Devil."
        self.combat_action = True

    def execute(self, character):
        import persons

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
            Attack(character.person).clean_execute(character)
            character.move(1)

        def flake_out_on_Felicity():
            Display().write("The Devil is very fast and not very fat, so you "
                            "manage to get away unmarried.")
            persons.fat_lady.attracted = -666
            character.move(2)
        
        if character.person == persons.fat_lady and \
           persons.fat_lady.attracted > 9:
            self.outcomes.add(flake_out_on_Felicity, weight=666)
        self.outcomes.add(escape, weight=9)
        self.outcomes.add(get_caught, weight=1)


class WaddleLikeGod(Action):

    def __init__(self):
        super().__init__()
        self.name = "Waddle like God."
        self.combat_action = True

    def execute(self, character):
        def waddle():
            Display().write("God is very slow, so you don't manage to get "
                            "away.")
            Attack(character.person).clean_execute(character)

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


class BurnThePlaceToACrisp(BurnThePlaceToTheGround):

    def __init__(self, place):
        super().__init__(place)
        self.place = place
        self.name = "Burn {0} to a crisp.".format(place.name)


class LightUpThePlace(BurnThePlaceToTheGround):

    def __init__(self, place):
        super().__init__(place)
        self.place = place
        self.name = "Light up {0}.".format(place.name)


class SetThePlaceOnFire(BurnThePlaceToTheGround):

    def __init__(self, place):
        super().__init__(place)
        self.place = place
        self.name = "Set {0} on fire.".format(place.name)


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


class SayYouLoveHer(Action):

    def __init__(self):
        super().__init__()
        self.name = "Say you love her too."

    def execute(self, character):
        import persons

        def assassinated():
            Display().write("\"What a shame,\" an assassin says as he steps "
                            "into the room. He shoots you with a crossbow.")
            character.die()

        def plotting():
            Display().write("Felicty is overjoyed and secretly lets you out "
                            "of prison that night. \"Let's get married!\" she "
                            "says.")
            character.move_to(places.streets)
            character.person = persons.fat_lady
            self.options["a"].add(MarryFelicity(), weight=777)
            self.options["c"].add(RunLikeTheDevil(), weight=666)
        self.outcomes.add(assassinated, weight=1)
        self.outcomes.add(plotting, weight=9)


class MarryFelicity(Action):

    def __init__(self):
        super().__init__()
        self.name = "Marry Felicity."

    def execute(self, character):
        import persons

        def happily_ever_after():
            Display().write("St. George secretly performs a wedding for you "
                            "and Felicity.")
            character.alone = False

        self.outcomes.add(happily_ever_after, weight=9)
