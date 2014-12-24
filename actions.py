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
import persons
from outcome import Outcome


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
        return self.run_outcome()

    @abc.abstractmethod
    def execute(self, character):
        """
        returns nothing, edits character attributes
        """

        def some_stuff():
            pass

    def run_outcome(self):
        outcome = self.outcomes.get()  # outcome may be function or instance
        if isinstance(outcome, Outcome):
            outcome.execute()
        elif outcome:
            outcome()
        self.outcomes = Raffle()
        return outcome


# A slot actions


class AskAboutAssassins(Action):

    def __init__(self):
        super().__init__()
        self.name = "Ask about assassins."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The first person you ask about assassins turns "
            "out to be an assassin. She assassinates you.",
            die=True
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You ask around, but nobody has heard anything "
            "about any assassins.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "During your search, you strike up a conversation "
            "with a pretty lady.",
            new_person=persons.pretty_lady
        ), weight=1)


class Apologize(Action):
    def __init__(self):
        super().__init__()
        self.name = "Tell him you're sorry."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "\"I'm afraid 'sorry' won't cut it.\" His knife does.",
            die=True,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "\"Oh, you're not sorry yet,\" he says as he steps toward you.",
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "A bystander notices the assassin threatening you. "
            "\"The man said he was sorry, isn't that enough?\" "
            "he says. \"No,\" the assassin replies.",
        ), weight=1)


class Attack(Action):

    def __init__(self, person):
        super().__init__()
        self.name = "Attack " + person.pronouns.obj + "."
        self.combat_action = True

    def execute(self, character):

        if character.person.attack >= character.attack:
            self.outcomes.add(Outcome(character,
                character.person.name.capitalize() + " kill" + 
                character.person.pronouns.tense + " you.",
                die=True,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "You kill " + character.person.name + ".",
                kill=True,
            ), weight=1)


class GoDivingForPearls(Action):

    def __init__(self):
        super().__init__()
        self.name = "Go diving for pearls."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Lord Arthur's pet shark eats you.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You soon find a pearl in an oyster.",
            add_item=items.Pearl(),
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You drown on a fool's errand",
            die=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You soon pry open an oyster and find beautiful pearl. "
            "It's so dazzling you drown while gazing at it.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You exhaust yourself trying to find pearls and start to drown. "
            "A beautiful mermaid grabs you and hoists you to safety.",
            move_to=places.mermaid_rock,
            new_person=persons.mermaid,
        ), weight=1)


class LickTheGround(Action):

    def __init__(self):
        super().__init__()
        self.name = "Lick the ground."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You catch an infection and spend three weeks fighting it.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find the flavor of the ground distasteful.",
            fail=True,
        ), weight=3)

        if character.place in places.populated:
            self.outcomes.add(Outcome(character,
                "The local guards see you licking the ground and accuse you of "
                "being a lunatic.",
                new_person=persons.guards,
            ), weight=3)

        if character.place == places.ocean:
            self.outcomes.add(Outcome(character,
                "You drown while swimming toward the ocean floor with your "
                "tongue extended.",
                die=True,
            ), weight=10000)

        if character.place == places.woods:
            self.outcomes.add(Outcome(character,
                "As you lick the ground, you notice it smells oddly familiar.",
            ), weight=3)

        if character.place == places.arctic:
            self.outcomes.add(Outcome(character,
                "You get your tongue stuck to an icicle.",
                fail=True,
                lock=True,
            ), weight=10)


class LookForAWeapon(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for a weapon."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You find yourself talking to a wealthy war merchant.",
            new_person=persons.wealthy_merchant,
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You find one... in your back as an assasin walks away smoothly.",
            die=True,
        ), weight=1)


class GoMushroomPicking(Action):

    def __init__(self):
        super().__init__()
        self.name = "Go mushroom picking."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You find a yellow mushroom.",
            add_item=items.YellowMushroom(),
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a white mushroom.",
            add_item=items.WhiteMushroom(),
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a black mushroom.",
            add_item=items.BlackMushroom(),
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a many-colored mushroom.",
            add_item=items.ManyColoredMushroom(),
        ), weight=1)


class LookForStGeorge(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for St. George."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You forget what you were doing.",
            move=1,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You trip over a cat and break your neck.",
            die=True
        ), weight=1)

        if persons.st_george.alive:
            self.outcomes.add(Outcome(character,
                "You find St. George at the chuch.",
                move_to=places.church,
                new_person=persons.st_george,
            ), weight=10)

            self.outcomes.add(Outcome(character,
                "You find St. George in the streets.",
                move_to=places.streets,
                new_person=persons.st_george,
            ), weight=5)

            self.outcomes.add(Outcome(character,
                "You find St. George in the market.",
                move_to=places.market,
                new_person=persons.st_george,
            ), weight=3)


