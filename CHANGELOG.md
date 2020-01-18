# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2020-01-TBD

### Added

The release switches us over to using gRPC-Web instead of the node.js version of gRPC. The goal of this change is to enabled the library to be used in browser as well as on Node.js without having two separate codebases or build strategies.

- Move from gRPC node to gRpc Web
- Update ESLint and configure it to work with prettier and TSConfig.
- Fixed the lint issues found in the src as well as the tests.
- Moved the generated files that are being consumed by the build process into the src.
- Updated our webpack configuration to use UMD (Universal module definitions) to support both web and node.js.
- Added a .vscode > settings.json to help with the prettier and eslint automation.

## [2.0.0] - 2019-02-15

### Added

The release migrates the protocol buffers in (xpring-common-protocol-buffers)[https://github.com/xpring-eng/xpring-common-protocol-buffers) to a 'legacy' namespace. These protocol buffers and methods will be removed at some point in the future.

This release adds support for (protocol buffers in rippled)[https://github.com/ripple/rippled/tree/develop/src/ripple/proto/rpc/v1]. These protocol buffers are the recommended alternative.

The protocol buffers from `rippled` are not compatible with the protocol buffers from `xpring-common-protocol-buffers`. That makes this a *breaking change*. Clients will need to migrate to new methods (see `breaking changes` below).

- Support for rippled protocol buffer serialization and signing.
- `Serializer`'s `transactionToJSON` method is renamed `legacyTransactionToJSON`. The `transactionToJSON` method now supports protocol buffers from rippled.
- `Signers`'s `signTransaction` method is renamed to `signLegacyTransaction`. The `signTransaction` method now supports protocol buffers from rippled.

### Breaking Changes

- Clients who called `Serializer`'s `transactionToJSON` should migrate to using the `legacyTransactionToJSON` method.
- Clients who called `Signers`'s `signTransaction` should migrate to using the `signLegacyTransaction` method.
