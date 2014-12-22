"""
St. George Game
main.py
Sage Berg, Skyler Berg
Created: 5 Dec 2014
"""

import places
from character import Character
from display import Display
import actions
from multiple_choice import MultipleChoice


def main():
    """
    runs program
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
        choices.generate_actions(character)
    if not character.alone:
        Display().write("You both live happily ever after.")

if __name__ == "__main__":
    main()


# Set up the initial state
# Display the initial message
# Display the initial options

# Choose an action
# Get an outcome
# Display results of the outcomes
# Outcome changes game state
# if-else on action
# if-else on outcome
# if-else on person
# if-else on place
# if-else on items
# if-else on character
