"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

import random

import places
from character import Character
from display import Display
import actions
import frog_actions
import persons
import items
import weapons
import money
from multiple_choice import MultipleChoice


def add_action_actions(choices, character):
    if type(character.prev_act) == actions.Swim and \
       character.place == places.ocean:
        choices.add(actions.KeepSwimming(), "c", 10000)
    if type(character.prev_act) ==  actions.KeepSwimming and \
       character.place == places.ocean:
        choices.add(actions.JustKeepSwimming(), "c", 10000)
    if type(character.prev_act) == actions.JustKeepSwimming and \
       character.place == places.ocean:
        choices.add(actions.JustKeepSwimming(), "c", 10000)
    if isinstance(character.prev_act, actions.SayYouLoveHer) and \
       character.person == persons.fat_lady:
        choices.add(actions.MarryFelicity(), "a", 777)
        choices.add(actions.RunLikeTheDevil(), "c", 666)


def add_outcome_actions(choices, character, outcome):
    for action, slot, weight in outcome.actions:
        choices.add(action, slot, weight)
    if outcome.love_confessor is not None:
        choices.add(actions.SayYouLoveHer(outcome.love_confessor), "a", 1000)
    if outcome.fail:
        choices.add(actions.KillYourselfInFrustration(), "a", 5)
        if character.place in places.populated:
            choices.add(actions.KillEverybodyInAFitOfRage(), "a", 5)
        if character.place in places.burnable:
            choices.add(actions.BurnThePlaceToTheGround(
                character.place), "b", 3)
        if not character.place.locked:
            choices.add(actions.LeaveInAHuff(), "c", 5)
    if outcome.succeed:
        choices.add(actions.ThumpYourselfOnTheChest(), "a", 5)
        choices.add(actions.CelebrateYourSuccess(), "c", 5)
    if outcome.topic:
        if outcome.new_person == persons.guards:
            choices.add(actions.TellThemYouAreNotALunatic(
                topic=outcome.topic), "b", 10)
        else:
            choices.add(actions.SingASong(topic=outcome.topic), "d", 10)


def add_person_actions(choices, character):
    if character.person:
        choices.add(actions.Attack(character.person), "a", 10)
    if character.person == persons.assassin:
        choices.add(actions.Apologize(), "d", 10)
    if character.person == persons.assassins:
        choices.add(actions.BoastOfYourBravery(), "b", 1)
    if character.person == persons.blind_bartender:
        choices.add(actions.BoastOfYourBravery(), "b", 1)
    if character.person == persons.pretty_lady:
        choices.add(actions.BoastOfYourBravery(), "b", 5)
        choices.add(actions.FlirtWith(persons.pretty_lady), "c", 1000) # TODO fix
    if character.person == persons.st_george:
        choices.add(actions.BegForMoney(), "b", 10)
        choices.add(actions.SingASong(topic="St. George"), "d", 3)
    if character.person == persons.wealthy_merchant:
        choices.add(actions.BoastOfYourBravery(), "b", 1)
        choices.add(actions.Buy(weapons.weapons), "b", 30)
        choices.add(actions.SingASong(topic="weapons"), "d", 3)
    if character.person == persons.wizard:
        choices.add(actions.BoastOfYourBravery(), "b", 2)
        choices.add(actions.SingASong(), "d", 2)
        choices.add(actions.SingASong(topic="magic"), "d", 3)
    if character.person != persons.wizard and \
       character.place in [places.streets, places.market]:
        choices.add(actions.LookForTheWizard(), "c", 2)
    if character.person == persons.peasant_lass or \
       character.person == persons.simple_peasant:
        choices.add(actions.AskDirections(), "a", 30)