class KillYourselfInFrustration(Action):

    def __init__(self):
        super().__init__()
        self.name = "Kill yourself in frustration."

    def execute(self, character):

        if character.place in [
                places.docks,
                places.mermaid_rock,
                places.arctic]:
            self.outcomes.add(Outcome(character,
                "You walk into the ocean and are suddenly inspired to write "
                "a novel. You drown.",
                die=True,
            ), weight=5)

        if character.place in [places.streets, places.market, places.church]:
            self.outcomes.add(Outcome(character,
                "You throw yourself off a rooftop, but St. George catches "
                "you and gives you a large fortune.",
                get_money=money.large_fortune,
                new_person=persons.st_george,
            ), weight=2)

        if character.place in [places.docks]:
            self.outcomes.add(Outcome(character,
                "You find Lord Arthur and ask him to kill you with his "
                "jeweled cutlass. He gladly obliges.",
                die=True,
            ), weight=5)

        self.outcomes.add(Outcome(character,
            "You perform the ritual of seppuku.",
            die=True,
        ), weight=3)

        if character.place != places.ocean:
            self.outcomes.add(Outcome(character,
                "You set yourself on fire and burn to a crisp.",
                die=True,
            ), weight=3)
        else:
            self.outcomes.add(Outcome(character,
                "You drown trying to set yourself on fire.",
                die=True,
            ), weight=3)


class KillEverybodyInAFitOfRage(Action):

    def __init__(self):
        super().__init__()
        self.name = "Kill everybody in a fit of rage."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You start with yourself.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You make no exceptions.",
            die=True
        ), weight=1)

class SayYouLoveHer(Action):

    def __init__(self, person):
        super().__init__()
        self.name = "Say you love her too."
        self.person = person

    def execute(self, character):

        if self.person == persons.fat_lady:
            self.outcomes.add(Outcome(character,
                "\"What a shame,\" an assassin says as he steps into the room. "
                "He shoots you with a crossbow.",
                die=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity is overjoyed and secretly lets you out of prison "
                "that night. \"Let's get married!\" she says.",
                move_to=places.streets,
                new_person=persons.fat_lady
            ), weight=9)


class MarryFelicity(Action):

    def __init__(self):
        super().__init__()
        self.name = "Marry Felicity."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "St. George secretly performs a wedding for you and Felicity.",
            win=True
        ), weight=9)


# B slot actions


class SeekAHigherPower(Action):

    def __init__(self):
        super().__init__()
        self.name = "Seek a higher power."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "Your prayers go unanswered.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your prayers are answered.",
            get_money=money.small_fortune
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your prayers aren't answered, but the assassins' are.",
            die=True
        ), weight=1)

        if character.place == places.tavern:

            self.outcomes.add(Outcome(character,
                "You find no higher power, but you do find a small sack of "
                "jewels someone left on a counter.",
                add_item=items.Jewels(),
                topic='jewels'
            ), weight=1)

        if character.place in [places.market, places.church, places.streets]:

            self.outcomes.add(Outcome(character,
                "You find St. George.",
                new_person=persons.st_george
            ), weight=1)


class BegForMoney(Action):

    def __init__(self):
        super().__init__()
        self.name = "Beg for money."

    def execute(self, character):

        if character.place != places.church and \
           character.person == persons.st_george:
            self.outcomes.add(Outcome(character,
                "St. George tells you he has lost his wallet in the church.",
            ), weight=1)


        if character.person == persons.st_george:
            if persons.st_george.state.get("given money", False):
                self.outcomes.add(Outcome(character,
                    "St. George becomes irritated by your begging "
                    "and crushes you with his iron hammer.",
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "St. George smites you with his saintly wraith "
                    "for being ungrateful.",
                ), weight=1)

            else:
                self.outcomes.add(Outcome(character,
                    character.person.name + " give" +
                    character.person.pronouns.tense +
                    " you a pittance.",
                    beg=True,
                    get_money=money.pittance,
                ), weight=3)

                self.outcomes.add(Outcome(character,
                    character.person.name + " give" +
                    character.person.pronouns.tense +
                    " you a small fortune.",
                    beg=True,
                    get_money=money.small_fortune,
                ), weight=2)

                self.outcomes.add(Outcome(character,
                    character.person.name + " give" +
                    character.person.pronouns.tense +
                    " you a large fortune.",
                    beg=True,
                    get_money=money.large_fortune,
                ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "Your begging falls on deaf ears.",
                fail=True,
                beg=True,
                topic="money",
            ), weight=1)


