var functions = require('./functions');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

var NUMBER_OF_TESTS = 100;

driver.get('http://localhost:3000');
var options = ["a", "b", "c", "d",];
//e is not included in options because it creates some superfluous output

for (var i = 0; i < NUMBER_OF_TESTS; i++) {
    var option = functions.random_choice(options);
    driver.findElement(By.id(option)).click();
}
