const { assert } = require("chai");
const { utils } = require("../index.js");

describe("utils", function() {
  it("isValidAddress() - Valid Address", function() {
    // GIVEN a valid address.
    const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = utils.isValidAddress(address);

    // THEN the address is deemed valid.
    assert.isTrue(validAddress);
  });

  it("isValidAddress() - Wrong Alphabet", function() {
    // GIVEN a base58check address encoded in the wrong alphabet.
    const address = "1EAG1MwmzkG6gRZcYqcRMfC17eMt8TDTit";

    // WHEN the address is validated.
    const validAddress = utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid Checksum", function() {
    // GIVEN a base58check address which fails checksumming.
    const address = "rU6K7V3Po4sBBBBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid Characters", function() {
    // GIVEN a base58check address which has invalid characters.
    const address = "rU6K7V3Po4sBBBBBaU@#$%qs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Too Long", function() {
    // GIVEN a base58check address which has invalid characters.
    const address =
      "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Too Short", function() {
    // GIVEN a base58check address which has invalid characters.
    const address = "rU6K7V3Po4s2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });
});
