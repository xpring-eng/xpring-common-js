#!/bin/bash

set -e

echo "Regenerating Terram Protos..."
protoc --proto_path=./terram-protos/ \
--js_out=import_style=commonjs,binary:./generated/ \
./terram-protos/*.proto

echo "All done!"
