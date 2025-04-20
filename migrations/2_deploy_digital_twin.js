const DigitalTwinManagement = artifacts.require("DigitalTwinManagement");

module.exports = function (deployer) {
  deployer.deploy(DigitalTwinManagement);
};