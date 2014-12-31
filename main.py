"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

import random

import places
from character import Character
import actions
import frog_actions
import monstrosity_actions
import persons
import items
import weapons
import money
from multiple_choice import MultipleChoice


def add_action_actions(choices, character):
    if type(character.prev_act) == actions.Swim and \
       character.place == places.ocean:
        choices.add(actions.KeepSwimming(), 10000)
    if type(character.prev_act) ==  actions.KeepSwimming and \
       character.place == places.ocean:
        choices.add(actions.JustKeepSwimming(), 10000)
    if type(character.prev_act) == actions.JustKeepSwimming and \
       character.place == places.ocean:
        choices.add(actions.JustKeepSwimming(), 10000)
    if isinstance(character.prev_act, actions.SayYouLoveHer) and \
       character.person == persons.fat_lady:
        choices.add(actions.MarryFelicity(), 777)
        choices.add(actions.RunLikeTheDevil(), 666)


def add_outcome_actions(choices, character, outcome):
    for action, weight in outcome.actions:
        choices.add(action, weight)
    if outcome.love_confessor is not None:
        if character.person == persons.fat_lady:
            choices.add(actions.SayYouLoveHer(outcome.love_confessor), 10000)
        if character.person == persons.pretty_lady:
            choices.add(actions.MarryOlga(), 10000)
            choices.add(actions.RunLikeTheDevil(), 10000)
    if outcome.fail:
        choices.add(actions.KillYourselfInFrustration(), 5)
        if character.place in places.populated:
            choices.add(actions.KillEverybodyInAFitOfRage(), 5)
        if character.place in places.burnable:
            choices.add(actions.BurnThePlaceToTheGround(
                character.place), 3)
        if not character.place.locked:
            choices.add(actions.LeaveInAHuff(), 5)
    if outcome.succeed:
        choices.add(actions.ThumpYourselfOnTheChest(), 5)
        choices.add(actions.CelebrateYourSuccess(), 5)
    if outcome.topic:
        if outcome.new_person == persons.guards:
            choices.add(actions.TellThemYouAreNotALunatic(
                topic=outcome.topic), 10)
        else:
            choices.add(actions.SingASong(topic=outcome.topic), 10)


def add_person_actions(choices, character):
    if character.person:
        choices.add(actions.Attack(character.person), 10)
    if character.person == persons.assassin:
        choices.add(actions.Apologize(), 10)
    if character.person == persons.assassins:
        choices.add(actions.BoastOfYourBravery(), 1)
    if character.person == persons.blind_bartender:
        choices.add(actions.BoastOfYourBravery(), 1)
    if character.person == persons.eve:
        choices.add(actions.FlirtWith(persons.eve), 1000)  # TODO fix
    if character.person == persons.pretty_lady:
        choices.add(actions.BoastOfYourBravery(), 5)
        choices.add(actions.FlirtWith(persons.pretty_lady), 1000) # TODO fix
    if character.person == persons.st_george:
        choices.add(actions.BegForMoney(), 10)
        choices.add(actions.SingASong(topic="St. George"), 3)
    if character.person == persons.wealthy_merchant:
        choices.add(actions.BoastOfYourBravery(), 1)
        choices.add(actions.BuyWeapon(weapons.weapons), 30)
        choices.add(actions.SingASong(topic="weapons"), 3)
    if character.person == persons.wizard:
        choices.add(actions.BoastOfYourBravery(), 2)
        choices.add(actions.SingASong(), 2)
        choices.add(actions.SingASong(topic="magic"), 3)
    if character.person == persons.lord_arthur:
        choices.add(actions.SuckUpTo(persons.lord_arthur), 5)
    if character.person == persons.lord_bartholomew:
        choices.add(actions.SuckUpTo(persons.lord_bartholomew), 5)
    if character.person == persons.lord_carlos:
        choices.add(actions.SuckUpTo(persons.lord_carlos), 5)
    if character.person == persons.lord_daniel:
        choices.add(actions.SuckUpTo(persons.lord_daniel), 5)
    if character.person != persons.wizard and \
       character.place in [places.streets, places.market]:
        choices.add(actions.LookForTheWizard(), 2)
    if character.person == persons.peasant_lass or \
       character.person == persons.simple_peasant:
        choices.add(actions.AskDirections(), 30)
    if character.person == persons.witch:
        if character.has_item(items.bottle_of_sap) and \
           character.has_item(items.bouquet_of_flowers) and \
           character.has_item(items.many_colored_mushroom):
            choices.add(actions.AskHerToBrew(items.love_potion), 100)
        if character.has_item(items.cat) and \
           character.has_item(items.pearl):
            choices.add(actions.AskHerToBrew(items.tail_potion), 100)
        if character.has_item(items.white_mushroom) and \
           character.has_item(items.deep_cave_newt):
            choices.add(actions.AskHerToBrew(items.strength_potion), 100)


