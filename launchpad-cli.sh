#!/bin/bash

# CLI tool for interacting with the Multiagent Army Platform
# Usage: ./launchpad-cli.sh <command> [options]

set -e

COMMAND="$1"
shift 1

# Color codes for output formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Define canister IDs (these will be replaced by actual IDs in your environment)
AGENT_REGISTRY_CANISTER="agent_registry"
LAUNCHPAD_CANISTER="launchpad"
TOKEN_FACTORY_CANISTER="token_factory"
USER_REGISTRY_CANISTER="user_registry"
ARMY_TOKEN_CANISTER="army_token"

# Print usage information
function print_usage() {
    echo -e "${BLUE}Multiagent Army Platform CLI${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  $0 <command> [options]"
    echo ""
    echo -e "${YELLOW}Available commands:${NC}"
    echo "  list-agents                          List all agents"
    echo "  agent-details <agent_id>             Get details for a specific agent"
    echo "  list-sales                           List all token sales"
    echo "  sale-details <sale_id>               Get details for a specific sale"
    echo "  pledge-points <sale_id> <amount>     Pledge points to a sale"
    echo "  commit-army <sale_id> <amount>       Commit ARMY tokens to a sale"
    echo "  claim-tokens <sale_id>               Claim tokens after a successful sale"
    echo "  transfer-army <recipient> <amount>   Transfer ARMY tokens to a user"
    echo "  get-balance                          Get your ARMY token balance"
    echo "  get-pledges <sale_id>                Get your point pledges for a sale"
    echo "  get-commitments                      Get your token commitments"
    echo "  help                                 Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 list-agents"
    echo "  $0 pledge-points sale_123 5000"
    echo "  $0 commit-army sale_123 100"
    echo "  $0 transfer-army abc123-def456 500"
    echo ""
}