class BideYourTime(Action):

    def __init__(self):
        super().__init__()
        self.name = "Bide your time."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You die of old age.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "As the days drag on, you go insane.",
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You notice the warden carries the keys when he "
            "inspects the cells. He inspects the cells with "
            "an entourage of guards most weekends, but he "
            "does it alone on holidays.",
        ), weight=2)
            #self.options["a"].add(LaughAboutWarden(), 5)
            #self.options["b"].add(TryToTakeKeys(), 5)
            #self.options["d"].add(WaitForAHoliday(), 5)

        if persons.fat_lady.attracted > -1 and persons.fat_lady.attracted < 3:
            self.outcomes.add(Outcome(character,
                "As the days pass, you find yourself more and more "
                "attracted to the fat woman who brings you food.",
            ), weight=3)


class Buy(Action):

    def __init__(self, weapons):
        super().__init__()
        self.weapon = random.choice(weapons)
        self.name = "Buy a " + self.weapon.name

    def execute(self, character):

        if character.money >= self.weapon.price:
            self.outcomes.add(Outcome(character,
                "",
                new_weapon=self.weapon,
            ), weight=3)
        else:
            self.outcomes.add(Outcome(character,
                "You can't afford this weapon.",
                fail=True,
                topic="poverty",
            ), weight=3)


class BuyADrink(Action):

    def __init__(self):
        super().__init__()
        self.name = "Buy a drink."

    def execute(self, character):

        if persons.blind_bartender.alive:

            self.outcomes.add(Outcome(character,
                "The blind bartender grumbles as he passes you a drink.",
                new_person=persons.blind_bartender,
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "An assassin walks up and starts hitting on you... very hard.",
                die=True,
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "As you drink, you hear a countryman, talking about how great "
                "Lord Bartholomew is.",
                topic='Lord Bartholomew'
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "A man in a black cloak sits next to you and orders a drink.",
                new_person=persons.assassin,
                topic="assassins"
            ), weight=2)

        else:
            self.outcomes.add(Outcome(character,
                "No one is selling.",
                fail=True,
            ), weight=1)


class BoastOfYourBravery(Action):

    def __init__(self):
        super().__init__()
        self.name = "Boast of your bravery."

    def execute(self, character):
        if not character.person:

            self.outcomes.add(Outcome(character,
                "You impress yourself.",
            ), weight=1)

        else:

            self.outcomes.add(Outcome(character,
                 character.person.pronouns.subj.capitalize() +
                 " is not impressed.",
                 fail=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "As you boast of your exploits, {0} walks away.".format(
                    character.person.name),
                new_person=None,
                fail=True,
            ), weight=1)

            if character.person == persons.blind_bartender:

                self.outcomes.add(Outcome(character,
                    "The blind bartender starts pretending to be deaf.",
                    fail=True,
                ), weight=3)

            if character.person == persons.st_george:

                self.outcomes.add(Outcome(character,
                    "St. George warns you of the dangers of hubris.",
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "You tell St. George about the time you burnt a house "
                    "down and hey slays you for your wicked ways.",
                    die=True
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "St. George lauds your noble deeds and rewards you.",
                    get_money=money.large_fortune
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "St. George becomes irate when you claim to have slain a "
                    "dragon. He obliterates you.",
                    die=True
                ), weight=1)

            if character.person == persons.pretty_lady:

                self.outcomes.add(Outcome(character,
                    "Her eyes glaze over as you struggle to remember times "
                    "you were brave.",
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "She sees through your lies.",
                    fail=True,
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "She seems interested in your stories.",
                ), weight=1)

            if character.person == persons.fat_lady:

                self.outcomes.add(Outcome(character,
                    "She points out several inconsistencies in your story.",
                    flirt=-1,
                    fail=True
                ), weight=1)

                self.outcomes.add(Outcome(character,
                    "She seems to buy it.",
                    flirt=1
                ), weight=1)

            if character.person == persons.guards:

                self.outcomes.add(Outcome(character,
                    "You tell the guards that you are brave.\n 'A brave "
                    "lunatic,' they say and they throw you in prison.",
                    new_person=persons.other_lunatics,
                    move_to=places.prison
                ), weight=1)


