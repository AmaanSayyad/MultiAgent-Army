# Multiagent Army Platform

A decentralized platform for creating, managing, and investing in AI agents, inspired by Virtuals Protocol. This platform allows users to create agents, participate in token sales, and earn rewards through the agent ecosystem.

## Features

- **Agent Creation**: Create AI agents with customizable parameters
- **Token Sales**: Launch tokens for agents through Genesis or Standard sales
- **Point Pledging**: Pledge Army Points to get allocation in Genesis launches
- **Token Commitment**: Commit ARMY tokens to secure allocation
- **User Registration**: Register and manage your profile
- **Token Claiming**: Claim tokens after successful sales

## Architecture

The platform consists of the following components:

- **Motoko Backend**: Smart contracts running on the Internet Computer blockchain

  - Agent Registry: Manages agent details and metadata
  - Token Factory: Creates and manages agent tokens
  - Launchpad: Handles token sales, point pledging, and token commitments
  - User Registry: Manages user profiles and preferences
  - Token: Standard ICRC-1 token implementation

- **React Frontend**: Modern UI for interacting with the platform
  - Agent Creation Form: UI for creating new agents
  - Agent Details: View agent information and participate in sales
  - Dashboard: Overview of your agents and investments
  - User Profile: Manage your profile and preferences

## Getting Started

### Prerequisites

- [dfx](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html) installed
- Node.js and npm
- Internet Identity account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/multiagent-army.git
cd multiagent-army
```

2. Install dependencies:

```bash
npm install
```

### Deployment

The platform provides several deployment scripts to simplify the setup process:

#### Full Deployment (Recommended)

For a complete deployment of all components, use the `deploy_all.sh` script:

```bash
./deploy_all.sh
```

This script handles the entire deployment process:

- Builds and deploys all canisters
- Configures canister relationships
- Deploys both ARMY and APTC tokens
- Mints initial token supply
- Builds and deploys the frontend

#### Individual Component Deployment

If you prefer to deploy components individually:

1. Deploy core canisters:

```bash
./deploy.sh
```

2. Deploy token canisters:

```bash
./deploy_army_token.sh
./deploy_aptc_token.sh
```

3. Mint initial token supply:

```bash
./mint_army_tokens.sh
./mint_initial_supply.sh
```

### Token Management

Transfer tokens to users:

```bash
./transfer-to-user.sh <recipient_principal> <amount> ARMY
```

Interact with the launchpad:

```bash
./launchpad-interaction.sh pledge-points <sale_id> <amount>
./launchpad-interaction.sh commit-tokens <sale_id> <amount>
./launchpad-interaction.sh claim-tokens <sale_id>
```

3. Deploy the canisters:

```bash
./deploy.sh
```

## Usage

### Creating an Agent

1. Connect your Internet Identity
2. Navigate to the Create Agent page
3. Fill in the agent details
4. Choose a launch type (Genesis or Standard)
5. Configure tokenomics
6. Submit the form

### Participating in Token Sales

1. Browse the available agents
2. Click on an agent to view details
3. For Genesis launches:
   - Pledge Army Points to get allocation
   - Commit ARMY tokens based on your allocation
   - Claim tokens after the sale is successful
4. For Standard launches:
   - Buy tokens directly with ARMY

### Command-Line Interface

You can also use the CLI to interact with the platform:

```bash
./launchpad-cli.sh <command> [options]
```

Available commands:

- `list-agents`: List all agents
- `agent-details <agent_id>`: Get details for a specific agent
- `list-sales`: List all token sales
- `sale-details <sale_id>`: Get details for a specific sale
- `pledge-points <sale_id> <amount>`: Pledge points to a sale
- `commit-army <sale_id> <amount>`: Commit ARMY tokens to a sale
- `claim-tokens <sale_id>`: Claim tokens after a successful sale
- `transfer-army <recipient> <amount>`: Transfer ARMY tokens to a user
- `get-balance`: Get your ARMY token balance
- `get-pledges <sale_id>`: Get your point pledges for a sale
- `get-commitments`: Get your token commitments
- `help`: Show the help message

## Development

### Project Structure

```
├── src/
│   ├── declarations/           # TypeScript declarations for canisters
│   ├── multiagent_backend/     # Motoko canisters
│   │   ├── agent_registry.mo   # Agent Registry canister
│   │   ├── launchpad.mo        # Launchpad canister
│   │   ├── token_factory.mo    # Token Factory canister
│   │   ├── token.mo            # Token canister
│   │   ├── user_registry.mo    # User Registry canister
│   │   └── types.mo            # Shared types
│   └── multiagent_frontend/    # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── lib/            # Services and utilities
│       │   ├── pages/          # Page components
│       │   └── hooks/          # Custom React hooks
├── deploy.sh                   # Deployment script
├── transfer-to-user.sh         # Script for transferring tokens
├── launchpad-cli.sh            # CLI for interacting with the platform
└── update-declarations-manually.sh # Script to update TypeScript declarations
```

### Making Changes

1. Edit the Motoko canisters in `src/multiagent_backend/`
2. Edit the frontend in `src/multiagent_frontend/`
3. Run `./deploy.sh` to deploy your changes

### Troubleshooting

If you encounter issues with TypeScript declarations not matching the Motoko backend:

1. Run `./update-declarations-manually.sh` to update the declarations
2. Alternatively, use the workaround in `launchpad-service.ts`

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
