# Multiagent Army Platform - User Guide

This guide provides instructions on how to use the Multiagent Army Platform, including agent creation, user registration, pledging points, committing tokens, and claiming tokens after successful sales.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Registration](#user-registration)
3. [Creating an Agent](#creating-an-agent)
4. [Participating in Token Sales](#participating-in-token-sales)
5. [Command Line Interface](#command-line-interface)
6. [Deployment Guide](#deployment-guide)

## Getting Started

The Multiagent Army Platform allows users to create and manage AI agents, participate in token sales, and earn rewards through the agent ecosystem. The platform uses the Internet Computer (ICP) blockchain for its backend and provides a modern React-based frontend for user interactions.

### Prerequisites

- Internet Identity account
- ARMY tokens for participation in sales
- Army Points for participating in Genesis launches

## User Registration

1. Visit the platform at [https://yourcanisterid.ic0.app/](https://yourcanisterid.ic0.app/)
2. Click on "Connect Wallet" in the top right corner
3. Choose "Internet Identity" as your authentication method
4. Complete the authentication process
5. Fill in your user profile information (name, email, etc.)
6. Click "Register" to complete the registration process

## Creating an Agent

To create a new agent:

1. Navigate to the "Create Agent" page from the dashboard
2. Fill in the agent details:
   - Name
   - Ticker symbol
   - Agent type
   - Short pitch
   - Overview
   - Framework
   - Launch type (Genesis or Standard)
   - Website URL
   - Twitter URL
   - Image
   - Category
   - Tags
3. Add team members:
   - Name
   - Role
   - Avatar
   - Bio
   - Social links
4. Configure tokenomics:
   - Total supply
   - Token distribution
   - Vesting schedule
   - Revenue split
5. Click "Create Agent" to submit the agent for approval

## Participating in Token Sales

### Viewing Available Agents

1. Go to the "Explore" page to see all available agents
2. Click on an agent to view its details
3. Check the launch status and token sale information

### Genesis Launches

For Genesis launches, the process is as follows:

1. **Pledge Points**:

   - Navigate to the agent's page
   - Enter the number of points you want to pledge
   - Click "Pledge Points"
   - Your allocation will be calculated based on your pledged points relative to the total points pledged

2. **Commit ARMY**:

   - After pledging points, you'll see your suggested allocation
   - Enter the amount of ARMY tokens you want to commit
   - Click "Commit ARMY"
   - This reserves your tokens for the sale

3. **Claim Tokens**:
   - If the Genesis launch is successful, return to the agent's page
   - Click "Claim Tokens" to receive your purchased tokens
   - Your unused points will be refunded
   - If the launch fails, all your points and ARMY tokens will be refunded

### Standard Launches

For Standard launches, the process is simpler:

1. Navigate to the agent's page
2. Enter the amount of ARMY tokens you want to use
3. Click "Buy Tokens"
4. Your tokens will be transferred immediately

## Command Line Interface

The platform provides a command-line interface for advanced users. You can use the `launchpad-cli.sh` script to interact with the platform:

```bash
./launchpad-cli.sh <command> [options]
```

Available commands:

- `list-agents` - List all agents
- `agent-details <agent_id>` - Get details for a specific agent
- `list-sales` - List all token sales
- `sale-details <sale_id>` - Get details for a specific sale
- `pledge-points <sale_id> <amount>` - Pledge points to a sale
- `commit-army <sale_id> <amount>` - Commit ARMY tokens to a sale
- `claim-tokens <sale_id>` - Claim tokens after a successful sale
- `transfer-army <recipient> <amount>` - Transfer ARMY tokens to a user
- `get-balance` - Get your ARMY token balance
- `get-pledges <sale_id>` - Get your point pledges for a sale
- `get-commitments` - Get your token commitments
- `help` - Show the help message

Example usage:

```bash
./launchpad-cli.sh pledge-points sale_123 5000
./launchpad-cli.sh commit-army sale_123 100
./launchpad-cli.sh claim-tokens sale_123
```

## Deployment Guide

To deploy the platform, follow these steps:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

The script will:

1. Build all Motoko canisters
2. Deploy the canisters to the Internet Computer
3. Configure the canister relationships
4. Build and deploy the frontend
5. Output the URLs and canister IDs for accessing the platform

### Manual Deployment

If you prefer to deploy manually, follow these steps:

1. Build the Motoko canisters:
   ```bash
   dfx build
   ```
2. Deploy the canisters:
   ```bash
   dfx deploy agent_registry
   dfx deploy token_factory
   dfx deploy token
   dfx deploy launchpad
   dfx deploy user_registry
   dfx deploy army_token
   ```
3. Configure canister relationships (see deploy.sh for details)
4. Build and deploy the frontend:
   ```bash
   cd src/multiagent_frontend
   npm install
   npm run build
   cd ../..
   dfx deploy multiagent_frontend
   ```

## Conclusion

The Multiagent Army Platform provides a comprehensive ecosystem for creating, managing, and investing in AI agents. By following this guide, you'll be able to navigate the platform, participate in token sales, and manage your agent investments effectively.
