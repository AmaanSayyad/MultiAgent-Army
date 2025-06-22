# Integration Fixes Guide

This guide explains how to fix the integration issues between the frontend and backend for the Multiagent Army platform.

## TypeScript Declaration Errors

The main issue is that the TypeScript declarations for the launchpad canister don't include the methods `pledgePoints`, `getUserPointPledges`, and `claimTokens` which are implemented in the Motoko backend but not in the TypeScript declaration files.

### Option 1: Update the Declarations Manually

1. Run the provided script to update the declarations manually:

```bash
./update-declarations-manually.sh
```

This script adds the missing method declarations to the `_SERVICE` interface in the `launchpad.did.d.ts` file.

### Option 2: Workaround in launchpad-service.ts

If you prefer not to modify the declaration files, you can use the workaround already implemented in the `launchpad-service.ts` file:

1. We've created an extended interface `ExtendedLaunchpadActor` that adds the missing methods.
2. We've cast the actor to this extended interface when initializing it.

This approach allows TypeScript to recognize the methods without modifying the declaration files.

## Testing the Integration

To test that the integration is working properly:

1. Deploy the canisters:

```bash
./deploy.sh
```

2. Create a test agent using the AgentCreationForm:

   - Fill in the required fields
   - Choose either Genesis or Standard launch
   - Submit the form

3. Test the agent details page:

   - Navigate to the agent page
   - Try pledging points
   - Try committing ARMY tokens
   - Try claiming tokens if the sale is successful

4. You can also use the command-line interface:

```bash
./launchpad-cli.sh list-agents
./launchpad-cli.sh agent-details <agent_id>
./launchpad-cli.sh pledge-points <sale_id> <amount>
./launchpad-cli.sh commit-army <sale_id> <amount>
./launchpad-cli.sh claim-tokens <sale_id>
```

## Troubleshooting

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Look for errors in the deployment logs
3. Verify that all canister IDs are correctly set
4. Make sure the Motoko backend is properly deployed with the latest changes
5. Ensure that your Internet Identity is connected

## Updating After Backend Changes

If you make changes to the Motoko backend:

1. Build the canisters:

```bash
dfx build
```

2. Update the declarations:

```bash
./update-declarations-manually.sh
```

3. Deploy the changes:

```bash
dfx deploy launchpad
```

This process ensures that the frontend and backend remain in sync.
