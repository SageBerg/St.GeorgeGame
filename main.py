import places
from character import Character
import actions
import options
from multiple_choice import MultipleChoice


def combat(character):
    """
    takes in a character, returns outcome of fight
    """
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
    options.set_initial_actions(choices)
    print("\n---The St. George Game---\n")
    print("You are in a tavern. The local assassins hate you.")
    while character.alive and character.alone and not character.lose:
        action = choices.choose_action()
        if not character.threatened or action.combat_action:
            outcome = action.get_outcome(character)
        else:
            outcome = combat(character)
            if not character.alive:
                break
        outcome.execute()
        character.prev_act = action
        options.add_actions(choices, character, outcome)
        choices.generate_actions(character)

if __name__ == "__main__":
    main()
