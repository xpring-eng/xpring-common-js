import Utils from "../src/utils";
import { assert } from "chai";
import "mocha";

describe("utils", function(): void {
  it("isValidAddress() - Valid Address", function(): void {
    // GIVEN a valid address.
    const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed valid.
    assert.isTrue(validAddress);
  });

  it("isValidAddress() - Wrong Alphabet", function(): void {
    // GIVEN a base58check address encoded in the wrong alphabet.
    const address = "1EAG1MwmzkG6gRZcYqcRMfC17eMt8TDTit";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid Checksum", function(): void {
    // GIVEN a base58check address which fails checksumming.
    const address = "rU6K7V3Po4sBBBBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Invalid Characters", function(): void {
    // GIVEN a base58check address which has invalid characters.
    const address = "rU6K7V3Po4sBBBBBaU@#$%qs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Too Long", function(): void {
    // GIVEN a base58check address which has invalid characters.
    const address =
      "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });

  it("isValidAddress() - Too Short", function(): void {
    // GIVEN a base58check address which has invalid characters.
    const address = "rU6K7V3Po4s2qTQJWDw1";

    // WHEN the address is validated.
    const validAddress = Utils.isValidAddress(address);

    // THEN the address is deemed invalid.
    assert.isFalse(validAddress);
  });
});
