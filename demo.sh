#!/bin/bash

# set -e

# clear
dfx stop
rm -rf .dfx

ALICE_HOME=$(mktemp -d)
BOB_HOME=$(mktemp -d)
DAN_HOME=$(mktemp -d)
FEE_HOME=$(mktemp -d)
HOME=$ALICE_HOME

ALICE_PUBLIC_KEY="principal \"$( \
    HOME=$ALICE_HOME dfx identity get-principal
)\""
BOB_PUBLIC_KEY="principal \"$( \
    HOME=$BOB_HOME dfx identity get-principal
)\""
DAN_PUBLIC_KEY="principal \"$( \
    HOME=$DAN_HOME dfx identity get-principal
)\""
FEE_PUBLIC_KEY="principal \"$( \
    HOME=$FEE_HOME dfx identity get-principal
)\""

echo Alice id = $ALICE_PUBLIC_KEY
echo Bob id = $BOB_PUBLIC_KEY
echo Dan id = $DAN_PUBLIC_KEY
echo Fee id = $FEE_PUBLIC_KEY

dfx start --clean --background
dfx canister create --all
dfx build

TOKENID=$(dfx canister id token)
TOKENID="principal \"$TOKENID\""

echo Token id: $TOKENID

echo
echo == Install token canister
echo

HOME=$ALICE_HOME
eval dfx canister install token --argument="'(\"https://multiagent.army/logo.png\", \"Multiagent Army Token\", \"ARMY\", 8, 1000000000000000, $ALICE_PUBLIC_KEY, 100000)'"

echo
echo == Initial setting for token canister
echo

eval dfx canister call token setFeeTo "'($FEE_PUBLIC_KEY)'"
eval dfx canister call token setFee "'(100000)'"

echo
echo == Initial token balances for Alice and Bob, Dan, FeeTo
echo

echo Alice = $( \
    eval dfx canister call token balanceOf "'($ALICE_PUBLIC_KEY)'" \
)
echo Bob = $( \
    eval dfx canister call token balanceOf "'($BOB_PUBLIC_KEY)'" \
)
echo Dan = $( \
    eval dfx canister call token balanceOf "'($DAN_PUBLIC_KEY)'" \
)
echo FeeTo = $( \
    eval dfx canister call token balanceOf "'($FEE_PUBLIC_KEY)'" \
)

echo
echo == Transfer 1000000000 tokens from Alice to Bob
echo

eval dfx canister call token transfer "'($BOB_PUBLIC_KEY, 1000000000)'"

echo
echo == Transfer 1000000000 tokens from Alice to Dan
echo

eval dfx canister call token transfer "'($DAN_PUBLIC_KEY, 1000000000)'"

echo
echo == Check balances after transfers
echo

echo Alice = $( \
    eval dfx canister call token balanceOf "'($ALICE_PUBLIC_KEY)'" \
)
echo Bob = $( \
    eval dfx canister call token balanceOf "'($BOB_PUBLIC_KEY)'" \
)
echo Dan = $( \
    eval dfx canister call token balanceOf "'($DAN_PUBLIC_KEY)'" \
)
echo FeeTo = $( \
    eval dfx canister call token balanceOf "'($FEE_PUBLIC_KEY)'" \
)

echo
echo == Test staking functionality
echo

echo "Bob stakes 500000000 tokens"
HOME=$BOB_HOME
eval dfx canister call token stake "'(500000000)'"

echo "Bob's balance after staking:"
echo Bob balance = $( \
    eval dfx canister call token balanceOf "'($BOB_PUBLIC_KEY)'" \
)
echo Bob staked = $( \
    eval dfx canister call token getStakedAmount "'($BOB_PUBLIC_KEY)'" \
)

echo
echo "Dan stakes 250000000 tokens"
HOME=$DAN_HOME
eval dfx canister call token stake "'(250000000)'"

echo "Dan's balance after staking:"
echo Dan balance = $( \
    eval dfx canister call token balanceOf "'($DAN_PUBLIC_KEY)'" \
)
echo Dan staked = $( \
    eval dfx canister call token getStakedAmount "'($DAN_PUBLIC_KEY)'" \
)

echo
echo "Get total staking stats:"
HOME=$ALICE_HOME
eval dfx canister call token getStakingStats

echo
echo "Bob unstakes 100000000 tokens"
HOME=$BOB_HOME
eval dfx canister call token unstake "'(100000000)'"

echo "Bob's balance after partial unstaking:"
echo Bob balance = $( \
    eval dfx canister call token balanceOf "'($BOB_PUBLIC_KEY)'" \
)
echo Bob staked = $( \
    eval dfx canister call token getStakedAmount "'($BOB_PUBLIC_KEY)'" \
)

echo
echo == Test vesting functionality
echo

echo "Alice creates vesting schedule for Dan (500000000 tokens, 1 year, 3 month cliff)"
HOME=$ALICE_HOME
# 31536000 seconds = 1 year, 7776000 seconds = 3 months
eval dfx canister call token createVestingSchedule "'($DAN_PUBLIC_KEY, 500000000, 31536000, 7776000)'"

echo "Check Dan's vesting info:"
eval dfx canister call token getVestingInfo "'($DAN_PUBLIC_KEY)'"

echo "Get vesting stats:"
eval dfx canister call token getVestingStats

echo
echo "Attempt to release vested tokens (should fail due to cliff period)"
HOME=$DAN_HOME
eval dfx canister call token releaseVestedTokens

echo
echo "Done! The token implementation is now complete with staking and vesting capabilities."
echo "You can deploy this token for the Multiagent Army platform."
