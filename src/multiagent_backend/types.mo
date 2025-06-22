/**
 * Module     : types.mo
 * Copyright  : 2021 DFinance Team
 * License    : Apache 2.0 with LLVM Exception
 * Maintainer : DFinance Team <hello@dfinance.ai>
 * Stability  : Experimental
 */

import Time "mo:base/Time";
import P "mo:base/Prelude";
import Float "mo:base/Float";

module {
    /// Update call operations
    public type Operation = {
        #mint;
        #burn;
        #transfer;
        #transferFrom;
        #approve;
    };
    public type TransactionStatus = {
        #succeeded;
        #inprogress;
        #failed;
    };
    /// Update call operation record fields
    public type TxRecord = {
        caller : ?Principal;
        op : Operation;
        index : Nat;
        from : Principal;
        to : Principal;
        amount : Nat;
        fee : Nat;
        timestamp : Time.Time;
        status : TransactionStatus;
    };

    public func unwrap<T>(x : ?T) : T = switch x {
        case null { P.unreachable() };
        case (?x_) { x_ };
    };

    // Additional types for TokenFactory and other modules
    public type CanisterId = Text;
    public type TokenId = Text;
    public type AgentId = Text;

    public type TokenConfig = {
        name : Text;
        symbol : Text;
        decimals : Nat8;
        totalSupply : Nat;
        fee : Nat;
        feeTo : Principal;
        owner : Principal;
    };

    public type TokenDistribution = {
        developer : Float;
        publicSale : Float;
        liquidityPool : Float;
        team : Float;
        marketing : Float;
        ecosystem : Float;
    };

    public type VestingSchedule = {
        developerMonths : Nat;
        publicSaleMonths : Nat;
        liquidityPoolMonths : Nat;
        teamMonths : Nat;
        marketingMonths : Nat;
        ecosystemMonths : Nat;
    };

    public type TokenInfo = {
        id : TokenId;
        canisterId : CanisterId;
        config : TokenConfig;
        agentId : ?AgentId;
        distribution : ?TokenDistribution;
        vestingSchedule : ?VestingSchedule;
        createdAt : Time.Time;
    };

    public type DIP20Interface = {
        balanceOf : (Principal) -> async Nat;
        transfer : (Principal, Nat) -> async Bool;
        transferFrom : (Principal, Principal, Nat) -> async Bool;
        approve : (Principal, Nat) -> async Bool;
        allowance : (Principal, Principal) -> async Nat;
        totalSupply : () -> async Nat;
        name : () -> async Text;
        symbol : () -> async Text;
        decimals : () -> async Nat8;
    };
};
