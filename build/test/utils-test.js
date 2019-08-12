"use strict";
const { assert } = require("chai");
const { Utils } = require("../build/index.js");
describe("utils", function () {
    it("isValidAddress() - Valid Address", function () {
        const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";
        const validAddress = Utils.isValidAddress(address);
        assert.isTrue(validAddress);
    });
    it("isValidAddress() - Wrong Alphabet", function () {
        const address = "1EAG1MwmzkG6gRZcYqcRMfC17eMt8TDTit";
        const validAddress = Utils.isValidAddress(address);
        assert.isFalse(validAddress);
    });
    it("isValidAddress() - Invalid Checksum", function () {
        const address = "rU6K7V3Po4sBBBBBaU29sesqs2qTQJWDw1";
        const validAddress = Utils.isValidAddress(address);
        assert.isFalse(validAddress);
    });
    it("isValidAddress() - Invalid Characters", function () {
        const address = "rU6K7V3Po4sBBBBBaU@#$%qs2qTQJWDw1";
        const validAddress = Utils.isValidAddress(address);
        assert.isFalse(validAddress);
    });
    it("isValidAddress() - Too Long", function () {
        const address = "rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1";
        const validAddress = Utils.isValidAddress(address);
        assert.isFalse(validAddress);
    });
    it("isValidAddress() - Too Short", function () {
        const address = "rU6K7V3Po4s2qTQJWDw1";
        const validAddress = Utils.isValidAddress(address);
        assert.isFalse(validAddress);
    });
});
//# sourceMappingURL=utils-test.js.map