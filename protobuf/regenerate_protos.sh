#!/bin/bash

set -e

echo "Regenerating protos"
protoc --js_out=import_style=commonjs,binary:../generated *.proto
echo "All Done!"