# Execute the requested command
case "$COMMAND" in
    list-agents)
        echo -e "${BLUE}Fetching agents...${NC}"
        dfx canister call $AGENT_REGISTRY_CANISTER getAgents
        ;;
        
    agent-details)
        AGENT_ID="$1"
        if [ -z "$AGENT_ID" ]; then
            echo -e "${RED}Error: Agent ID is required${NC}"
            echo "Usage: $0 agent-details <agent_id>"
            exit 1
        fi
        echo -e "${BLUE}Fetching details for agent $AGENT_ID...${NC}"
        dfx canister call $AGENT_REGISTRY_CANISTER getAgent "\"$AGENT_ID\""
        ;;
        
    list-sales)
        echo -e "${BLUE}Fetching all token sales...${NC}"
        dfx canister call $LAUNCHPAD_CANISTER getSales
        ;;
        
    sale-details)
        SALE_ID="$1"
        if [ -z "$SALE_ID" ]; then
            echo -e "${RED}Error: Sale ID is required${NC}"
            echo "Usage: $0 sale-details <sale_id>"
            exit 1
        fi
        echo -e "${BLUE}Fetching details for sale $SALE_ID...${NC}"
        dfx canister call $LAUNCHPAD_CANISTER getSale "\"$SALE_ID\""
        ;;
        
    pledge-points)
        SALE_ID="$1"
        AMOUNT="$2"
        if [ -z "$SALE_ID" ] || [ -z "$AMOUNT" ]; then
            echo -e "${RED}Error: Sale ID and amount are required${NC}"
            echo "Usage: $0 pledge-points <sale_id> <amount>"
            exit 1
        fi
        echo -e "${BLUE}Pledging $AMOUNT points to sale $SALE_ID...${NC}"
        dfx canister call $LAUNCHPAD_CANISTER pledgePoints "(\"$SALE_ID\", $AMOUNT)"
        
        # Check updated pledges
        echo -e "${BLUE}Checking your pledged points...${NC}"
        PRINCIPAL=$(dfx identity get-principal)
        dfx canister call $LAUNCHPAD_CANISTER getUserPointPledges "(\"$SALE_ID\", principal \"$PRINCIPAL\")"
        ;;
        
    commit-army)
        SALE_ID="$1"
        AMOUNT="$2"
        if [ -z "$SALE_ID" ] || [ -z "$AMOUNT" ]; then
            echo -e "${RED}Error: Sale ID and amount are required${NC}"
            echo "Usage: $0 commit-army <sale_id> <amount>"
            exit 1
        fi
        
        # Convert to e8s (assuming 8 decimal places)
        AMOUNT_E8S=$(echo "$AMOUNT * 100000000" | bc | sed 's/\..*//g')
        
        echo -e "${BLUE}Committing $AMOUNT ARMY tokens to sale $SALE_ID...${NC}"
        dfx canister call $LAUNCHPAD_CANISTER commitToGenesisSale "(\"$SALE_ID\", $AMOUNT_E8S)"
        
        # Check updated commitments
        echo -e "${BLUE}Checking your commitments...${NC}"
        PRINCIPAL=$(dfx identity get-principal)
        dfx canister call $LAUNCHPAD_CANISTER getUserCommitments "(principal \"$PRINCIPAL\")"
        ;;
        
    claim-tokens)
        SALE_ID="$1"
        if [ -z "$SALE_ID" ]; then
            echo -e "${RED}Error: Sale ID is required${NC}"
            echo "Usage: $0 claim-tokens <sale_id>"
            exit 1
        fi
        echo -e "${BLUE}Claiming tokens from sale $SALE_ID...${NC}"
        dfx canister call $LAUNCHPAD_CANISTER claimTokens "\"$SALE_ID\""
        ;;
        
    transfer-army)
        RECIPIENT="$1"
        AMOUNT="$2"
        if [ -z "$RECIPIENT" ] || [ -z "$AMOUNT" ]; then
            echo -e "${RED}Error: Recipient and amount are required${NC}"
            echo "Usage: $0 transfer-army <recipient> <amount>"
            exit 1
        fi
        echo -e "${BLUE}Transferring $AMOUNT ARMY tokens to $RECIPIENT...${NC}"
        ./transfer-to-user.sh "$RECIPIENT" "$AMOUNT" "ARMY"
        ;;
        
    get-balance)
        echo -e "${BLUE}Checking your ARMY token balance...${NC}"
        PRINCIPAL=$(dfx identity get-principal)
        BALANCE=$(dfx canister call $ARMY_TOKEN_CANISTER icrc1_balance_of "(record { owner = principal \"$PRINCIPAL\"; subaccount = null })")
        BALANCE_E8S=$(echo "$BALANCE" | sed 's/_//g' | grep -o '[0-9]\+')
        BALANCE_TOKENS=$(echo "scale=8; $BALANCE_E8S / 100000000" | bc)
        echo -e "${GREEN}Your balance: $BALANCE_TOKENS ARMY${NC}"
        ;;
        
    get-pledges)
        SALE_ID="$1"
        if [ -z "$SALE_ID" ]; then
            echo -e "${RED}Error: Sale ID is required${NC}"
            echo "Usage: $0 get-pledges <sale_id>"
            exit 1
        fi
        echo -e "${BLUE}Checking your pledged points for sale $SALE_ID...${NC}"
        PRINCIPAL=$(dfx identity get-principal)
        dfx canister call $LAUNCHPAD_CANISTER getUserPointPledges "(\"$SALE_ID\", principal \"$PRINCIPAL\")"
        ;;
        
    get-commitments)
        echo -e "${BLUE}Checking your token commitments...${NC}"
        PRINCIPAL=$(dfx identity get-principal)
        dfx canister call $LAUNCHPAD_CANISTER getUserCommitments "(principal \"$PRINCIPAL\")"
        ;;
        
    help)
        print_usage
        ;;
        
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        print_usage
        exit 1
        ;;
esac