class LookForACat(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for a cat."

    def execute(self, character):

        if character.place in places.populated and not character.place.locked:
            self.outcomes.add(Outcome(character,
                "You follow a cat through the streets but "
                "eventually lose track of it.",
                move_to=places.dark_alley,
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "The local guards notice you searching for a cat "
                "and conclude that you must be a lunatic.",
                new_person=persons.guards,
                topic="lonely",
            ), weight=3)

        self.outcomes.add(Outcome(character,
            "After days of searching, you manage to find a cat.",
            add_item=items.Cat(),
        ), weight=7)

        self.outcomes.add(Outcome(character,
            "Your efforts to find a cat are fruitless.",
            fail=True,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You see something out of the corner of your eye that looks like "
            "a cat. You chase it to no avail.",
            fail=True,
            topic="cats",
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You find a ferocious cat. It kills you.",
            die=True,
        ), weight=1)

        if character.place == places.pirate_ship:
            self.outcomes.add(Outcome(character,
                "You find Lord Arthur's freakish cat. The cat has "
                "eight more tails than a normal cat.",
            ), weight=1)


class TellThemYouAreNotALunatic(Action):

    def __init__(self, topic):
        super().__init__()
        self.topic = topic
        self.name = "Tell them you are not a lunatic, " + \
            "you're just {0}.".format(topic)

    def execute(self, character):

        if self.topic[0] in "aeiou":
            self.outcomes.add(Outcome(character,
                "\"An {0} lunatic,\" they say.".format(self.topic),
                fail=True,
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=1)
        else:
            self.outcomes.add(Outcome(character,
                "\"A {0} lunatic,\" they say.".format(self.topic),
                fail=True,
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=1)


class LookForSeaTurtles(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for sea turtles."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You don't see one. You also drown because you are in the ocean.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "Your efforts to find a sea turtle are fruitless.",
            fail=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find a sea turtle and follow it to shore.",
            move_to=places.woods,
            topic="sea turtles"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find a sea turtle. Everywhere looks the same.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a shark instead. It minds its own business."
        ), weight=1)


class LookForMermaids(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for mermaids."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You are taken out by a storm during your search.",
            die=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "After days of searching, you are not sure mermaids exist.",
            fail=True,
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find a sea turtle instead.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are not sure where to look.",
            fail=True,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mermaid and she leads you back to her rock.",
            move_to=places.mermaid_rock,
            new_person=persons.mermaid
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a wooden mermaid figurehead on the front of Lord "
            "Arthur's ship. The crew hoists you abroad.",
            move_to=places.pirate_ship
        ), weight=1)


# C slot actions


class ChowDown(Action):

    def __init__(self, food):
        super().__init__()
        self.food = food
        self.name = "Chow down on the " + str(food) + "."

    def execute(self, character):

        if isinstance(self.food, items.ManyColoredMushroom):
            # TODO implement trip
            if not character.trip:
                self.outcomes.add(Outcome(character,
                    "Your perception of the world begins to change.",
                    remove_item=character.get_item(items.ManyColoredMushroom),
                    funcs=[character.start_tripping],
                ), weight=1)
            else:
                self.outcomes.add(Outcome(character,
                    "You feel normal again.",
                    remove_item=character.get_item(items.ManyColoredMushroom),
                    funcs=[character.stop_tripping],
                ), weight=1)

        if isinstance(self.food, items.YellowMushroom):
            self.outcomes.add(Outcome(character,
                "You find the mushroom distasteful.",
                remove_item=character.get_item(items.YellowMushroom),
            ), weight=1)

        if isinstance(self.food, items.BlackMushroom):
            self.outcomes.add(Outcome(character,
                "The mushroom tastes bittersweet.",
                remove_item=character.get_item(items.BlackMushroom),
                die=True,
            ), weight=1)

        if isinstance(self.food, items.WhiteMushroom):
            character.attack += 1  # TODO don't do this here
            self.outcomes.add(Outcome(character,
                "You grow larger.",
                remove_item=character.get_item(items.WhiteMushroom),
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You shrink to the size of a peanut. A weasel "
                "soon comes along and eats you.",
                remove_item=character.get_item(items.WhiteMushroom),
                die=True,
            ), weight=1)


class FlirtWith(Action):

    def __init__(self, person):
        super().__init__()
        self.person = person
        self.name = "Flirt with {0}.".format(person.name)

    def execute(self, character):

        if self.person == persons.fat_lady and \
           persons.fat_lady.name != "Felicity":
            self.outcomes.add(Outcome(character,
                "She ignores your hoots.",
                flirt=(persons.fat_lady, -1),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores your whistling.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you when you say \"Hello,\" but "
                "you catch her glancing at you throughout the day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She smiles, but doesn't reply to the love "
                "poem you recite to her.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you, but wears a low-cut blouse the next day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you, but gives you more food the next day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "She ignores you, but gives you more food the next day.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            if persons.fat_lady.attracted > 3:
                def change_name():
                    persons.fat_lady.name = "Felicity"
                def change_pronouns():
                    persons.fat_lady.pronouns = \
                        persons.Pronouns("Felicity", "Felicity", "s")
                self.outcomes.add(Outcome(character,
                    "You strike up a conversation and learn that her name is "
                    "Felicity.",
                    flirt=(persons.fat_lady, 2),
                    funcs=[change_name, change_pronouns]
                ), weight=100)
        elif self.person == persons.fat_lady:  # We know her name

            self.outcomes.add(Outcome(character,
                "Felicity blows you kisses.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity leans in close and kisses your cheek.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity talks with you for hours. She only "
                "stops when the warden barks at her to get "
                "back to work.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity tells you she asked the warden to "
                "let you out, but he has a strict \"No lunatics "
                "on the streets\" policy.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity says she thinks about you a lot.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity laughs at all your jests, even the bad ones.",
                flirt=(persons.fat_lady, 2),
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "Felicity asks if she looks fat in her new dress. "
                "You say \"Yes.\" She doesn't speak to you for several days.",
                flirt=(persons.fat_lady, -1),
            ), weight=1)

            if persons.fat_lady.attracted > 10:
                self.outcomes.add(Outcome(character,
                    "Felicity whispers that she loves you.",
                    love_confessor=persons.fat_lady
                ), weight=100)

                # places.prison.options["a"].add(SayYouLoveHer(), weight=777)


class GoToSleep(Action):

    def __init__(self):
        super().__init__()
        self.name = "Go to sleep."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You wake up dead.",
            die=1
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You have a nightmare about weasels.",
            topic="weasels",
            new_person=None
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You dream of fire.",
            topic="fire",
            new_person=None
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You have a wonderful dream that you married a nymph and took her "
            "to bed in Lord Carlos' manor.",
            new_person=None
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You wake up well-rested some hours later.",
            new_person=None
        ), weight=2)

        if character.place == places.prison:
            self.outcomes.add(Outcome(character,
                "You wake up just in time to see an assassin slip a weasel "
                "between the bars of your cell. The weasel kills you.",
                die=True
            ), weight=3)

        if character.place == places.ocean:
            self.outcomes.add(Outcome(character,
                "You drown in your sleep.",
                die=True
            ), weight=100)

        if not character.place.locked:
            self.outcomes.add(Outcome(character,
                "You wake up some hours later.",
                move=2,
                new_person=None
            ), weight=3)

        if character.place in places.populated and not character.place.locked:

            self.outcomes.add(Outcome(character,
                "You are pleasantly awakened by a cat rubbing itself against "
                "you.",
                add_item=items.Cat(),
                new_person=None
            ), weight=2)

            # TODO character.items = set()
            self.outcomes.add(Outcome(character,
                "You wake up robbed of all your worldly possessions.",
                new_person=None
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You are rudely awakened by an assassin's dagger.",
                die=True
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "You wake up robbed of all your worldly possessions.",
                get_money=money.pittance,
                topic="money",
                new_person=None
            ), weight=2)


class LookForTheWizard(Action):

    def __init__(self):
        super().__init__()
        self.name = "Look for the wizard."

    def execute(self, character):

        if character.has_item(items.YellowMushroom):
            self.outcomes.add(Outcome(character,
                "When you find him, he can smell that you have a yellow "
                "mushroom. He asks if he can have it.",
                move_to=places.market,
                new_person=persons.wizard
            ), weight=30)

        self.outcomes.add(Outcome(character,
            "You find him. He turns you into a frog and steps on you.",
            die=1
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find him. He turns you into a frog and tries to step on you "
            "but you manage to hop away.",
            funcs=[character.frogify],
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "When you find him. He gives you a frog.",
            add_item=items.Frog(),
            move_to=places.market,
            new_person=persons.wizard
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You look for the wizard, but the assassins are looking for you. "
            "They find you.",
            die=1
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find the wizard in the market. He is telling a woman how he "
            "cursed the icicles in the arctic.",
            move_to=places.market,
            new_person=persons.wizard
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You find the wizard in the market. He is telling a woman about "
            "a mesmerizing pearl.",
            move_to=places.market,
            new_person=persons.wizard
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "You see the wizard emptying a flask into a well in the market.",
            move_to=places.market,
            new_person=persons.wizard
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You can't find the wizard, but you find St. George. He says the "
            "wizard is a little testy.",
            new_person=persons.st_george
        ), weight=1)


class LeaveInAHuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a huff."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            None,
            move=1,
            new_person=None,
            unthreat=False
        ), weight=9)

        if character.place in places.populated:
            self.outcomes.add(Outcome(character,
                "The huffy manner in which you left causes some assassins to "
                "notice you. They assassinate you.",
                die=True
            ), weight=1)


