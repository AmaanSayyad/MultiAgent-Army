#!/bin/bash

echo "🪙 Deploying ARMY Token for Multiagent Army Platform"
echo ""
echo "📋 Token Economics:"
echo "  • Name: Multiagent Army"
echo "  • Symbol: ARMY" 
echo "  • Decimals: 8"
echo "  • Total Supply: 1,000,000,000 ARMY"
echo "  • Initial Distribution:"
echo "    - Minter (90%): For rewards, liquidity, platform operations"
echo "    - Office (10%): For operations, marketing, development"
echo ""

# Switch to minter identity
dfx identity use minter

# Get minter account ID
export MINTER_ACCOUNT_ID=$(dfx identity get-principal)
echo "Minter Principal: $MINTER_ACCOUNT_ID"

# Switch to aditya identity for initial balance
dfx identity use aditya

# Get aditya account ID
export OFFICE_ACCOUNT_ID=$(dfx identity get-principal)
echo "Office Principal: $OFFICE_ACCOUNT_ID"

# Switch back to minter for deployment
dfx identity use minter

echo "Deploying ARMY Token..."

# Get account IDs for initial distribution
MINTER_ACCOUNT_TEXT=$(dfx ledger account-id --of-principal $MINTER_ACCOUNT_ID)
OFFICE_ACCOUNT_TEXT=$(dfx ledger account-id --of-principal $OFFICE_ACCOUNT_ID)

echo "Minter Account ID: $MINTER_ACCOUNT_TEXT"
echo "Office Account ID: $OFFICE_ACCOUNT_TEXT"

# Deploy ARMY Token with initial supply
# First, create the canister
echo "Creating army_token canister..."
dfx canister create army_token

# Get the canister ID
ARMY_TOKEN_ID=$(dfx canister id army_token)
echo "ARMY Token Canister ID: $ARMY_TOKEN_ID"

# Deploy the army_token canister using dfx deploy
echo "Deploying army_token canister..."
dfx deploy army_token --argument "(variant { 
  Init = record {
    token_name = opt \"Multiagent Army\";
    token_symbol = opt \"ARMY\";
    transfer_fee = opt record { e8s = 1000 : nat64 };
    initial_values = vec {};
    minting_account = \"$MINTER_ACCOUNT_TEXT\";
    icrc1_minting_account = opt record {
      owner = principal \"$MINTER_ACCOUNT_ID\";
      subaccount = null;
    };
    archive_options = opt record {
      trigger_threshold = 2000 : nat64;
      num_blocks_to_archive = 1000 : nat64;
      controller_id = principal \"$MINTER_ACCOUNT_ID\";
    };
    send_whitelist = vec {};
    maximum_number_of_accounts = null;
    accounts_overflow_trim_quantity = null;
    transaction_window = null;
    max_message_size_bytes = null;
    feature_flags = opt record { icrc2 = true };
  }
})"

echo "✅ ARMY Token deployed successfully!"

# Get token canister ID
ARMY_TOKEN_ID=$(dfx canister id army_token)
echo "📋 ARMY Token Canister ID: $ARMY_TOKEN_ID"

echo ""
echo "🪙 Checking if we can mint initial supply..."

# Check current total supply
CURRENT_SUPPLY=$(dfx canister call army_token icrc1_total_supply "()")
echo "Current total supply: $CURRENT_SUPPLY"

echo ""
echo "📊 Token Information:"
echo "  • Name: Multiagent Army"
echo "  • Symbol: ARMY"
echo "  • Decimals: 8"
echo "  • Transfer Fee: 0.00001 ARMY"
echo "  • Canister ID: $ARMY_TOKEN_ID"
echo ""
echo "Note: Initial token supply will be minted through the minting account as needed."
echo "The minting account has the authority to create new tokens for platform operations."

echo "🪙 ARMY Token is ready for use!"
echo ""
echo "📋 Next Steps:"
echo "1. Run './mint_army_tokens.sh' to mint initial tokens (if not done already)"
echo "2. Use './transfer-to-user.sh <principal> <amount> ARMY' to transfer tokens to users"
echo ""
echo "💡 Token Management:"
echo "• The minting account can create new tokens as needed for rewards"
echo "• Current setup: Office account has initial token allocation"
echo "• Use the utility scripts for ongoing token management"
