"""
St. George Game
outcome.py
Sage Berg
Created: 21 Dec 2014
"""

class Outcome(object):
    
    def __init__(self, msg="", die=False, win=False, person=None, fail=False, 
                 item=None):
        self.msg = msg
        self.die = die
        self.win = win
        self.person = person
        self.item = item
        self.fail = fail

    def execute(self):
        pass
