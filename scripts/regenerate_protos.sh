#!/usr/bin/env bash

set -e -o pipefail

##########################################################################
# Generate Protocol Buffers from Rippled.
##########################################################################

echo "Regenerating Protocol Buffers from Rippled"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./src/XRP/generated"

PROTO_PATH="./rippled/src/ripple/proto"
PROTO_SRC_FILES=$PROTO_PATH/rpc/v1/*.proto

mkdir -p $OUT_DIR

# Generate node code.
$PWD/node_modules/grpc-tools/bin/protoc \
    --js_out=import_style=commonjs,binary:$OUT_DIR \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:$OUT_DIR \
    --proto_path $PROTO_PATH \
    $PROTO_SRC_FILES

echo "All done!"
