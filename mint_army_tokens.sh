#!/bin/bash

echo "🪙 Minting Initial ARMY Token Supply"
echo ""

# Switch to minter identity (who has minting privileges)
dfx identity use minter

# Get account IDs
export MINTER_ACCOUNT_ID=$(dfx identity get-principal)
export OFFICE_ACCOUNT_ID=$(dfx identity use aditya && dfx identity get-principal)

# Switch back to minter
dfx identity use minter

MINTER_ACCOUNT_TEXT=$(dfx ledger account-id --of-principal $MINTER_ACCOUNT_ID)
OFFICE_ACCOUNT_TEXT=$(dfx ledger account-id --of-principal $OFFICE_ACCOUNT_ID)

echo "Minter Principal: $MINTER_ACCOUNT_ID"
echo "Office Principal: $OFFICE_ACCOUNT_ID"
echo "Minter Account: $MINTER_ACCOUNT_TEXT"
echo "Office Account: $OFFICE_ACCOUNT_TEXT"
echo ""

# Check current supply
echo "Checking current ARMY token supply..."
CURRENT_SUPPLY=$(dfx canister call army_token icrc1_total_supply "()")
echo "Current total supply: $CURRENT_SUPPLY"

# Verify that the canister exists and is accessible
ARMY_TOKEN_ID=$(dfx canister id army_token || echo "")
if [ -z "$ARMY_TOKEN_ID" ]; then
    echo "❌ Error: Cannot find the army_token canister ID."
    echo "Please deploy the token first with './deploy_army_token.sh'"
    exit 1
fi
echo "ARMY Token Canister ID: $ARMY_TOKEN_ID"

if [ "$CURRENT_SUPPLY" = "(0 : nat)" ]; then
    echo ""
    echo "🏭 Minting initial ARMY token supply..."
    
    # The ICP ledger allows the minting account to send tokens to create new supply
    # We'll use the send_dfx method which is designed for minting
    
    echo "Minting 900,000,000 ARMY to minter account..."
    dfx canister call army_token send_dfx "(record {
        to = \"$MINTER_ACCOUNT_TEXT\";
        amount = record { e8s = 90000000000000000 : nat64 };
        fee = record { e8s = 0 : nat64 };
        memo = 1 : nat64;
        from_subaccount = null;
        created_at_time = null;
    })" && echo "✅ Minter account funded" || echo "❌ Minter minting failed"
    
    echo ""
    echo "Minting 100,000,000 ARMY to office account..."
    dfx canister call army_token send_dfx "(record {
        to = \"$OFFICE_ACCOUNT_TEXT\";
        amount = record { e8s = 10000000000000000 : nat64 };
        fee = record { e8s = 0 : nat64 };
        memo = 2 : nat64;
        from_subaccount = null;
        created_at_time = null;
    })" && echo "✅ Office account funded" || echo "❌ Office minting failed"
    
else
    echo "Initial supply already exists. Current supply: $CURRENT_SUPPLY"
fi

echo ""
echo "📊 Checking final balances..."

# Check minter balance
MINTER_BALANCE=$(dfx identity use minter && dfx canister call army_token icrc1_balance_of "(record { owner = principal \"$MINTER_ACCOUNT_ID\"; subaccount = null })")
echo "Minter balance: $MINTER_BALANCE"

# Check office balance  
OFFICE_BALANCE=$(dfx canister call army_token icrc1_balance_of "(record { owner = principal \"$OFFICE_ACCOUNT_ID\"; subaccount = null })")
echo "Office balance: $OFFICE_BALANCE"

# Check total supply
FINAL_SUPPLY=$(dfx canister call army_token icrc1_total_supply "()")
echo "Total supply: $FINAL_SUPPLY"

echo ""
echo "🎉 Initial ARMY supply minting complete!"
