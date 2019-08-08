#!/usr/bin/env bash

set -e -o pipefail

echo "Regenerating Terram Protos..."

mkdir -p ./generated

protoc --proto_path=$PWD/terram-protos/ \
--js_out=import_style=commonjs,binary:$PWD/generated/ \
$PWD/terram-protos/*.proto

echo "All done!"
