#!/bin/bash

# Script to update the DID files based on Motoko canister definitions
# Usage: ./update-declarations.sh

set -e

echo "🔄 Updating canister declarations..."

# Build the canisters to generate the latest DID files
dfx build

echo "✅ Declarations updated successfully!"
echo "You can now proceed with the frontend development."