def add_place_actions(choices, character):
    if not character.place.locked and character.place in places.town:
        choices.add(actions.LookForACat())
    if not character.threatened and not character.place.locked:
        for _ in range(3):
            choices.add(actions.GoTo(character.place))

    if character.place in places.burnable:
        choices.add(actions.BurnThePlaceToTheGround(character.place), 2)
    if not random.randint(0, 249) and character.place in places.burnable:
        choices.add(actions.SetThePlaceOnFire(character.place), 666)
        choices.add(actions.BurnThePlaceToTheGround(character.place), 666)
        choices.add(actions.BurnThePlaceToACrisp(character.place), 666)
        choices.add(actions.LightUpThePlace(character.place), 666)

    if character.place == places.arctic:
        choices.add(actions.GoFishing(), 2)
        if character.has_item(items.seal_carcass):
            choices.add(actions.BarterWithEskimos(), 2)
        choices.add(actions.BuildAnIgloo(), 20)
        choices.add(actions.ClubASeal(), 20)
        choices.add(actions.FreezeToDeath(), 2)
    if character.place == places.cave:
        choices.add(actions.LookForAWayOut(), 10)
    if character.place == places.church:
        if character.person != persons.st_george:
            choices.add(actions.LookForStGeorge(), 20)
        if character.money != money.none:
            choices.add(actions.Tithe(), 10)
        choices.add(actions.TellAPriest("that God doesn't exist"), 1)
        choices.add(actions.TellAPriest("that he's fat"), 1)
        choices.add(actions.TellAPriest("that you are the chosen one"), 1)
        choices.add(actions.SingASong("God"), 2)
    if character.place == places.countryside:
        choices.add(actions.PickSomeFlowers(), 10)
        choices.add(actions.TipACow(), 10)
        choices.add(actions.WanderTheCountryside(), 30)
        choices.add(actions.DoSomeFarmWork(), 10)
    if character.place == places.dark_alley:
        choices.add(actions.LookForAssassins(), 5)
        choices.add(actions.BuyBlackMarketItem(items.black_market), 1)
        choices.add(actions.Hide(), 5)
        choices.add(actions.LookThroughSomeTrash(), 5)
    if character.place == places.docks:
        choices.add(actions.GoFishing(), 2)
        #choices.add(actions.LookForWorkAsASailor(), 2)
        choices.add(actions.LookForTheWizard(), 2)
        choices.add(actions.DoSomeGambling(), 1)
    #if character.place == places.lord_bartholomews_manor:
        #if persons.lord_bartholomew.alive:
            #choices.add(actions.AskForAnAudienceWithLordBartholomew(s), 10)
            #choices.add(actions.GoStraightToLordBartholomew(), 2)
    if character.place == places.lord_carlos_manor:
        choices.add(actions.AskAboutAssassins(), 10)
        choices.add(actions.Disguise(), 10)
        #if persons.lord_carlos.alive:
            #choices.add(actions.GoStraightToLordCarlos(), 10)
        choices.add(actions.SneakAround(), 20)
    if character.place == places.market:
        if character.person != persons.wealthy_merchant:
            choices.add(actions.LookForAWeapon(), 10)
        choices.add(actions.BuyItem(items.buyable), 10)
        if character.person != persons.wizard:
            choices.add(actions.LookForTheWizard(), 4)
        choices.add(actions.WatchAPlay(), 500) # fix
    if character.place == places.mermaid_rock:
        choices.add(actions.GoFishing(), 2)
        if character.person != persons.mermaid:
            choices.add(actions.LookForMermaids(), 2)
        else:
            choices.add(actions.FlirtWith(persons.mermaid), 2)
        choices.add(actions.SingASong(), 2)
    if character.place == places.ocean:
        choices.add(actions.GoDivingForPearls(), 10)
        choices.add(actions.LookForMermaids(), 3)
        choices.add(actions.LookForSeaTurtles(), 3)
        choices.add(actions.Swim(), 10)
        choices.add(actions.Drown(), 3)
        choices.add(actions.Sink(), 3)
    if character.place == places.pirate_ship:
        choices.add(actions.GoFishing(), 2)
        choices.add(actions.SuckUpTo(persons.lord_arthur), 3)
        if character.has_item(items.sailor_peg):
            choices.add(actions.ClimbUpTheTopSails(), 10)
        choices.add(actions.WalkThePlank(), 10)
        choices.add(actions.ClimbIntoTheCrowsNest(), 5)
        choices.add(actions.ScrubTheDeck(), 5)
        choices.add(actions.RaiseASail(), 5)
        choices.add(actions.YellAPiratePhrase(), 10)
        choices.add(actions.DoSomeGambling(), 1)
    if character.place == places.prison:
        choices.add(actions.BideYourTime(), 10)
        choices.add(actions.FlirtWith(persons.fat_lady), 10)
    if character.place == places.streets and \
       character.person != persons.wizard:
        if character.person != persons.st_george:
            choices.add(actions.LookForStGeorge(), 2)
        choices.add(actions.GawkAtWomen(), 1)
        choices.add(actions.LookForTheWizard(), 1)
        if character.money == money.small_fortune or \
           character.money == money.large_fortune:
            choices.add(actions.FlauntYourWealth(), 2)
    if character.place == places.tavern:
        choices.add(actions.AskAboutAssassins(), 1)
        choices.add(actions.BuyADrink(), 2)
        #choices.add(actions.LookForLadies(), 2)
        choices.add(actions.DoSomeGambling(), 1)
    #if character.place == places.tower:
        #choices.add(actions.AskForAnAudienceWithLordDaniel(), 1)
        #choices.add(actions.ComplainAboutUnfairImprisonment(), 1)
        #choices.add(actions.TrainWithTheGuards(), 1)
    if character.place == places.void:
        choices.add(actions.LookForVoidDust(), 1)
    if character.place == places.wizards_lab:
        choices.add(actions.ReadASpellBook(), 5)
        if places.wizards_lab not in places.trashed:
            choices.add(actions.TrashThePlace(), 2)
        choices.add(actions.SnoopAround(), 20)
    if character.place == places.woods:
        if character.has_item(items.ax):
            choices.add(actions.ChopDownATree(), 20)
        choices.add(actions.PickSomeFlowers(), 10)
        choices.add(actions.LookForWitches(), 100)  # FIXME
        choices.add(actions.GoMushroomPicking(), 12)
        #choices.add(actions.LookForNymphs(), 10)

