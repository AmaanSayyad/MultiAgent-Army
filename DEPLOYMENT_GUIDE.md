# Multiagent Army Platform Deployment Guide

This guide provides step-by-step instructions for deploying the Multiagent Army Platform, including all canisters and configuration steps.

## Prerequisites

- [dfx](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html) installed
- Node.js and npm
- Identity set up in dfx (specifically one named "minter" for token deployment)

## Deployment Steps

### 1. Start a Local Internet Computer

```bash
dfx start --clean --background
```

### 2. Create Required Identities

If you haven't already, create the necessary identities:

```bash
# Create a minter identity for token operations
dfx identity new minter
# Create your main identity if needed
dfx identity new aditya  # Replace with your preferred name
```

### 3. Deploy All Canisters

You can use the deploy.sh script to deploy all canisters at once:

```bash
./deploy.sh
```

This script performs the following:

- Builds Motoko canisters
- Updates declarations to include missing methods
- Deploys all canisters (agent_registry, token_factory, token, launchpad, user_registry, army_token)
- Configures canister relationships by setting canister IDs
- Builds and deploys the frontend

### 4. Deploy and Mint ARMY Tokens

If you prefer to deploy the ARMY token separately, you can use:

```bash
./deploy_army_token.sh
```

After deployment, mint the initial supply of ARMY tokens:

```bash
./mint_army_tokens.sh
```

This will mint 1,000,000,000 ARMY tokens, distributing 90% to the minter account and 10% to the office account.

### 5. Transfer Tokens to Users

To transfer ARMY tokens to specific users:

```bash
./transfer-to-user.sh <recipient_principal> <amount> ARMY
```

Example:

```bash
./transfer-to-user.sh abc123-def456 1000 ARMY
```

## Canister Structure and Relationships

The Multiagent Army Platform consists of the following canisters that work together:

1. `agent_registry`: Stores and manages agent details
2. `token_factory`: Creates new agent tokens
3. `token`: Standard token implementation for agent tokens
4. `launchpad`: Handles token sales and investments
5. `user_registry`: Manages user profiles
6. `army_token`: The platform's utility token for investments

The canisters are interconnected with the following relationships:

- `agent_registry` connects to `token_factory` and `launchpad`
- `launchpad` connects to `agent_registry`, `token_factory`, and `army_token`
- `token_factory` connects to `agent_registry`
- `user_registry` connects to `agent_registry`

## CLI Tools

The platform provides several CLI tools for interacting with the canisters:

- `launchpad-cli.sh`: Interact with the launchpad canister for pledging, committing, and claiming
- `transfer-to-user.sh`: Transfer tokens between users
- `deploy.sh`: Deploy all canisters at once
- `deploy_army_token.sh`: Deploy only the ARMY token
- `mint_army_tokens.sh`: Mint the initial supply of ARMY tokens

## Troubleshooting

### Missing TypeScript Declarations

If you encounter TypeScript errors due to missing method declarations:

1. Run the update-declarations-manually.sh script:

```bash
./update-declarations-manually.sh
```

2. Restart your frontend development server

### Token Transfer Issues

If token transfers fail:

1. Check that the minter identity has sufficient balance
2. Verify that the recipient principal is correct
3. Make sure the token canister is properly deployed

### Canister Relationship Errors

If canisters cannot communicate with each other:

1. Check that the setCanisterIds functions have been called correctly
2. Verify that the canister IDs match those in dfx.json
3. Try redeploying the canisters with the deploy.sh script

## Additional Resources

For more detailed information, refer to:

- `USER_GUIDE.md`: Guide for end users of the platform
- `INTEGRATION_FIXES.md`: Technical fixes for integration issues
- `launchpad.mo`: Motoko implementation of the launchpad canister
- `AgentDetails.tsx`: Frontend implementation of agent details page
