import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AgentId = string;
export type CanisterId = string;
export interface CanisterSettings {
  'freezing_threshold' : [] | [bigint],
  'controllers' : [] | [Array<Principal>],
  'memory_allocation' : [] | [bigint],
  'compute_allocation' : [] | [bigint],
}
export interface CanisterStatusResult {
  'status' : { 'stopped' : null } |
    { 'stopping' : null } |
    { 'running' : null },
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : CanisterSettings,
  'module_hash' : [] | [Uint8Array | number[]],
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : CanisterStatusResult } |
  { 'err' : string };
export type Result_2 = { 'ok' : Principal } |
  { 'err' : string };
export type Result_3 = { 'ok' : TokenId } |
  { 'err' : string };
export type Time = bigint;
export interface TokenConfig {
  'fee' : bigint,
  'decimals' : number,
  'owner' : Principal,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
  'feeTo' : Principal,
}
export interface TokenDistribution {
  'publicSale' : number,
  'marketing' : number,
  'team' : number,
  'ecosystem' : number,
  'liquidityPool' : number,
  'developer' : number,
}
export type TokenId = string;
export interface TokenInfo {
  'id' : TokenId,
  'createdAt' : Time,
  'agentId' : [] | [AgentId],
  'vestingSchedule' : [] | [VestingSchedule],
  'config' : TokenConfig,
  'distribution' : [] | [TokenDistribution],
  'canisterId' : CanisterId,
}
export interface VestingSchedule {
  'developerMonths' : bigint,
  'marketingMonths' : bigint,
  'teamMonths' : bigint,
  'publicSaleMonths' : bigint,
  'liquidityPoolMonths' : bigint,
  'ecosystemMonths' : bigint,
}
export interface _SERVICE {
  'createToken' : ActorMethod<
    [
      TokenConfig,
      [] | [AgentId],
      [] | [TokenDistribution],
      [] | [VestingSchedule],
    ],
    Result_3
  >,
  'createTokensBatch' : ActorMethod<
    [
      Array<TokenConfig>,
      [] | [Array<[] | [AgentId]>],
      [] | [Array<[] | [TokenDistribution]>],
      [] | [Array<[] | [VestingSchedule]>],
    ],
    Array<Result_3>
  >,
  'getAllTokens' : ActorMethod<[], Array<TokenInfo>>,
  'getToken' : ActorMethod<[TokenId], [] | [TokenInfo]>,
  'getTokenByAgent' : ActorMethod<[AgentId], [] | [TokenInfo]>,
  'getTokenCanisterId' : ActorMethod<[TokenId], Result_2>,
  'getTokenCanisterStatus' : ActorMethod<[TokenId], Result_1>,
  'getTokensByOwner' : ActorMethod<[Principal], Array<TokenInfo>>,
  'init' : ActorMethod<[], undefined>,
  'startTokenCanister' : ActorMethod<[TokenId], Result>,
  'stopTokenCanister' : ActorMethod<[TokenId], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
