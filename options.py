import random

import state
import actions
import frog_actions
import monstrosity_actions
import persons
import items
import money


def _add_outcome_actions(choices, state, outcome):
    for action, weight in outcome.actions:
        choices.add(action, weight)
    if outcome.love_confessor is not None:
        if outcome.love_confessor == state.persons.persons_dict["fat_lady"]:
            choices.add(actions.SayYouLoveHer(state, outcome.love_confessor), 10000)
        if outcome.love_confessor == state.persons.persons_dict["pretty_lady"]:
            choices.add(actions.MarryOlga(state), 10000)
            choices.add(actions.RunLikeTheDevil(state), 10000)
    if outcome.fail:
        choices.add(actions.KillYourselfInFrustration(state), 5)
        if state.character.place in state.places.populated:
            choices.add(actions.KillEverybodyInAFitOfRage(state), 5)
        if state.character.place in state.places.burnable:
            choices.add(actions.BurnThePlaceToTheGround(
                state, state.character.place), 3)
        if not state.character.place in state.places.locked:
            choices.add(actions.LeaveInAHuff(state), 5)
    if outcome.succeed:
        choices.add(actions.ThumpYourselfOnTheChest(state), 5)
        choices.add(actions.CelebrateYourSuccess(state), 5)
    if outcome.topic:
        if outcome.new_person == state.persons.persons_dict["guards"]:
            choices.add(actions.TellThemYouAreNotALunatic(state,
                topic=outcome.topic), 10)
        else:
            choices.add(actions.SingASong(state, topic=outcome.topic), 10)


def _add_person_actions(choices, state):
    if state.character.person:
        choices.add(actions.Attack(state, state.character.person), 10)
    if state.character.person == state.persons.persons_dict["assassin"]:
        choices.add(actions.Apologize(state), 10)
    if state.character.person == state.persons.persons_dict["assassins"]:
        choices.add(actions.BoastOfYourBravery(state), 1)
    if state.character.person == state.persons.persons_dict["blind_bartender"]:
        choices.add(actions.BoastOfYourBravery(state), 1)
        #choices.add(actions.ChatWithTheBlindBartender(state), 1)
    if state.character.person == state.persons.persons_dict["eve"]:
        choices.add(actions.FlirtWith(state, state.persons.persons_dict["eve"]), 100)
    if state.character.person == state.persons.persons_dict["pirates"]:
        choices.add(actions.ArmWrestle(state), 10)
        choices.add(actions.ChallengeThemToAGameOfChess(state), 10)
    if state.character.person == state.persons.persons_dict["pretty_lady"]:
        choices.add(actions.BoastOfYourBravery(state), 5)
        choices.add(actions.FlirtWith(state, state.persons.persons_dict["pretty_lady"]), 100)
        if state.character.has_item(items.cat): 
            choices.add(actions.GiveCat(state, state.persons.persons_dict["pretty_lady"]), 10)
    if state.character.person == state.persons.persons_dict["st_george"]:
        choices.add(actions.BegForMoney(state), 10)
        choices.add(actions.SingASong(state, topic="St. George"), 3)
    if state.character.person == state.persons.persons_dict["wealthy_merchant"]:
        choices.add(actions.BoastOfYourBravery(state), 1)
        choices.add(actions.BuyWeapon(state), 30)
        choices.add(actions.SingASong(state, topic="weapons"), 3)
    if state.character.person == state.persons.persons_dict["nymph_queen"] and \
       state.character.has_item(items.love_potion):
        choices.add(actions.DouseHerWithYourLovePotion(state, state.persons.persons_dict["nymph_queen"])
                    , 1000)
    if state.character.person == state.persons.persons_dict["eve"] and \
       state.character.has_item(items.love_potion):
        choices.add(actions.DouseHerWithYourLovePotion(state, state.persons.persons_dict["eve"])
                    , 1000)
    if state.character.person == state.persons.persons_dict["wizard"]:
        choices.add(actions.BoastOfYourBravery(state), 2)
        choices.add(actions.SingASong(state), 2)
        choices.add(actions.SingASong(state, topic="magic"), 3)
    if state.character.person == state.persons.persons_dict["lord_arthur"]:
        choices.add(actions.SuckUpTo(state, state.persons.persons_dict["lord_arthur"]), 5)
    if state.character.person == state.persons.persons_dict["lord_bartholomew"]:
        choices.add(actions.SuckUpTo(state, state.persons.persons_dict["lord_bartholomew"]), 5)
    if state.character.person == state.persons.persons_dict["lord_bartholomew"]:
        choices.add(actions.ChatWithLordBartholomew(state), 5)
        choices.add(actions.AskForAsylum(state), 5)
    if state.character.person == state.persons.persons_dict["lord_carlos"]:
        if state.character.money >= money.small_fortune:
            choices.add(actions.RepayYourDebts(state), 40)
        choices.add(actions.SuckUpTo(state, state.persons.persons_dict["lord_carlos"]), 10)
        choices.add(actions.ChallengeHimToAGameOfChess(state), 10)
        choices.add(actions.Grovel(state), 40)
        choices.add(actions.MakeItHard(state), 10)
    if state.character.person == state.persons.persons_dict["lord_daniel"]:
        choices.add(actions.SuckUpTo(state, state.persons.persons_dict["lord_daniel"]), 5)
    if state.character.person != state.persons.persons_dict["wizard"] and \
       state.character.place in [state.places.places_dict["streets"], 
                                 state.places.places_dict["market"]]:
        choices.add(actions.LookForTheWizard(state), 2)
    if state.character.person == state.persons.persons_dict["peasant_lass"] or \
       state.character.person == state.persons.persons_dict["simple_peasant"]:
        choices.add(actions.AskDirections(state), 30)
    if state.character.person == state.persons.persons_dict["witch"]:
        if state.character.has_item(items.bottle_of_sap) and \
           state.character.has_item(items.bouquet_of_flowers) and \
           state.character.has_item(items.many_colored_mushroom):
            choices.add(actions.AskHerToBrew(state, items.love_potion), 1000)
        if state.character.has_item(items.cat) and \
           state.character.has_item(items.pearl):
            choices.add(actions.AskHerToBrew(state, items.tail_potion), 1000)
        if state.character.has_item(items.white_mushroom) and \
           state.character.has_item(items.deep_cave_newt):
            choices.add(actions.AskHerToBrew(state, items.strength_potion), 1000)


