# Multiagent Army Platform Deployment Checklist

Use this checklist to ensure a smooth deployment of the Multiagent Army Platform.

## Pre-Deployment Steps

- [ ] Set up dfx identities (minter and main identity)
- [ ] Start a local Internet Computer (`dfx start --clean --background`)
- [ ] Ensure all scripts are executable (`chmod +x *.sh`)

## Deployment Steps

### Core Canisters

- [ ] Deploy agent_registry canister
- [ ] Deploy token_factory canister
- [ ] Deploy token canister
- [ ] Deploy launchpad canister
- [ ] Deploy user_registry canister

### ARMY Token Deployment

- [ ] Deploy army_token canister
- [ ] Mint initial ARMY token supply
- [ ] Verify token balances

### Canister Configuration

- [ ] Set canister IDs in agent_registry
- [ ] Set canister IDs in launchpad
- [ ] Set canister IDs in token_factory
- [ ] Set canister IDs in user_registry

### Frontend Deployment

- [ ] Build frontend
- [ ] Deploy frontend canister

## Verification Steps

- [ ] Check agent_registry functionality
- [ ] Check token_factory functionality
- [ ] Check launchpad functionality
- [ ] Check user_registry functionality
- [ ] Check ARMY token transfers
- [ ] Verify frontend connectivity to backend
- [ ] Test agent creation flow
- [ ] Test sale creation flow
- [ ] Test point pledging flow
- [ ] Test token commitment flow
- [ ] Test token claiming flow

## Documentation

- [ ] Record all deployed canister IDs
- [ ] Update configuration files with correct IDs
- [ ] Document any custom deployment steps

## Commands Reference

### Deploy All Canisters

```bash
./deploy.sh
```

### Deploy ARMY Token Only

```bash
./deploy_army_token.sh
```

### Mint ARMY Tokens

```bash
./mint_army_tokens.sh
```

### Transfer ARMY Tokens

```bash
./transfer-to-user.sh <recipient_principal> <amount> ARMY
```

### Interact with Launchpad

```bash
./launchpad-interaction.sh pledge-points <sale_id> <amount>
./launchpad-interaction.sh commit-tokens <sale_id> <amount>
./launchpad-interaction.sh claim-tokens <sale_id>
```
