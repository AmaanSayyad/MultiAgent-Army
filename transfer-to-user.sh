#!/bin/bash

# Transfer tokens from DFX identity to a specified principal
# Usage: ./transfer-to-user.sh <recipient_principal> <amount> <token_type>
# token_type can be "APTC" or "ARMY"

set -e

RECIPIENT_PRINCIPAL="$1"
AMOUNT="$2"
TOKEN_TYPE="${3:-ARMY}"  # Default to ARMY if not specified

if [ -z "$RECIPIENT_PRINCIPAL" ] || [ -z "$AMOUNT" ]; then
    echo "Usage: $0 <recipient_principal> <amount> [token_type]"
    echo "Example: $0 abc123-def456 1000 ARMY"
    exit 1
fi

echo "🚀 Transferring $AMOUNT $TOKEN_TYPE to $RECIPIENT_PRINCIPAL"
echo ""

# Convert amount to e8s units (multiply by 100,000,000)
AMOUNT_E8S=$(echo "$AMOUNT * 100000000" | bc)
# Convert to integer (remove decimal places)
AMOUNT_E8S=${AMOUNT_E8S%.*}

# Make sure we're using the aditya identity (which has the tokens)
dfx identity use aditya

echo "📋 Transfer Details:"
echo "  From: $(dfx identity get-principal) (aditya)"
echo "  To: $RECIPIENT_PRINCIPAL"
echo "  Amount: $AMOUNT $TOKEN_TYPE ($AMOUNT_E8S e8s)"
echo ""

# Set the token canister ID based on token type
if [ "$TOKEN_TYPE" = "APTC" ]; then
    TOKEN_CANISTER="APTC-token"
elif [ "$TOKEN_TYPE" = "ARMY" ]; then
    TOKEN_CANISTER="army_token"  # Using the correct canister name from dfx.json
else
    echo "❌ Unsupported token type: $TOKEN_TYPE"
    echo "Supported types: APTC, ARMY"
    exit 1
fi

# Execute the transfer
echo "🔄 Executing transfer..."
RESULT=$(dfx canister call $TOKEN_CANISTER icrc1_transfer "(record {
    to = record { owner = principal \"$RECIPIENT_PRINCIPAL\"; subaccount = null };
    amount = $AMOUNT_E8S;
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
})")

# Check if transfer was successful
if echo "$RESULT" | grep -q "Ok"; then
    BLOCK_INDEX=$(echo "$RESULT" | sed 's/_//g' | grep -o '[0-9]\+' | head -1)
    echo "✅ Transfer successful!"
    echo "📄 Block Index: $BLOCK_INDEX"
    echo ""
    
    # Check recipient balance
    echo "💰 Checking recipient balance..."
    BALANCE=$(dfx canister call $TOKEN_CANISTER icrc1_balance_of "(record { owner = principal \"$RECIPIENT_PRINCIPAL\"; subaccount = null })")
    BALANCE_E8S=$(echo "$BALANCE" | sed 's/_//g' | grep -o '[0-9]\+')
    BALANCE_TOKEN=$(echo "scale=8; $BALANCE_E8S / 100000000" | bc)
    echo "   New balance: $BALANCE_TOKEN $TOKEN_TYPE"
    
    # Return JSON for potential API use
    echo ""
    echo "📊 Result JSON:"
    echo "{\"success\": true, \"tokenType\": \"$TOKEN_TYPE\", \"blockIndex\": \"$BLOCK_INDEX\", \"newBalance\": \"$BALANCE_TOKEN\"}"
    
else
    echo "❌ Transfer failed!"
    echo "Error: $RESULT"
    echo ""
    echo "📊 Result JSON:"
    echo "{\"success\": false, \"tokenType\": \"$TOKEN_TYPE\", \"error\": \"$RESULT\"}"
    exit 1
fi
