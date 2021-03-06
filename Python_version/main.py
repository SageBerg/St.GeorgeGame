import random

import places
import persons
import actions
import options
from state import GameState
from character import Character
from multiple_choice import MultipleChoice

def lords_victory(state):
    if not state.persons.persons_dict["lord_arthur"].alive and \
       not state.persons.persons_dict["lord_bartholomew"].alive and \
       not state.persons.persons_dict["lord_carlos"].alive and \
       not state.persons.persons_dict["lord_daniel"].alive:
        state.character.alone = False
        print("You have destroyed the establishment and brought about "
              "a uptopian anarchy... more or less.")
        print("You win!")

def pyro_victory(state):
    if len(state.places.burned) > 8:  # increase this number for each new 
                                # burnable place we add
        state.character.alone = False  # might need to add a master_pryo 
                                 # boolean for the character instead 
                                 # of using .alone (which makes no sense)
        print(random.choice(["Some people just like to watch the world "
                             "burn. You are one of them.",
                             "You are satisfied with how everything has "
                             "been burned.",
                             ]))
        print("You win!")

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
    """
    persons_object = persons.Persons()
    places_object = places.Places()
    character_object = Character(place=places_object.places_dict["tavern"])
    state = GameState(character_object, places_object, persons_object)
    choices = MultipleChoice()
    options.set_initial_actions(choices, state)
    print("\n---The St. George Game---\n")
    print("You are in a tavern. The local assassins hate you.")
    while state.character.alive and \
          state.character.alone and not \
          state.character.lose:
        action = choices.choose_action()
        if not state.character.threatened or action.combat_action:
            outcome = action.get_outcome(state)
        else:
            outcome = \
            actions.Attack(state, state.character.person).get_outcome(state)
        outcome.execute()
        options.add_actions(choices, state, outcome)
        choices.generate_actions(state.character)
        lords_victory(state)
        pyro_victory(state)
        
if __name__ == "__main__":
    main()