def add_place_actions(choices, character):
    if not character.place.locked and character.place in places.town:
        choices.add(actions.LookForACat(), "b")
    if not character.threatened and not character.place.locked:
        for _ in range(3):
            choices.add(actions.GoTo(character.place), "c")

    if character.place == places.arctic and character.place.locked:
        Display().write("Your tongue is stuck to an icicle.")

    if character.place in places.burnable:
        choices.add(actions.BurnThePlaceToTheGround(character.place), "b", 2)
    if not random.randint(0, 249) and character.place in places.burnable:
        choices.add(actions.SetThePlaceOnFire(character.place), "a", 666)
        choices.add(actions.BurnThePlaceToTheGround(character.place), "b", 666)
        choices.add(actions.BurnThePlaceToACrisp(character.place), "c", 666)
        choices.add(actions.LightUpThePlace(character.place), "d", 666)

    if character.place == places.arctic:
        choices.add(actions.GoFishing(), "a", 2)
        if character.has_item(items.SealCarcass):
            choices.add(actions.BarterWithEskimos(), "b", 2)
        choices.add(actions.BuildAnIgloo(), "b", 20)
        choices.add(actions.ClubASeal(), "c", 20)
        choices.add(actions.FreezeToDeath(), "d", 2)
    if character.place == places.cave:
        choices.add(actions.LookForAWayOut(), "c", 10)
    if character.place == places.church:
        if character.person != persons.st_george:
            choices.add(actions.LookForStGeorge(), "a", 20)
        if character.money != money.none:
            choices.add(actions.Tithe(), "b", 10)
        choices.add(actions.TellAPriest("that God doesn't exist"), "c", 1)
        choices.add(actions.TellAPriest("that he's fat"), "c", 1)
        choices.add(actions.TellAPriest("that you are the chosen one"), "c", 1)
        choices.add(actions.SingASong("God"), "d", 2)
    if character.place == places.countryside:
        choices.add(actions.PickSomeFlowers(), "a", 10)
        choices.add(actions.TipACow(), "b", 10)
        choices.add(actions.WanderTheCountryside(), "c", 30)
        choices.add(actions.DoSomeFarmWork(), "d", 10)
    if character.place == places.dark_alley:
        choices.add(actions.LookForAssassins(), "a", 5)
        #choices.add(actions.LookForBlackMarketItems(), "b", 5)
        #choices.add(actions.Hide(), "c", 5)
        choices.add(actions.LookThroughSomeTrash(), "d", 5)
    if character.place == places.docks:
        choices.add(actions.GoFishing(), "a", 2)
        #choices.add(actions.LookForWorkAsASailor(), "b", 2)
        choices.add(actions.LookForTheWizard(), "c", 2)
        choices.add(actions.DoSomeGambling(), "d", 1)
    #if character.place == places.lord_bartholomews_manor:
        #if persons.lord_bartholomew.alive:
            #choices.add(actions.AskForAnAudienceWithLordBartholomew(s), "a", 10)
            #choices.add(actions.ToStraightToLordBartholomew(), "c", 2)
    if character.place == places.lord_carlos_manor:
        choices.add(actions.AskAboutAssassins(), "a", 10)
        choices.add(actions.Disguise(), "b", 10)
        #if persons.lord_carlos.alive:
            #choices.add(actions.GoStraightToLordCarlos(), "c", 10)
        choices.add(actions.SneakAround(), "d", 20)
    if character.place == places.market:
        if character.person != persons.wealthy_merchant:
            choices.add(actions.LookForAWeapon(), "a", 10)
        #choices.add(actions.GoShopping(), "b", 10)
        if character.person != persons.wizard:
            choices.add(actions.LookForTheWizard(), "c", 4)
        #choices.add(actions.WatchAPlay(), "d", 5)
    if character.place == places.mermaid_rock:
        choices.add(actions.GoFishing(), "a", 2)
        if character.person != persons.mermaid:
            choices.add(actions.LookForMermaids(), "b", 2)
        else:
            choices.add(actions.FlirtWith(persons.mermaid), "d", 2)
        choices.add(actions.SingASong(), "d", 2)
    if character.place == places.ocean:
        choices.add(actions.GoDivingForPearls(), "a", 10)
        choices.add(actions.LookForMermaids(), "b", 3)
        choices.add(actions.LookForSeaTurtles(), "b", 3)
        choices.add(actions.Swim(), "c", 10)
        choices.add(actions.Drown(), "d", 3)
        choices.add(actions.Sink(), "d", 3)
    if character.place == places.pirate_ship:
        choices.add(actions.GoFishing(), "a", 2)
        choices.add(actions.WalkThePlank(), "c", 10)
        choices.add(actions.ClimbIntoTheCrowsNest(), "b", 5)
        choices.add(actions.ScrubTheDeck(), "b", 5)
        choices.add(actions.RaiseASail(), "b", 5)
        choices.add(actions.YellAPiratePhrase(), "d", 10)
        choices.add(actions.DoSomeGambling(), "d", 1)
    if character.place == places.prison:
        choices.add(actions.BideYourTime(), "b", 10)
        choices.add(actions.FlirtWith(persons.fat_lady), "c", 10)
    if character.place == places.streets and \
       character.person != persons.wizard:
        if character.person != persons.st_george:
            choices.add(actions.LookForStGeorge(), "a", 2)
        #choices.add(actions.GawkAtWomen(), "b", 10)
        choices.add(actions.LookForTheWizard(), "c", 1)
        #if character.money == money.small_fortune or \
        #   character.money == money.large_fortune:
            #choices.add(actions.FlauntYourWealth(), "d", 2)
    if character.place == places.tavern:
        choices.add(actions.AskAboutAssassins(), "a", 1)
        choices.add(actions.BuyADrink(), "b", 2)
        #choices.add(actions.LookForLadies(), "c", 2)
        choices.add(actions.DoSomeGambling(), "d", 1)
    #if character.place == places.tower:
        #choices.add(actions.AskForAnAudienceWithLordDaniel(), "a", 1)
        #choices.add(actions.ComplainAboutUnfairImprisonment(), "c", 1)
        #choices.add(actions.TrainWithTheGuards(), "d", 1)
    if character.place == places.void:
        choices.add(actions.LookForVoidDust(), "a", 1)
    if character.place == places.wizards_lab:
        #choices.add(actions.ReadASpellBook(), "b", 5)
        #choices.add(actions.BrewAPotion(), "b", 5)
        #choices.add(actions.TrashThePlace(), "c", 2)
        choices.add(actions.SnoopAround(), "d", 20)
    if character.place == places.woods:
        if character.has_item(items.Ax):
            choices.add(actions.ChopDownATree(), "a", 20)
        choices.add(actions.PickSomeFlowers(), "a", 10)
        #choices.add(actions.LookForWitches(), "b", 10)
        choices.add(actions.GoMushroomPicking(), "c", 12)
        #choices.add(actions.LookForNymphs(), "d", 10)

