class Display(object):
    """
    The display class is responsible for putting text on the screen. It can
    also be disabled to prevent messages being displayed after an event has
    occured that should not be followed by another message. The enabled
    attribute is shared across all instance of the display.
    """

    _shared_state = {}

    def __init__(self):
        self.__dict__ = self._shared_state
        self.enabled = True

    def enable(self):
        self.enabled = True

    def disable(self):
        self.enabled = False

    def write(self, msg):
        print(msg)
