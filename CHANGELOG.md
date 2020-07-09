# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- A new method, `walletFromMnemonicAndDerivationPath` in `WalletFactory` encapsulates functionality for creating a `Wallet` object from a mnemonic and derivation path.

### Deprecated

- The `generateWalletFromMnemonic` method of the `Wallet` class is deprecated. Use the new `WalletFactory` class to generate `Wallet`s from mnemonics and derivation paths.

## [5.1.1] - 2020-06-16

### Added

- XRP specific functionality on the `Utils` class is deprecated. Use the new `XrpUtils` class instead.
- A new method, `walletFromSeed` in `WalletFactory` encapsulates functionality for creating a `Wallet` object from a seed.
- A new enum, `XrplNetwork`, identifies the XRP Ledger network that components are connected to.
- A new method, `isTestNetwork`, is provided by `XrpUtils` to identify whether a given `XrplNetwork` is a test network.
- `Serializer` can now support serialization of [DepositPreAuth](https://xrpl.org/depositpreauth.html) operations.
- A new method, `parsePayId`, is provided by `PayIdUtils`, to replace the `parsePayID` method.
- `Serializer` can now support serialization of [AccountSet](https://xrpl.org/accountset.html) operations.

### Deprecated

- XRP-specific functionality on the `Utils` class is deprecated. Use the new `XrpUtils` class instead.
- The `walletFromSeed` method of the `Wallet` class is deprecated. Use the new `WalletFactory` to generate `Wallet`s from seeds.
- The `parsePayID` method on `PayIdUtils` is deprecated. Use the `parsePayId` method instead.

### Breaking Changes

- `WalletFactory`'s constructor takes an `XrplNetwork` enum instead of a boolean indicating if the network is a test network. Clients should pass `XrplNetwork.Test` if they were previously passing `true`, otherwise they should pass `XrplNetwork.Main`.

### Removed

- `PayIDUtils` is removed. The class has been deprecated for two releases.
- `PayIDComponents` is removed. The class has been deprecated for two releases.

## [5.1.0] - 2020-06-01

### Added

- A new class `WalletFactory` encapsulates functionality for creating a `Wallet` object from a public and private key.

## [5.0.4] - 2020-05-15

This release contains minor deprecations of names of methods and classes to make this library more idiomatic with the wider JavaScript ecosystem.

### Added

- A new class, `PayIdUtils`, replaces the functionality in `PayIDUtils` with an idiomatically cased name.
- A new class, `PayIdComponents`, replaces the functionality in `PayIDComponents` with an idiomatically cased name.

### Deprecated

- `PayIDUtils` is deprecated. Use the idiomatically cased `PayIdUtils` class instead.
- `PayIDComponents` is deprecated. Use the idiomatically cased `PayIdComponents` class instead.

## [5.0.3] - 2020-04-10

This fix release contains minor improvements to experimental components.

## [5.0.2] - 2020-04-08

This fix release fixes build references.

## [5.0.1] - 2020-04-08

This fix release fixes build references.

## [5.0.0] - 2020-04-08

### Added

- A new `FakeWallet` is exported from the library to assist clients in unit testing.

### Removed

- - All legacy services are removed from Xpring-Common-JS. This functionality is no longer supported. Going forward, all functionality will use [rippled's protocol buffer API](https://github.com/ripple/rippled/pull/3254).

## [4.2.0] - 2020-03-16

Adds the Signer.signTransactionFromJSON function.

## [4.1.0] - 2020-03-04

This release adds new functionality to work with the PayID system in Xpring SDK.

### Added

- `PaymentPointer`: A new model object to work with conceptual components of payment pointers. See: https://paymentpointers.org/syntax-resolution/
- `PayIDUtils`: A static utility class for working with PayID constructs.

## [4.0.0] - 2020-02-28

This version uses new protocol buffers from rippled which have breaking changes in them. Specifically, the breaking changes include:

- Use numeric `string` types rather than `number` types when working with 64 bit numbers
- Re-ordering and repurposing of fields in order to add additional layers of abstraction
- Change package from `rpc.v1` to `org.xrpl.rpc.v1`

Since this library exposes public APIs that use these protocol buffers, clients will need to pass the same version of the protocol buffers compiled from rippled, which is any commit after [#3254](https://github.com/ripple/rippled/pull/3254).

### Changed

Update to the latest version of protocol buffers from rippled, introduced in [#3254](https://github.com/ripple/rippled/pull/3254).

## [3.0.2] - 2019-02-28

### Fixed

- Webpack wasn't being run.

### Added

- Added transaction exports.

## [3.0.1] - 2019-02-27

This release fixes the empty typescript type definition exports.

### Fixed

- Build and Webpack output now include the generated protobuf typescript type definintions.

## [3.0.0] - 2019-02-24

This release adds support for (protocol buffers in rippled)[https://github.com/ripple/rippled/tree/develop/src/ripple/proto/rpc/v1]. The `Signer`'s `signTransaction` method previously returned a hex string representing the signature of the transaction. After this change, it returns the entire signed and encoded transaction as a byte array. This encapsulates the serialization and signing logic inside of this library, rather than forcing clients to understand it. This is a breaking change (See 'Breaking Changes') below.

This release also changes the protocol buffer compiler used to generate protocol buffers in order to make this library function inside of a browser environment. As part of this change, various optimizations to TypeScript and webpack compilation are also produced (see 'Breaking Changes') below.

### Breaking Changes

- Modify `Signer`'s `signTransaction` method to return an array of signed bytes rather than a string based signature.
- Changed webpack EntryPoint to XpringCommonJS.
- Changed webpack output file from bundled.js to index.js.

### Added

- Added compatability for the library to be usable on the web and Node.js without having two separate codebases or build strategies by switching to using gRPC-Web instead of the Node.js version of gRPC.

### Fixed

- Updated webpack configuration to use UMD (Universal module definitions) to support both web and Node.js.

### Internal Changes

- Updated the ESLint and TSConfig to properly lint the project to our preferred styles.

## [2.0.1] - 2019-02-15

### Fixed

This patch release locks the versions of `grpc-tools` and `grpc_tools_node_protoc_ts` dependencies. This allows client projects to be able to deterministically generate compatible protocol buffers with this project's TypeScript.

Previously, different versions of the protocol buffer compiler would (sometimes) produce slightly different output (generally by renaming fields).

## [2.0.0] - 2019-02-15

### Added

The release migrates the protocol buffers in (xpring-common-protocol-buffers)[https://github.com/xpring-eng/xpring-common-protocol-buffers) to a 'legacy' namespace. These protocol buffers and methods will be removed at some point in the future.

This release adds support for (protocol buffers in rippled)[https://github.com/ripple/rippled/tree/develop/src/ripple/proto/rpc/v1]. These protocol buffers are the recommended alternative.

The protocol buffers from `rippled` are not compatible with the protocol buffers from `xpring-common-protocol-buffers`. That makes this a _breaking change_. Clients will need to migrate to new methods (see `breaking changes` below).

- Support for rippled protocol buffer serialization and signing.
- `Serializer`'s `transactionToJSON` method is renamed `legacyTransactionToJSON`. The `transactionToJSON` method now supports protocol buffers from rippled.
- `Signers`'s `signTransaction` method is renamed to `signLegacyTransaction`. The `signTransaction` method now supports protocol buffers from rippled.

### Breaking Changes

- Clients who called `Serializer`'s `transactionToJSON` should migrate to using the `legacyTransactionToJSON` method.
- Clients who called `Signers`'s `signTransaction` should migrate to using the `signLegacyTransaction` method.
