none = 0
pittance = 1
small_fortune = 2
large_fortune = 3


def to_str(amount):
    if amount == 0:
        return "no money"
    if amount == 1:
        return "a pittance"
    if amount == 2:
        return "a small fortune"
    if amount == 3:
        return "a large fortune"
