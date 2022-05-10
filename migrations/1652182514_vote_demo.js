const VoteDemo = artifacts.require("VoteDemo");

module.exports = function(_deployer) {
  _deployer.deploy(VoteDemo, 10);
};