def _add_place_actions(choices, state):
    if not state.character.place in state.places.locked and \
       state.character.place in state.places.town and \
       not state.character.has_item(items.cat):
        choices.add(actions.LookForACat(state))
    if not state.character.threatened and not \
       state.character.place in state.places.locked:
        for _ in range(5):
            choices.add(actions.GoTo(state, state.character.place))

    if state.character.place in state.places.burnable:
        choices.add(actions.BurnThePlaceToTheGround(state, state.character.place), 2)
    if not random.randint(0, 249) and state.character.place in state.places.burnable:
        choices.add(actions.SetThePlaceOnFire(state, state.character.place), 666)
        choices.add(actions.BurnThePlaceToTheGround(state, state.character.place), 666)
        choices.add(actions.BurnThePlaceToACrisp(state, state.character.place), 666)
        choices.add(actions.LightUpThePlace(state, state.character.place), 666)

    if state.character.place == state.places.places_dict["arctic"]:
        choices.add(actions.GoFishing(state), 2)
        if state.character.has_item(items.seal_carcass):
            choices.add(actions.BarterWithEskimos(state), 2)
        choices.add(actions.BuildAnIgloo(state), 20)
        choices.add(actions.ClubASeal(state), 20)
        choices.add(actions.FreezeToDeath(state), 2)
    if state.character.place == state.places.places_dict["cave"]:
        choices.add(actions.LookForAWayOut(state), 10)
    if state.character.place == state.places.places_dict["church"]:
        if state.character.person != state.persons.persons_dict["st_george"] and \
           state.persons.persons_dict["st_george"].alive:
            choices.add(actions.LookForStGeorge(state), 20)
        if state.character.money != money.none:
            choices.add(actions.Tithe(state), 10)
        choices.add(actions.TellAPriest(state), 3)
        choices.add(actions.SingASong(state, topic="God"), 2)
    if state.character.place == state.places.places_dict["countryside"]:
        choices.add(actions.PickSomeFlowers(state), 10)
        choices.add(actions.TipACow(state), 10)
        choices.add(actions.WanderTheCountryside(state), 30)
        choices.add(actions.DoSomeFarmWork(state), 10)
    if state.character.place == state.places.places_dict["dark_alley"]:
        choices.add(actions.LookForAssassins(state), 5)
        choices.add(actions.BuyBlackMarketItem(state), 2)
        choices.add(actions.Hide(state), 5)
        choices.add(actions.LookThroughSomeTrash(state), 5)
    if state.character.place == state.places.places_dict["docks"]:
        choices.add(actions.GoFishing(state), 2)
        choices.add(actions.LookForTheWizard(state), 1)
        choices.add(actions.DoSomeGambling(state), 1)
    if state.character.place == state.places.places_dict["lord_bartholomews_manor"]:
        if state.persons.persons_dict["lord_bartholomew"].alive and \
           state.character.person != state.persons.persons_dict["lord_bartholomew"]:
            choices.add(actions.Disguise(state), 10)
            choices.add(actions.AskForAnAudienceWithLordBartholomew(state), 10)
        if state.character.person == None:
            choices.add(actions.SneakAround(state), 10)
    if state.character.place == state.places.places_dict["lord_carlos_manor"]:
        choices.add(actions.AskAboutAssassins(state), 10)
        choices.add(actions.Disguise(state), 10)
        if state.character.person == None:
            choices.add(actions.SneakAround(state), 10)
    if state.character.place == state.places.places_dict["market"]:
        if state.character.person != state.persons.persons_dict["wealthy_merchant"] and \
           state.persons.persons_dict["wealthy_merchant"].alive:
            choices.add(actions.LookForAWeapon(state), 10)
        choices.add(actions.BuyItem(state), 10)
        choices.add(actions.WatchAPlay(state), 500) # fix
    if state.character.place == state.places.places_dict["mermaid_rock"]:
        if state.character.person == state.persons.persons_dict["mermaid"]:
            choices.add(actions.AskHerToTakeYouBackToLand(state), 2)
            choices.add(actions.FlirtWith(state, state.persons.persons_dict["mermaid"]), 2)
            if state.character.has_item(items.love_potion):
                choices.add(
                    actions.DouseHerWithYourLovePotion(state, state.persons.persons_dict["mermaid"]),
                    2)
        choices.add(actions.GoFishing(state), 2)
        choices.add(actions.SunYourselfOnARock(state), 2)
        if state.character.person != state.persons.persons_dict["mermaid"]:
            choices.add(actions.LookForMermaids(state), 5)
        choices.add(actions.SingASong(state), 2)
    if state.character.place == state.places.places_dict["ocean"]:
        choices.add(actions.GoDivingForPearls(state), 10)
        choices.add(actions.LookForMermaids(state), 3)
        choices.add(actions.LookForSeaTurtles(state), 3)
        choices.add(actions.Swim(state), 10)
        choices.add(actions.Drown(state), 3)
        choices.add(actions.Sink(state), 3)
    if state.character.place == state.places.places_dict["pirate_ship"]:
        choices.add(actions.GoFishing(state), 2)
        if state.persons.persons_dict["lord_arthur"].alive:
            choices.add(actions.SuckUpTo(state, state.persons.persons_dict["lord_arthur"]), 3)
        if state.character.has_item(items.sailor_peg):
            choices.add(actions.ClimbUpTheTopSails(state), 10)
        choices.add(actions.WalkThePlank(state), 10)
        choices.add(actions.ClimbIntoTheCrowsNest(state), 5)
        choices.add(actions.ScrubTheDeck(state), 5)
        choices.add(actions.RaiseASail(state), 5)
        choices.add(actions.YellAPiratePhrase(state), 10)
        choices.add(actions.DoSomeGambling(state), 1)
    if state.character.place == state.places.places_dict["prison"]:
        choices.add(actions.BideYourTime(state), 10)
        choices.add(actions.FlirtWith(state, state.persons.persons_dict["fat_lady"]), 10)
    if state.character.place == state.places.places_dict["streets"] and \
       state.character.person != state.persons.persons_dict["wizard"]:
        if state.character.person != state.persons.persons_dict["st_george"] and \
           state.persons.persons_dict["st_george"].alive:
            choices.add(actions.LookForStGeorge(state), 2)
        choices.add(actions.GawkAtWomen(state), 1)
        if state.character.money == money.small_fortune or \
           state.character.money == money.large_fortune:
            choices.add(actions.FlauntYourWealth(state), 2)
    if state.character.place == state.places.places_dict["tavern"]:
        if state.places.places_dict["tavern"] in state.places.burnable:
            choices.add(actions.AskAboutAssassins(state), 1)
            choices.add(actions.BuyADrink(state), 2)
            choices.add(actions.DoSomeGambling(state), 1)
        if state.character.has_item(items.love_potion) and \
           state.character.person == state.persons.persons_dict["pretty_lady"]:
            choices.add(actions.DrugHerWithYourLovePotion(state, state.persons.persons_dict["pretty_lady"])
                        , 100)
    if state.character.place == state.places.places_dict["tower"]:
        if state.character.person != state.persons.persons_dict["lord_daniel"] and \
           state.persons.persons_dict["lord_daniel"].alive:
            choices.add(actions.AskForAnAudienceWithLordDaniel(state), 100)
            choices.add(actions.TrainWithTheGuards(state), 5)
        choices.add(actions.ComplainAboutUnfairImprisonment(state), 5)
    if state.character.place == state.places.places_dict["void"]:
        choices.add(actions.LookForVoidDust(state), 1)
    if state.character.place == state.places.places_dict["wizards_lab"]:
        choices.add(actions.ReadASpellBook(state), 5)
        if state.places.places_dict["wizards_lab"] not in state.places.trashed:
            choices.add(actions.TrashThePlace(state), 2)
        choices.add(actions.SnoopAround(state), 20)
    if state.character.place == state.places.places_dict["woods"]:
        if state.character.has_item(items.ax):
            choices.add(actions.ChopDownATree(state), 20)
        choices.add(actions.PickSomeFlowers(state), 10)
        if state.character.person != state.persons.persons_dict["witch"]:
            choices.add(actions.LookForWitches(state), 10)
        choices.add(actions.GoMushroomPicking(state), 12)
        choices.add(actions.LookForNymphs(state), 10)
    if state.character.place != state.places.places_dict["void"] and not \
       random.randint(0, 249):
        choices.add(actions.EnterTheVoid(state))


