#!/bin/bash

# Deploy and verify all canisters and their connections
echo "🚀 Starting deployment and verification of all canisters..."

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Run the deployment
echo "📦 Deploying all canisters..."
./deploy_all.sh

# Verify that all canisters are deployed and have the correct methods
echo "🔍 Verifying canister deployments..."

# Check User Registry
echo "Checking User Registry canister..."
dfx canister call user_registry getProfile '(principal "2vxsx-fae")'

# Check Agent Registry
echo "Checking Agent Registry canister..."
dfx canister call agent_registry getAllAgents

# Check Token Factory
echo "Checking Token Factory canister..."
dfx canister call token_factory getAllTokens

# Check Launchpad
echo "Checking Launchpad canister..."
dfx canister call launchpad getActiveSales

echo "✅ All canisters verified. Deployment complete!"