class LeaveInAPuff(Action):

    def __init__(self):
        super().__init__()
        self.name = "Leave in a puff."
        self.combat_action = True

    def execute(self, character):
        options = places.Place.instances - set([character.place])
        place = random.sample(options, 1)[0]

        self.outcomes.add(Outcome(character,
            None,
            move_to=place,
            new_person=None,
            unthreat=True
        ), weight=3)


class FleeTheScene(Action):

    def __init__(self):
        super().__init__()
        self.name = "Flee the scene."

    def execute(self, character):
        self.outcomes.add(Outcome(character,
            None,
            move=2,
            new_person=None
        ), weight=3)


class GoTo(Action):

    def __init__(self, place):
        super().__init__()
        self.dest = random.sample(place.connections, 1)[0]
        self.name = "Go to " + str(self.dest) + "."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You absent mindedly leave {0}".format(character.place),
            move=1,
            new_person=None
        ), weight=3)

        self.outcomes.add(Outcome(character,
            None,
            move_to=self.dest,
            new_person=None
        ), weight=3)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "On your way out of {0} you run headlong into some guards and "
                "they say you must be a lunatic.".format(character.place),
                new_person=persons.guards,
                topic="oblivious"
            ), weight=3)

            self.outcomes.add(Outcome(character,
                "As you are entering {0}, you notice an assassin following "
                "you.".format(self.dest),
                move_to=self.dest,
                threat=True,
                new_person=persons.assassin
            ), weight=2)

            if character.has_item(items.Cat):
                self.outcomes.add(Outcome(character,
                    "Your cat notices an assassin approaching. You do not.",
                    die=True,
                ), weight=1)

            overhear_template = "As you leave " + character.place.name + \
                " you overhear {0}."

            self.outcomes.add(Outcome(character,
                overhear_template.format("someone say that the town's well "
                    "has been poisoned"),
                move_to=self.dest,
                new_person=None
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("someone talking about how nice St. "
                    "George was to them"),
                move_to=self.dest,
                new_person=None
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("a woman talks about how hear baby "
                    "was eaten by a werewolf"),
                move_to=self.dest,
                new_person=None
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("a man talking being a pirate on "
                    "Lord Arthur's ship"),
                move_to=self.dest,
                new_person=None
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("a woman asking around about "
                    "assassins"),
                move_to=self.dest,
                new_person=None
            ), weight=1)

            self.outcomes.add(Outcome(character,
                overhear_template.format("some men are planning a trip to "
                    "the woods to look for nymphs"),
                move_to=self.dest,
                new_person=None
            ), weight=1)


