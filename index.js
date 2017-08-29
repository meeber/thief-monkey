const Alexa = require("alexa-sdk");
const fs = require("fs");
const yaml = require("js-yaml");

const STATES = {
  "GAME": 0,
};

const launchHandlers = {
  "NewSession": function () {
    this.handler.state = STATES.GAME;
    this.attributes.objectKey = getRandomNum(0, objects.length - 1);
    this.emit(
      ":ask",
      "Oh no! Thief Monkey stole something. He'll only give it back if you"
      + " guess what it is."
    );
  },
};

const gameHandlers = Alexa.CreateStateHandler(STATES.GAME, {
  "GetStolenItem": function () {
    this.emit(
      ":tell",
      `Thief Monkey stole ${objects[this.attributes.objectKey].name}`
    );
  },
  "Unhandled": function () {
    this.emit(":tell", "I'm sorry. I have no idea what you just said.");
  },
});

const objects = yaml.safeLoad(fs.readFileSync("objects.yaml")).objects;

const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(...arguments);

  alexa.registerHandlers(launchHandlers, gameHandlers);
  alexa.execute();
};
