# Contributing

Thanks for considering a contribution to [Xpring SDK](https://github.com/xpring-eng/xpring-sdk)!

We're thrilled you're interested and your help is greatly appreciated. Contributing is a great way to learn about the [XRP Ledger](https://xrpl.org) and [Interledger Protocol (ILP)](https://interledger.org/). We are happy to review your pull requests. To make the process as smooth as possible, please read this document and follow the stated guidelines.

## About This Library

<img src="architecture.png" alt="Architecture Diagram of Xpring SDK"/>

This library is made up of [protocol buffers](https://developers.google.com/protocol-buffers) which form common model objects for Xpring SDK. There are also [gRPC service definitions](https://grpc.io), which form a network interface for  Xpring SDK.

This library is widely consumed, including by:
- [Language Specific Libraries in Xpring SDK](https://github.com/xpring-eng/xpring-sdk#client-side-libraries)
- Xpring SDK's Server Side Component

If you make a code change to this library, you are more than likely adding a new feature in one or more dependent libraries. Your [pull requests](#requirements-for-a-successful-pull-request) for all code changes should document how the new fields and functionality will be used.

## Requirements for a Successful Pull request

- Continuous integration tests pass on pull request.
- Documentation in pull request about how the new functionality will be used in client libraries.
- Pull request is free of lint errors. Please run `eslint` before sending a pull request.
- Pull Requests are [marked as drafts](https://github.blog/2019-02-14-introducing-draft-pull-requests/) until they are ready for review.
- Text and comments of pull request adhere to the [code of conduct](CODE_OF_CONDUCT.md) for this repository.

## Building The Library

The library should build and pass all tests.

```shell
# Clone repository
$ git clone https://github.com/xpring-eng/xpring-common-js.git
$ cd xpring-common-js

# Pull submodules
$ git submodule init
$ git submodule update

# Install Protocol Buffers
# OSX
$ brew install protobuf
# Linux
$ sudo apt install protobuf-compiler
# Otherwise, see: https://github.com/protocolbuffers/protobuf#protocol-compiler-installation

# Install gRPC tools globally.
$ npm -g i nyc grpc-tools

# Install required modules.
$ npm i

# Run tests!
$ npm test
```
