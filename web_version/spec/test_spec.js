/*jslint node: true*/
"use strict";

var functions = require("../increment");

describe("increment test", function() {
    it("returns an incremented value", function() {
        expect(functions.inc(1)).toBe(2);
    });
});
