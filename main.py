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
    if outcome.love_confessor is not None:
        choices.add(actions.SayYouLoveHer(outcome.love_confessor), "a", 1000)
    if outcome.fail:
        choices.add(actions.KillYourselfInFrustration(), "a", 5)
        if character.place in places.populated:
            choices.add(actions.KillEverybodyInAFitOfRage(), "a", 5)
        if character.place in places.burnable:
            choices.add(actions.BurnThePlaceToTheGround(
                character.place), "d", 3)
        if not character.place.locked:
            choices.add(actions.LeaveInAHuff(), "c", 5)
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
    if character.person == persons.st_george:
        choices.add(actions.BegForMoney(), "b", 10)
    if character.person == persons.st_george:
        choices.add(actions.SingASong(topic="St. George"), "d", 3)
    if character.person == persons.wealthy_merchant:
        choices.add(actions.BoastOfYourBravery(), "b", 1)
    if character.person == persons.wealthy_merchant:
        choices.add(actions.Buy(weapons.weapons), "b", 30)
    if character.person == persons.wealthy_merchant:
        choices.add(actions.SingASong(topic="weapons"), "d", 3)
    if character.person == persons.wizard:
        choices.add(actions.BoastOfYourBravery(), "b", 2)
    if character.person == persons.wizard:
        choices.add(actions.SingASong(), "d", 2)
    if character.person != persons.wizard and \
       character.place in [places.streets, places.market]:
        choices.add(actions.LookForTheWizard(), "c", 2)


def add_place_actions(choices, character):
    if not character.place.locked and character.place in places.populated:
        choices.add(actions.LookForACat(), "b")
    if character.place == places.docks:
        choices.add(actions.LookForTheWizard(), "c", 2)
    if character.place == places.market and \
        character.person != persons.wealthy_merchant:
        choices.add(actions.LookForAWeapon(), "a", 10)
    if character.place == places.market and character.person != persons.wizard:
        choices.add(actions.LookForTheWizard(), "c", 4)
    if character.place == places.ocean:
        choices.add(actions.GoDivingForPearls(), "a", 10)
        choices.add(actions.LookForMermaids(), "b", 3)
        choices.add(actions.LookForSeaTurtles(), "b", 3)
        choices.add(actions.Swim(), "c", 10)
        choices.add(actions.Drown(), "d", 3)
        choices.add(actions.Sink(), "d", 3)
    if character.place == places.prison:
        choices.add(actions.BideYourTime(), "b", 10)
        choices.add(actions.FlirtWith(persons.fat_lady), "c", 10)
    if character.place == places.streets and \
       character.person != persons.wizard:
        choices.add(actions.LookForTheWizard(), "c", 1)
    if character.place == places.streets and \
       character.person != persons.st_george:
        choices.add(actions.LookForStGeorge(), "a", 2)
    if character.place == places.tavern:
        choices.add(actions.BuyADrink(), "b", 2)
        choices.add(actions.AskAboutAssassins(), "b", 1)
    if character.place == places.dark_alley:
        choices.add(actions.LookThroughSomeTrash(), "d", 5)
    if character.place == places.woods:
        choices.add(actions.GoMushroomPicking(), "c", 12)
    if character.place in places.burnable:
        choices.add(actions.BurnThePlaceToTheGround(character.place), "d", 2)
    if not character.threatened and not character.place.locked:
        for _ in range(3):
            choices.add(actions.GoTo(character.place), "c")
    if character.place == places.arctic and character.place.locked:
        Display().write("Your tongue is stuck to an icicle.")
    if not random.randint(0, 99) and character.place in places.burnable:
        choices.add(actions.SetThePlaceOnFire(character.place), "a", 666)
        choices.add(actions.LightUpThePlace(character.place), "b", 666)
        choices.add(actions.BurnThePlaceToACrisp(character.place), "c", 666)
        choices.add(actions.BurnThePlaceToTheGround(character.place), "d", 666)


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


def add_character_actions(choices, character):
    if character.threatened:
        choices.add(actions.RunLikeTheDevil(), "c", 9)
        choices.add(actions.LeaveInAHuff(), "c", 3)
        choices.add(actions.WaddleLikeGod(), "c", 1)


def add_default_actions(choices):
    choices.add(actions.LickTheGround(), "a")
    choices.add(actions.GoToSleep(), "c", 2)
    choices.add(actions.LeaveInAPuff(), "c")
    choices.add(actions.SingASong(), "d")


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
    display = Display()
    display.enable()
    display.write("\n---The St. George Game---\n")
    display.write("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone:
        action = choices.choose_action()
        display.enable()
        if not character.threatened or action.combat_action:
            outcome = action.clean_execute(character)
        else:
            Display().write(character.person.pronouns.subj.capitalize() +
                            " attack" +
                            character.person.pronouns.tense + " you.")
            outcome = actions.Attack(character.person).clean_execute(character)
            if not character.alive:
                break
        character.prev_act = action
        add_actions(choices, character, outcome)
        choices.generate_actions(character)
    if not character.alone:
        Display().write("You both live happily ever after.")

if __name__ == "__main__":
    main()