class RunLikeTheDevil(Action):

    def __init__(self):
        super().__init__()
        self.name = "Run like the Devil."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "The Devil is very fast, so you manage to get away.",
            new_person=None,
            unthreat=True,
            move=2
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You run like the Devil, but " + character.person.pronouns.subj +
            " also run" + character.person.pronouns.tense + " like the Devil "
            "and overtake" + character.person.pronouns.tense + " you.",
            die=True
        ), weight=1)

        if character.person == persons.fat_lady and \
           persons.fat_lady.attracted > 9:
            self.outcomes.add(Outcome(character,
                "The Devil is very fast and not very fat, so you manage to get "
                "away unmarried.",
                move=2,
                flirt=(persons.fat_lady, -666)
            ), weight=666)


class WaddleLikeGod(Action):

    def __init__(self):
        super().__init__()
        self.name = "Waddle like God."
        self.combat_action = True

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "God is very slow, so you don't manage to get away.",
            die=True
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You waddle like God, but " + character.person.pronouns.subj +
            " also waddle" + character.person.pronouns.tense + " like God and "
            "fail to overtake" + character.person.pronouns.tense + " you. You "
            "slowly get away.",
            unthreat=True,
            new_person=None,
            move=1
        ), weight=1)


class Swim(Action):
    def __init__(self):
        super().__init__()
        self.name = "Swim."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You manage to stay afloat."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You keep your head up."
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You see a ship in the distance. You are unable to reach it.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You make very little progress.",
            fail=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You die of dehydration.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are in way over your head.",
            die=True
        ), weight=1)