def _add_item_actions(choices, state):
    if state.character.has_item(items.frog):
        choices.add(actions.KissYourFrog(state), 10)
    if state.character.has_item(items.foreign_coin) and \
       (state.character.person == state.persons.persons_dict["lord_bartholomew"] or \
       state.character.person == state.persons.persons_dict["lord_daniel"]):
        choices.add(actions.ShowYourForeignCoin(state), 10)
    if state.character.has_item(items.love_potion):
        choices.add(actions.SlurpDown(state, items.love_potion), 1)
    if state.character.has_item(items.tail_potion):
        choices.add(actions.SlurpDown(state, items.tail_potion), 2)
    if state.character.has_item(items.strength_potion):
        choices.add(actions.SlurpDown(state, items.strength_potion), 2)
    if state.character.has_item(items.many_colored_mushroom):
        choices.add(actions.ChowDown(state, items.many_colored_mushroom), 1)
    if state.character.has_item(items.black_mushroom):
        choices.add(actions.ChowDown(state, items.black_mushroom), 1)
    if state.character.has_item(items.white_mushroom):
        choices.add(actions.ChowDown(state, items.white_mushroom), 1)
    if state.character.has_item(items.yellow_mushroom):
        choices.add(actions.ChowDown(state, items.yellow_mushroom), 1)
    if state.character.has_item(items.cat):
        choices.add(actions.SwingYourCat(state), 1)
    if state.character.has_item(items.jewels):
        choices.add(actions.AdmireYourJewels(state), 1)
    if state.character.has_item(items.bouquet_of_flowers) and \
       (state.character.person == state.persons.persons_dict["eve"] or \
       state.character.person == state.persons.persons_dict["fat_lady"] or \
       state.character.person == state.persons.persons_dict["pretty_lady"]):
        choices.add(actions.GiveFlowers(state, state.character.person), 20)


