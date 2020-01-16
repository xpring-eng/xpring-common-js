#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Moves Typescript types to the build folder.
##########################################################################

echo "Copying typescript type defintions files for Protos into build"

mkdir -p ./build/generated
mkdir -p ./build/generated/legacy
mkdir -p ./build/generated/rpc
mkdir -p ./build/generated/rpc/v1

cp ./src/generated/legacy/*.d.ts ./build/generated/legacy/
cp ./src/generated/rpc/v1/*.d.ts ./build/generated/rpc/v1/

echo "All done!"
