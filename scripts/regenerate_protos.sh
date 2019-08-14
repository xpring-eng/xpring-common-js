#!/usr/bin/env bash

set -e -o pipefail

echo "Regenerating Terram Protos..."

mkdir -p ./generated

protoc --proto_path=$PWD/terram-protos/models \
--js_out=import_style=commonjs,binary:$PWD/generated/ \
$PWD/terram-protos/models/*.proto

echo "All done!"
