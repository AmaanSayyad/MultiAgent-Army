#!/bin/bash

# This script helps update the declarations for the launchpad canister
# to include missing functions when the declarations can't be updated automatically

set -e

echo "Updating launchpad.did.d.ts declarations..."

# Path to the declarations file
DECLARATIONS_FILE="src/declarations/launchpad/launchpad.did.d.ts"

# Check if the file exists
if [ ! -f "$DECLARATIONS_FILE" ]; then
    echo "Error: Declarations file not found at $DECLARATIONS_FILE"
    exit 1
fi

# Backup the original file
cp "$DECLARATIONS_FILE" "${DECLARATIONS_FILE}.backup"
echo "Backed up original file to ${DECLARATIONS_FILE}.backup"

# Update the _SERVICE interface to include missing methods
sed -i '' 's/export interface _SERVICE {/export interface _SERVICE {\n  pledgePoints: ActorMethod<[SaleId, bigint], Result>,\n  getUserPointPledges: ActorMethod<[SaleId, Principal], bigint>,\n  claimTokens: ActorMethod<[SaleId], Result>,/g' "$DECLARATIONS_FILE"

echo "Updated declarations file with missing methods"
echo "Done! ✅"