def add_item_actions(choices, character):
    if character.has_item(items.ManyColoredMushroom):
        item = character.get_item(items.ManyColoredMushroom)
        choices.add(actions.ChowDown(item), "d", 1)
    if character.has_item(items.BlackMushroom):
        item = character.get_item(items.BlackMushroom)
        choices.add(actions.ChowDown(item), "d", 1)
    if character.has_item(items.WhiteMushroom):
        item = character.get_item(items.WhiteMushroom)
        choices.add(actions.ChowDown(item), "d", 1)
    if character.has_item(items.YellowMushroom):
        item = character.get_item(items.YellowMushroom)
        choices.add(actions.ChowDown(item), "d", 1)
    if character.has_item(items.Cat):
        item = character.get_item(items.Cat)
        choices.add(actions.SwingYourCat(item), "d", 1)
    if character.has_item(items.Jewels):
        item = character.get_item(items.Jewels)
        choices.add(actions.AdmireYourJewels(item), "a", 1)


def add_character_actions(choices, character):
    if character.threatened and character.person:
        if not character.person.arrester:
            choices.add(actions.PlayDead(), "b", 10)
            choices.add(actions.Panic(), "d", 100)  # TODO fix weight
        choices.add(actions.RunLikeTheDevil(), "c", 18)
        choices.add(actions.LeaveInAHuff(), "c", 2)
        choices.add(actions.WaddleLikeGod(), "c", 2)


def add_default_actions(choices):
    choices.add(actions.Think(), "a", 2)
    choices.add(actions.LickTheGround(), "a")
    choices.add(actions.PrayToAHigherPower(), "b")
    choices.add(actions.GoToSleep(), "c", 2)
    choices.add(actions.LeaveInAPuff(), "c")
    choices.add(actions.SingASong(), "d")
    choices.add(actions.DanceAJig(), "d")
    choices.add(actions.EnterTheVoid(), "e")


def add_frog_actions(choices, character):
    choices.add(frog_actions.Croak(), "a")
    choices.add(frog_actions.Ribbit(), "b")
    choices.add(frog_actions.Hop(), "c")
    choices.add(frog_actions.EatAFly(), "d")


def add_actions(choices, character, outcome):
    if character.is_frog:
        add_frog_actions(choices, character)
    else:
        add_action_actions(choices, character)
        add_outcome_actions(choices, character, outcome)
        add_person_actions(choices, character)
        add_place_actions(choices, character)
        add_item_actions(choices, character)
        add_character_actions(choices, character)
        add_default_actions(choices)


def combat(character):
    """
    takes in a character, returns outcome of fight
    """

    Display().write(character.person.pronouns.subj[0].upper() +
                    character.person.pronouns.subj[1:] +" attack" +
                    character.person.pronouns.tense + " you.")
    return actions.Attack(character.person).clean_execute(character)


def main():
    """
    The goal is to have the main function operate as follows:
        Set up the initial state
        Display the initial message
        Display the initial options
        Choose an action
        Get an outcome
        Display results of the outcomes
        Outcome changes game state
        Add actions from action
        Add actions from outcome
        Add actions from person
        Add actions from place
        Add actions from items
        Add actions from character
    """
    character = Character()
    character.place = places.tavern
    choices = MultipleChoice()
    choices.actions["a"] = actions.AskAboutAssassins()
    choices.actions["b"] = actions.BuyADrink()
    choices.actions["c"] = actions.LeaveInAHuff()
    choices.actions["d"] = actions.SingASong()
    choices.actions["e"] = actions.EnterTheVoid()
    display = Display()
    display.enable()
    display.write("\n---The St. George Game---\n")
    display.write("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone:
        action = choices.choose_action()
        display.enable()
        if not character.threatened or action.combat_action:
            outcome = action.clean_execute(character)
        elif character.person.arrester:
            outcome = actions.Arrest(character.person).clean_execute(character)
        else:
            outcome = combat(character)
            if not character.alive:
                break
        character.prev_act = action
        add_actions(choices, character, outcome)
        choices.generate_actions(character)
    if not character.alone:
        Display().write("You both live happily ever after.")

if __name__ == "__main__":
    main()
