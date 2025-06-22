#!/bin/bash

# Script to interact with the launchpad canister for pledging points and committing tokens
# Usage: ./launchpad-interaction.sh <action> <sale_id> <amount> <principal>
# Action: pledge-points, commit-tokens, claim-tokens

set -e

ACTION="$1"
SALE_ID="$2"
AMOUNT="$3"
PRINCIPAL="${4:-$(dfx identity get-principal)}"  # Use current identity if not specified

# Validate inputs
if [ -z "$ACTION" ] || [ -z "$SALE_ID" ] || [ -z "$AMOUNT" ]; then
    echo "Usage: $0 <action> <sale_id> <amount> [principal]"
    echo "Actions: pledge-points, commit-tokens, claim-tokens"
    echo "Example: $0 pledge-points sale_1 5000"
    exit 1
fi

# Set the launchpad canister ID
LAUNCHPAD_CANISTER="launchpad"  # Replace with your actual launchpad canister ID

# Execute the appropriate action
case "$ACTION" in
    pledge-points)
        echo "🔄 Pledging $AMOUNT points to sale $SALE_ID..."
        RESULT=$(dfx canister call $LAUNCHPAD_CANISTER pledgePoints "(\"$SALE_ID\", $AMOUNT)")
        ;;
    commit-tokens)
        echo "🔄 Committing $AMOUNT ARMY tokens to sale $SALE_ID..."
        RESULT=$(dfx canister call $LAUNCHPAD_CANISTER commitToGenesisSale "(\"$SALE_ID\", $AMOUNT)")
        ;;
    claim-tokens)
        echo "🔄 Claiming tokens from sale $SALE_ID..."
        RESULT=$(dfx canister call $LAUNCHPAD_CANISTER claimTokens "(\"$SALE_ID\")")
        ;;
    *)
        echo "❌ Unknown action: $ACTION"
        echo "Supported actions: pledge-points, commit-tokens, claim-tokens"
        exit 1
        ;;
esac

# Check if the operation was successful
if echo "$RESULT" | grep -q "ok"; then
    echo "✅ Operation successful!"
    echo "Result: $RESULT"
    
    # Get current user pledges and commitments for this sale
    if [ "$ACTION" = "pledge-points" ]; then
        echo "📊 Checking your pledged points..."
        PLEDGED=$(dfx canister call $LAUNCHPAD_CANISTER getUserPointPledges "(\"$SALE_ID\", principal \"$PRINCIPAL\")")
        echo "   Points pledged to this sale: $PLEDGED"
    elif [ "$ACTION" = "commit-tokens" ]; then
        echo "📊 Checking your committed tokens..."
        COMMITMENTS=$(dfx canister call $LAUNCHPAD_CANISTER getUserCommitments "(principal \"$PRINCIPAL\")")
        echo "   Your commitments: $COMMITMENTS"
    fi
    
    # Return JSON for potential API use
    echo ""
    echo "📊 Result JSON:"
    echo "{\"success\": true, \"action\": \"$ACTION\", \"saleId\": \"$SALE_ID\", \"amount\": \"$AMOUNT\", \"result\": \"$RESULT\"}"
else
    echo "❌ Operation failed!"
    echo "Error: $RESULT"
    echo ""
    echo "📊 Result JSON:"
    echo "{\"success\": false, \"action\": \"$ACTION\", \"saleId\": \"$SALE_ID\", \"amount\": \"$AMOUNT\", \"error\": \"$RESULT\"}"
    exit 1
fi
