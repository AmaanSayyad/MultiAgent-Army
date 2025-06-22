#!/bin/bash

# Master deployment script for the Multiagent Army Platform
# This script handles the full deployment process in the correct order

set -e

echo "📋 Starting complete deployment of Multiagent Army Platform..."

# Ensure we're using the default identity to start
dfx identity use default || dfx identity new default

# Check if minter identity exists, create if not
dfx identity use minter 2>/dev/null || dfx identity new minter

# Check if aditya identity exists, create if not
dfx identity use aditya 2>/dev/null || dfx identity new aditya

# Switch back to default
dfx identity use default

# Start local IC if not already running
echo "🚀 Ensuring local Internet Computer is running..."
dfx ping || dfx start --clean --background

# Build Motoko canisters
echo "🔨 Building Motoko canisters..."
dfx build

# Update declarations manually to include missing methods
echo "🔄 Updating declarations to include missing methods..."
./update-declarations-manually.sh

# Deploy the core canisters
echo "🚀 Deploying core canisters..."
dfx deploy agent_registry
dfx deploy token_factory
dfx deploy token
dfx deploy launchpad
dfx deploy user_registry

# Deploy the token canisters (ARMY and APTC)
echo "🪙 Deploying token canisters..."

# Deploy ARMY Token using dfx deploy
echo "Deploying ARMY token..."
dfx canister create army_token

# Get minter account information
dfx identity use minter
MINTER_ACCOUNT_ID=$(dfx identity get-principal)
MINTER_ACCOUNT_TEXT=$(dfx ledger account-id --of-principal $MINTER_ACCOUNT_ID)

# Deploy the army_token canister
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

# Deploy APTC Token (if needed)
echo "Deploying APTC token..."
dfx canister create APTC-token
dfx deploy APTC-token --argument "(variant { 
  Init = record {
    token_name = opt \"APTC Token\";
    token_symbol = opt \"APTC\";
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

# Switch back to default identity
dfx identity use default

# Configure canister relationships
echo "⚙️ Configuring canister relationships..."

# Get canister IDs
AGENT_REGISTRY_ID=$(dfx canister id agent_registry)
TOKEN_FACTORY_ID=$(dfx canister id token_factory)
TOKEN_ID=$(dfx canister id token)
LAUNCHPAD_ID=$(dfx canister id launchpad)
USER_REGISTRY_ID=$(dfx canister id user_registry)
ARMY_TOKEN_ID=$(dfx canister id army_token)
APTC_TOKEN_ID=$(dfx canister id APTC-token 2>/dev/null || echo "Not deployed")

echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  Token Factory: $TOKEN_FACTORY_ID"
echo "  Token: $TOKEN_ID"
echo "  Launchpad: $LAUNCHPAD_ID"
echo "  User Registry: $USER_REGISTRY_ID"
echo "  ARMY Token: $ARMY_TOKEN_ID"
echo "  APTC Token: $APTC_TOKEN_ID"

# Set canister IDs in Agent Registry
echo "  Configuring Agent Registry..."
dfx canister call agent_registry setCanisterIds "(
  opt \"$TOKEN_FACTORY_ID\",
  opt \"$LAUNCHPAD_ID\"
)"

# Set canister IDs in Launchpad
echo "  Configuring Launchpad..."
dfx canister call launchpad setCanisterIds "(
  opt \"$AGENT_REGISTRY_ID\", 
  opt \"$TOKEN_FACTORY_ID\",
  opt \"$ARMY_TOKEN_ID\"
)"

# Set canister IDs in Token Factory
echo "  Configuring Token Factory..."
dfx canister call token_factory setCanisterIds "(
  opt \"$AGENT_REGISTRY_ID\"
)"

# Set canister IDs in User Registry
echo "  Configuring User Registry..."
dfx canister call user_registry setCanisterIds "(
  opt \"$AGENT_REGISTRY_ID\"
)"

# Mint initial token supply
echo "🪙 Minting initial token supply..."
echo "Minting ARMY tokens..."
./mint_army_tokens.sh

echo "Minting APTC tokens (if needed)..."
./mint_initial_supply.sh || echo "Skipping APTC token minting"

# Build and deploy frontend
echo "🌐 Building frontend..."
cd src/multiagent_frontend

# Export canister IDs as environment variables for the frontend
export CANISTER_ID_AGENT_REGISTRY=$AGENT_REGISTRY_ID
export CANISTER_ID_TOKEN_FACTORY=$TOKEN_FACTORY_ID
export CANISTER_ID_TOKEN=$TOKEN_ID
export CANISTER_ID_LAUNCHPAD=$LAUNCHPAD_ID
export CANISTER_ID_USER_REGISTRY=$USER_REGISTRY_ID
export CANISTER_ID_ARMY_TOKEN=$ARMY_TOKEN_ID
export CANISTER_ID_APTC_TOKEN=$APTC_TOKEN_ID

npm install
npm run build

# Deploy frontend
echo "🚀 Deploying frontend..."
cd ../..
dfx deploy multiagent_frontend

FRONTEND_CANISTER_ID=$(dfx canister id multiagent_frontend)
FRONTEND_URL=$(dfx canister id multiagent_frontend).ic0.app

echo "✅ Deployment completed successfully!"
echo "📱 Frontend URL: https://$FRONTEND_URL"
echo ""
echo "📝 Canister IDs"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  Token Factory: $TOKEN_FACTORY_ID"
echo "  Token: $TOKEN_ID"
echo "  Launchpad: $LAUNCHPAD_ID"
echo "  User Registry: $USER_REGISTRY_ID"
echo "  ARMY Token: $ARMY_TOKEN_ID"
echo "  APTC Token: $APTC_TOKEN_ID"
echo "  Frontend: $FRONTEND_CANISTER_ID"
echo ""
echo "🚀 You can now access the application at: https://$FRONTEND_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Transfer ARMY tokens to users: ./transfer-to-user.sh <principal> <amount> ARMY"
echo "2. Create and register agents: Use the web interface or CLI tools"
echo "3. Set up token sales: Use the web interface or CLI tools"
echo ""
echo "For more information, see DEPLOYMENT_GUIDE.md and USER_GUIDE.md"