class KeepSwimming(Swim):
    def __init__(self):
        super().__init__()
        self.name = "Keep swimming."

    def execute(self, character):
        super().execute(character)

        self.outcomes.add(Outcome(character,
            "You die of exhaustion.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You are picked up by Lord Arthur's pirate ship.",
            move_to=places.pirate_ship,
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mermaid sitting on a rock.",
            move_to=places.mermaid_rock,
            new_person=persons.mermaid
        ), weight=1)

        if character.has_item(items.Cat):
            self.outcomes.add(Outcome(character,
                "Your cat dies.",
                remove_item=character.get_item(items.Cat),
                fail=True
            ), weight=1)


class JustKeepSwimming(KeepSwimming):
    def __init__(self):
        super().__init__()
        self.name = "Just keep swimming."

    def execute(self, character):
        super().execute(character)

        self.outcomes.add(Outcome(character,
            "You die of exhaustion.",
            die=True
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You finally find land.",
            move_to=places.docks
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "As you swim, you notice the water getting colder. You eventually "
            "find land",
            move_to=places.arctic,
            fail=True
        ), weight=1)


# D slot actions


class SingASong(Action):

    def __init__(self, topic=None):
        super().__init__()
        self.topic = topic
        if topic:
            self.name = "Sing a song about {0}.".format(topic)
        else:
            self.name = "Sing a song."

    def execute(self, character):

        if character.place == places.mermaid_rock:
            self.outcomes.add(Outcome(character,
                "As you sing, a ship sails by. The crew has wax in their "
                "ears and the captain is tied to the mast. He is not "
                "impressed.",
                fail=True,
            ), weight=100)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "Your singing is too load for you to hear the footsteps of an "
                "assassin over. He assassinates you.",
                die=True
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "A crowd gathers to hear your music and throws you a small "
                "fortune in coins.",
                get_money=money.small_fortune
            ), weight=2)

            self.outcomes.add(Outcome(character,
                "The locals hate your voice and soon mob you.",
                die=True
            ), weight=1)

            if not character.person:
                self.outcomes.add(Outcome(character,
                    "While you're singing, some men in black cloaks start to "
                    "edge their way toward you.",
                    new_person=persons.assassins,
                    threat=True
                ), weight=3)

        if self.topic == "assassins":
            self.outcomes.add(Outcome(character,
                "An assassin notices you singing about assassins and "
                "assassinates you",
                die=True
            ), weight=5)

        if character.person == persons.wizard:
            self.outcomes.add(Outcome(character,
                "The wizard complains that you are singing off key. He turns "
                "you into a frog and steps on you.",
                die=True
            ), weight=20)

        if not character.place.locked:

            self.outcomes.add(Outcome(character,
                "You wander aimlessly as you work your way through an epic "
                "ballad.",
                move=1
            ), weight=1)

        if self.topic is None:

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Arthur, captain of the pirates.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Bartholomew, leader of the "
                "peasants.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Carlos, ruler of the assassins.",
            ), weight=1)

            self.outcomes.add(Outcome(character,
                "You sing a song about Lord Daniels, head of the guard.",
            ), weight=1)

        self.outcomes.add(Outcome(character,
            "You sing your favorite song. No one cares.",
        ), weight=2)


class SwingYourCat(Action):

    def __init__(self, cat):
        super().__init__()
        self.cat = cat
        self.name = "Swing your cat."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You hit an assassin with your cat.",
            new_person=persons.assassin,
            threat=True,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "Your cat manages to escape.",
            remove_item=self.cat
        ), weight=2)

        if character.place in places.populated:

            self.outcomes.add(Outcome(character,
                "The local guards notice you swinging your cat around and "
                "conclude that you must be a lunatic.",
                new_person=persons.guards,
                topic="angry"
            ), weight=3)


