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
import persons
from multiple_choice import MultipleChoice


def add_action_actions(choices, character):
    pass


def add_outcome_actions(choices, character):
    pass


def add_person_actions(choices, character):
    if character.person:
        choices.add(actions.Attack(character.person), "a", 10)
    if character.person != persons.wizard and \
            character.place in [places.streets, places.market]:
        choices.add(actions.LookForTheWizard(), "c", 2)


def add_place_actions(choices, character):
    if not character.place.locked:
        choices.add(actions.LookForACat(), "b")
    if character.place == places.docks:
        choices.add(actions.LookForTheWizard(), "c", 2)
    if character.place == places.market:
        choices.add(actions.LookForAWeapon(), "a", 10)
        choices.add(actions.LookForTheWizard(), "c", 4)
    if character.place == places.ocean:
        choices.add(actions.GoDivingForPearls(), "a", 10)
    if character.place == places.prison:
        choices.add(actions.BideYourTime(), "b", 10)
        choices.add(actions.FlirtWithFatLady(), "c", 10)
    if character.place == places.streets:
        choices.add(actions.LookForStGeorge(), "a", 2)
        choices.add(actions.LookForTheWizard(), "c", 1)
    if character.place == places.tavern:
        choices.add(actions.BuyADrink(), "b", 2)
        choices.add(actions.AskAboutAssassins(), "b", 1)
    if character.place == places.dark_alley:
        choices.add(actions.LookThroughSomeTrash(), "d", 5)
    if character.place == places.woods:
        choices.add(actions.LookForMushrooms(), "c", 12)
    if character.place in places.burnable:
        choices.add(actions.BurnThePlaceToTheGround(character.place), "d", 2)
    if not character.threatened and not character.place.locked:
        for _ in range(3):
            choices.add(actions.GoTo(character.place), "c")
    if character.place == places.arctic and character.place.locked:
        Display().write("Your tongue is stuck to an icicle.")
    if not random.randint(0, 99) and character.place in places.burnable:
        choices.add(actions.SetThePlaceOnFire(character.place), "a",  666)
        choices.add(actions.LightUpThePlace(character.place), "b", 666)
        choices.add(actions.BurnThePlaceToACrisp(character.place), "c",  666)
        choices.add(actions.BurnThePlaceToTheGround(character.place), "d", 666)


def add_item_actions(choices, character):
    pass


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


def add_actions(choices, character):
        add_action_actions(choices, character)
        add_outcome_actions(choices, character)
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
            action.clean_execute(character)
        else:
            Display().write(character.person.pronouns.subj.capitalize() +
                            " attack" +
                            character.person.pronouns.tense + " you.")
            actions.Attack(character.person).clean_execute(character)
            if not character.alive:
                break
        character.prev_act = action
        for item in character.items:
            item.contribute(character)
        add_actions(choices, character)
        choices.generate_actions(character)
    if not character.alone:
        Display().write("You both live happily ever after.")

if __name__ == "__main__":
    main()
