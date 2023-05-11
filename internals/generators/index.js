'use strict';

const inquirerDirectory = require('inquirer-directory');

const featureGenerator = require('./feature');

module.exports = plop => {
  plop.addPrompt('directory', inquirerDirectory);

  // feature generator
  plop.setGenerator('feature', featureGenerator);
};
