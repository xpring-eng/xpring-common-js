[![CircleCI](https://img.shields.io/circleci/build/github/xpring-eng/xpring-common-js/master?style=flat-square&token=0ed9e0790d44d163a5bf2793724fc85d98c3845b)](https://circleci.com/gh/xpring-eng/xpring-common-js/tree/master) [![CodeCob](https://img.shields.io/codecov/c/github/xpring-eng/xpring-common-js/master?style=flat-square&token=08b799e2895a4dd6add40c4621880c1a)]((https://codecov.io/gh/xpring-eng/xpring-common-js))

# Xpring Common JS
Xpring Common JS provides JavaScript based common functionality to all client side libraries in the Xpring Platform. 

Developers who want to access the Xpring platform should use one of the following top-level libraries:
- [XpringJS](http://github.com/xpring-eng/xpring-js): A JavaScript interface for the Xpring Platform
- [XpringKit](http://github.com/xpring-eng/xpringkit): A Swift interface for the Xpring Platform

Developers who are looking for low level cryptographic functions in the Xpring Platform likely want to use this library.

## Overview
Xpring Common JS is composed of several classes:
- `Wallet`:  Provides key management, address derivation, and signing / verify functionality.
- `Signer`: Provides utility functions for signing transactions.
- `Serializer`: Provides functionality for serializing Terram model objects for signing.
- `Utils`: Provides common utility functions.

## Development
To get set up on Terram, run the following: 

```shell
# Clone repository
$ git clone https://github.com/xpring-eng/terram.git
$ cd terram

# Pull submodules
$ git submodule init
$ git submodule update --remote

# Install Protocol Buffers
# OSX
$ brew install protobuf
# Linux
$ sudo apt install protobuf-compiler

# Install GRPC
$ npm -g i nyc grpc-tools

# Install required modules.
$ npm i

# Run tests (And generate intermediate code artifacts)
$ npm test
```