class BurnThePlaceToTheGround(Action):

    def __init__(self, place):
        super().__init__()
        self.place = place
        self.name = "Burn {0} to the ground.".format(place.name)

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You accidentally set yourself on fire and promptly burn to the "
            "ground.",
            die=True
        ), weight=1)

        if self.place in places.burnable:
            self.outcomes.add(Outcome(character,
                None,
                burn_place=self.place,
                move_to=self.place
            ), weight=4)


        if character.person == persons.st_george:
            self.outcomes.add(Outcome(character,
                "St. George sees you attempting arson and kills you.",
                die=True
            ), weight=30)

        if character.person == persons.st_george:
            self.outcomes.add(Outcome(character,
                "The wizard sees you attempting arson and turns you into a "
                "frog. He steps on you.",
                die=True
            ), weight=20)


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

        self.outcomes.add(Outcome(character,
            "You attempt to look through the trash, but an assassin takes it "
            "out.",
            die=True
        ), weight=2)

        self.outcomes.add(Outcome(character,
            "While you are searching through the trash you find an somewhat "
            "agreeable cat.",
            add_item=items.Cat()
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "The local guards see you searching through the trash and accuse "
            "you of being a lunatic.",
            add_item=items.Cat(),
            new_person=persons.guards,
            topic="curious"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You do not find anything useful in the trash.",
            fail=True,
            topic="trash"
        ), weight=1)

        self.outcomes.add(Outcome(character,
            "You find a mirror in the trash. You see nothing of value.",
            fail=True
        ), weight=1)

class DanceAJig(Action):

    def __init__(self):
        super().__init__()
        self.name = "Dance a jig."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You get sweaty.",
        ), weight=9)

        self.outcomes.add(Outcome(character,
            "You have a grand old time.",
        ), weight=5)

        self.outcomes.add(Outcome(character,
            "You step in a puddle and get your britches wet.",
            fail=True,
        ), weight=3)

        self.outcomes.add(Outcome(character,
            "You break your ankle and fall to the ground. You catch yourself "
            "but you break your wrist and hit your head on the ground and "
            "your neck.",
            die=True,
        ), weight=1)

        if character.place == places.woods:
            fae = random.choice(["fairaes", "sprites",
                                 "pixies", "dryads",
                                 "nymphs", "spirits"])
            self.outcomes.add(Outcome(character,
                "Some {0} dance with you and then fade away.".format(fae),
            ), weight=20)

            self.outcomes.add(Outcome(character,
                "Some goblins dance with you and then kill you."
                die=True,
            ), weight=3)

        if character.place in places.populated:
            self.outcomes.add(Outcome(character,
                "Some local peasants are entertained by your antics and toss "
                "you some coins.",
                get_money=money.pittance
            ), weight=10)

            self.outcomes.add(Outcome(character,
                "Many peasants start dancing with you and begin singing about "
                "Lord Bartholomew.",
            ), weight=15)

        if character.place == places.countryside:
            self.outcomes.add(Outcome(character,
                "Many peasants start dancing with you and begin singing an "
                "ode to Lord Bartholomew.",
            ), weight=25)

        if character.person == persons.mermaid:
            self.outcomes.add(Outcome(character,
                "She laughs and claps and seems completely in awe of your "
                "legs.",
                flirt=(persons.mermaid, 30),
            ), weight=1)

        if character.person == persons.guards:
            self.outcomes.add(Outcome(character,
                "\"We got a dancer,\" one of them says. They throw you in "
                "prison.",
                move_to=places.prison,
                new_person=persons.other_lunatics,
            ), weight=100)

            self.outcomes.add(Outcome(character,
                "\"Eh, he's all right,\" one of them says. The guards "
                "go on their way.",
                topic="guards",
            ), weight=100)

        if character.place == places.arctic:
            self.outcomes.add(Outcome(character,
                "You get sweaty. The sweat freezes on you. "
                "You freeze to death.",
                die=True,
            ), weight=30)

        if character.place == places.tavern or \
           character.place == places.lord_carlos_manor:
            self.outcomes.add(Outcome(character,
                "Some assassins immediately notice you dancing and assassinate "
                "you.",
                die=True,
            ), weight=15)


class Drown(Action):

    def __init__(self):
        super().__init__()
        self.name = "Drown."

    def execute(self, character):

        self.outcomes.add(Outcome(character,
            "You drown.",
            die=True
        ), weight=1)


class Sink(Drown):

    def __init__(self):
        super().__init__()
        self.name = "Sink."