def add_item_actions(choices, character):
    if character.has_item(items.love_potion):
        choices.add(actions.SlurpDown(items.love_potion), 100)  # FIXME
    if character.has_item(items.tail_potion):
        choices.add(actions.SlurpDown(items.tail_potion), 100) # FIXME
    if character.has_item(items.strength_potion):
        choices.add(actions.SlurpDown(items.strength_potion), 100)  # FIXME
    if character.has_item(items.many_colored_mushroom):
        choices.add(actions.ChowDown(items.many_colored_mushroom), 1)
    if character.has_item(items.black_mushroom):
        choices.add(actions.ChowDown(items.black_mushroom), 1)
    if character.has_item(items.white_mushroom):
        choices.add(actions.ChowDown(items.white_mushroom), 1)
    if character.has_item(items.yellow_mushroom):
        choices.add(actions.ChowDown(items.yellow_mushroom), 1)
    if character.has_item(items.cat):
        choices.add(actions.SwingYourCat(items.cat), 1)
    if character.has_item(items.jewels):
        choices.add(actions.AdmireYourJewels(items.jewels), 1)


def add_character_actions(choices, character):
    if character.threatened and character.person:
        if not character.person.arrester:
            choices.add(actions.PlayDead(), 10)
            choices.add(actions.Panic(), 1)
        choices.add(actions.RunLikeTheDevil(), 18)
        choices.add(actions.LeaveInAHuff(), 2)
        choices.add(actions.WaddleLikeGod(), 2)
    if character.lost_peg_leg:
        choices.add(actions.Yell("I lost my leg"), 1)


def add_default_actions(choices, character):
    choices.add(actions.Think())
    choices.add(actions.LickTheGround(character.place))
    choices.add(actions.PrayToAHigherPower())
    choices.add(actions.GoToSleep())
    choices.add(actions.LeaveInAPuff())
    choices.add(actions.SingASong())
    choices.add(actions.DanceAJig())
    choices.add(actions.EnterTheVoid())


def add_frog_actions(choices, character):
    choices.add(frog_actions.Croak())
    choices.add(frog_actions.Ribbit())
    choices.add(frog_actions.Hop())
    choices.add(frog_actions.EatAFly())


def add_monstrosity_actions(choices, character):
    choices.add(monstrosity_actions.AnnihilateEverything())
    choices.add(monstrosity_actions.TerrorizeTheKingdom())
    choices.add(monstrosity_actions.GoOnARampage())
    choices.add(monstrosity_actions.DestroyAllHumanCivilizations())


def add_actions(choices, character, outcome):
    if character.is_frog:
        add_frog_actions(choices, character)
    if character.is_monstrosity:
        add_monstrosity_actions(choices, character)
    else:
        add_action_actions(choices, character)
        add_outcome_actions(choices, character, outcome)
        add_person_actions(choices, character)
        add_place_actions(choices, character)
        add_item_actions(choices, character)
        add_character_actions(choices, character)
        add_default_actions(choices, character)


def combat(character):
    """
    takes in a character, returns outcome of fight
    """

    print(character.person.name[0].upper() +
                    character.person.name[1:] + " attack" +
                    persons.get_tense(character.person) + " you.")
    return actions.Attack(character.person).get_outcome(character)


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
    print("\n---The St. George Game---\n")
    print("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone:
        action = choices.choose_action()
        if not character.threatened or action.combat_action:
            outcome = action.get_outcome(character)
        elif character.person.arrester:
            outcome = actions.Arrest(character.person).get_outcome(character)
        else:
            outcome = combat(character)
            if not character.alive:
                break
        outcome.execute()
        character.prev_act = action
        add_actions(choices, character, outcome)
        choices.generate_actions(character)

if __name__ == "__main__":
    main()