def _add_character_actions(choices, state):
    if state.character.threatened and state.character.person:
        choices.add(actions.PlayDead(state), 10)
        choices.add(actions.Panic(state), 1)
        choices.add(actions.RunLikeTheDevil(state), 100)
        choices.add(actions.LeaveInAHuff(state), 2)
        choices.add(actions.WaddleLikeGod(state), 2)
    if state.character.lost_peg_leg:
        choices.add(actions.Yell("I lost my leg"), 1)


def _add_default_actions(choices, state):
    choices.add(actions.Think(state))
    choices.add(actions.LickTheGround(state, state.character.place))
    choices.add(actions.PrayToAHigherPower(state))
    choices.add(actions.GoToSleep(state))
    #choices.add(actions.LeaveInAPuff(state))  # under revision
    choices.add(actions.SingASong(state))
    choices.add(actions.DanceAJig(state))


def _add_frog_actions(choices, state):
    choices.add(frog_actions.Croak(state))
    choices.add(frog_actions.Ribbit(state))
    choices.add(frog_actions.Hop(state))
    choices.add(frog_actions.EatAFly(state))


def _add_monstrosity_actions(choices, state):
    choices.add(monstrosity_actions.AnnihilateEverything(state))
    choices.add(monstrosity_actions.TerrorizeTheKingdom(state))
    choices.add(monstrosity_actions.GoOnARampage(state))
    choices.add(monstrosity_actions.DestroyAllHumanCivilizations(state))


def add_actions(choices, state, outcome):
    if state.character.is_frog:
        _add_frog_actions(choices, state)
    elif state.character.is_monstrosity:
        _add_monstrosity_actions(choices, state)
    else:
        _add_outcome_actions(choices, state, outcome)
        _add_person_actions(choices, state)
        _add_place_actions(choices, state)
        _add_item_actions(choices, state)
        _add_character_actions(choices, state)
        _add_default_actions(choices, state)


def set_initial_actions(choices, state):
    choices.actions["a"] = actions.AskAboutAssassins(state)
    choices.actions["b"] = actions.BuyADrink(state)
    choices.actions["c"] = actions.LeaveInAHuff(state)
    choices.actions["d"] = actions.SingASong(state)
